"""
ECHO 覆蓋率稽核：台灣上市公司的美國子公司（MOPS）在 EPA ECHO 有哪些設施、我們的 data/facilities.csv 漏了哪些。

做法
  1. 從 MOPS 海外轉投資取出所有「地區別＝美國」且有英文名的子公司，去掉公司型態字與泛用字得到搜尋詞。
     另加入 MOPS 沒有、但已確認屬台灣集團的美國實體（CURATED_TERMS，例如 FPC USA）。
  2. 逐一查詢 ECHO facility search API（echodata.epa.gov，公開、免金鑰），取回設施名稱、地點與合規摘要。
  3. 只保留設施名稱包含搜尋詞全部關鍵字者，與 facilities.csv 比對（名稱＋州），列出缺漏。

輸出 data/echo-coverage-audit.json（只含 EPA 公開資料與 MOPS 公司名稱）。不會修改 facilities.csv；
缺漏設施要不要納入網站，需另外匯入其 ICIS-NPDES 違規資料並人工確認。

用法：python3 scripts/audit-echo-coverage.py --exporter=/path/echo_exporter.zip   （建議：EPA 全量檔本機比對，約 2–5 分鐘）
      python3 scripts/audit-echo-coverage.py                                  （逐一查 API；ECHO 會回 429 限流，極慢，已完成者快取在 data/.echo-audit-cache.json）
"""
import csv, json, re, sys, time, pathlib, datetime, collections, importlib.util, urllib.request, urllib.parse, urllib.error

DASH = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('ro', DASH / 'scripts' / 'resolve-ownership.py')
ro = importlib.util.module_from_spec(spec); spec.loader.exec_module(ro)

API = 'https://echodata.epa.gov/echo/echo_rest_services.'
OUT = DASH / 'data' / 'echo-coverage-audit.json'
CACHE = DASH / 'data' / '.echo-audit-cache.json'
MIN_INTERVAL = 1.5   # 秒；ECHO API 並行或太快會回 429
_last = [0.0]
STOP = ro.GENERIC | {'north', 'south', 'east', 'west', 'american', 'us', 'usa', 'llc', 'inc', 'corp', 'systems', 'system', 'solutions',
                     'products', 'product', 'manufacturing', 'mfg', 'operations', 'sales', 'marketing', 'research', 'design',
                     'digital', 'semiconductor', 'semiconductors', 'optical', 'medical', 'health', 'capital', 'management',
                     'partners', 'ventures', 'fund', 'finance', 'financial', 'properties', 'realty', 'logistics', 'supply'}

# MOPS 子公司清單沒有、但已確認屬台灣集團的美國實體（依據見 resolve-ownership.py CURATED）
CURATED_TERMS = [
    ('1301', 'FORMOSA PLASTICS', 'FPC USA，台塑集團關係企業（私人持有）'),
    ('1301', 'FORMOSA INDUSTRIES', 'Formosa Industries Corp.，台塑 1301 100%'),
    ('1303', 'NAN YA PLASTICS', '南亞美國／南亞美洲／南亞德州'),
    ('6505', 'FG LA', 'FG LA LLC，台塑化 6505 經 FG INC. 持股 57%'),
    ('2317', 'SHARP ELECTRONICS', '夏普美國（鴻海集團，2016 起）'),
    ('2317', 'SHARP MANUFACTURING', '夏普美國製造（鴻海集團，2016 起）'),
]


def get(url, tries=6):
    for i in range(tries):
        wait = MIN_INTERVAL - (time.time() - _last[0])
        if wait > 0: time.sleep(wait)
        _last[0] = time.time()
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429 and i < tries - 1:
                time.sleep(45 * (i + 1)); continue
            if i == tries - 1: return {'error': f'HTTP {e.code}'}
            time.sleep(5)
        except Exception as e:
            if i == tries - 1: return {'error': str(e)}
            time.sleep(5)


