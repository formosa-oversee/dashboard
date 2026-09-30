"""
工廠 <> 公司 <> 控股：把每一筆污染／裁罰紀錄的「受罰實體」沿持股鏈往上追到負責的台灣母公司。

輸入
  - MOPS 子公司持股資料（公開資訊觀測站，存於 sibling repo formosa-oversee/scripts/mops_company，可用 MOPS_DIR 覆寫）
      mops_company_info.csv           上市櫃公司基本資料（英文簡稱、英文全稱*）
      oversea_subsidiaries_union.csv  海外轉投資：投資公司 → 被投資海外子公司、持股比例
      subsidiaries_union.csv          合併報表子公司：投資公司 → 子公司、持股比例、子公司公司代號
      * 英文全稱欄有整段錯一列的問題，這裡用英文簡稱交叉驗證後修正（見 docs/violation-tracker-data-access.md 附錄）
  - data/facilities.csv                              EPA ECHO 設施 ↔ 台灣上市公司（既有匹配）
  - data/violation-tracker/<date>-*-p*.tsv          Violation Tracker 列表頁快照（僅本機，不進 git）
  - data/company-mapping.json                        VT 母公司層級對照（fallback）

輸出
  - data/ownership-resolution.json（進 git）：每個受罰實體 → 負責母公司、持股路徑、有效持股比例、依據與信心等級

解析順序（先命中者優先）
  1. CURATED  人工確認規則（來源寫在 note；含 MOPS 查不到的私人／國營母公司、合資、併購時點）
  2. self     實體就是上市公司本身（英文簡稱／修正後英文全稱）
  3. mops     實體名稱對上 MOPS 子公司節點（英文名，或 ECHO 既有匹配的境外子公司）→ 由持股圖算路徑與有效持股
  4. group    只有 VT 母公司層級對照（company-mapping.json），無持股路徑
  5. foreign  外資母公司、無台灣資金鏈

用法
  python3 scripts/resolve-ownership.py            # 產出 data/ownership-resolution.json
  MOPS_DIR=/path/to/mops_company python3 scripts/resolve-ownership.py
"""
import csv, json, os, re, sys, unicodedata, collections, datetime, pathlib

DASH = pathlib.Path(__file__).resolve().parents[1]
DATA = DASH / 'data'
MOPS_DIR = pathlib.Path(os.environ.get('MOPS_DIR', DASH.parent / 'scripts' / 'mops_company'))
OUT = DATA / 'ownership-resolution.json'

SRC_US, SRC_G, SRC_ECHO = 'Violation Tracker', 'Violation Tracker Global', 'EPA ECHO'

# ---------------------------------------------------------------- normalization

LEGAL = {'co', 'corp', 'corporation', 'company', 'companies', 'inc', 'incorporated', 'ltd', 'limited', 'llc', 'lp', 'plc',
         'sa', 'spa', 'gmbh', 'bv', 'pte', 'pvt', 'the', 'et', 'al', 'dba', 'sarl', 'sprl'}
GENERIC = {'taiwan', 'international', 'holding', 'holdings', 'investment', 'investments', 'group', 'global', 'asia', 'pacific',
           'usa', 'us', 'america', 'americas', 'technology', 'technologies', 'industrial', 'industries', 'industry', 'trading',
           'development', 'enterprise', 'enterprises', 'services', 'service', 'electronics', 'electronic', 'bank', 'securities',
           'insurance', 'life', 'energy', 'material', 'materials', 'and', 'of', 'new', 'hong', 'kong', 'china', 'japan'}


def en_tokens(s):
    s = unicodedata.normalize('NFKC', s or '').lower()
    s = s.replace('u.s.a.', ' usa ').replace('u.s.a', ' usa ').replace('u.s.', ' us ').replace('&', ' and ')
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    return tuple(t for t in s.split() if t not in LEGAL)


def en_key(s):
    return ' '.join(en_tokens(s))


def has_latin(s):
    return bool(re.search(r'[A-Za-z]{3,}', s or ''))


ALIAS_PREFIX = re.compile(r'^(以下簡稱|以下稱|下稱|簡稱)')
DITTO = {'〃', '"', '同上', '仝上', '〃〃', '""'}


def zh_clean(s):
    s = unicodedata.normalize('NFKC', s or '')
    # 只移除中文字旁的空白（「本 公 司」→「本公司」），英文名保留字間空白
    s = re.sub(r'(?<=[\u4e00-\u9fff()])\s+|\s+(?=[\u4e00-\u9fff()])', '', s.strip())
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'\(註\d*\)', '', s)
    return s.replace('(股)', '股份有限')


def zh_strip_suffix(s):
    return re.sub(r'(股份有限公司|有限公司|股份有限|公司)$', '', s)


def name_keys(raw):
    """回傳 (base_key, [alias_keys])；中英文都處理。尾端括號視為別名，中間括號（地名）保留在 base。"""
    s = zh_clean(raw)
    aliases = []
    for m in re.finditer(r'\(([^()]*)\)', s):
        inner = m.group(1)
        if ALIAS_PREFIX.match(inner):
            aliases.append(ALIAS_PREFIX.sub('', inner))
    s = re.sub(r'\((以下簡稱|以下稱|下稱|簡稱)[^()]*\)', '', s)
    m = re.search(r'\(([^()]*)\)$', s)
    if m and re.search(r'(公司|Corporation|Corp\.?|Inc\.?|Ltd\.?|Limited|LLC|GmbH|Co\.)\s*$', s[:m.start()], re.I):
        aliases.append(m.group(1)); s = s[:m.start()]
    keys = []
    base = zh_strip_suffix(s)
    keys = [base] + [zh_strip_suffix(a) for a in aliases if a]
    out = []
    for k in keys:
        if not k: continue
        out.append(('en', en_key(k)) if has_latin(k) and not re.search(r'[一-鿿]', k) else ('zh', k))
    return out


