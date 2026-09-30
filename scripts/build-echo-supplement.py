"""
把 ECHO 覆蓋率稽核（scripts/audit-echo-coverage.py）確認屬台灣母公司、但 GCS 原始 CSV 沒有的 NPDES 許可證，
從 EPA ICIS-NPDES 全量檔補進來，輸出兩個補充檔（進 git，建置時由 fetch-gcs-data.js 合併）：

  data/facilities-supplement.csv   欄位與 data/facilities.csv 相同
  data/violations-supplement.csv   欄位與 data/violations.csv 相同

GCS 的 facilities.csv / violations.csv 維持原樣，下次 npm run download-epa 不會蓋掉補充資料。

用法
  curl -o /tmp/npdes_downloads.zip https://echo.epa.gov/files/echodownloads/npdes_downloads.zip   # 約 355MB，不進 git
  curl -o /tmp/npdes_eff_downloads.zip https://echo.epa.gov/files/echodownloads/npdes_eff_downloads.zip  # 放流水超標，約 3GB
  python3 scripts/build-echo-supplement.py --npdes=/tmp/npdes_downloads.zip --eff=/tmp/npdes_eff_downloads.zip

CONFIRMED 每一筆都經過人工確認：MOPS 持股路徑（或 resolve-ownership.py CURATED 的集團關係）＋設施名稱就是該子公司。
排除的同名誤配與沒有 NPDES 許可證的工廠記在 docs/enforcement-data-interface.md 第 8 節。
"""
import csv, io, re, sys, zipfile, pathlib, importlib.util, collections

DASH = pathlib.Path(__file__).resolve().parents[1]
DATA = DASH / 'data'
spec = importlib.util.spec_from_file_location('ro', DASH / 'scripts' / 'resolve-ownership.py')
ro = importlib.util.module_from_spec(spec); spec.loader.exec_module(ro)

# (公司代號, 境外子公司名稱＝MOPS 節點或集團實體, 依據, [NPDES 許可證], 取得控制年份或 None)
# 有取得控制年份者，早於該年的違規屬前業主，不納入
CONFIRMED = [
    ('1301', 'Formosa Plastics Corporation, U.S.A.', '台塑集團關係企業 FPC USA 德州 Point Comfort 主廠', ['TX0085570', 'TXR15285Z']),
    ('1301', 'Formosa Plastics Corporation, U.S.A.', '台塑集團關係企業 FPC USA 德州 Shore Tank Farm', ['TXR05GN80', 'TXR1575HM']),
    ('6505', 'FG LA LLC', 'MOPS：台塑化 → FG INC.（57%）→ FG LA LLC；路易斯安那 St. James Sunshine Project', ['LAR10N958', 'LAR10N960']),
    ('2104', 'Continental Carbon Company', 'MOPS：國際中橡 → CCC USA Corp.（66.67%）→ Continental Carbon Company', ['TXR05EU88', 'ALD000238', 'ALU011379']),
    # WAG030060「MORRIS & CO DBA OCEAN ALEXANDER」為同品牌經銷商，持股關係未能確認，不納入
    ('2383', 'EMD SPECIALTY MATERIALS,LLC', 'MOPS：台光電 → EMC International Holding → EMC Special Application → EMD Specialty Materials', ['CAZ469513']),
    ('2908', 'Test-Rite International (U.S.) Co., Ltd.', 'MOPS：特力 → Test-Rite International (U.S.)', ['CAZ494423', 'GAR1544B7']),
    ('2330', 'TSMC Arizona Corporation', 'MOPS：台積電 → TSMC Arizona（100%）', ['AZC112964', 'AZC113138', 'AZC113140', 'AZC112312', 'AZC113891']),
    ('6472', 'Upsher-Smith Laboratories, LLC', 'MOPS：保瑞 → Bora Pharmaceuticals USA → … → Upsher-Smith', ['CONOX0652']),
    ('2027', 'TCI Texarkana, Inc.', 'MOPS：大成不銹鋼 → Ta Chen International → TCI Texarkana；2018-10 向 Arconic 買下（Arconic 公告）', ['TXR1533GK', 'TX0097055'], 2018),  # TXR05M678 為前業主 Alumax 名下，不納入
    ('2027', 'Primus Pipe and Tube, Inc.', 'MOPS：大成不銹鋼 → Ta Chen International → Primus Pipe and Tube', ['FLR10SJ36']),
    ('1515', 'Power Tool Specialists Inc.', 'MOPS：力山 → Power Tool Specialists（96%）', ['CAZ513140']),
    ('2723', 'Perfect 85 Degrees C, Inc.', 'MOPS：美食-KY → Perfect 85 Degrees C', ['CAZ502731']),
    ('2603', 'Everport Terminal Services Inc.', 'MOPS：長榮 → Everport Terminal Services（94.43%）', ['CAZ466559']),
    ('1210', 'Amy Food, Inc', 'MOPS：大成 → Dachan (USA) → Amy Food（80%）', ['TXRNEBU79', 'TXRNET517']),
    ('1303', '南亞塑膠美洲有限公司', 'MOPS：南亞 → 南亞塑膠美洲（Nan Ya Plastics Corp., America）', ['SCR000483']),
    ('2317', 'Sharp Manufacturing Company of America', '夏普美國製造，夏普 2016 起為鴻海集團', ['TNR053068'], 2016),
]

