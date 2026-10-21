"""
台灣上市櫃公司的海外據點清單：依國家列出台灣母公司與當地子公司，給夥伴分國家去找當地的環境裁罰資料來源（像美國的 EPA ECHO）。

資料來源
  - MOPS 海外轉投資（oversea_subsidiaries_union.csv）：投資公司 → 海外子公司、地區別、持股比例。不含中國大陸。
  - MOPS 合併報表子公司（subsidiaries_union.csv）：補「業務性質」；中國大陸子公司也只能從這裡依名稱推斷。

輸出
  data/overseas-footprint.csv      每列一個（國家, 母公司, 子公司）
  data/overseas-countries.csv      每列一個國家的摘要，供認領分工

「類型」是依名稱與業務性質的關鍵字推測，不是官方分類；境外控股地（英屬維京群島、開曼等）幾乎沒有實體工廠。

用法：python3 scripts/build-overseas-footprint.py
"""
import csv, re, sys, pathlib, collections, importlib.util

DASH = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('ro', DASH / 'scripts' / 'resolve-ownership.py')
ro = importlib.util.module_from_spec(spec); spec.loader.exec_module(ro)

OUT_ROWS = DASH / 'data' / 'overseas-footprint.csv'
OUT_COUNTRIES = DASH / 'data' / 'overseas-countries.csv'
SNAPSHOT = 'MOPS 2025Q2'

# 境外控股／權宜船籍地：子公司多為控股公司或船舶 SPV，沒有工廠
OFFSHORE = {'英屬維京群島', '薩摩亞', '開曼群島', '塞席爾', '模里西斯', '馬紹爾群島', '百慕達群島', '貝里斯', '安奎拉',
            '英屬澤西島', '賴比瑞亞', '巴拿馬', '巴哈馬', '汶萊', '英屬曼島', '英屬根西島', '直布羅陀', '庫克群島', '萬那杜'}
FINANCE = re.compile(r'金融|保險|證券')
# 已有環境裁罰資料進網站的國家
DONE = {'美國': 'EPA ECHO（ICIS-NPDES 水污違規）已接入網站；Violation Tracker 有罰款紀錄'}

T_HOLD = re.compile(r'控股|投資|holding|invest|capital|venture|fund|財務|融資|finance', re.I)
T_SHIP = re.compile(r'航運|船舶|海運|輪船|船務|shipping|marine|navigation|maritime|vessel|tanker|carrier', re.I)
T_MFG = re.compile(r'製造|生產|加工|工廠|產製|鑄造|冶煉|煉|染整|紡織|織造|成衣|製鞋|鞋業|塑膠|化工|化學|水泥|鋼|印刷電路|電路板|封裝|晶圓|'
                   r'manufactur|factory|industr|mfg|plant|textile|chemical|steel|cement|plastic|foundry|precision', re.I)
# 業務性質只認「實際在做」的字；「化學品買賣」「鋼材貿易」不算工廠
T_MFG_NATURE = re.compile(r'製造|生產|加工|工廠|產製|鑄造|冶煉|煉製|染整|織造|紡紗|成衣|製鞋|組裝|代工|manufactur|production|assembl', re.I)
T_SALES = re.compile(r'銷售|買賣|貿易|行銷|業務推廣|售後|服務|物流|倉儲|研發|設計|顧問|諮詢|軟體|零售|餐飲|'
                     r'trading|sales|marketing|service|logistic|research|design|consult|software|retail', re.I)