def search(term):
    q = get(API + 'get_facilities?' + urllib.parse.urlencode({'output': 'JSON', 'p_fn': term}))
    if isinstance(q, dict) and 'error' in q:
        raise RuntimeError(q['error'])
    res = q.get('Results', {}) if isinstance(q, dict) else {}
    rows, qid = int(res.get('QueryRows') or 0), res.get('QueryID')
    if not qid or rows == 0:
        return rows, []
    if rows > 150:            # 搜尋詞太泛，略過
        return rows, None
    out, page = [], 1
    while len(out) < rows and page <= 2:
        d = get(API + 'get_qid?' + urllib.parse.urlencode({'output': 'JSON', 'qid': qid, 'pageno': page}))
        out += (d.get('Results', {}) or {}).get('Facilities', []) if isinstance(d, dict) else []
        page += 1
    return rows, out


def core_tokens(name):
    return [t for t in ro.en_tokens(name) if t not in STOP and not t.isdigit() and len(t) > 2]


def match_api(terms, companies, have, results, skipped, failed):
    """逐一查 ECHO API（會被限流，慢）。"""
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    for i, (term, owners) in enumerate(sorted(terms.items()), 1):
        if i % 50 == 0: print(f'  {i}/{len(terms)}', file=sys.stderr, flush=True)
        if term not in cache:
            try:
                rows, facs = search(term)
            except RuntimeError as e:
                failed.append({'term': term, 'error': str(e)}); continue
            cache[term] = {'rows': rows, 'facs': facs}
            if i % 20 == 0: CACHE.write_text(json.dumps(cache))
        rows, facs = cache[term]['rows'], cache[term]['facs']
        if facs is None:
            skipped.append({'term': term, 'rows': rows}); continue
        need = set(t.lower() for t in term.split())
        for f in facs:
            ftoks = set(ro.en_tokens(f.get('FacName') or ''))
            if not need <= ftoks:
                continue
            key = (ro.en_key(f['FacName']), (f.get('FacState') or '').strip())
            results.append({
                'term': term, 'strength': 'strong' if len(need) >= 2 else 'weak',
                'owners': [{'code': c, 'name': companies.get(c, {}).get('name', c), 'via': n, 'basis': w} for c, n, w in owners],
                'registryId': f.get('RegistryID'), 'name': f.get('FacName'), 'city': f.get('FacCity') or '', 'state': f.get('FacState') or '',
                'active': f.get('FacActiveFlag'), 'inOurData': key in have,
                'qtrsNonCompliant': int(f.get('FacQtrsWithNC') or 0), 'penaltyCount': int(f.get('FacPenaltyCount') or 0),
                'formalActions': int(f.get('CAAFormalActionCount') or 0), 'cwaEffluentExceed13q': int(f.get('CWA13qtrsEfflntExceedances') or 0),
                'snc': f.get('FacSNCFlg'), 'tri': f.get('TRIFlag'), 'lastPenalty': f.get('FacDateLastPenalty'),
            })
    CACHE.write_text(json.dumps(cache))

EXPORTER_COLS = ['REGISTRY_ID', 'FAC_NAME', 'FAC_CITY', 'FAC_STATE', 'FAC_ACTIVE_FLAG', 'NPDES_IDS', 'AIR_IDS', 'RCRA_IDS',
                 'FAC_QTRS_WITH_NC', 'FAC_PENALTY_COUNT', 'FAC_TOTAL_PENALTIES', 'FAC_FORMAL_ACTION_COUNT', 'CWA_13QTRS_EFFLNT_EXCEEDANCES',
                 'FAC_SNC_FLG', 'TRI_FLAG', 'FAC_DATE_LAST_PENALTY']


