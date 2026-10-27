"""
水污染違規（data/violations.csv，build-water-violations.py）以外的 EPA 紀錄：同一個廠區在空污（CAA）、有害廢棄物（RCRA）的違規與處分、
水污染（CWA）的處分與罰款、EPA 聯邦執法案件（ICIS FE&C），以及 TRI 有毒物質排放量、溫室氣體排放量。輸出 data/echo-programs.json（EPA 公開資料，進 git），建置時由 fetch-gcs-data.js 併入。

做法
  1. 我們的設施（data/facilities.csv＋facilities-supplement.csv）以 NPDES 許可證號在 ECHO Exporter 找到所屬廠區（FRS REGISTRY_ID）。
     一個廠區可能有好幾張 NPDES 許可證，空污、廢棄物紀錄是廠區層級的，掛在主要設施（個別許可證優先於通用許可證）。
     沒有 NPDES 許可證、只有空污或廢棄物紀錄的台灣母公司工廠列在 EXTRA_SITES，以 REGISTRY_ID 當設施編號另建設施。
     同一座工廠在 FRS 另有登記（名稱、地址寫法不同而分開）的列在 SAME_SITE，系統編號與排放量併進我們的廠區。
  2. 用廠區的 AIR_IDS／RCRA_IDS／REGISTRY_ID 與我們的 NPDES 許可證到各計畫的全量檔取逐筆紀錄。
  3. 台灣母公司取得控制前的紀錄屬前業主，不納入（CONTROL_SINCE，與 build-echo-supplement.py 的 CONFIRMED 年份）。
     水污染違規在 violations.csv，建置時 fetch-gcs-data.js 用這裡輸出的廠區 controlSince 同樣排除。
  4. 查證後確定是同名誤配的廠區（NOT_OWNED）不掛任何紀錄，輸出在 excludedSites，建置時 fetch-gcs-data.js 連設施與水污染違規一起拿掉。

用法（全量檔不進 git）
  scripts/download-echo-sources.sh                          # → ../epa-downloads
  python3 scripts/build-echo-programs.py --dir=../epa-downloads
"""
import csv, io, re, sys, json, zipfile, pathlib, datetime, collections, importlib.util

DASH = pathlib.Path(__file__).resolve().parents[1]
DATA = DASH / 'data'
OUT = DATA / 'echo-programs.json'
spec = importlib.util.spec_from_file_location('sup', DASH / 'scripts' / 'build-echo-supplement.py')
sup = importlib.util.module_from_spec(spec); spec.loader.exec_module(sup)

