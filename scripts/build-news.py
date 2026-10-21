"""
污染事件：data/news-events.json（人工整理）→ data/news.json（建置用，進 git）。規格見 docs/pollution-news-spec.md。

- 驗證每個事件的欄位與收錄門檻（spec 第 3 節），有任何錯誤就中止、不產出。
- 依持股決定事件出現在哪些公司頁（spec 第 4 節）：有效持股 ≥ 20%，或集團合計 ≥ 50% 且本身有持股。
  事件有 attributionOverride 就照用（關聯企業、MOPS 追不到的實體）；沒有才用 resolve-ownership.py 沿 MOPS 持股鏈追。
- 只有新聞、沒有 EPA 設施的公司，從 MOPS 補基本資料（需要 ../scripts/mops_company，可用 MOPS_DIR 覆寫）。

data/news.json 進 git，CI 建置不需要 MOPS。
用法：python3 scripts/build-news.py（npm run news 會接著跑 fetch-data）
"""
import csv, json, re, sys, datetime, pathlib, importlib.util

DASH = pathlib.Path(__file__).resolve().parents[1]
DATA = DASH / 'data'
SRC = DATA / 'news-events.json'
OUT = DATA / 'news.json'
spec = importlib.util.spec_from_file_location('ro', DASH / 'scripts' / 'resolve-ownership.py')
ro = importlib.util.module_from_spec(spec); spec.loader.exec_module(ro)

TYPES = {'pollution-incident', 'enforcement', 'litigation', 'eia-dispute', 'industrial-accident', 'community-health'}
STATUSES = {'alleged', 'investigating', 'concluded', 'penalized', 'settled', 'ruled', 'ongoing'}
SOURCE_KINDS = {'official', 'court', 'company', 'media', 'ngo'}
DOC_KINDS = {'official', 'court', 'company'}      # 一份就過門檻
REGIONS = {'taiwan', 'local', 'international'}
DATE_RE = {'day': r'^\d{4}-\d{2}-\d{2}$', 'month': r'^\d{4}-\d{2}$', 'year': r'^\d{4}$'}
ANY_DATE = r'^\d{4}(-\d{2}(-\d{2})?)?$'
OWN_MIN, GROUP_MIN = 20, 50                       # 有效持股、集團合計（%）
SRC_NEWS = 'News'


def check_event(ev, ids):
    err = []
    eid = ev.get('id') or '(沒有 id)'
    for k in ('id', 'title', 'summary', 'type', 'status', 'dateStart', 'datePrecision', 'locations', 'entities', 'sources'):
        if not ev.get(k):
            err.append(f'缺 {k}')
    if ev.get('id') and not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', ev['id']):
        err.append('id 只能用小寫英數與連字號')
    if eid in ids:
        err.append('id 重複')
    if ev.get('type') not in TYPES: err.append(f"type 不合法：{ev.get('type')}")
    if ev.get('status') not in STATUSES: err.append(f"status 不合法：{ev.get('status')}")
    prec = ev.get('datePrecision')
    if prec not in DATE_RE or not re.fullmatch(DATE_RE[prec], ev.get('dateStart') or ''):
        err.append(f"dateStart 與 datePrecision 不符：{ev.get('dateStart')} / {prec}")
    if ev.get('dateEnd') and (not re.fullmatch(ANY_DATE, ev['dateEnd']) or ev['dateEnd'] < (ev.get('dateStart') or '')):
        err.append(f"dateEnd 不合法：{ev['dateEnd']}")
    for loc in ev.get('locations') or []:
        if not loc.get('country') or not loc.get('plantSite'): err.append('locations 每筆要有 country 與 plantSite')
    for s in ev.get('sources') or []:
        tag = s.get('outlet') or s.get('url')
        if s.get('kind') not in SOURCE_KINDS: err.append(f'來源 kind 不合法：{tag}')
        if s.get('outletRegion') not in REGIONS: err.append(f'來源 outletRegion 不合法：{tag}')
        if not re.match(r'^https?://', s.get('url') or ''): err.append(f'來源網址不合法：{tag}')
        if not s.get('title') or not s.get('outlet'): err.append(f'來源缺 title 或 outlet：{tag}')
        if not re.fullmatch(ANY_DATE, s.get('date') or ''): err.append(f"來源日期不合法：{tag} {s.get('date')}")
    srcs = ev.get('sources') or []
    media = {re.sub(r'\W', '', s['outlet'].lower()) for s in srcs if s.get('kind') == 'media' and s.get('outlet')}
    if not any(s.get('kind') in DOC_KINDS for s in srcs) and len(media) < 2:
        err.append('未達來源門檻：要有 1 份官方／法院／公司文件，或 2 家獨立媒體')
    warn = [f"來源沒有封存網址：{s.get('outlet')}（{s.get('note') or '未說明原因'}）" for s in srcs if not s.get('archiveUrl')]
    return err, warn


def resolve_holders(ev, resolver):
    """attributionOverride 優先；沒有就逐一用 MOPS 持股鏈解析 entities。"""
    if ev.get('attributionOverride'):
        return [dict(h) for h in ev['attributionOverride']]
    holders = []
    for ent in ev['entities']:
        res = resolver.resolve(SRC_NEWS, None, ent['name'])
        who = res.get('responsible') or {}
        if who.get('kind') != 'listed' or not who.get('code'):
            continue
        hops = [f"{p['investee']}（{p['pct']}%）" if p.get('pct') is not None else p['investee'] for p in res.get('path') or []]
        holders.append({'companyCode': who['code'], 'entity': ent['name'], 'kind': 'listed',
                        'effectivePct': res.get('effectivePct'), 'controlSince': res.get('controlSince'),
                        'path': [who.get('short') or who.get('name')] + hops,
                        'basis': f"MOPS 持股鏈（{res.get('method')}）"})
    return holders