VIOLATION_FILES = ['NPDES_EFF_VIOLATIONS.csv', 'NPDES_SE_VIOLATIONS.csv', 'NPDES_CS_VIOLATIONS.csv', 'NPDES_PS_VIOLATIONS.csv']
TYPE_DESC = {'NPDES_EFF_VIOLATIONS.csv': ('E', 'Effluent Violations'), 'NPDES_SE_VIOLATIONS.csv': ('S', 'Single Event Violations'),
             'NPDES_CS_VIOLATIONS.csv': ('C', 'Compliance Schedule Violations'), 'NPDES_PS_VIOLATIONS.csv': ('P', 'Permit Schedule Violations')}


def rows_from(zf, name, only=None):
    """only：只要這些 NPDES_ID（第一欄）。放流水檔解壓後 16GB，先用行首字串過濾再解析，快很多。"""
    member = next((n for n in zf.namelist() if n.upper().endswith(name.upper())), None)
    if not member:
        print(f'  ⚠ {name} 不在壓縮檔中', file=sys.stderr); return
    with zf.open(member) as fh:
        if not only:
            yield from csv.DictReader(io.TextIOWrapper(fh, encoding='latin-1')); return
        header = next(csv.reader([fh.readline().decode('latin-1')]))
        prefixes = tuple(f'"{p}",'.encode() for p in only) + tuple(f'{p},'.encode() for p in only)
        for line in fh:
            if line.startswith(prefixes):
                vals = next(csv.reader([line.decode('latin-1')]))
                yield dict(zip(header, vals))