# (公司代號, REGISTRY_ID, 取得控制日期, 廠區, 依據)；早於該日的紀錄屬前業主。2026-10-25 逐一查證，只知年份的填 1 月 1 日
# 自建的廠區也列出來，表示查過了
CONTROL_SINCE = [
    ('1301', '110000597444', '1981-01-01', 'FPC Baton Rouge LA', '1981 年起由 FPC USA 經營（路易斯安那州長新聞稿 opportunitylouisiana.gov「FPC has operated since 1981」）'),
    ('1301', '110000338536', '1981-05-01', 'FPC Delaware City DE', '1981-05 向 Stauffer Chemical 買下（EPA NPL 說明 semspub.epa.gov/src/document/03/900262）'),
    ('1301', '110000722166', '2002-04-01', 'FPC Illiopolis IL', '2002-04 向 Borden Chemicals and Plastics 買下（CSB 調查報告 csb.gov/assets/1/20/formosa_il_report.pdf）'),
    ('1301', '110018925957', '1980-01-01', 'FPC Point Comfort TX', 'FPC 自建，1980 年開始營運（EPA 結案摘要、fpcusa.com）'),
    ('1303', '110000353965', '1990-01-01', '南亞 Lake City SC', '南亞自建，1990 年一期完工（nanyaamericasc.com）'),
    ('1402', '110000585956', '2018-03-01', 'APG Polytech Apple Grove WV', '2018-03-01 遠東新從 M&G Polymers USA 破產程序買下（westvirginia.gov/?p=2497）'),
    ('1460', '110000348106', '2016-10-01', '宏遠美國 Forest City NC', '宏遠 2016-10 設立美國廠（宏遠 2023 年報、areadevelopment.com 2016-12-07）'),
    ('1726', '110000479330', '2012-11-01', 'Continental Coatings Fontana CA', '永記 2012-11 轉投資 Continental Coatings（永記 2023 年報）'),
    ('2027', '110000372178', '2025-04-04', 'Bristol Metals TN', '2025-04-04 大成不銹鋼美國子公司 Ta Chen International 向 Ascent Industries 買下資產（SEC 8-K 附件 acnt-20250331ex991）'),
    ('2103', '110046122735', '2011-04-01', 'TSRC Specialty Materials Plaquemine LA', '2011-04 台橡 100% 買下 Dexco Polymers（Dow／ExxonMobil 合資）（businessreport.com 2011-04-05）'),
    ('2104', '110000369798', '1995-01-01', 'Continental Carbon Phenix City AL', '1995 年中橡向 Witco 買下 Continental Carbon（continentalcarbonasia.com 集團沿革）'),
    ('2104', '110000465728', '1995-01-01', 'Continental Carbon Sunray TX', '同上'),
    ('2104', '110000455766', '1995-01-01', 'Continental Carbon Ponca City OK', '同上'),
    ('2327', '110017088355', '2020-06-15', 'KEMET Simpsonville SC', '2020-06-15 國巨完成合併 KEMET（KEMET 8-K：「On June 15, 2020 … consummated the previously announced merger」）'),
    ('2330', '110000490772', '1996-06-01', 'WaferTech Camas WA', '1996-06 台積電主導合資成立，2000-12 起近 100%（pr.tsmc.com/english/news/2290、Altera 10-K）'),
    ('2383', '110000477608', '2021-01-18', 'Arlon EMD Rancho Cucamonga CA', '2021-01 台光電向 CriticalPoint Capital 買下（arlonemd.com 2021-01-18 公告）'),
    ('6472', '110000887942', '2024-04-01', 'Upsher-Smith Denver CO', '2024-04-01 保瑞向 Sawai 完成收購 Upsher-Smith（boracdmo.com 公告）；公告只列明尼蘇達廠'),
    ('6488', '110000442101', '2016-12-02', 'MEMC O’Fallon MO', '2016-12-02 環球晶完成收購 SunEdison Semiconductor（SEC 8-K 附件 d304688dex991）'),
    ('6534', '110064691668', '2015-02-28', 'CH Biotech Ontario CA', '正瀚 2015-02-28 100% 投資設立（正瀚 2023 年報）'),
    ('6670', '110000861354', '2004-09-01', 'FS Precision Tech Compton CA', '2004 年復盛向 Coastcast 買下該址（foundrymag.com）；2001 年的紀錄屬 Coastcast'),
    ('8069', '110041673463', '2009-12-24', 'E Ink Corporation MA', '2009-12 元太（PVI）完成收購 E Ink（blog.eink.com）'),
    # 2026-10-25 第二批：只有水污染違規、可能是收購來的工廠
    ('1402', '110067568297', '2018-12-28', 'Corpus Christi Polymers TX', '2018-12-28 Corpus Christi Polymers（Alpek／Indorama／遠東新各 1/3）向破產的 M&G USA 買下（alpek.com/?p=3417；遠東新重大訊息 2018-12-22、2018-12-27）'),
    ('8478', '110009766761', '2015-07-01', 'Pacific Coast Yachting Services Seattle WA', '東哥集團最晚 2015-07 起向關係人承租此址（東哥 2016 年報）；2018-02 許可證由 Alexander Marine USA 轉給 PCYS（華盛頓州 Ecology 轉移文件）'),
    ('5009', '110070094063', '2010-01-01', 'Alloy Tool Steel Santa Fe Springs CA', '榮剛 2010 年取得 55%、2011 年 85%（榮剛 2010、2011 年報）；月份不明'),
    ('6887', '110070093475', '2013-05-30', 'Boretech Stockton CA', '寶綠特 2013-05-30 設立 Boretech LLC（現名 CYCLEPLUS LLC）自建（寶綠特 2024 年報、wastedive.com 2014-08-12）'),
    ('2027', '110070263045', '2017-08-01', 'Primus Pipe and Tube Wildwood FL', '2017-08-01 大成不銹鋼美國子公司向 Outokumpu 買下 Outokumpu Stainless Pipe（大成重大訊息 2017-08-01、outokumpu.com 公告）'),
    # 2026-10-27 第三批：ECHO 品牌名搜尋與 TRI 外國母公司欄位找到、資料裡原本沒有的工廠（docs/echo-data-sources.md §4.4）
    ('6488', '110071945656', '2022-08-04', 'GlobalWafers America Sherman TX', '環球晶自建：GTI 2022-08 新設 GlobalWafers America（環球晶 111 年報），2022-12-01 動土'),
    ('8069', '110056371144', '2009-12-24', 'E Ink Corporation Billerica MA', '元太 2009-12 取得 E Ink（同 South Hadley）；Billerica 廠 2013 年啟用（元太 2013 年報）'),
    ('8069', '110012230264', '2012-11-01', 'E Ink Fremont CA（原 SiPix）', '2012-11 元太完成收購 SiPix Imaging，改名 E Ink California, LLC（元太 2012 年報、104 年度合併財報附註）；月份以前的紀錄屬 SiPix'),
    ('6472', '110068499333', '2024-04-01', 'Upsher-Smith Maple Grove MN', '保瑞重大訊息 113/04/02：美東時間 4 月 1 日接手 Upsher-Smith，100% 持股'),
    ('6472', '110001130981', '2024-04-01', 'Upsher-Smith Plymouth MN', '同上；2025-02 發出 WARN 關廠通知（Star Tribune 2025-02-07）'),
    ('1504', '110000599905', '1995-04-01', 'TECO-Westinghouse Motor Round Rock TX', '1995-04 東元買下西屋在合資公司的全部股份（tecowestinghouse.com 公司簡介）；合資期間由西屋控制（西屋 FY1993 10-K），月份以前的紀錄不算'),
    ('1504', '110072257417', '1995-04-01', 'TECO-Westinghouse Motor Round Rock TX（2026 雨水許可）', '同上'),
    ('2317', '110001862208', '2016-08-12', 'Sharp Manufacturing Company of America Memphis TN', '2016-08-12 鴻海完成認購夏普新股（夏普公告 160812-4、鴻海 2016 合併財報）；1979 年以來的夏普工廠，之前的紀錄不算'),
]