def attribute(ev, holders, companies):
    """標出每個持股人是否出現在公司頁，並檢查收購前事件。"""
    err = []
    groups = ev.get('groupControl') or []
    start_year = int(ev['dateStart'][:4])
    for h in holders:
        code = h.get('companyCode')
        if code not in companies:
            err.append(f'MOPS 查無公司代號 {code}')
            continue
        h['companyName'], h['companyShort'] = companies[code]['name'], companies[code]['short']
        pct = h.get('effectivePct')
        if pct is not None and pct <= 1:          # 允許寫成小數
            pct = h['effectivePct'] = round(pct * 100, 2)
        since = h.get('controlSince')
        if since and start_year < int(since):
            err.append(f'{code} 在 {since} 年才取得持股，事件 {ev["dateStart"]} 屬收購前，不收')
        g = next((g for g in groups if code in g.get('members', []) and (g.get('totalPct') or 0) * (100 if g['totalPct'] <= 1 else 1) >= GROUP_MIN), None)
        if pct is not None and pct >= OWN_MIN:
            h['shown'], h['reason'] = True, 'own'
        elif g and pct:
            h['shown'], h['reason'], h['group'] = True, 'group', g['group']
        else:
            h['shown'], h['reason'] = False, None
    for g in groups:
        if g.get('totalPct') is not None and g['totalPct'] <= 1:
            g['totalPct'] = round(g['totalPct'] * 100, 2)
    if not any(h.get('shown') for h in holders):
        err.append('沒有任何上市公司達到歸屬門檻（要補 attributionOverride 或 groupControl）')
    return err


def company_info():
    rows = {r['公司代號']: r for r in csv.DictReader(open(ro.MOPS_DIR / 'mops_company_info.csv', encoding='utf-8-sig'))}
    return rows


def company_cols(code, info, companies):
    """與 data/facilities.csv 的公司欄位同名，fetch-gcs-data.js 用同一套對應。"""
    m, c = info[code], companies[code]
    site = (m['公司網址'] or '').strip()
    if site and not re.match(r'^https?://', site):
        site = 'https://' + site.lstrip('/')
    return {'公司代號': code, '投資公司名稱': m['公司名稱'], '投資公司英文全稱': c['enFull'] or m['英文簡稱'] or m['公司名稱'],
            '英文簡稱': m['英文簡稱'], '公司簡稱': m['公司簡稱'], '產業類別': m['產業類別'], '董事長': m['董事長'],
            '成立日期': m['成立日期'], '上市日期': m['上市日期'], '實收資本額(元)': m['實收資本額(元)'],
            '公司網址': site, '住址': m['住址'], 'LOGO網址': ''}


def main():
    events = json.load(open(SRC, encoding='utf-8'))
    companies, edges, display, listed_child, us_subs = ro.load_mops()
    resolver = ro.Resolver(ro.OwnershipGraph(companies, edges, display, listed_child), [], {})

    errors, warnings, ids, out_events = [], [], set(), []
    for ev in events:
        err, warn = check_event(ev, ids)
        ids.add(ev.get('id'))
        if not err:
            holders = resolve_holders(ev, resolver)
            err += attribute(ev, holders, companies)
            ev = {k: v for k, v in ev.items() if k != 'attributionOverride'}
            ev['attribution'] = holders
            ev['companyCodes'] = sorted({h['companyCode'] for h in holders if h.get('shown')})
            out_events.append(ev)
        errors += [f"[{ev.get('id')}] {e}" for e in err]
        warnings += [f"[{ev.get('id')}] {w}" for w in warn]

    for w in warnings:
        print(f'  ⚠ {w}', file=sys.stderr)
    if errors:
        for e in errors:
            print(f'  ✗ {e}', file=sys.stderr)
        sys.exit(f'{len(errors)} 個錯誤，未產出 {OUT.relative_to(DASH)}')

    have = set()
    for f in ('facilities.csv', 'facilities-supplement.csv'):
        if (DATA / f).exists():
            have |= {r['公司代號'].strip() for r in csv.DictReader(open(DATA / f, encoding='utf-8-sig'))}
    info = company_info()
    shown = sorted({c for ev in out_events for c in ev['companyCodes']})
    news_only = {c: company_cols(c, info, companies) for c in shown if c not in have}

    out_events.sort(key=lambda e: e['dateStart'], reverse=True)
    OUT.write_text(json.dumps({
        'generatedAt': datetime.date.today().isoformat(),
        'note': '由 scripts/build-news.py 從 data/news-events.json 產生，規格見 docs/pollution-news-spec.md。'
                'attribution[].shown 表示事件是否出現在該公司頁；reason：own 有效持股 ≥ 20%｜group 集團合計 ≥ 50% 且本身有持股。'
                'companies 為只有新聞、不在 EPA 資料裡的公司基本資料（MOPS）。',
        'events': out_events,
        'companies': news_only,
    }, ensure_ascii=False, indent=2) + '\n')

    print(f'{len(out_events)} 個事件 → {OUT.relative_to(DASH)}')
    for c in shown:
        n = sum(1 for ev in out_events if c in ev['companyCodes'])
        print(f"  {c} {companies[c]['short']}：{n} 個事件{'（只有新聞，新增公司頁）' if c in news_only else ''}")
    if warnings:
        print(f'{len(warnings)} 個警告（見上方）')


if __name__ == '__main__':
    main()