def parse_pct(s):
    s = unicodedata.normalize('NFKC', s or '').replace('%', '').strip()
    try:
        return float(s) / 100.0
    except ValueError:
        return None


# ---------------------------------------------------------------- MOPS load

def load_mops():
    for f in ('mops_company_info.csv', 'oversea_subsidiaries_union.csv', 'subsidiaries_union.csv'):
        if not (MOPS_DIR / f).exists():
            sys.exit(f'找不到 {MOPS_DIR / f}。請 clone formosa-oversee/scripts 到 dashboard 旁，或設定 MOPS_DIR。')
    rows = list(csv.DictReader(open(MOPS_DIR / 'mops_company_info.csv', encoding='utf-8-sig')))

    def k4(s): return re.sub(r'[^a-z0-9]', '', (s or '').lower())

    def subseq(short, long_):
        it = iter(long_)
        return all(ch in it for ch in short)

    def consistent(full, abbr):
        a, b = k4(full), k4(abbr)
        if not (a and b): return False
        return a[:4] in b or b[:4] in a or (2 <= len(b) <= 6 and subseq(b, a))

    companies = {}
    for i, r in enumerate(rows):
        own = r['英文全稱'] or ''
        nxt = rows[i + 1]['英文全稱'] if i + 1 < len(rows) else ''
        prev_abbr = rows[i - 1]['英文簡稱'] if i else ''
        shifted = not consistent(own, r['英文簡稱']) and consistent(nxt, r['英文簡稱'])
        companies[r['公司代號']] = {
            'code': r['公司代號'], 'name': r['公司名稱'], 'short': r['公司簡稱'],
            'enAbbr': r['英文簡稱'], 'enFull': nxt if shifted else own, 'market': r['市場別'],
        }

    edges = collections.defaultdict(dict)       # code -> {(inv_key, sub_key): edge}
    display = collections.defaultdict(dict)     # code -> key -> display name
    listed_child = {}                           # child listed code -> (parent code, pct)

    def add(code, inv, sub, pct, sub_code=''):
        inv_keys, sub_keys = name_keys(inv), name_keys(sub)
        if not inv_keys or not sub_keys:
            return
        ik, sk = inv_keys[0], sub_keys[0]
        display[code].setdefault(ik, inv); display[code].setdefault(sk, sub)
        for a in sub_keys[1:]:
            display[code].setdefault(a, sub)
        e = edges[code].get((ik, sk))
        if e is None or (pct or 0) > (e['pct'] or 0):
            edges[code][(ik, sk)] = {'inv': ik, 'sub': sk, 'pct': pct, 'subAliases': sub_keys[1:], 'subCode': sub_code}
        if sub_code and pct and pct >= 0.5 and sub_code != code:
            prev = listed_child.get(sub_code)
            if not prev or pct > prev[1]:
                listed_child[sub_code] = (code, pct)

    us_subs = collections.defaultdict(set)      # code -> 美國子公司名稱（ECHO 匹配驗證用）
    prev_inv = {}
    for r in csv.DictReader(open(MOPS_DIR / 'oversea_subsidiaries_union.csv', encoding='utf-8-sig')):
        if '美國' in (r['地區別代號'] or ''):
            us_subs[r['公司代號']].add(r['被投資海外子公司名稱'].strip())
        inv = r['投資公司名稱'].strip()
        if inv in DITTO or not inv: inv = prev_inv.get(r['公司代號'], '本公司')
        prev_inv[r['公司代號']] = inv
        add(r['公司代號'], inv, r['被投資海外子公司名稱'], parse_pct(r['本期期末持股比例']))
    prev_inv = {}
    for r in csv.DictReader(open(MOPS_DIR / 'subsidiaries_union.csv', encoding='utf-8-sig')):
        inv = r['投資公司名稱'].strip()
        if inv in DITTO or not inv: inv = prev_inv.get(r['公司代號'], '本公司')
        prev_inv[r['公司代號']] = inv
        # 「本公司、富邦人壽及富邦產險」這類聯合持有：取第一個投資人當路徑起點（持股比例為合計）
        inv = re.split(r'[、及與]', inv)[0] if re.search(r'[、及與]', inv) else inv
        add(r['公司代號'], inv, r['子公司名稱'], parse_pct(r['所持股權百分比']), (r['子公司公司代號'] or '').strip())
    return companies, edges, display, listed_child, us_subs


def root_keys(c):
    ks = {('zh', '本公司'), ('zh', '母公司'), ('zh', '本集團'), ('zh', '本'), ('zh', '母')}
    for n in (c['name'], c['short']):
        for kind, k in name_keys(n):
            ks.add((kind, k)); ks.add((kind, zh_strip_suffix(k)))
    if c['short']:
        ks.add(('zh', c['short'] + '公司')); ks.add(('zh', zh_strip_suffix(c['short'])))
    for n in (c['enAbbr'], c['enFull']):
        if n: ks.add(('en', en_key(n)))
    return {k for k in ks if k[1]}