# 查證後確定與台灣母公司無關的同名誤配廠區：不掛空污、廢棄物紀錄與水污處分；設施與水污染違規（violations.csv）在建置時拿掉（2026-10-27 決定）
NOT_OWNED = [
    ('4523', '110001888253', 'Everbrite LLC Buena Vista VA', '是威斯康辛的招牌廠 Everbrite；永彰英文名 Everbrite Technology，2023 年報沒有美國子公司'),
    ('2359', '110033647016', 'Solomon Corporation Decatur TN', '所羅門 2023 年報唯一的美國子公司是 2019 年在加州 Walnut 設立的 Solomon Technology (USA)'),
    ('2360', '110000429607', 'Chroma Corp McHenry IL', '是伊利諾州的色母粒廠，2018 年被 Carolina Color 併購（ptonline.com）；致茂的美國子公司都在加州'),
    ('6782', '110069582400', 'VISCO, Inc. Eugene OR', '1947 年在奧勒岡登記的建築金屬加工廠（opencorpdata.com/us-or/4554812，SIC 3446）；視陽是隱形眼鏡廠，MOPS 沒有美國子公司'),
    ('1227', '110009956379', 'Standard Foods Inc Louisville KY', '1937 年創立的肉品冷凍食品廠，後改名 Culinary Standards（肯塔基州公司登記）；佳格的美國子公司是 Standard Foods, LLC'),
    ('6957', '110066887738', 'Beeline Facility Scottsdale AZ', '許可證持有人是原住民族企業 Salt River Sand and Rock（砂石，SIC 1442），Beeline 是公路名；裕慶的 Beeline Corp. 在伊利諾州做展示架'),
    ('8271', '110016682115', 'AMA Facility Ama LA', '許可證持有人是 ADM Grain（穀物，SIC 5153），Ama 是路易斯安那的地名；宇瞻的 AMA 是 Apacer Memory America'),
]

# 沒有 NPDES 許可證的台灣母公司工廠：(公司代號, REGISTRY_ID, 依據, 持股鏈沿用哪個既有設施 公司代號|設施編號)
# 候選來自 ECHO 覆蓋率稽核（data/echo-coverage-audit.json 的 npdesIds 為空者），每筆人工確認
EXTRA_SITES = [
    ('2104', '110000455766', 'MOPS：國際中橡 → CCC USA Corp.（66.67%）→ Continental Carbon Company；Ponca City 廠沒有 NPDES 許可證', '2104|3600967495'),
    # 2026-10-27 第三批（docs/echo-data-sources.md §4.4）
    ('8069', '110012230264', 'MOPS：元太 → … → E Ink Corporation（100%）；Fremont 47485 Seabridge Dr 原是 SiPix Imaging（2012-11 併入，改名 E Ink California, LLC），現由 E Ink Corporation 持有有害廢棄物登記', '8069|3600135516'),
    ('6472', '110068499333', 'MOPS：保瑞 → Bora Pharmaceutical Holdings → … → Upsher-Smith Laboratories, LLC（100%）；Maple Grove 6701 Evenstad Dr 製造廠', '6472|3601322171'),
    ('6472', '110001130981', 'MOPS：保瑞 → Bora Pharmaceutical Holdings → … → Upsher-Smith Laboratories, LLC（100%）；Plymouth 14905 23rd Ave N 製造廠，2025 年關廠', '6472|3601322171'),
]

