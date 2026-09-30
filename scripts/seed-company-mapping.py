"""
用 MOPS 上市公司英文名稱與海外子公司清單，自動為 Violation Tracker 母公司（unmatched.json）
產生 company-mapping 候選，輸出 data/company-mapping.seed.json 供人工確認後改名為 company-mapping.json。

匹配層級（由高到低）：
  exact-abbr   VT parent 名稱正規化後 == MOPS 英文簡稱
  exact-full   == MOPS 英文全稱（去掉 Co., Ltd., Corporation 等尾綴）
  subsidiary   == MOPS 海外子公司名稱（去尾綴）
  fuzzy        difflib 相似度 >= 0.85
"""
import csv, json, re, difflib, collections, pathlib

import os
ROOT = pathlib.Path(__file__).resolve().parents[2]
MOPS = pathlib.Path(os.environ.get('MOPS_DIR', ROOT / 'scripts/mops_company'))
DATA = pathlib.Path(__file__).resolve().parents[1] / 'data'

SUFFIX = r"\b(co|corp|corporation|company|inc|incorporated|ltd|limited|holding|holdings|group|plc|s\.?a\.?|the)\b"
def norm(s):
    s = s.lower().replace('&', ' and ')
    s = re.sub(r"\(.*?\)", " ", s)              # 去括號內容
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    s = re.sub(SUFFIX, " ", s)
    return re.sub(r"\s+", " ", s).strip()

# 注意：mops_company_info.csv 的「英文全稱」欄在部分區段整段往下錯一列（真正的全稱在下一列），
# 「英文簡稱」欄正確。這裡同時收錄「本列」與「下一列」的英文全稱作為候選，並用英文簡稱字首交叉驗證。
rows = list(csv.DictReader(open(MOPS / 'mops_company_info.csv', encoding='utf-8-sig')))
mops = {r['公司代號']: r for r in rows}
def _k(s): return re.sub(r'[^a-z0-9]', '', s.lower())
def _consistent(full, abbr):
    a, b = _k(full), _k(abbr); return bool(a and b and (a[:4] in b or b[:4] in a))
by_abbr = collections.defaultdict(list); by_full = collections.defaultdict(list)
full_fixed = {}
for i, r in enumerate(rows):
    code = r['公司代號']
    if r['英文簡稱']: by_abbr[norm(r['英文簡稱'])].append(code)
    own = r['英文全稱'] or ''; nxt = rows[i + 1]['英文全稱'] if i + 1 < len(rows) else ''
    prev_abbr = rows[i - 1]['英文簡稱'] if i else ''
    # 錯位特徵：本列全稱符合「上一列」簡稱、且不符合自己的簡稱 → 真正的全稱在下一列
    shifted = not _consistent(own, r['英文簡稱']) and _consistent(nxt, r['英文簡稱'])
    full_fixed[code] = nxt if shifted else own
    for cand in {own, nxt} - {''}:
        by_full[norm(cand)].append(code)
by_sub = collections.defaultdict(set)
for r in csv.DictReader(open(MOPS / 'oversea_subsidiaries_union.csv', encoding='utf-8-sig')):
    for k in ('投資公司名稱', '被投資海外子公司名稱'):
        n = norm(r[k]);
        if n: by_sub[n].add(r['公司代號'])
full_keys = list(by_full.keys())

# 母公司清單直接從 enforcement.json 全部紀錄彙整（不讀 unmatched.json，避免與 build 結果循環依賴）
enf = json.load(open(DATA / 'enforcement.json'))['records']
companies_of = collections.defaultdict(set); agg = {}
for r in enf:
    k = (r['source'], r['parentSlug'])
    companies_of[k].add(r['companyNameInSource'])
    a = agg.setdefault(k, {'source': r['source'], 'slug': r['parentSlug'], 'parent': r['parentInSource'], 'records': 0, 'penaltyUSD': 0})
    a['records'] += 1
    if not r['isDuplicateFlagged']: a['penaltyUSD'] += r['penaltyAmountUSD']
unmatched = sorted(agg.values(), key=lambda x: -x['penaltyUSD'])

