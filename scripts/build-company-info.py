"""
不在 EPA 資料裡的公司基本資料：data/news.json、data/enforcement.json 掛到的上市公司，
如果 data/facilities.csv（含 supplement）沒有，就從 MOPS 補一份 → data/company-info.json。

欄位與 data/facilities.csv 的公司欄位同名，fetch-gcs-data.js 用同一套對應，這些公司標 inEpaData: false。
需要 ../scripts/mops_company（可用 MOPS_DIR 覆寫）。data/company-info.json 進 git，CI 建置不需要 MOPS。
用法：python3 scripts/build-company-info.py（npm run news、npm run attribution 都會跑）
"""
import csv, json, re, sys, datetime, pathlib, importlib.util

DASH = pathlib.Path(__file__).resolve().parents[1]
DATA = DASH / 'data'
OUT = DATA / 'company-info.json'
spec = importlib.util.spec_from_file_location('ro', DASH / 'scripts' / 'resolve-ownership.py')
ro = importlib.util.module_from_spec(spec); spec.loader.exec_module(ro)


def wanted_codes():
    """各來源上網站的公司代號 → 來源名稱。"""
    codes = {}
    news = DATA / 'news.json'
    if news.exists():
        for ev in json.load(open(news, encoding='utf-8'))['events']:
            for c in ev['companyCodes']:
                codes.setdefault(c, set()).add('news')
    enf = DATA / 'enforcement.json'
    if enf.exists():
        for r in json.load(open(enf, encoding='utf-8'))['records']:
            if r.get('shown'):
                for c in r['companyCodes']:
                    codes.setdefault(c, set()).add('enforcement')
    return codes


def company_cols(code, info, companies):
    m, c = info[code], companies[code]
    site = (m['公司網址'] or '').strip()
    if site and not re.match(r'^https?://', site):
        site = 'https://' + site.lstrip('/')
    return {'公司代號': code, '投資公司名稱': m['公司名稱'], '投資公司英文全稱': c['enFull'] or m['英文簡稱'] or m['公司名稱'],
            '英文簡稱': m['英文簡稱'], '公司簡稱': m['公司簡稱'], '產業類別': m['產業類別'], '董事長': m['董事長'],
            '成立日期': m['成立日期'], '上市日期': m['上市日期'], '實收資本額(元)': m['實收資本額(元)'],
            '公司網址': site, '住址': m['住址'], 'LOGO網址': ''}


def main():
    # 查證後不歸台灣母公司的設施（echo-programs.json excludedSites）建置時會拿掉，設施全被拿掉的公司算不在 EPA 資料裡
    progs = DATA / 'echo-programs.json'
    gone = {(e['companyCode'], fid) for e in (json.load(open(progs))['excludedSites'] if progs.exists() else []) for fid in e['facilityIds']}
    have = set()
    for f in ('facilities.csv', 'facilities-supplement.csv'):
        if (DATA / f).exists():
            have |= {r['公司代號'].strip() for r in csv.DictReader(open(DATA / f, encoding='utf-8-sig'))
                     if (r['公司代號'].strip(), re.sub(r'\.0+$', '', r['icis_facility_id'].strip())) not in gone}
    companies, *_ = ro.load_mops()
    info = {r['公司代號']: r for r in csv.DictReader(open(ro.MOPS_DIR / 'mops_company_info.csv', encoding='utf-8-sig'))}

    out, missing = {}, []
    for code, sources in sorted(wanted_codes().items()):
        if code in have:
            continue
        if code not in info or code not in companies:
            missing.append(code)
            continue
        out[code] = {**company_cols(code, info, companies), 'sources': sorted(sources)}
    if missing:
        sys.exit(f"MOPS 查無公司代號：{', '.join(missing)}，未產出 {OUT.relative_to(DASH)}")

    OUT.write_text(json.dumps({
        'generatedAt': datetime.date.today().isoformat(),
        'note': '由 scripts/build-company-info.py 產生：污染事件或 Violation Tracker 紀錄掛到、但不在 EPA 資料裡的上市公司基本資料（MOPS）。'
                'sources：news 污染事件｜enforcement Violation Tracker。',
        'companies': out,
    }, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(out)} 家不在 EPA 資料裡的公司 → {OUT.relative_to(DASH)}')
    for code, row in out.items():
        print(f"  {code} {row['公司簡稱']}：{'、'.join(row['sources'])}")


if __name__ == '__main__':
    main()