# 同一座工廠在 FRS 的其他登記：(公司代號, 另一個 REGISTRY_ID, 併入的我們廠區 REGISTRY_ID, 依據)
# 2026-10-25 以同城市、名稱有品牌字找出（docs/echo-data-sources.md §4.3），2026-10-27 以 ECHO Exporter 的地址、座標確認
SAME_SITE = [
    ('1301', '110071160841', '110018925957', 'FORMOSA POINT COMFORT PLANT：Point Comfort 主廠的溫室氣體申報，座標距主廠 0.6 公里'),
    ('1301', '110000505490', '110018925957', 'FORMOSA HYDROCARBONS COMPANY（103 Fannin Rd）：Point Comfort 廠區南側的烯烴廠，台塑美國子公司'),
    ('1301', '110033933536', '110018925957', 'FORMOSA PLASTICS MARINE TERMINAL（101 Formosa Dr）：Point Comfort 廠的碼頭'),
    ('1303', '110070326649', '110000353965', 'NAN YA PLASTICS CORPORATION AMERICA SOUTH CAROLINA PLANT：同址 140 Beulah Rd 的溫室氣體申報'),
    ('1303', '110000823798', '110070367682', 'NAN YA PLASTICS CORPORATION（700 Hwy 59 Loop）：座標距 Wharton 廠 0.3 公里，同為塑膠膜（SIC 3081）'),
    ('1303', '110064116772', '110070367682', 'NAN YA PLASTICS：同址 2081 FM 102 Rd 的有害廢棄物登記'),
    ('1402', '110069729271', '110000585956', 'APG POLYTECH, LLC（27610 Huntington Rd）：Apple Grove 廠的溫室氣體申報，座標相距 0.1 公里'),
    ('1402', '110070639169', '110000585956', 'APG POLYTECH LLC（27610 Huntington Rd）：Apple Grove 廠的有害廢棄物登記'),
    ('2327', '110004939103', '110017088355', 'KEMET ELECTRONICS CORPORATION（1428 Old Stage Rd）：Simpsonville 廠區的有害廢棄物登記，距 2835 Kemet Way 約 2 公里'),
    ('2327', '110000354152', '110017088355', 'KEMET:MAULDIN（1224 Old Stage Rd）：Simpsonville 廠區的有害廢棄物登記，距 2835 Kemet Way 約 1.3 公里'),
    ('6488', '110072209293', '110071945656', 'GLOBALWAFERS AMERICA（3200 Northgate Dr）：Sherman 新廠的有害廢棄物登記，與雨水許可的 3230 Northgate Dr 同一廠區'),
    ('6472', '110071715565', '110068499333', 'UPSHER-SMITH LABORATORIES, LLC：同址 6701 Evenstad Dr 的 TRI 申報'),
    ('2317', '110071087344', '110001862208', 'SHARP MANUFACTURING COMPANY OF AMERICA（4050 S Mendenhall Rd）：同址的 EPA 案件登記（FIFRA）'),
    ('2317', '110012706143', '110001862208', 'SHARP ELECTRONICS CORP. SHARP MANUFACTURING DIV.（4120 S Mendenhall）：同一 104 英畝廠區的有害廢棄物登記與 TRI，相距約 150 公尺'),
]

DFR = 'https://echo.epa.gov/detailed-facility-report?fid='
# 各檔的機關欄位寫法不同（S／E／L 代碼或 State／EPA 全名），統一成中文
AGENCY = {'S': '州政府', 'E': 'EPA', 'L': '地方政府', 'State': '州政府', 'EPA': 'EPA', 'U.S. EPA': 'EPA', 'Local': '地方政府', 'Tribal': '原住民族政府'}


def norm_npdes(x):
    """GCS 原始資料的許可證號有被轉成浮點數的（SCR000483 → 「SCR 483.00」），補回 9 碼。"""
    x = re.sub(r'\.0+$', '', (x or '').replace('\xa0', ' ').strip())
    m = re.fullmatch(r'([A-Z]+)\s*(\d+)', x)
    if m and len(m.group(1) + m.group(2)) < 9:
        return m.group(1) + m.group(2).zfill(9 - len(m.group(1)))
    return x.replace(' ', '')


def ymd(s):
    """EPA 日期有 MM/DD/YYYY 與 MM-DD-YYYY 兩種。"""
    m = re.fullmatch(r'(\d\d)[/-](\d\d)[/-](\d{4})', (s or '').strip())
    return f'{m.group(3)}-{m.group(1)}-{m.group(2)}' if m else None


def money(s):
    try:
        v = float(s)
    except (TypeError, ValueError):
        return None
    return round(v) if v > 0 else None


def ids(s):
    return [x for x in re.split(r'[,\s]+', s or '') if x]


def rows(zf, name):
    with zf.open(name) as fh:
        yield from csv.DictReader(io.TextIOWrapper(fh, encoding='latin-1'))


def load_ours():
    """NPDES → [(公司代號, ICIS 設施編號, 設施名稱)]，以及設施 → 取得控制年份。"""
    ours = collections.defaultdict(list)
    for fp in ('facilities.csv', 'facilities-supplement.csv'):
        for r in csv.DictReader(open(DATA / fp, encoding='utf-8-sig')):
            fid = re.sub(r'\.0+$', '', r['icis_facility_id'].strip())
            ours[norm_npdes(r['npdes_id'])].append((r['公司代號'], fid, r['facility_name']))
    since = {}
    for code, _, _, permits, *rest in sup.CONFIRMED:
        for p in permits:
            if rest and rest[0]:
                since[p] = f'{rest[0]}-01-01'
    for e in json.loads((DATA / 'ownership-resolution.json').read_text()).get('entities', []):
        if e['source'] == 'EPA ECHO' and e.get('controlSince'):
            since[e['key']] = f"{e['controlSince']}-01-01"
    return ours, since