# 已知不是台灣公司的 VT 母公司（外資在台子公司），直接標 exclude
FOREIGN = {'qualcomm','nippon-chemi-con-corp','panasonic','tdk-corporation','nhk-spring','vantiva-sa','nichicon-corporation','citigroup','barclays','dbs-bank','standard-chartered','bnp-paribas','hsbc','deutsche-bank','societe-generale','allianz','cigna','costco','carrefour','walt-disney','apple-inc','samsung-electronics','hitachi','sony','royal-philips','volkswagen','ford-motor','mazda-motor','honda','geely','nissan','toyota','mercedes-benz-group','yamaha-motor','heineken','basf','wh-group','hyatt-hotels','deloitte','ernst-and-young','wsp-global','kone','schindler','schneider-electric','fujifilm','fujitsu-general-limited','lg-electronics','xiaomi-corporation','ajinomoto','kao-corporation','kimberly-clark','colgate-palmolive','loreal','natura-and-co','gsk-plc','chemours','maersk','american-express','mitsubishi-electric','mitsubishi-chemical','samsung-candt-corporation','cathay-pacific-airways','australia-and-new-zealand-banking-group','apollo-global-management','vishay-intertechnology','matsuo-electric'}

# 人工覆寫：簡稱撞名、集團層級、VT 命名與 MOPS 不同者
OVERRIDES = {
    'au-optronics': dict(companyCodes=['2409'], level='company', note='AUO 友達；VT 名稱 AU Optronics 與 MOPS 英文名 AUO Corporation 無法自動對上'),
    'foxconn-technology-group-hon-hai-precisi': dict(companyCodes=['2317', '2354'], level='group', note='VT 以鴻海集團為 parent；2317 鴻海為主，2354 鴻準（Foxconn Technology Co.）併入集團層'),
    'formosa-plastics': dict(companyCodes=['1301'], level='group', note='VT US 版把台塑美國廠、南亞美國廠部分紀錄與 Formosa Petrochemical Point Comfort 掛在此 parent；Global 版另有獨立 nan-ya-plastics 與 formosa-petrochemical-corporation。集團層紀錄，罰款總額只計入 1301'),
    'formosa-petrochemical-corporation': dict(companyCodes=['6505', '1326'], level='group', note='VT Global 把台化（Formosa Chemicals and Fibre）掛在台塑化 parent 下'),
    'taiwan-semiconductor-manufacturing-compa': dict(companyCodes=['2330'], level='company', note='母公司層級歸 2330；VT 誤歸在此的「Taiwan Semiconductor Corporation」實為台半 5425，由 resolve-ownership.py 在實體層級更正'),
    'cpc-corporation': dict(companyCodes=[], level=None, note='台灣中油，國營未上市（非上市公司，不進上市公司對照）；MOPS 英文簡稱 CPC 撞名直得科技 1597。實體歸屬見 ownership-resolution.json（state-owned）', confidence='exclude'),
    'fcf-co': dict(companyCodes=[], level=None, note='豐群水產，台灣未上市公司（非上市，不進上市公司對照）。實體歸屬見 ownership-resolution.json（private）', confidence='exclude'),
    'taishin-financial-holdings': dict(companyCodes=['2887'], level='company', note='台新金；2025 併新光金後 MOPS 名稱為台新新光金'),
    'shin-kong-financial-holding-co-ltd': dict(companyCodes=['2887'], level='company', note='新光金已併入台新新光金 2887；歷史裁罰歸到 2887'),
    'first-financial-holding': dict(companyCodes=['2892'], level='company', note='第一金；MOPS 英文全稱錯位，靠子公司 First Commercial Bank 對上'),
    'yuanta-financial-holdings': dict(companyCodes=['2885'], level='company', note='元大金；MOPS 英文全稱錯位區'),
    'mega-financial-holding': dict(companyCodes=['2886'], level='company', note='兆豐金'),
    'ctbc-financial': dict(companyCodes=['2891'], level='company', note='中信金'),
    'innolux-corporation': dict(companyCodes=['3481'], level='company', note='群創；Chi Mei Optoelectronics 為前身'),
    'yang-ming-marine-transport': dict(companyCodes=['2609'], level='company', note='陽明海運'),
}