class OwnershipGraph:
    def __init__(self, companies, edges, display, listed_child):
        self.companies, self.display, self.listed_child = companies, display, listed_child
        self.children = collections.defaultdict(lambda: collections.defaultdict(list))
        self.index = collections.defaultdict(list)   # key -> [(code, node_key)]
        self.alias = collections.defaultdict(dict)   # code -> alias key -> canonical key
        for code, es in edges.items():
            c = companies.get(code)
            roots = root_keys(c) if c else {('zh', '本公司'), ('zh', '本')}
            amap = self.alias[code]
            for e in es.values():
                for a in e['subAliases']:
                    if a != e['sub'] and a not in roots: amap.setdefault(a, e['sub'])
            canon = lambda k: amap.get(k, k)
            investees = {canon(e['sub']) for e in es.values()}
            short = zh_strip_suffix(c['short']) if c and c['short'] else ''
            seen_edge = set()
            for e in es.values():
                inv, sub = canon(e['inv']), canon(e['sub'])
                if inv in roots:
                    inv = 'ROOT'
                # 從未出現在被投資端、且名稱是公司簡稱變體的頂層投資人（例：元大金控、台積公司）也視為本公司
                elif inv not in investees and inv[0] == 'zh' and short and len(inv[1]) >= 2 and (inv[1].startswith(short) or short.startswith(inv[1])):
                    inv = 'ROOT'
                if sub in roots or (inv, sub) in seen_edge:
                    continue
                seen_edge.add((inv, sub))
                self.children[code][inv].append((sub, e['pct']))
                for k in {e['sub'], sub, *e['subAliases']}:
                    self.index[k].append((code, sub))
                if inv != 'ROOT':
                    self.index[inv].append((code, inv))
                    if e['inv'] != inv: self.index[e['inv']].append((code, inv))
        self._eff = {}

    def reach(self, code):
        """DFS from ROOT: node -> (effective pct summed over paths, best path)。"""
        if code in self._eff:
            return self._eff[code]
        res = {}

        def dfs(node, prod, path, seen):
            for sub, pct in self.children[code].get(node, []):
                if sub in seen or pct is None:
                    continue
                p = prod * pct
                np_ = path + [(node, sub, pct)]
                eff, best, bestp = res.get(sub, (0.0, None, -1))
                res[sub] = (eff + p, np_ if p > bestp else best, max(p, bestp))
                if len(np_) < 10:
                    dfs(sub, p, np_, seen | {sub})
        dfs('ROOT', 1.0, [], {'ROOT'})
        self._eff[code] = {k: (min(v[0], 1.0), v[1]) for k, v in res.items()}
        return self._eff[code]

    def name(self, code, key):
        if key == 'ROOT':
            return self.companies[code]['name']
        return self.display[code].get(key, key[1])

    def lookup(self, key, codes=None):
        """key -> [(code, node, effective or None, path)]"""
        out, seen = [], set()
        for code, node in self.index.get(key, []):
            if codes and code not in codes: continue
            if (code, node) in seen: continue
            seen.add((code, node))
            eff, path = self.reach(code).get(node, (None, None))
            out.append((code, node, eff, path))
        return out

    def find_node(self, code, zh_or_en):
        """在指定公司的持股圖中找名稱包含 zh_or_en 的節點（curated 規則用）。排序：完全相同 > 開頭相同 > 有效持股 > 名稱較短。"""
        target = zh_or_en if re.search(r'[\u4e00-\u9fff]', zh_or_en) else en_key(zh_or_en)
        amap = self.alias.get(code, {})
        best, best_rank = None, None
        for key in self.display[code]:
            kind, k = key
            if not ((kind == 'zh' and target in k) or (kind == 'en' and target == k)):
                continue
            node = amap.get(key, key)
            eff, path = self.reach(code).get(node, (None, None))
            rank = (k == target, k.startswith(target), eff or 0, -len(k))
            if best_rank is None or rank > best_rank:
                best, best_rank = (node, eff, path), rank
        return best

    def path_json(self, code, path):
        if not path:
            return []
        return [{'investor': self.name(code, a), 'investee': self.name(code, b), 'pct': round(p * 100, 2) if p is not None else None}
                for a, b, p in path]

    def ultimate(self, code):
        chain, seen = [], {code}
        while code in self.listed_child:
            parent, pct = self.listed_child[code]
            if parent in seen: break
            chain.append({'code': parent, 'name': self.companies.get(parent, {}).get('name', parent), 'pct': round(pct * 100, 2)})
            seen.add(parent); code = parent
        return chain


# ---------------------------------------------------------------- curated rules
# 每條：(source 限定或 None, parentSlug 限定或 None, entity regex) → spec
# spec 種類：
#   self=code / node=(code, 節點名稱片段) / group=[codes] / unlisted={...} / foreign=note
# 共同欄位：confidence（high|medium|low）、note、controlSince（台灣母公司取得控制的年份，早於此年的紀錄標 preAcquisition）

FPG_USA_NOTE = ('FPC USA（台塑美國）與其德州 Point Comfort、路易斯安那 Baton Rouge、德拉瓦 Delaware City 廠為私人持有公司，'
                '隸屬台塑集團但不是任何台灣上市公司的子公司（MOPS 子公司清單無此節點）。台塑 1301 在美國的 100% 子公司是 '
                'Formosa Industries Corp.（MOPS：台塑工業美國；FPG 官網 fpg.com.tw/en/about/other-company），'
                '2026-08-01 併入 FPC USA（Business Wire 2026-08-01），1301 自此持有存續公司股權，比例未揭露。')