# 中國大陸地名（MOPS 海外轉投資不含大陸，只能從合併報表子公司名稱推斷）
CN_PLACES = ('中國|大陸|中华|上海|北京|天津|重慶|江蘇|浙江|廣東|福建|山東|河北|河南|湖北|湖南|安徽|江西|四川|遼寧|吉林|黑龍江|陝西|山西|'
             '雲南|貴州|廣西|海南|內蒙|寧夏|新疆|甘肅|青海|昆山|蘇州|無錫|常州|常熟|太倉|吳江|南京|南通|揚州|鎮江|泰州|徐州|淮安|鹽城|'
             '杭州|寧波|嘉興|嘉善|紹興|溫州|湖州|平湖|深圳|東莞|廣州|佛山|中山|珠海|惠州|江門|肇慶|汕頭|廈門|福州|泉州|漳州|莆田|青島|'
             '煙台|威海|濟南|成都|武漢|長沙|合肥|鄭州|西安|瀋陽|大連|長春|哈爾濱|南昌|昆明|貴陽|南寧|蕪湖|滁州|淮安|宿遷|連雲港|'
             '中國大陸|大陸地區|廊坊|唐山|秦皇島|保定|石家莊')
CN_NAME = re.compile(rf'({CN_PLACES})')
CN_EN = re.compile(r'\((shanghai|beijing|tianjin|chongqing|jiangsu|zhejiang|guangdong|fujian|shandong|kunshan|suzhou|wuxi|'
                   r'changzhou|nanjing|nantong|hangzhou|ningbo|shenzhen|dongguan|guangzhou|foshan|zhongshan|zhuhai|xiamen|'
                   r'fuzhou|qingdao|chengdu|wuhan|hefei|xi\'?an|dalian|shenyang|china|prc)\)', re.I)
NOT_CN = re.compile(r'香港|澳門|台灣|臺灣|新加坡|越南|泰國|馬來|印尼|菲律賓|日本|韓國|美國|印度|hong\s*kong|macau|taiwan', re.I)


def country_name(code_field):
    return re.sub(r'^\d+--', '', (code_field or '').strip()) or '未標註'


def classify(name, nature, country):
    if T_SHIP.search(f'{name} {nature}'):
        return '航運'
    # 「投資控股及電子產品製造」算製造；「生產及非生產事業之投資業務」算控股
    if T_HOLD.search(name) or re.search(r'之投資|投資(業務|事業)$', nature) or (T_HOLD.search(nature) and not T_MFG_NATURE.search(nature)):
        return '控股／投資'
    if T_MFG_NATURE.search(nature):
        return '製造（推測）'
    if nature and T_SALES.search(nature):
        return '銷售／服務'
    if T_MFG.search(name):
        return '製造（推測）'
    if T_SALES.search(name):
        return '銷售／服務'
    if country in OFFSHORE:
        return '控股／投資'
    return '未標註'