def match_exporter(zip_path, terms, companies, have, results, df):
    """用 EPA ECHO Exporter 全量檔（echo.epa.gov/files/echodownloads/echo_exporter.zip）在本機比對，不受 API 限流。"""
    import zipfile, io
    term_toks = {t: set(x.lower() for x in t.split()) for t in terms}
    by_first = collections.defaultdict(list)          # 最少見的字 → 搜尋詞（加速）
    for t, need in term_toks.items():
        by_first[min(need, key=len) if len(need) == 1 else sorted(need)[0]].append(t)
    fac_files = [DASH / 'data' / 'facilities.csv'] + ([DASH / 'data' / 'facilities-supplement.csv'] if (DASH / 'data' / 'facilities-supplement.csv').exists() else [])
    have_npdes = {x.replace(' ', '') for fp in fac_files for x in (re.sub(r'\.0+$', '', (f.get('npdes_id') or '').strip()) for f in csv.DictReader(open(fp, encoding='utf-8-sig'))) if x}
    zf = zipfile.ZipFile(zip_path)
    name = next(n for n in zf.namelist() if n.lower().endswith('.csv'))
    n = 0
    with zf.open(name) as fh:
        for row in csv.DictReader(io.TextIOWrapper(fh, encoding='latin-1')):
            n += 1
            if n % 500000 == 0: print(f'  exporter rows {n:,}', file=sys.stderr, flush=True)
            ftoks = set(ro.en_tokens(row.get('FAC_NAME') or ''))
            if not ftoks: continue
            df.update(ftoks)
            for tok in ftoks:
                for t in by_first.get(tok, ()):
                    need = term_toks[t]
                    if not need <= ftoks: continue
                    npdes = {x for x in re.split(r'[,\s]+', row.get('NPDES_IDS') or '') if x}
                    key = (ro.en_key(row['FAC_NAME']), (row.get('FAC_STATE') or '').strip())
                    results.append({
                        'term': t, 'strength': 'strong' if len(need) >= 2 else 'weak',
                        'owners': [{'code': c, 'name': companies.get(c, {}).get('name', c), 'via': nm, 'basis': w} for c, nm, w in terms[t]],
                        'registryId': row.get('REGISTRY_ID'), 'name': row.get('FAC_NAME'), 'city': row.get('FAC_CITY') or '', 'state': row.get('FAC_STATE') or '',
                        'active': row.get('FAC_ACTIVE_FLAG'), 'inOurData': key in have or bool(npdes & have_npdes),
                        'coverage': ('full' if (key in have and not (npdes - have_npdes)) or (npdes and npdes <= have_npdes) else
                                     'partial' if (key in have or npdes & have_npdes) else 'none'),
                        'npdesMissingFromOurs': sorted(npdes - have_npdes)[:8],
                        'npdesIds': sorted(npdes)[:8], 'airIds': (row.get('AIR_IDS') or '')[:80], 'rcraIds': (row.get('RCRA_IDS') or '')[:80],
                        'qtrsNonCompliant': int(float(row.get('FAC_QTRS_WITH_NC') or 0)), 'penaltyCount': int(float(row.get('FAC_PENALTY_COUNT') or 0)),
                        'totalPenaltiesUSD': float(row.get('FAC_TOTAL_PENALTIES') or 0), 'formalActions': int(float(row.get('FAC_FORMAL_ACTION_COUNT') or 0)),
                        'cwaEffluentExceed13q': int(float(row.get('CWA_13QTRS_EFFLNT_EXCEEDANCES') or 0)),
                        'snc': row.get('FAC_SNC_FLG'), 'tri': row.get('TRI_FLAG'), 'lastPenalty': row.get('FAC_DATE_LAST_PENALTY'),
                    })
    print(f'  exporter rows total {n:,}', file=sys.stderr)