CURATED = [
    # ---- 台塑集團（美國）：FPC USA 為集團關係企業，無上市公司持股路徑
    (SRC_US, 'formosa-plastics', r'formosa (plastics?|petrochemical)', dict(
        group=['1301'], groupName='台塑集團 Formosa Plastics Group', entityName='Formosa Plastics Corporation, U.S.A.（台塑美國）',
        confidence='medium', basis='group-affiliate', note=FPG_USA_NOTE)),
    (SRC_US, 'nan-ya-plastics', r'nan ya plastics.*\bamerica\b', dict(node=('1303', '南亞塑膠美洲'), confidence='high',
        note='Nan Ya Plastics Corp., America（FPG 官網列為南亞子公司）＝ MOPS 南亞塑膠美洲有限公司')),
    (SRC_US, 'nan-ya-plastics', r'nan ya plastics.*\busa\b', dict(node=('1303', '南亞塑膠美國'), confidence='high',
        note='Nan Ya Plastics Corp., USA ＝ MOPS 南亞塑膠美國有限公司')),
    # ---- 台塑集團（台灣）：VT Global 名稱為中文名直譯
    (SRC_G, 'formosa-plastics', r'^formosa plastic industries', dict(self='1301', confidence='high', note='直譯「台灣塑膠工業」＝ 1301')),
    (SRC_G, 'formosa-plastics', r'^formosa plastics petrochemical', dict(self='6505', confidence='medium',
        note='直譯「台塑石化」＝ 6505。VT 將其掛在 Formosa Plastics 母公司下，但依公司名稱應歸台塑化（VT 另有 Formosa Petrochemical Corporation 母公司）')),
    (SRC_G, 'formosa-plastics', r'^formosa plastics biomedical', dict(node=('1326', '台塑生醫'), confidence='high',
        note='台塑生醫科技由台化 1326 持股 88.59%（MOPS），非台塑 1301')),
    (SRC_G, 'formosa-plastics', r'^formosa plastics energy technology', dict(group=['1301'], groupName='台塑集團 Formosa Plastics Group',
        confidence='low', basis='group-assumed', note='中文實體名稱未能確認（MOPS 無對應節點），暫以 VT 母公司層級歸台塑 1301')),
    (SRC_G, 'formosa-plastics', r'^formosa plastics$', dict(self='1301', confidence='medium', note='VT 名稱即母公司名稱，歸台塑 1301')),
    (SRC_G, 'formosa-petrochemical-corporation', r'^formosa chemicals and fibre', dict(self='1326', confidence='high',
        note='台化 1326 為獨立上市公司；VT 將其掛在台塑化母公司下，依資金鏈應歸 1326')),
    # ---- 台半 vs 台積電：VT 誤歸
    (SRC_G, 'taiwan-semiconductor-manufacturing-compa', r'^taiwan semiconductor$', dict(self='5425', confidence='high',
        note='台灣半導體（台半 5425）非台積電。佐證：台半利澤廠 2021 年違反水污法罰 142.8 萬元（旺得富 2021-10-20），與 VT 2021 年 US$51,025 紀錄相符')),
    # ---- 鴻海：夏普 2016 年起才是鴻海集團
    (SRC_US, None, r'^sharp', dict(self='2317', confidence='high', controlSince=2016,
        note='夏普 Sharp 自 2016-08 起為鴻海集團取得控制權的公司（MOPS 子公司清單未列）；2016 年以前的罰款屬收購前責任')),
    (None, 'foxconn-technology-group-hon-hai-precisi', r'^(foxconn|hon hai)', dict(self='2317', confidence='high', note='鴻海精密 2317 本身或其美國據點')),
    (None, 'au-optronics', r'^au optronics', dict(self='2409', confidence='high', note='友達光電 AUO（MOPS 英文名 AUO Corporation）')),
    (SRC_G, 'pegatron-corporation', r'^pegatron', dict(self='4938', confidence='medium', note='和碩聯合科技 4938（VT 名稱 Pegatron Technology 為中文名直譯）')),
    # ---- 群創：奇美電子 2010 年併入
    (SRC_US, 'innolux-corporation', r'^chi ?mei', dict(self='3481', confidence='high', controlSince=2010,
        note='奇美電子 2010 年與群創合併（存續更名奇美電、2012 年再更名群創）；2010 年以前的罰款為合併前責任，由群創承繼')),
    (SRC_G, 'innolux-corporation', r'^chimei innolux', dict(self='3481', confidence='high', note='奇美電為群創前名')),
    # ---- 國巨：KEMET 2020、TOKIN（2017 併入 KEMET）
    (None, 'yageo', r'kemet blue pow', dict(node=('2327', 'KEMET Corporation'), confidence='medium', controlSince=2020,
        note='KEMET Blue Powder 為 KEMET 子公司（MOPS 未列此層），掛到 KEMET Corporation 節點；國巨 2020-06 完成收購 KEMET')),
    (None, 'yageo', r'^kemet', dict(node=('2327', 'KEMET Corporation'), confidence='high', controlSince=2020, note='國巨 2020-06 完成收購 KEMET')),
    (None, 'yageo', r'(nec )?tokin', dict(node=('2327', 'TOKIN Corporation'), confidence='high', controlSince=2020,
        note='TOKIN（原 NEC TOKIN）2017 年成為 KEMET 全資子公司，2020 年隨 KEMET 併入國巨')),
    # ---- 大同：華映為大同集團關係企業
    (SRC_US, 'tatung', r'chunghwa picture tubes', dict(self='2371', confidence='medium',
        note='中華映管為大同集團關係企業、大同為最大股東（非過半持股）；華映 2019 年重整下市，MOPS 無持股資料')),
    (SRC_US, 'tatung', r'^tatung.*\bamerica\b', dict(node=('2371', '大同美國電機'), confidence='high', note='Tatung Company of America ＝ MOPS 大同美國電機(股)公司')),
    (SRC_G, 'tatung', r'^tatung', dict(self='2371', confidence='high', note='大同本身（含桃園電線電纜廠）')),
    # ---- 陽明
    (SRC_US, 'yang-ming-marine-transport', r'yang ming america', dict(node=('2609', '陽明(美洲)'), confidence='high',
        note='Yang Ming (America) Corp. ＝ MOPS 陽明德拉瓦控股 → 陽明（美洲）')),
    (SRC_US, 'yang-ming-marine-transport', r'^yang ming marine', dict(self='2609', confidence='high', note='陽明海運本身')),
    # ---- 金控子公司（MOPS 中文名）
    (SRC_US, 'mega-financial-holding', r'mega international commercial bank', dict(node=('2886', '兆豐銀行'), confidence='high', note='兆豐國際商業銀行')),
    (SRC_G, 'mega-financial-holding', r'mega international commercial bank', dict(node=('2886', '兆豐銀行'), confidence='high', note='兆豐國際商業銀行')),
    (None, 'taishin-financial-holdings', r'taishin international bank', dict(node=('2887', '台新銀行'), confidence='high', note='台新銀行')),
    (None, 'taishin-financial-holdings', r'taishin securities', dict(node=('2887', '台新證券'), confidence='high', note='台新證券')),
    (SRC_G, 'shin-kong-financial-holding-co-ltd', r'shin kong life', dict(group=['2887'], groupName='台新新光金控', confidence='high',
        basis='merger', controlSince=2025, note='新光金控 2025-07 以股份轉換成為台新新光金 2887 的子公司，新光人壽隨之併入；2025 年以前為合併前責任')),
    (SRC_G, 'ctbc-financial', r'^ctbc bank', dict(node=('2891', '中國信託商業銀行'), confidence='high', note='中國信託商業銀行')),
    (SRC_G, 'ctbc-financial', r'taiwan life insurance', dict(node=('2891', '台灣人壽'), confidence='high', note='台灣人壽')),
    (SRC_G, 'fubon-financial-holding', r'taipei fubon commercial bank', dict(node=('2881', '台北富邦銀行'), confidence='high', note='台北富邦銀行')),
    (SRC_G, 'fubon-financial-holding', r'fubon life', dict(node=('2881', '富邦人壽'), confidence='high', note='富邦人壽')),
    (SRC_G, 'yuanta-financial-holdings', r'yuanta commercial bank', dict(node=('2885', '元大銀行'), confidence='high', note='元大商業銀行')),
    (SRC_G, 'yuanta-financial-holdings', r'yuanta securities', dict(node=('2885', '元大證券'), confidence='high', note='元大證券')),
    (SRC_G, 'yuanta-financial-holdings', r'yuanta funds', dict(node=('2885', '元大證券投資信託'), confidence='high', note='元大投信（元大金控持股 74.71%）')),
    (SRC_G, 'cathay-financial', r'cathay united bank', dict(node=('2882', '國泰世華商業銀行'), confidence='medium',
        note='國泰世華銀行；MOPS 國泰金子公司清單不完整，只有國泰世華作為投資人的紀錄，持股比例未列')),
    (SRC_G, 'cathay-financial', r'cathay life', dict(node=('2882', '國泰人壽'), confidence='medium', note='國泰人壽；MOPS 國泰金子公司清單不完整，持股比例未列')),
    (SRC_G, 'first-financial-holding', r'first commercial bank', dict(node=('2892', '第一銀行'), confidence='medium', note='第一商業銀行；MOPS 第一金子公司清單不完整，持股比例未列')),
    # ---- 合資／外資母公司但有台灣資金
    (SRC_G, 'carrefour', r'carrefour', dict(node=('1216', '家福'), confidence='high', controlSince=2023,
        note='家樂福台灣＝家福股份有限公司。統一集團 2023 年向家樂福集團買下 60% 後持有 100%（MOPS：統一企業 → 家福 100%）；'
             '2023 年以前為家樂福 60%／統一集團 40% 合資，統一為少數股東')),
    (SRC_G, 'royal-philips', r'philips and lite on digital', dict(node=('2301', '飛利浦建興數位科技'), confidence='high',
        note='飛利浦建興數位科技（PLDS）目前由光寶科 2301 持股 100%（MOPS）；2012 年時為建興電子與飛利浦合資，建興 2014 年併入光寶科')),
    (SRC_G, 'nissan', r'nissan taiwan', dict(self='2227', confidence='medium',
        note='Nissan 在台由裕隆日產汽車（2227，上市）代理，裕隆集團與日產合資；VT 原文為 Nissan Taiwan，依代理關係歸 2227')),
    (SRC_G, 'costco', r'costco', dict(foreign='美商 Costco 台灣子公司。1997 年起由高雄大統集團持股 45%，2022-06 由 Costco 買回全部股權'
        '（Taipei Times 2022-07-02）；大統集團持股非經上市公司，MOPS 無路徑', confidence='high', taiwanMinorityUntil=2022)),
    (SRC_G, 'ford-motor', r'ford lio ho', dict(foreign='福特六和：福特 70%、六和機械（未上市）30%', confidence='medium')),
    (SRC_G, 'kimberly-clark', r'kimberl(e)?y clark', dict(foreign='金百利克拉克 2000 年起全資持有台灣公司（Kimberly-Clark 新聞稿）', confidence='high')),
    # ---- 台灣非上市母公司
    (SRC_US, 'fcf-co', r'bumble bee', dict(unlisted={'kind': 'private', 'id': 'fcf', 'name': '豐群水產股份有限公司（FCF Co., Ltd.）'},
        confidence='high', controlSince=2020, note='豐群水產（台灣，未上市）2020 年初買下 Bumble Bee；2020 年以前的罰款屬收購前責任')),
    (SRC_G, 'cpc-corporation', r'.', dict(unlisted={'kind': 'state-owned', 'id': 'cpc', 'name': '台灣中油股份有限公司（CPC Corporation, Taiwan）'},
        confidence='medium', note='台灣中油為經濟部所屬國營事業，未上市。VT 的「Taiwan CNPC Co. Ltd.」疑為台灣中油誤譯，一併歸中油')),
]


