"""
水污染（ICIS-NPDES）違規：從 EPA 全量檔重建 data/violations.csv。

原本的 violations.csv 是 GCS 上的匹配快照（comprehensive_violations_full.csv），只更新到 2025-08，之後 EPA 刪改的紀錄也沒跟上。
這支腳本用同一批設施（data/facilities.csv 的 NPDES 許可證）到全量檔重取四類違規，欄位與原檔相同，fetch-gcs-data.js 照舊讀。
公司、設施欄位沿用 facilities.csv，違規欄位照全量檔原值。

  facilities-supplement.csv 的許可證另由 build-echo-supplement.py 產生 violations-supplement.csv（也是全量檔），更新時兩支都要跑。
  處分與罰款（NPDES 正式／非正式處分）在 build-echo-programs.py，跟空污、廢棄物的處分放一起。
  台灣母公司取得控制前的紀錄這裡不刪，建置時由 fetch-gcs-data.js 依 echo-programs.json 廠區的 controlSince 排除，所有類別同一套。

用法（全量檔不進 git，scripts/download-echo-sources.sh 下載）
  python3 scripts/build-water-violations.py --dir=../epa-downloads
"""
import csv, re, sys, zipfile, pathlib, collections, importlib.util

DASH = pathlib.Path(__file__).resolve().parents[1]
DATA = DASH / 'data'
OUT = DATA / 'violations.csv'


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, DASH / 'scripts' / file)
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    return mod


sup = load('sup', 'build-echo-supplement.py')
progs = load('progs', 'build-echo-programs.py')

# 各違規檔 → violations.csv 原本的 VIOLATION_TYPE／VIOLATION_TYPE_DESC（放流水檔這兩欄是空的）
TYPES = {'NPDES_EFF_VIOLATIONS.csv': ('EFF', 'Effluent Violations'), 'NPDES_SE_VIOLATIONS.csv': ('SE', 'Single Event Violations'),
         'NPDES_CS_VIOLATIONS.csv': ('CS', 'Compliance Schedule Violations'), 'NPDES_PS_VIOLATIONS.csv': ('PS', 'Permit Schedule Violations')}
ID = lambda x: re.sub(r'\.0+$', '', (x or '').strip())


def year(r):
    d = r.get('SINGLE_EVENT_VIOLATION_DATE') or r.get('MONITORING_PERIOD_END_DATE') or r.get('RNC_DETECTION_DATE') or r.get('SCHEDULE_DATE') or ''
    m = re.search(r'\d{4}$', d)
    return m.group() if m else '無日期'


def main():
    d = pathlib.Path(next((a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--dir=')), '') or sys.exit(__doc__))
    header = [h.lstrip('﻿') for h in next(csv.reader(open(OUT, encoding='utf-8-sig')))]
    old = {(r['VIOLATION_TYPE_DESC'], ID(r['NPDES_VIOLATION_ID'])): r for r in csv.DictReader(open(OUT, encoding='utf-8-sig'))}

    fac = {}
    for f in csv.DictReader(open(DATA / 'facilities.csv', encoding='utf-8-sig')):
        fac[progs.norm_npdes(f['npdes_id'])] = f

    rows, per_type, per_year = [], collections.Counter(), collections.Counter()
    npdes = zipfile.ZipFile(d / 'npdes_downloads.zip')
    eff = zipfile.ZipFile(d / 'npdes_eff_downloads.zip')
    for name, (code, desc) in TYPES.items():
        for r in sup.rows_from(eff if name == 'NPDES_EFF_VIOLATIONS.csv' else npdes, name, only=set(fac)):
            f = fac.get(r['NPDES_ID'])
            if not f:
                continue
            out = {k: f.get(k, '') for k in header}
            out.update({k: v for k, v in r.items() if k in header and v != ''})
            out.update({'FACILITY_NAME': f['facility_name'], 'ICIS_FACILITY_ID': ID(f['icis_facility_id']), 'NPDES_ID': r['NPDES_ID'],
                        'VIOLATION_TYPE': code, 'VIOLATION_TYPE_DESC': desc})
            rows.append(out); per_type[desc] += 1; per_year[year(out)] += 1

    rows.sort(key=lambda r: (r['公司代號'], r['NPDES_ID'], r['VIOLATION_TYPE'], r['NPDES_VIOLATION_ID']))
    # fetch-gcs-data.js 的 CSV 解析以換行切列：用 \n、欄位內換行改空白
    with open(OUT, 'w', encoding='utf-8', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=header, lineterminator='\n')
        w.writeheader()
        w.writerows({k: re.sub(r'[\r\n]+', ' ', v or '') for k, v in r.items()} for r in rows)

    new = {(r['VIOLATION_TYPE_DESC'], r['NPDES_VIOLATION_ID']) for r in rows}
    latest = max((m.group(3) + m.group(1) + m.group(2) for r in rows
                  for m in [re.match(r'(\d\d)/(\d\d)/(\d{4})', r.get('MONITORING_PERIOD_END_DATE') or r.get('SINGLE_EVENT_VIOLATION_DATE') or '')] if m), default='')
    print(f'{OUT.relative_to(DASH)}：{len(fac)} 張許可證、{len(rows)} 筆違規（上一版 {len(old)} 筆），最新監測期 {latest[:4]}-{latest[4:6]}-{latest[6:]}')
    for k, n in per_type.most_common():
        print(f'  {k:32} {n:5}')
    print(f'  新增 {len(new - set(old))} 筆；上一版有、全量檔已無（EPA 刪除或更正）{len(set(old) - new)} 筆')
    print('  各年筆數', dict(sorted(per_year.items())))


if __name__ == '__main__':
    main()