out = []
for u in unmatched:
    slug, name, src = u['slug'], u['parent'], u['source']
    entry = {'source': src, 'slug': slug, 'parent': name, 'records': u['records'], 'penaltyUSD': u['penaltyUSD'],
             'companyCodes': [], 'level': None, 'confidence': None, 'candidates': [], 'note': ''}
    if slug in OVERRIDES:
        o = OVERRIDES[slug]; entry.update({k: v for k, v in o.items() if k != 'confidence'}); entry['confidence'] = o.get('confidence', 'manual-confirmed')
        out.append(entry); continue
    if slug in FOREIGN:
        entry['confidence'] = 'exclude'; entry['note'] = '外資母公司，在台子公司受罰；非台灣上市公司'
        out.append(entry); continue
    n = norm(name)
    cands = []
    for code in by_abbr.get(n, []): cands.append((code, 'exact-abbr', 1.0))
    for code in by_full.get(n, []):
        cands.append((code, 'exact-full', 1.0 if norm(full_fixed.get(code, '')) == n else 0.6))
    for code in by_sub.get(n, []): cands.append((code, 'subsidiary', 0.95))
    # 用 VT 底下的 company 名稱也試 subsidiary / full
    for cn in companies_of[(src, slug)]:
        cn_n = norm(cn)
        for code in by_sub.get(cn_n, []): cands.append((code, 'subsidiary(company)', 0.9))
        for code in by_full.get(cn_n, []): cands.append((code, 'exact-full(company)', 0.9 if norm(full_fixed.get(code, '')) == cn_n else 0.5))
    if not cands:
        for k, score in [(k, difflib.SequenceMatcher(None, n, k).ratio()) for k in full_keys]:
            if score >= 0.85:
                for code in by_full[k]: cands.append((code, 'fuzzy', round(score, 2)))
    seen = {}
    for code, how, sc in cands:
        if code not in seen or seen[code][1] < sc: seen[code] = (how, sc)
    entry['candidates'] = [{'companyCode': c, 'name': mops[c]['公司名稱'], 'en': full_fixed.get(c, mops[c]['英文全稱']), 'how': h, 'score': s} for c, (h, s) in sorted(seen.items(), key=lambda x: -x[1][1])]
    if entry['candidates']:
        best = entry['candidates'][0]
        entry['companyCodes'] = [c['companyCode'] for c in entry['candidates'] if c['score'] >= 0.9]
        entry['level'] = 'group' if len(entry['companyCodes']) > 1 else 'company'
        entry['confidence'] = 'auto-high' if best['score'] >= 0.95 else 'auto-review'
    else:
        entry['confidence'] = 'manual'
    out.append(entry)

json.dump(out, open(DATA / 'company-mapping.seed.json', 'w'), ensure_ascii=False, indent=2)

# 正式對照表：只收有上市公司代號者；同一 slug 的 US / Global 合併
final = {}
for e in out:
    if e['confidence'] == 'exclude' or not e['companyCodes']:
        continue
    m = final.setdefault(e['slug'], {'vtSlug': None, 'vtgSlug': None, 'companyCodes': e['companyCodes'],
                                     'level': e['level'] or 'company', 'confidence': e['confidence'], 'note': e['note']})
    m['vtSlug' if e['source'] == 'Violation Tracker' else 'vtgSlug'] = e['slug']
json.dump(list(final.values()), open(DATA / 'company-mapping.json', 'w'), ensure_ascii=False, indent=2)
print(f'company-mapping.json：{len(final)} 個 VT 母公司 → 上市公司')
c = collections.Counter(e['confidence'] for e in out)
print(dict(c))
for e in out:
    if e['confidence'] in ('auto-high', 'auto-review', 'manual'):
        cs = ', '.join(f"{x['companyCode']} {x['name']}({x['how']} {x['score']})" for x in e['candidates'][:3])
        print(f"[{e['confidence']:11}] {e['source'][18:] or 'US':6} {e['parent'][:45]:45} -> {cs or '—'}")