def curated_for(source, parent_slug, entity):
    ek = en_key(entity)
    for src, slug, pat, spec in CURATED:
        if src and src != source: continue
        if slug and slug != parent_slug: continue
        if re.search(pat, ek):
            return spec
    return None


# ---------------------------------------------------------------- resolver

class Resolver:
    def __init__(self, g, mapping, foreign):
        self.g, self.mapping, self.foreign = g, mapping, foreign
        c = g.companies
        self.self_index = collections.defaultdict(set)
        for code, info in c.items():
            for n in (info['enAbbr'], info['enFull']):
                k = en_key(n)
                if k and len(k) >= 3: self.self_index[k].add(code)
        # EN 子公司節點（token subset 用）
        self.en_nodes = [(k, set(k[1].split())) for k in g.index if k[0] == 'en' and k[1]]

    def listed(self, code):
        info = self.g.companies.get(code, {})
        return {'kind': 'listed', 'code': code, 'name': info.get('name', code), 'short': info.get('short')}

    def finish(self, out, code=None):
        if code:
            ult = self.g.ultimate(code)
            if ult: out['ultimateParent'] = ult[-1]; out['listedChain'] = ult
        return out

    def from_node(self, code, node, eff, path, method, confidence, note=None):
        out = {'responsible': self.listed(code), 'entityInMops': self.g.name(code, node),
               'effectivePct': round(eff * 100, 2) if eff is not None else None,
               'path': self.g.path_json(code, path), 'method': method, 'confidence': confidence}
        if eff is None:
            out['pathNote'] = 'MOPS 有此節點但未列出從母公司到此節點的持股（清單不完整），持股比例未知'
        if note: out['note'] = note
        return self.finish(out, code)

    def resolve(self, source, parent_slug, entity, codes_hint=None, echo_sub=None):
        spec = curated_for(source, parent_slug, entity)
        if spec:
            return self.apply_spec(spec)
        # ECHO：既有匹配若有境外子公司名稱，直接查該公司持股圖
        if echo_sub and codes_hint:
            for kind, k in name_keys(echo_sub):
                hits = self.g.lookup((kind, k), set(codes_hint))
                if hits:
                    code, node, eff, path = max(hits, key=lambda h: h[2] or 0)
                    return self.from_node(code, node, eff, path, 'mops-echo-subsidiary', 'high')
        ek = en_key(entity)
        is_foreign = parent_slug in self.foreign
        # self
        if ek in self.self_index and not is_foreign:
            codes = self.self_index[ek]
            code = next((c for c in codes if not codes_hint or c in codes_hint), sorted(codes)[0])
            return self.finish({'responsible': self.listed(code), 'effectivePct': 100.0, 'path': [], 'method': 'self', 'confidence': 'high'}, code)
        # MOPS 子公司節點（英文名 exact → token subset）
        et = set(ek.split())
        cands = []
        for code, node, eff, path in self.g.lookup(('en', ek)):
            cands.append((1.0, code, node, eff, path, 'mops-exact'))
        if not cands and len(et) >= 2:
            for key, nt in self.en_nodes:
                if len(nt) >= 2 and nt <= et and not nt <= GENERIC:
                    score = len(nt) / len(et | nt)
                    for code, node, eff, path in self.g.lookup(key):
                        cands.append((score, code, node, eff, path, 'mops-token'))
        if cands and not is_foreign:
            def rank(c):
                return (c[0], 1 if codes_hint and c[1] in codes_hint else 0, c[3] or 0)
            score, code, node, eff, path, method = max(cands, key=rank)
            conf = 'high' if method == 'mops-exact' or score >= 0.66 else 'medium'
            if not codes_hint or code in codes_hint:
                return self.from_node(code, node, eff, path, method, conf)
            cross = [{'code': c[1], 'node': self.g.name(c[1], c[2]), 'score': round(c[0], 2)} for c in sorted(cands, key=rank, reverse=True)[:3]]
        else:
            cross = None
        # VT 母公司層級 fallback
        if codes_hint:
            code = codes_hint[0]
            out = {'responsible': self.listed(code), 'effectivePct': None, 'path': [], 'method': 'vt-parent-mapping',
                   'confidence': 'low', 'note': '只有 VT 母公司層級對照，實體名稱對不到 MOPS 子公司節點'}
            if cross: out['crossGroupCandidates'] = cross
            return self.finish(out, code)
        if is_foreign:
            return {'responsible': {'kind': 'foreign', 'name': self.foreign[parent_slug]}, 'method': 'foreign-parent', 'confidence': 'high',
                    'candidates': [{'code': c[1], 'node': self.g.name(c[1], c[2])} for c in cands[:3]] or None}
        return {'responsible': {'kind': 'unresolved'}, 'method': 'unresolved', 'confidence': None}

    def apply_spec(self, spec):
        base = {k: spec[k] for k in ('note', 'controlSince', 'taiwanMinorityUntil') if k in spec}
        conf = spec.get('confidence', 'medium')
        if 'self' in spec:
            code = spec['self']
            return self.finish({'responsible': self.listed(code), 'effectivePct': 100.0, 'path': [], 'method': 'curated-self', 'confidence': conf, **base}, code)
        if 'node' in spec:
            code, frag = spec['node']
            found = self.g.find_node(code, frag)
            if not found:
                print(f'  ⚠ curated node 找不到：{code} {frag}', file=sys.stderr)
                return self.finish({'responsible': self.listed(code), 'effectivePct': None, 'path': [], 'method': 'curated-node-missing',
                                    'confidence': 'low', **base}, code)
            node, eff, path = found
            out = self.from_node(code, node, eff, path, 'curated-mops-node', conf)
            out.update(base)
            return out
        if 'group' in spec:
            code = spec['group'][0]
            out = {'responsible': {**self.listed(code), 'kind': spec.get('basis', 'group')}, 'groupCodes': spec['group'],
                   'groupName': spec.get('groupName'), 'effectivePct': None, 'path': [], 'method': 'curated-' + spec.get('basis', 'group'),
                   'confidence': conf, **base}
            if spec.get('entityName'): out['entityName'] = spec['entityName']
            return out
        if 'unlisted' in spec:
            return {'responsible': spec['unlisted'], 'effectivePct': None, 'path': [], 'method': 'curated-unlisted', 'confidence': conf, **base}
        if 'foreign' in spec:
            return {'responsible': {'kind': 'foreign', 'name': spec['foreign']}, 'method': 'curated-foreign', 'confidence': conf, **base}
        raise ValueError(spec)