def main():
    npdes_zip = next((a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--npdes=')), None)
    eff_zip = next((a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--eff=')), None)
    if not npdes_zip:
        sys.exit(__doc__)
    fac_header = next(csv.reader(open(DATA / 'facilities.csv', encoding='utf-8-sig')))
    vio_header = next(csv.reader(open(DATA / 'violations.csv', encoding='utf-8-sig')))   # utf-8-sig 去掉 BOM
    have = {re.sub(r'\s', '', r['npdes_id'] or '') for r in csv.DictReader(open(DATA / 'facilities.csv', encoding='utf-8-sig'))}
    companies, edges, display, listed_child, _ = ro.load_mops()
    g = ro.OwnershipGraph(companies, edges, display, listed_child)
    info = {r['公司代號']: r for r in csv.DictReader(open(ro.MOPS_DIR / 'mops_company_info.csv', encoding='utf-8-sig'))}
    # 既有 facilities.csv 的公司欄位（含 LOGO）優先沿用
    existing_company = {}
    for r in csv.DictReader(open(DATA / 'facilities.csv', encoding='utf-8-sig')):
        existing_company.setdefault(r['公司代號'], r)

    want = {}
    control_since = {}
    for code, sub, basis, permits, *rest in CONFIRMED:
        for p in permits:
            if p in have:
                print(f'  略過 {p}：GCS 原始資料已有', file=sys.stderr); continue
            want[p] = (code, sub, basis)
            if rest and rest[0]: control_since[p] = rest[0]

    zf = zipfile.ZipFile(npdes_zip)
    icis = {}
    for r in rows_from(zf, 'ICIS_FACILITIES.csv'):
        if r.get('NPDES_ID') in want:
            icis[r['NPDES_ID']] = r
    # 以 ICIS 設施編號再擋一次：GCS 原始資料的許可證號有被轉成浮點數而變形的（例：SCR000483 → 「SCR 483.00」）
    have_icis = {re.sub(r'\.0+$', '', (r['icis_facility_id'] or '').strip()) for r in csv.DictReader(open(DATA / 'facilities.csv', encoding='utf-8-sig'))}
    for p in [p for p, f in icis.items() if f.get('ICIS_FACILITY_INTEREST_ID') in have_icis]:
        print(f'  略過 {p}：ICIS 設施 {icis[p]["ICIS_FACILITY_INTEREST_ID"]} 已在 GCS 原始資料（許可證號格式不同）', file=sys.stderr)
        del icis[p]; del want[p]
    missing = sorted(set(want) - set(icis))
    if missing:
        print(f'  ⚠ ICIS_FACILITIES 找不到：{missing}', file=sys.stderr)

    def company_cols(code):
        e = existing_company.get(code)
        if e:
            return {k: e[k] for k in fac_header if k in ('公司代號', '投資公司名稱', '投資公司英文全稱', '英文簡稱', '產業類別', '董事長',
                                                        '成立日期', '上市日期', '實收資本額(元)', '公司網址', '住址', 'LOGO網址')}
        m, c = info[code], companies[code]
        return {'公司代號': code, '投資公司名稱': m['公司名稱'], '投資公司英文全稱': c['enFull'], '英文簡稱': m['英文簡稱'],
                '產業類別': m['產業類別'], '董事長': m['董事長'], '成立日期': m['成立日期'], '上市日期': m['上市日期'],
                '實收資本額(元)': m['實收資本額(元)'], '公司網址': m['公司網址'], '住址': m['住址'], 'LOGO網址': ''}

    fac_rows = {}
    for p, f in icis.items():
        code, sub, basis = want[p]
        row = {k: '' for k in fac_header}
        row.update(company_cols(code))
        investor, pct = '', ''
        found = g.find_node(code, ro.zh_strip_suffix(ro.zh_clean(sub)) if re.search(r'[\u4e00-\u9fff]', sub) else sub)
        if found and found[2]:
            last = g.path_json(code, found[2])[-1]
            investor, pct = last['investor'], f"{last['pct']:.2f}%"
        row.update({
            '境外投資公司名稱': investor, '持股比例': pct,
            '境外子公司名稱': sub, '地區別代號': '211--美國', 'facility_name': f.get('FACILITY_NAME', ''),
            'facility_address': f.get('LOCATION_ADDRESS', ''), 'city': f.get('CITY', ''), 'state': f.get('STATE_CODE', ''),
            'zip': f.get('ZIP', ''), 'latitude': f.get('GEOCODE_LATITUDE', ''), 'longitude': f.get('GEOCODE_LONGITUDE', ''),
            'icis_facility_id': f.get('ICIS_FACILITY_INTEREST_ID', ''), 'npdes_id': p,
            '資料來源': 'ECHO覆蓋率稽核', '匹配分數': '100', '匹配英文名稱': sub, '匹配英文名稱類型': basis,
        })
        fac_rows[p] = row

    vio_rows, per_permit, dropped = [], collections.Counter(), collections.Counter()
    effzf = zipfile.ZipFile(eff_zip) if eff_zip else None
    if not effzf:
        print('  ⚠ 沒有 --eff：略過放流水超標（NPDES_EFF_VIOLATIONS）', file=sys.stderr)
    for name in VIOLATION_FILES:
        code_letter, desc = TYPE_DESC[name]
        src = effzf if name == 'NPDES_EFF_VIOLATIONS.csv' else zf
        if src is None:
            continue
        for r in rows_from(src, name, only=set(fac_rows)):
            p = r.get('NPDES_ID')
            if p not in fac_rows:
                continue
            f = fac_rows[p]
            out = {k: '' for k in vio_header}
            for k in vio_header:
                if k in f: out[k] = f[k]
                if k in r and r[k] != '': out[k] = r[k]
            out['FACILITY_NAME'] = f['facility_name']; out['ICIS_FACILITY_ID'] = f['icis_facility_id']; out['NPDES_ID'] = p
            out['VIOLATION_TYPE'] = out.get('VIOLATION_TYPE') or code_letter
            out['VIOLATION_TYPE_DESC'] = out.get('VIOLATION_TYPE_DESC') or desc
            cs = control_since.get(p)
            if cs:
                d = out.get('SINGLE_EVENT_VIOLATION_DATE') or out.get('MONITORING_PERIOD_END_DATE') or out.get('RNC_DETECTION_DATE') or out.get('SCHEDULE_DATE') or ''
                m = re.search(r'(19|20)\d\d', d)
                if m and int(m.group()) < cs:
                    dropped[p] += 1; continue
            vio_rows.append(out); per_permit[p] += 1

    # fetch-gcs-data.js 的 CSV 解析以換行切列：不寫 BOM、用 \n、欄位內換行改空白
    clean = lambda rows: [{k: re.sub(r'[\r\n]+', ' ', v or '') for k, v in r.items()} for r in rows]
    for fname, header, rows in (('facilities-supplement.csv', fac_header, fac_rows.values()), ('violations-supplement.csv', vio_header, vio_rows)):
        with open(DATA / fname, 'w', encoding='utf-8', newline='') as fh:
            w = csv.DictWriter(fh, fieldnames=[h.lstrip('\ufeff') for h in header], lineterminator='\n')
            w.writeheader(); w.writerows([{k.lstrip('\ufeff'): v for k, v in r.items()} for r in clean(rows)])
    print(f'facilities-supplement.csv：{len(fac_rows)} 個許可證／設施；violations-supplement.csv：{len(vio_rows)} 筆違規')
    for p, n in dropped.items():
        print(f'  排除 {p} 在 {control_since[p]} 年取得控制前的 {n} 筆違規（前業主）')
    for p in sorted(fac_rows, key=lambda x: -per_permit[x]):
        f = fac_rows[p]
        print(f"  {f['公司代號']} {p:10} {f['facility_name'][:44]:44} {f['city'][:14]:14} {f['state']} | 違規 {per_permit[p]}")


if __name__ == '__main__':
    main()