def main():
    d = pathlib.Path(next((a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--dir=')), '') or sys.exit(__doc__))
    zips = {k: zipfile.ZipFile(d / f'{k}.zip') for k in ('echo_exporter', 'ICIS-AIR_downloads', 'rcra_downloads', 'case_downloads', 'npdes_downloads')}
    ours, since = load_ours()

    # 1. 廠區：公司代號＋REGISTRY_ID 一個，同一廠區不同公司（不同持股鏈）分開
    sites = {}
    extra = {reg: (code, basis, own) for code, reg, basis, own in EXTRA_SITES}
    same_site = {reg for _, reg, _, _ in SAME_SITE}
    same_rows = {}

    def site(code, r):
        return sites.setdefault((code, r['REGISTRY_ID']), {
            'registryId': r['REGISTRY_ID'], 'companyCode': code, 'name': r['FAC_NAME'], 'city': r['FAC_CITY'], 'state': r['FAC_STATE'],
            'dfrUrl': DFR + r['REGISTRY_ID'], 'facilityIds': [], 'npdesIds': [],
            'programIds': {'air': ids(r['AIR_IDS']), 'waste': ids(r['RCRA_IDS']), 'toxics': ids(r['TRI_IDS']), 'ghg': ids(r['GHG_IDS'])},
            'releases': {'triOnSiteLb': money(r['TRI_ON_SITE_RELEASES']), 'triReleasesTransfersLb': money(r['TRI_RELEASES_TRANSFERS']),
                         'ghgCO2eTons': money(r['GHG_CO2_RELEASES'])},
            'controlSince': None,
        })

    for r in rows(zips['echo_exporter'], 'ECHO_EXPORTER.csv'):
        if r['REGISTRY_ID'] in same_site:
            same_rows[r['REGISTRY_ID']] = r
        if r['REGISTRY_ID'] in extra:
            code, basis, own = extra[r['REGISTRY_ID']]
            s = site(code, r)
            s['facilityIds'] = [r['REGISTRY_ID']]
            s['newFacility'] = {'address': r['FAC_STREET'], 'zipCode': r['FAC_ZIP'], 'latitude': r['FAC_LAT'], 'longitude': r['FAC_LONG'],
                                'basis': basis, 'ownershipFrom': own}
        common = [n for n in ids(r['NPDES_IDS']) if n in ours]
        for n in common:
            for code, fid, _ in ours[n]:
                s = site(code, r)
                if fid not in s['facilityIds']:
                    # 個別許可證（第 3 碼是數字，例 TX0085570）排前面當主要設施，通用許可證（TXR…、CAZ…）排後面
                    if n[2:3].isdigit() and not any(x[2:3].isdigit() for x in s['npdesIds']):
                        s['facilityIds'].insert(0, fid)
                    else:
                        s['facilityIds'].append(fid)
                if n not in s['npdesIds']:
                    s['npdesIds'].append(n)
                cs = since.get(n) or since.get(f'{code}|{fid}')
                s['controlSince'] = max(filter(None, [s['controlSince'], cs]), default=None)
    if set(extra) - {s['registryId'] for s in sites.values()}:
        print(f'  ⚠ EXTRA_SITES 在 ECHO Exporter 找不到：{sorted(set(extra) - {s["registryId"] for s in sites.values()})}', file=sys.stderr)
    for code, reg, date, _, basis in CONTROL_SINCE:
        s = sites.get((code, reg))
        if not s:
            print(f'  ⚠ CONTROL_SINCE 的廠區不在資料中：{code} {reg}', file=sys.stderr); continue
        s['controlSince'] = max(filter(None, [s['controlSince'], date]))
        s['controlBasis'] = basis
    for code, reg, into, basis in SAME_SITE:
        s, r = sites.get((code, into)), same_rows.get(reg)
        if not s or not r:
            print(f'  ⚠ SAME_SITE 找不到：{code} {reg} → {into}', file=sys.stderr); continue
        # 排放量是各登記最近申報年度的數字，系統編號沒重複才加總
        for k, col, amounts in (('air', 'AIR_IDS', ()), ('waste', 'RCRA_IDS', ()), ('toxics', 'TRI_IDS', (('triOnSiteLb', 'TRI_ON_SITE_RELEASES'), ('triReleasesTransfersLb', 'TRI_RELEASES_TRANSFERS'))),
                                 ('ghg', 'GHG_IDS', (('ghgCO2eTons', 'GHG_CO2_RELEASES'),))):
            new = [x for x in ids(r[col]) if x not in s['programIds'][k]]
            s['programIds'][k] += new
            for key, rc in amounts if new else ():
                s['releases'][key] = (s['releases'][key] or 0) + (money(r[rc]) or 0) or None
        s.setdefault('relatedRegistries', []).append({'registryId': reg, 'name': r['FAC_NAME'], 'dfrUrl': DFR + reg, 'basis': basis})
    found = {n for s in sites.values() for n in s['npdesIds']}
    print(f'{len(found)}/{len(ours)} 個 NPDES 許可證對到 {len(sites) - len(extra)} 個廠區，另有 {len(extra)} 個沒有 NPDES 的廠區', file=sys.stderr)
    if set(ours) - found:
        print(f'  ⚠ ECHO Exporter 找不到：{sorted(set(ours) - found)}', file=sys.stderr)
    excluded = []
    for code, reg, name, basis in NOT_OWNED:
        s = sites.pop((code, reg), None)
        if s:
            excluded.append({'companyCode': code, 'registryId': reg, 'name': name, 'reason': basis, 'facilityIds': s['facilityIds']})

    by_air = collections.defaultdict(list)
    by_rcra = collections.defaultdict(list)
    by_reg = collections.defaultdict(list)
    by_npdes = collections.defaultdict(list)
    for key, s in sites.items():
        for x in s['programIds']['air']: by_air[x].append(key)
        for x in s['programIds']['waste']: by_rcra[x].append(key)
        for x in s['npdesIds']: by_npdes[x].append(key)
        for reg in [s['registryId']] + [x['registryId'] for x in s.get('relatedRegistries', [])]: by_reg[reg].append(key)
    fid_of = {(code, n): fid for n, lst in ours.items() for code, fid, _ in lst}

    records = []

    def add(keys, rec):
        for key in keys:
            records.append({**rec, 'companyCode': key[0], 'registryId': key[1]})

    # 2a. 空污 ICIS-Air
    air = zips['ICIS-AIR_downloads']
    for r in rows(air, 'ICIS-AIR_VIOLATION_HISTORY.csv'):
        if r['PGM_SYS_ID'] in by_air:
            hpv = r['ENF_RESPONSE_POLICY_CODE'] == 'HPV'
            add(by_air[r['PGM_SYS_ID']], {
                'id': f"CAA-V-{r['ACTIVITY_ID']}-{r['COMP_DETERMINATION_UID']}", 'program': 'CAA', 'kind': 'violation',
                'type': 'High Priority Violation' if hpv else 'Federally Reportable Violation',
                'date': ymd(r['HPV_DAYZERO_DATE']) or ymd(r['EARLIEST_FRV_DETERM_DATE']), 'resolvedDate': ymd(r['HPV_RESOLVED_DATE']),
                'agency': AGENCY.get(r['AGENCY_TYPE_DESC'], r['AGENCY_TYPE_DESC']), 'description': r['PROGRAM_DESCS'],
                'pollutants': '' if r['POLLUTANT_DESCS'] == 'FACIL' else r['POLLUTANT_DESCS'], 'penaltyUSD': None})
    for r in rows(air, 'ICIS-AIR_FORMAL_ACTIONS.csv'):
        if r['PGM_SYS_ID'] in by_air:
            add(by_air[r['PGM_SYS_ID']], {
                'id': f"CAA-F-{r['ACTIVITY_ID']}", 'program': 'CAA', 'kind': 'formal', 'type': r['ENF_TYPE_DESC'],
                'date': ymd(r['SETTLEMENT_ENTERED_DATE']), 'agency': AGENCY.get(r['STATE_EPA_FLAG'], r['STATE_EPA_FLAG']),
                'description': r['ACTIVITY_TYPE_DESC'], 'caseNumber': r['ENF_IDENTIFIER'], 'penaltyUSD': money(r['PENALTY_AMOUNT'])})
    for r in rows(air, 'ICIS-AIR_INFORMAL_ACTIONS.csv'):
        if r['PGM_SYS_ID'] in by_air:
            add(by_air[r['PGM_SYS_ID']], {
                'id': f"CAA-I-{r['ACTIVITY_ID']}", 'program': 'CAA', 'kind': 'informal', 'type': r['ENF_TYPE_DESC'],
                'date': ymd(r['ACHIEVED_DATE']), 'agency': AGENCY.get(r['STATE_EPA_FLAG'], r['STATE_EPA_FLAG']),
                'description': r['ACTIVITY_TYPE_DESC'], 'caseNumber': r['ENF_IDENTIFIER'], 'penaltyUSD': None})
    for r in rows(air, 'ICIS-AIR_STACK_TESTS.csv'):
        if r['PGM_SYS_ID'] in by_air and r['AIR_STACK_TEST_STATUS_DESC'] == 'Fail':
            add(by_air[r['PGM_SYS_ID']], {
                'id': f"CAA-ST-{r['ACTIVITY_ID']}", 'program': 'CAA', 'kind': 'stack-test', 'type': 'Failed Stack Test',
                'date': ymd(r['ACTUAL_END_DATE']), 'agency': AGENCY.get(r['STATE_EPA_FLAG'], r['STATE_EPA_FLAG']),
                'description': r['COMP_MONITOR_TYPE_DESC'], 'pollutants': r['POLLUTANT_CODES'], 'penaltyUSD': None})

    # 2b. 有害廢棄物 RCRA。處分類型代碼第 3 碼：1 非正式、2–3 行政正式、5–6 司法
    rcra = zips['rcra_downloads']
    for r in rows(rcra, 'RCRA_VIOLATIONS.csv'):
        if r['ID_NUMBER'] in by_rcra:
            add(by_rcra[r['ID_NUMBER']], {
                'id': f"RCRA-V-{r['ID_NUMBER']}-{r['VIOLATION_TYPE']}-{r['DATE_VIOLATION_DETERMINED']}", 'program': 'RCRA', 'kind': 'violation',
                'type': r['VIOLATION_TYPE_DESC'], 'violationCode': r['VIOLATION_TYPE'], 'date': ymd(r['DATE_VIOLATION_DETERMINED']),
                'resolvedDate': ymd(r['ACTUAL_RTC_DATE']), 'agency': AGENCY.get(r['VIOL_DETERMINED_BY_AGENCY'].strip(), r['VIOL_DETERMINED_BY_AGENCY'].strip()),
                'penaltyUSD': None})
    for r in rows(rcra, 'RCRA_ENFORCEMENTS.csv'):
        if r['ID_NUMBER'] in by_rcra:
            level = r['ENFORCEMENT_TYPE'][2:3]
            add(by_rcra[r['ID_NUMBER']], {
                'id': f"RCRA-E-{r['ID_NUMBER']}-{r['ENFORCEMENT_IDENTIFIER']}-{r['ENFORCEMENT_TYPE']}", 'program': 'RCRA',
                'kind': 'informal' if level == '1' else 'formal', 'type': r['ENFORCEMENT_DESC'].strip().title(),
                'date': ymd(r['ENFORCEMENT_ACTION_DATE']), 'agency': AGENCY.get(r['ENFORCEMENT_AGENCY'].strip(), r['ENFORCEMENT_AGENCY'].strip()),
                'penaltyUSD': money(r['FMP_AMOUNT']), 'proposedPenaltyUSD': money(r['PMP_AMOUNT'])})

    # 2c. EPA 聯邦執法案件（跨法規：CAA、RCRA、CWA、EPCRA、TSCA…），以廠區 REGISTRY_ID 對案件
    case = zips['case_downloads']
    case_keys = collections.defaultdict(set)
    for r in rows(case, 'CASE_FACILITIES.csv'):
        for key in by_reg.get(r['REGISTRY_ID'], ()):
            case_keys[r['ACTIVITY_ID']].add(key)
    statutes, penalty, settled = collections.defaultdict(list), {}, {}
    for r in rows(case, 'CASE_LAW_SECTIONS.csv'):
        if r['ACTIVITY_ID'] in case_keys and r['STATUTE_CODE'] not in statutes[r['ACTIVITY_ID']]:
            statutes[r['ACTIVITY_ID']].append(r['STATUTE_CODE'])
    for r in rows(case, 'CASE_ENFORCEMENT_CONCLUSIONS.csv'):
        if r['ACTIVITY_ID'] in case_keys:
            penalty[r['ACTIVITY_ID']] = (penalty.get(r['ACTIVITY_ID']) or 0) + (money(r['FED_PENALTY_ASSESSED_AMT']) or 0) + (money(r['STATE_LOCAL_PENALTY_AMT']) or 0)
            settled[r['ACTIVITY_ID']] = max(filter(None, [settled.get(r['ACTIVITY_ID']), ymd(r['SETTLEMENT_ENTERED_DATE'])]), default=None)
    for r in rows(case, 'CASE_ENFORCEMENTS.csv'):
        a = r['ACTIVITY_ID']
        if a in case_keys:
            add(sorted(case_keys[a]), {
                'id': f'FEC-{a}', 'program': 'FEC', 'kind': 'case', 'type': r['ACTIVITY_TYPE_DESC'], 'statutes': statutes.get(a, []),
                'date': settled.get(a) or ymd(r['CASE_STATUS_DATE']), 'fiscalYear': r['FISCAL_YEAR'], 'agency': AGENCY.get(r['LEAD'], r['LEAD']),
                'caseNumber': r['CASE_NUMBER'], 'caseName': r['CASE_NAME'], 'status': r['ACTIVITY_STATUS_DESC'], 'outcome': r['ENF_OUTCOME_DESC'],
                'description': re.sub(r'\s+', ' ', r['ENF_SUMMARY_TEXT']).strip(), 'penaltyUSD': penalty.get(a) or money(r['TOTAL_PENALTY_ASSESSED_AMT']),
                'sourceUrl': f'https://echo.epa.gov/enforcement-case-report?id={r["CASE_NUMBER"]}'})

    # 2d. 水污染處分 ICIS-NPDES：掛在該許可證的設施（不是廠區主要設施）。違規本身在 violations.csv
    npdes = zips['npdes_downloads']

    def add_npdes(n, rec):
        for key in by_npdes.get(n, ()):
            records.append({**rec, 'facilityId': fid_of.get((key[0], n)), 'npdesId': n, 'companyCode': key[0], 'registryId': key[1]})

    for r in rows(npdes, 'NPDES_FORMAL_ENFORCEMENT_ACTIONS.csv'):
        if r['NPDES_ID'] in by_npdes:
            add_npdes(r['NPDES_ID'], {
                'id': f"CWA-F-{r['ACTIVITY_ID']}", 'program': 'CWA', 'kind': 'formal', 'type': r['ENF_TYPE_DESC'],
                'date': ymd(r['SETTLEMENT_ENTERED_DATE']), 'agency': AGENCY.get(r['AGENCY'], r['AGENCY']),
                'description': {'AFR': 'Administrative - Formal', 'JDC': 'Judicial'}.get(r['ACTIVITY_TYPE_CODE'], r['ACTIVITY_TYPE_CODE']),
                'caseNumber': r['ENF_IDENTIFIER'], 'penaltyUSD': money((money(r['FED_PENALTY_ASSESSED_AMT']) or 0) + (money(r['STATE_LOCAL_PENALTY_AMT']) or 0))})
    # 非正式處分只收 OFFICIAL_FLG=Y（警告信、違規通知）；N 是電話、內部審查、「無須處理」等，不是對業者的處分
    for r in rows(npdes, 'NPDES_INFORMAL_ENFORCEMENT_ACTIONS.csv'):
        if r['NPDES_ID'] in by_npdes and r['OFFICIAL_FLG'] == 'Y':
            add_npdes(r['NPDES_ID'], {
                'id': f"CWA-I-{r['ACTIVITY_ID']}", 'program': 'CWA', 'kind': 'informal', 'type': r['ENF_TYPE_DESC'],
                'date': ymd(r['ACHIEVED_DATE']), 'agency': AGENCY.get(r['AGENCY'], r['AGENCY']),
                'description': r['ACTIVITY_TYPE_DESC'], 'caseNumber': r['ENF_IDENTIFIER'], 'penaltyUSD': None})

    # 3. 前業主的紀錄、沒有日期的紀錄
    dropped = collections.defaultdict(collections.Counter)
    kept, seen = [], set()
    for rec in records:
        # ICIS-Air 處分檔同一個處分每個適用計畫各一列；RCRA 違規檔同一天同一條文的多筆無法區分，算一筆；
        # NPDES 同一封警告信寄給同廠區好幾張許可證時各一列，算一筆（掛第一張許可證的設施）
        if (rec['companyCode'], rec['registryId'], rec['id']) in seen:
            continue
        seen.add((rec['companyCode'], rec['registryId'], rec['id']))
        s = sites[(rec['companyCode'], rec['registryId'])]
        if s['controlSince'] and rec.get('date') and rec['date'] < s['controlSince']:
            dropped[(s['companyCode'], s['name'], s['controlSince'])][rec['program']] += 1
            continue
        kept.append({k: v for k, v in rec.items() if v not in (None, '', [])})
    kept.sort(key=lambda x: (x['companyCode'], x.get('date') or ''), reverse=False)

    # 空污、水污罰款同時出現在各計畫正式處分與聯邦案件時（EPA 主辦案件），案件號相同只算一次
    fec_numbers = {(r['companyCode'], r.get('caseNumber')) for r in kept if r['program'] == 'FEC'}
    for r in kept:
        if r['program'] in ('CAA', 'CWA') and r['kind'] == 'formal' and (r['companyCode'], r.get('caseNumber')) in fec_numbers:
            r['duplicateOf'] = 'FEC'

    used = {(r['companyCode'], r['registryId']) for r in kept}
    # 有 controlSince 的廠區一定輸出：fetch-gcs-data.js 要用它排除水污染違規
    out_sites = [s for k, s in sites.items() if k in used or any(s['releases'].values()) or s['programIds']['air'] or s['programIds']['waste'] or s['controlSince']]
    OUT.write_text(json.dumps({
        'generatedAt': datetime.date.today().isoformat(),
        'source': 'EPA ECHO 全量檔：ECHO Exporter、ICIS-Air、RCRAInfo、ICIS-NPDES 處分、ICIS FE&C（echo.epa.gov/tools/data-downloads）',
        'note': '以我們設施的 NPDES 許可證找出同一廠區（FRS）的空污、有害廢棄物紀錄與 EPA 聯邦執法案件，以及各許可證的水污染處分。TRI／GHG 為最近申報年度的排放量。',
        'sites': sorted(out_sites, key=lambda s: (s['companyCode'], s['name'])),
        'excludedSites': excluded,
        'records': kept,
    }, ensure_ascii=False, indent=1))

    print(f'輸出 {OUT.relative_to(DASH)}：{len(out_sites)} 個廠區、{len(kept)} 筆紀錄', file=sys.stderr)
    by = collections.Counter((r['program'], r['kind']) for r in kept)
    for k, n in sorted(by.items()):
        print(f'  {k[0]:5} {k[1]:10} {n:5}', file=sys.stderr)
    for (code, name, date), n in sorted(dropped.items()):
        print(f"  排除 {code} {name} 在 {date} 取得控制前的 {sum(n.values())} 筆（{'、'.join(f'{k} {v}' for k, v in sorted(n.items()))}）", file=sys.stderr)
    for e in excluded:
        print(f"  排除同名誤配廠區 {e['companyCode']} {e['name']}", file=sys.stderr)


if __name__ == '__main__':
    main()