# ---------------------------------------------------------------- inputs

def load_vt_entities():
    d = DATA / 'violation-tracker'
    if not d.exists():
        return None
    files = sorted(d.glob('*-p*.tsv'))
    if not files:
        return None
    date = max(re.match(r'(\d{4}-\d{2}-\d{2})', f.name).group(1) for f in files)
    agg = {}
    for f in files:
        if not f.name.startswith(date): continue
        source = SRC_G if '-global-' in f.name else SRC_US
        for line in open(f, encoding='utf-8'):
            c = line.rstrip('\n').split('\t')
            if len(c) != 8: continue
            if source == SRC_US:
                _, company, slug, _, _, year, _, pen = c
            else:
                _, company, slug, _, _, _, year, pen = c
            a = agg.setdefault((source, company), {'source': source, 'entity': company, 'parentSlug': slug, 'records': 0, 'years': set(), 'penaltyUSD': 0})
            a['records'] += 1; a['years'].add(int(year))
            if '(*)' not in pen: a['penaltyUSD'] += int(re.sub(r'\D', '', pen) or 0)
    return date, list(agg.values())


ECHO_STOP = GENERIC | {'site', 'plant', 'facility', 'campus', 'mfg', 'manufacturing', 'project', 'phase', 'building', 'warehouse',
                       'restaurant', 'medical', 'springs', 'right', 'way', 'group', 'mass', 'grading', 'temporary', 'access', 'road',
                       'utilities', 'channel', 'exc', 'kv', 'oh', 'la', 'm'}