def main():
    companies, *_ = ro.load_mops()
    subs = collections.defaultdict(set)
    for r in csv.DictReader(open(ro.MOPS_DIR / 'oversea_subsidiaries_union.csv', encoding='utf-8-sig')):
        n = r['被投資海外子公司名稱'].strip()
        if '美國' in (r['地區別代號'] or '') and re.search(r'[A-Za-z]{3,}', n) and not re.search(r'[一-鿿]', n):
            subs[r['公司代號']].add(n)

    terms = {}   # term -> [(code, source name, why)]
    for code, names in subs.items():
        if '金融' in companies.get(code, {}).get('industry', '') or '保險' in companies.get(code, {}).get('industry', ''):
            continue
        for n in names:
            toks = core_tokens(n)
            if not toks or (len(toks) == 1 and len(toks[0]) < 6):
                continue
            terms.setdefault(' '.join(toks[:4]).upper(), []).append((code, n, 'MOPS 美國子公司'))
    for code, t, why in CURATED_TERMS:
        terms.setdefault(t, []).append((code, t, why))
    print(f'{len(subs)} 家公司、{sum(len(v) for v in subs.values())} 個美國子公司 → {len(terms)} 個搜尋詞', file=sys.stderr)

    fac_files = [DASH / 'data' / 'facilities.csv'] + ([DASH / 'data' / 'facilities-supplement.csv'] if (DASH / 'data' / 'facilities-supplement.csv').exists() else [])
    have = {(ro.en_key(f['facility_name']), f['state'].strip()) for fp in fac_files for f in csv.DictReader(open(fp, encoding='utf-8-sig'))}
    results, skipped = [], []

    failed = []
    exporter = next((a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--exporter=')), None)
    df = collections.Counter()
    if exporter:
        match_exporter(exporter, terms, companies, have, results, df)
        # 精準度：搜尋詞要含罕見字、且命中數不能太多（例：REAL PROPERTY、RIGHT WAY 這類常用字全美到處都是）
        curated = {t for _, t, _ in CURATED_TERMS}
        hits = collections.Counter(r['term'] for r in results)
        keep = set()
        for t in terms:
            toks = [x.lower() for x in t.split()]
            rarest = min(df.get(x, 0) for x in toks)
            if t in curated or (hits[t] <= 40 and rarest <= 2000 and (len(toks) >= 2 or rarest <= 200)):
                keep.add(t)
            elif hits[t]:
                skipped.append({'term': t, 'rows': hits[t], 'rarestTokenDF': rarest})
        results[:] = [r for r in results if r['term'] in keep]
    else:
        match_api(terms, companies, have, results, skipped, failed)
    seen, uniq = set(), []
    for r in sorted(results, key=lambda x: (-x['penaltyCount'], -x['qtrsNonCompliant'])):
        if r['registryId'] in seen: continue
        seen.add(r['registryId']); uniq.append(r)
    missing = [r for r in uniq if r.get('coverage', 'none') != 'full' and not (r['inOurData'] and not r.get('npdesMissingFromOurs'))]
    OUT.write_text(json.dumps({
        'generatedAt': datetime.date.today().isoformat(), 'source': 'EPA ECHO facility search API + MOPS 美國子公司',
        'note': '名稱比對找出的候選設施，須人工確認；inOurData=false 表示 data/facilities.csv 沒有此設施（名稱＋州）。',
        'searchTerms': len(terms), 'failedTerms': failed, 'skippedTooGeneric': skipped, 'facilities': uniq}, ensure_ascii=False, indent=2))
    flagged = [r for r in missing if r['strength'] == 'strong' and (r['penaltyCount'] or r['qtrsNonCompliant'] or r['cwaEffluentExceed13q'] or r.get('formalActions'))]
    print(f'失敗 {len(failed)} 個搜尋詞（重跑會續查）；過泛略過 {len(skipped)}')
    part = [r for r in missing if r.get('coverage') == 'partial']
    print(f'ECHO 候選設施 {len(uniq)} 個；完整涵蓋 {len(uniq) - len(missing)}；部分涵蓋（缺某些許可證）{len(part)}；完全缺漏 {len(missing) - len(part)}；缺漏中有違規或罰款紀錄 {len(flagged)}')
    for r in flagged[:40]:
        o = r['owners'][0]
        print(f"  {o['code']} {r['name'][:46]:46} {r['city'][:14]:14} {r['state']} | {r.get('coverage','none'):7} | NC季 {r['qtrsNonCompliant']:2} 罰款 {r['penaltyCount']:2} | 缺許可 {','.join(r.get('npdesMissingFromOurs', [])[:2])} | via {o['via'][:30]}")


if __name__ == '__main__':
    main()