def main():
    companies, *_ = ro.load_mops()

    # 合併報表子公司：(公司代號, 子公司名稱 key) → 業務性質；〃 沿用上一列
    nature, consolidated = {}, []
    prev = {}
    for r in csv.DictReader(open(ro.MOPS_DIR / 'subsidiaries_union.csv', encoding='utf-8-sig')):
        code, n = r['公司代號'], r['子公司名稱'].strip()
        bn = (r['業務性質'] or '').strip()
        if bn in ro.DITTO or not bn:
            bn = prev.get(code, '')
        prev[code] = bn
        for _, k in ro.name_keys(n):
            nature.setdefault((code, k), bn)
        consolidated.append((code, n, bn, ro.parse_pct(r['所持股權百分比']), r['投資公司名稱'].strip()))

    rows = {}
    seen_names = collections.defaultdict(set)
    prev_inv = {}
    for r in csv.DictReader(open(ro.MOPS_DIR / 'oversea_subsidiaries_union.csv', encoding='utf-8-sig')):
        code, sub = r['公司代號'], r['被投資海外子公司名稱'].strip()
        inv = r['投資公司名稱'].strip()
        if inv in ro.DITTO or not inv:
            inv = prev_inv.get(code, '本公司')
        prev_inv[code] = inv
        country = country_name(r['地區別代號'])
        keys = [k for _, k in ro.name_keys(sub)]
        seen_names[code].update(keys)
        bn = next((nature[(code, k)] for k in keys if (code, k) in nature), '')
        pct = ro.parse_pct(r['本期期末持股比例'])
        key = (country, code, keys[0] if keys else sub)
        if key not in rows or (pct or 0) > (rows[key]['pct'] or 0):
            rows[key] = {'country': country, 'code': code, 'sub': sub, 'inv': inv, 'pct': pct, 'nature': bn,
                         'source': f'{SNAPSHOT} 海外轉投資'}

    # 中國大陸：合併報表子公司中，名稱帶大陸地名、且不在海外轉投資清單者
    for code, n, bn, pct, inv in consolidated:
        keys = [k for _, k in ro.name_keys(n)]
        if not keys or any(k in seen_names[code] for k in keys):
            continue
        if not (CN_NAME.search(n) or CN_EN.search(n)) or NOT_CN.search(n):
            continue
        key = ('中國大陸', code, keys[0])
        if key not in rows or (pct or 0) > (rows[key]['pct'] or 0):
            rows[key] = {'country': '中國大陸', 'code': code, 'sub': n, 'inv': inv, 'pct': pct, 'nature': bn,
                         'source': f'{SNAPSHOT} 合併報表子公司（依名稱推斷為大陸）'}

    out = []
    for r in rows.values():
        c = companies.get(r['code'], {})
        r['type'] = classify(r['sub'], r['nature'], r['country'])
        r['short'] = c.get('short', '')
        r['industry'] = c.get('industry', '')
        r['finance'] = bool(FINANCE.search(r['industry']))
        out.append(r)

    zone = lambda c: '境外控股地' if c in OFFSHORE else ('未標註' if c in ('其他', '未標註') else '實體據點')
    out.sort(key=lambda r: (zone(r['country']) != '實體據點', r['country'], r['code'], r['sub']))
    with open(OUT_ROWS, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        w.writerow(['國家', '國家類型', '公司代號', '公司簡稱', '產業類別', '投資公司', '子公司名稱', '持股比例', '業務性質', '類型（推測）', '資料來源'])
        for r in out:
            w.writerow([r['country'], zone(r['country']), r['code'], r['short'], r['industry'], r['inv'], r['sub'],
                        f"{r['pct'] * 100:.2f}%" if r['pct'] is not None else '', r['nature'], r['type'], r['source']])

    by_country = collections.defaultdict(list)
    for r in out:
        by_country[r['country']].append(r)
    summary = []
    for country, rs in by_country.items():
        real = [r for r in rs if not r['finance']]
        mfg = [r for r in real if r['type'] == '製造（推測）']
        parents = collections.Counter(r['code'] for r in real)
        mfg_parents = collections.Counter(r['code'] for r in mfg)
        top = (mfg_parents or parents).most_common(8)
        summary.append({
            'country': country, 'zone': zone(country), 'subs': len(real), 'parents': len(parents), 'mfg': len(mfg),
            'mfgParents': len(mfg_parents),
            'top': '、'.join(f"{companies.get(c, {}).get('short', c)} {c}" for c, _ in top),
            'status': DONE.get(country, ''),
        })
    summary.sort(key=lambda s: (s['zone'] != '實體據點', -s['mfg'], -s['subs']))
    with open(OUT_COUNTRIES, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        w.writerow(['國家', '國家類型', '子公司數（不含金融業）', '母公司數', '推測製造子公司數', '有製造子公司的母公司數',
                    '主要母公司（優先列製造）', '目前資料狀態', '認領人', '找到的資料來源／API', '備註'])
        for s in summary:
            w.writerow([s['country'], s['zone'], s['subs'], s['parents'], s['mfg'], s['mfgParents'], s['top'], s['status'], '', '', ''])

    real = [r for r in out if not r['finance']]
    print(f"{len(out)} 列（不含金融業 {len(real)}），{len(by_country)} 個國家／地區，"
          f"{len({r['code'] for r in out})} 家母公司；推測製造子公司 {sum(r['type'] == '製造（推測）' for r in real)} 個", file=sys.stderr)
    print(f'→ {OUT_ROWS.relative_to(DASH)}、{OUT_COUNTRIES.relative_to(DASH)}', file=sys.stderr)


if __name__ == '__main__':
    main()