def echo_fallback(r, g, us_subs, code, f):
    """既有 ECHO 名稱匹配在 MOPS 找不到持股路徑時，用「該公司有沒有美國子公司、名稱有沒有共同字」判斷可信度。"""
    name = f['facility_name']
    toks = {t for t in en_tokens(name) if not t.isdigit() and len(t) > 1}
    # 台積電亞利桑那工地（ECHO 登記名稱多為 TSMC + 工程名稱）
    if code == '2330' and 'tsmc' in toks and (f.get('state') or '').strip().upper() == 'AZ':
        found = g.find_node('2330', 'TSMC Arizona')
        if found:
            node, eff, path = found
            return r.from_node('2330', node, eff, path, 'echo-site-to-subsidiary', 'medium',
                               note='亞利桑那州的 TSMC 工地／公用設施許可，歸 TSMC Arizona（台積電 100%）')
    distinct = toks - ECHO_STOP
    subs = sorted(us_subs.get(code, []))
    en_subs = [x for x in subs if not re.search(r'[\u4e00-\u9fff]', x)]
    zh_only = len(en_subs) < len(subs)
    sub_toks = set().union(*[set(en_tokens(x)) for x in en_subs]) if en_subs else set()
    shared = sorted(distinct & sub_toks)
    brand = set(en_tokens(g.companies.get(code, {}).get('enAbbr', ''))) | set(en_tokens(g.companies.get(code, {}).get('enFull', '')))
    pct = parse_pct(f['持股比例'])
    src = f['資料來源']
    out = {'responsible': r.listed(code), 'effectivePct': round(pct * 100, 2) if pct else None, 'path': [], 'method': 'echo-name-match'}
    if subs: out['usSubsidiaries'] = subs[:8]
    if not subs:
        out.update(confidence='suspect', note=f'既有 ECHO 名稱匹配（{src}）無佐證：MOPS 顯示此公司沒有任何美國子公司，疑為同名誤配')
    elif len(shared) >= 2 or (shared and not set(shared) <= brand):
        out.update(confidence='medium', note=f"既有 ECHO 名稱匹配（{src}），與 MOPS 美國子公司共同字：{', '.join(shared)}")
    elif shared:
        out.update(confidence='weak', note=f"既有 ECHO 名稱匹配（{src}）只靠品牌字「{', '.join(shared)}」相同，美國可能有同名無關公司，需人工確認")
    elif zh_only:
        out.update(confidence='unverified', note=f'既有 ECHO 名稱匹配（{src}）；此公司的美國子公司在 MOPS 只有中文名，無法用英文名比對')
    else:
        out.update(confidence='suspect', note=f'既有 ECHO 名稱匹配（{src}）無佐證：設施名稱與此公司的美國子公司沒有共同字')
    return r.finish(out, code)


def main():
    companies, edges, display, listed_child, us_subs = load_mops()
    g = OwnershipGraph(companies, edges, display, listed_child)
    mapping = json.load(open(DATA / 'company-mapping.json')) if (DATA / 'company-mapping.json').exists() else []
    slug_codes = {}
    for m in mapping:
        for s in (m.get('vtSlug'), m.get('vtgSlug')):
            if s: slug_codes[s] = m['companyCodes']
    seed = json.load(open(DATA / 'company-mapping.seed.json')) if (DATA / 'company-mapping.seed.json').exists() else []
    foreign = {e['slug']: f"外資母公司：{e['parent']}" for e in seed if e.get('confidence') == 'exclude' and e['slug'] not in ('cpc-corporation', 'fcf-co')}
    r = Resolver(g, mapping, foreign)

    prev = json.load(open(OUT)) if OUT.exists() else {'entities': []}
    entities, local_report = [], []

    # ---- Violation Tracker
    vt = load_vt_entities()
    if vt is None:
        print('（本機沒有 VT 快照，保留既有 VT 解析結果）')
        entities += [e for e in prev['entities'] if e['source'] in (SRC_US, SRC_G)]
        vt_date = prev.get('vtSnapshotDate')
    else:
        vt_date, items = vt
        for it in sorted(items, key=lambda x: (x['source'], x['parentSlug'], x['entity'])):
            res = r.resolve(it['source'], it['parentSlug'], it['entity'], slug_codes.get(it['parentSlug']))
            e = {'source': it['source'], 'key': f"{it['source']}|{it['entity']}", 'entity': it['entity'], 'parentSlug': it['parentSlug'], **res}
            entities.append(e)
            # VT 衍生的筆數／金額只寫本機報表（data/violation-tracker/ 不進 git）
            cs = res.get('controlSince')
            local_report.append({**e, 'records': it['records'], 'years': [min(it['years']), max(it['years'])], 'penaltyUSD': it['penaltyUSD'],
                                 'recordsBeforeControl': sum(1 for y in it['years'] if cs and y < cs)})

    # ---- EPA ECHO facilities
    fac = list(csv.DictReader(open(DATA / 'facilities.csv', encoding='utf-8-sig')))
    seen = set()
    for f in fac:
        code = f['公司代號'].strip()
        fid = re.sub(r'\.0+$', '', (f['icis_facility_id'] or '').strip())
        if not code or not fid or (code, fid) in seen: continue
        seen.add((code, fid))
        # ECHO 的台塑美國設施：沿用 US 版 curated 規則
        parent_slug = 'formosa-plastics' if code == '1301' else ('nan-ya-plastics' if code == '1303' else None)
        res = r.resolve(SRC_US if parent_slug else SRC_ECHO, parent_slug, f['facility_name'], [code], echo_sub=f['境外子公司名稱'] or None)
        if res['responsible'].get('kind') in ('unresolved',) or res.get('method') == 'vt-parent-mapping':
            res = echo_fallback(r, g, us_subs, code, f)
        entities.append({'source': SRC_ECHO, 'key': f'{code}|{fid}', 'entity': f['facility_name'], 'companyCode': code, 'facilityId': fid, **res})

    stats = collections.Counter()
    for e in entities:
        stats[(e['source'], e['responsible'].get('kind'), e['method'])] += 1
    out = {
        'generatedAt': datetime.date.today().isoformat(),
        'vtSnapshotDate': vt_date,
        'mopsSource': 'formosa-oversee/scripts mops_company（公開資訊觀測站，2025Q1–Q2 子公司持股）',
        'note': '由 scripts/resolve-ownership.py 產生。responsible.kind：listed 上市公司｜group-affiliate 集團關係企業（無上市公司持股路徑）｜'
                'merger 合併承繼｜private／state-owned 台灣非上市母公司｜foreign 外資母公司｜unresolved。path 為 MOPS 持股鏈，effectivePct 為沿路持股相乘。',
        'entities': entities,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2))
    if local_report:
        (DATA / 'violation-tracker' / 'ownership-report.json').write_text(json.dumps(local_report, ensure_ascii=False, indent=2))

    # ---- report
    print(f'MOPS：{len(companies)} 家上市櫃、{sum(len(v) for v in edges.values())} 條持股邊')
    print(f'輸出 {OUT.relative_to(DASH)}：{len(entities)} 個實體')
    for (src, kind, method), n in sorted(stats.items()):
        print(f'  {src:26} {str(kind):16} {method:26} {n}')


if __name__ == '__main__':
    main()
