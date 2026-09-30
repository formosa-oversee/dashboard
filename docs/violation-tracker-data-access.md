# Violation Tracker（Good Jobs First）資料獲取調查

調查日期：2026-09-10
調查對象：https://violationtracker.goodjobsfirst.org/（US 版）、Violation Tracker Global、Violation Tracker UK

> 方法備註：三個 Violation Tracker 站與 goodjobsfirst.org 主站皆在 Cloudflare 之後，對 `curl`（含瀏覽器 UA）與 WebFetch 一律回 **HTTP 403 + `cf-mitigated: challenge`**（JS challenge 頁「Just a moment...」）。本文所有頁面內容是透過會執行 JS 的第三方抽取服務（anysearch extract）取得；「結果筆數」「連結數」均是從實際回傳的頁面計數而來。

## 結論摘要

1. **免費、不登入就能看到的東西**：US 版所有搜尋結果列表（每頁 100 筆，可分頁，上限 100,000 筆）、每筆個別紀錄頁（含罰款金額、日期、機關、違規類型、母公司、HQ 國家、產業、原始來源文件連結）、母公司／產業／HQ 國家摘要頁。`hq_id=Taiwan` 有效，目前回傳 **201 筆**（母公司總部在台灣、自 2000 年起、罰款調整後合計 US$2,715,482,621）。
2. **拿不到的東西**：CSV / XML 下載連結雖然直接出現在每個結果頁上，但未登入時導向 "Subscriber Portal" 登入頁。沒有公開 API、沒有 bulk dump。訂閱 US$25–150／月，下載仍有每次搜尋 1,000–10,000 筆的上限；完整資料集（含 corporate identifiers）需直接聯絡 Philip Mattera，官方說法只提「academic purposes」或「academic or commercial use」。
3. **US 版只覆蓋美國司法轄區**（聯邦、州、地方機關與美國法院訴訟）。台灣企業在 US 版的紀錄 = 台資在美子公司／美國廠的違規（例如 Formosa Plastics 83 筆，幾乎全是 EPA 與德州／路易斯安那環保機關）。台灣本地的違規紀錄不在 US 版。
4. **Violation Tracker Global 對本專案更合適**：Taiwan 作為 jurisdiction 有 **428 筆**（自 2010 年、US$1,039,179,666），來源包含台灣公平會、金管會、環境部與地方環保局、勞動部、職安署；另外「HQ 在台灣的母公司」共 **38 家、439 筆**橫跨各國（Formosa Plastics 一家就 158 筆，含越南河靜鋼廠 US$500M）。但 Global 只收錄約 1,700 家大型母公司、罰款 ≥ US$5,000，且下載限制更嚴（每次 100–1,000 筆或 US$5 買 50 筆）。
5. **法律面**：Terms of Service 明文禁止「以造成伺服器負擔的速率或規避我方技術阻擋的方式進行 bots／scraping」，且只授予「internal use」的有限授權，未提供任何開放授權（無 CC、無署名再利用條款）。Cloudflare challenge 本身就是條款所稱的「technological blockers」。因此**用程式繞過 challenge 批次抓取，在條款上站不住腳**；可行路徑是（a）訂閱後手動下載 CSV，或（b）以研究／公益用途向 Philip Mattera 申請完整資料集，或（c）只在 dashboard 中以連結方式引用其頁面。

---

## 1. 資料範圍

### Violation Tracker（US 版）

| 項目 | 事實 | 來源 |
|---|---|---|
| 司法轄區 | 美國：聯邦監管機關、Justice Department 各部門、州 AG、精選州與地方監管機關；另收錄特定類別的 class action／multi-district 訴訟。首頁標題明講 "Throughout the United States"。 | [首頁][home]、[User Guide][ug] |
| 時間範圍 | 2000 年起至今（"since 2000"；資料來源頁：「Coverage for all agencies begins in January 2000 unless noted otherwise」） | [首頁][home]、[Data Sources][ds] |
| 規模 | 首頁：「more than 700,000 civil and criminal cases from more than 450 agencies with total penalties of over $1 trillion」；Quick Start 頁仍寫 600,000（舊文）。連結到 3,000+ 家母公司。 | [首頁][home]、[Quick Start][qs]、[10 週年文章][ten] |
| 收錄門檻 | 排除罰款 < US$5,000 與無金額罰則；排除政府／公營被告；排除純個人被告；採「修正後」金額而非初始提案金額 | [User Guide][ug] |
| 機關類型 | 聯邦：EPA、OSHA、DOJ、CFPB、CFTC、CPSC、MSHA、NLRB、Wage & Hour…（完整清單見 Data Sources）；州／地方：各州 AG、環保、勞工、保險、金融監理等；部分來源為 open records request（FOIA） | [Data Sources][ds]、[State/Local Data Sources][dss] |
| 更新頻率 | Update Log 顯示**每月一次**（每月 24–28 日左右），每季一次做全機關更新，其餘月份更新「selected federal agency and state AG cases」＋新增訴訟。最新一次 2026-08-24。 | [Update Log][ul] |
| 母公司匹配 | 主要對應到**現任**母公司（current parent），2022 起加上「罰款當時的母公司」欄位；2025-10-24 起 reporting-date parent 與訴訟文件開放給所有使用者 | [User Guide][ug]、[Update Log][ul] |

### Violation Tracker Global

| 項目 | 事實 | 來源 |
|---|---|---|
| 司法轄區 | 「more than 700 regulatory agencies in more than 50 countries」（首頁另寫 75+ 國）；比較表：60+ jurisdictions（含 US 與 UK）、800 個監管機關 | [Global User Guide][gug]、[版本比較][cmp] |
| 時間範圍 | 2010 年 1 月起 | [Global User Guide][gug] |
| 規模 | 比較表（2024-09-30）：65,000 筆；只收錄與約 1,700–1,900 家大型母公司相連的案件 | [版本比較][cmp]、[Global User Guide][gug] |
| 台灣覆蓋 | Jurisdiction = Taiwan：**428 筆**、US$1,039,179,666；台灣資料來源列出 5 個機關：Fair Trade Commission、Financial Supervisory Commission、Ministry of Environment and local authorities（data.moenv.gov.tw EMS_P_46 資料集）、Ministry of Labor、Occupational Safety and Health Administration（皆指向 announcement.mol.gov.tw） | [Taiwan jurisdiction 頁][gtw]、[Global Data Sources][gds] |
| HQ 在台灣的母公司 | 「Parent Roster by Headquarters Country」列出 Taiwan 段共 **38 家母公司、合計 439 筆**。前幾名：AU Optronics US$867M／10 筆、Formosa Plastics US$536M／158 筆、Innolux US$534M／9 筆、Mega Financial US$210M／10 筆、Foxconn US$123M／8 筆、Yageo US$112M／7 筆、HannStar US$71M／7 筆、UMC US$60M／6 筆、China Airlines US$41M／13 筆、FCF Co. US$32M／10 筆；亦含 TSMC 28 筆（US$326,558）、Nan Ya Plastics 31 筆、Cathay Financial 19 筆 | [Parent Roster by HQ][ghq] |
| 已知缺口 | User Guide 自承部分國家的環境／勞動案件機關不公開，因此「does not have data in every category for all the countries」 | [Global User Guide][gug] |

### Violation Tracker UK

- 僅英國：75+ 個 UK 監管機關、2010 起、120,000 筆、罰款含 0 元警告；下載免費。與台灣企業關聯僅限其英國子公司。 | [UK User Guide][ukug]、[版本比較][cmp]

## 2. 資料欄位

### 列表頁（實測 `hq_id=Taiwan`、`major_industry=electrical and electronic equipment`）

欄位固定 7 欄，均可點欄名排序（`order=` 參數，見第 3 節）：
Company、Current Parent、Current Parent Industry、Primary Offense Type、Year、Agency、Penalty Amount。
Agency 欄顯示代碼（如 `DOJ_ANTITRUST`、`NY-DFS`、`MULTI-AG`、`EPA`、`TX-ENV`、`private lawsuit-federal`）。重複計算的金額標 `(*)`。
列表頂部有摘要區：HQ Country、Current Parent Penalty Total since 2000、Number of Records、Top 10 Current Parent Companies。
來源：[hq_id/Taiwan][tw]、[User Guide「Intermediate Search Results」][ug]

### 單筆紀錄頁（實際開了兩筆）

- AU Optronics US$500M（2012，DOJ Antitrust）：[/violation-tracker/-au-optronics-corporation][rec1]
- Formosa Plastics Corporation, Texas US$27,634（2006，TCEQ）：[/violation-tracker/tx-formosa-plastics-corporation-texas-17][rec2]

實際出現的欄位：Company、Current Parent Company（連到 /parent/ 頁）、Parent at the Time of the Penalty Announcement、Penalty、Year、Date、Offense Group、Primary Offense、Mega-Scandal（若有）、Violation Description（若有）、Level of Government、Action Type、Agency（全名）、Civil or Criminal Case、Facility State、Facility County、HQ Country of Current Parent、Ownership Structure of Current Parent、Major Industry of Current Parent、Specific Industry of Current Parent、Source of Data（原始機關連結）、Archived Source（web.archive.org）、Source Notes、Current parent company note。

User Guide 列出的完整欄位集另含：Secondary Offense Type、Court、Prosecution Agreement、Case ID、Case Name、Private Lawsuit Resolution Type、Facility City／Address／Zip、Facility NAICS、HQ State of Parent、Recap of Ownership Changes、Link to PACER Case Docket、Link to Archived Court Document、Link to ECHO、Link to OSHA Inspection records、Notes。頁面只顯示有值的欄位。來源：[User Guide「Data Fields for Individual Entries」][ug]

紀錄 URL 模式：`/violation-tracker/{state-prefix}-{company-slug}[-N]`（如 `tx-formosa-plastics-corporation-texas-17`、`ny-mega-international-commercial-bank`；聯邦案件前綴為空字串 `-au-optronics-corporation`）。母公司頁：`/parent/{slug}`。

### 母公司摘要頁（實測 Formosa Plastics）

Current Parent Company Name、Ownership Structure、Headquartered in、Major Industry、Specific Industry、Penalty total since 2000、Number of records（83）、Top 5 Offense Groups、Top 5 Primary Offense Types、Links（連到 Global 同名母公司頁與 Subsidy Tracker）、Individual Penalty Records 列表。來源：[/parent/formosa-plastics][par]

### Global 單筆紀錄（實測 TOKIN Corporation／Yageo，台灣公平會 2021）

額外欄位：Jurisdiction、Region、Penalty Currency、Penalty Amount in Original Currency（1,145,220,000 台幣）、U.S. Dollar Equivalent at the Time of the Penalty Announcement、Offense Category、VTG Record ID（`VTG24-72849`）；Source of Data 指向 ftc.gov.tw 英文文件。下載檔另有 Cross Database ID 欄位可辨識來自 US／UK 版的紀錄。來源：[Global 紀錄][grec]、[Global User Guide][gug]

## 3. 篩選能力（URL 查詢參數）

參數名稱來自 Quick Start 頁範例連結與搜尋引擎索引到的完整 Advanced Search URL，並逐一以 `hq_id=Taiwan` 組合實測：

| 參數 | 意義 | 實測 |
|---|---|---|
| `hq_id=Taiwan` | 現任母公司 HQ 國家／州 | **有效**，201 筆，3 頁；`/hq_id/Taiwan` 為同義摘要頁 [tw] |
| `page=N` | 分頁，每頁 100 筆 | 有效。`?hq_id=Taiwan&page=2` 回 100 筆、`page=3` 存在。注意 `&page=1` 搭配 `order=pen_year&sort=desc` 的 docs.md 原 URL 在抽取服務上失敗（原因未確認，可能是 `page=1` 的重導），拿掉 `page=1` 即可 |
| `order=` / `sort=` | 排序欄位與方向 | 頁面欄名連結使用 `order=company|parent_name|major_industry|primary_offense|pen_year|agency_code|penalty`，`sort=asc|desc`（空值＝預設） |
| `pen_year[]=2024&pen_year[]=2025` | 年份（可多值） | 有效，Taiwan HQ 2024–2025 共 **9 筆** |
| `agency_code[]=EPA` | 聯邦機關代碼（可多值） | 有效，Taiwan HQ × EPA **17 筆** |
| `agency_code_st[]=` | 州／地方機關代碼 | 未實測，代碼格式如 `TX-ENV`、`NY-DFS`、`MULTI-AG` |
| `state=TX` | 設施所在州 | 有效，Taiwan HQ × Texas **51 筆** |
| `offense_group=environment-related+offenses` | 九大 offense group | 有效，Taiwan HQ × 環境 **70 筆** |
| `major_industry=electrical+and+electronic+equipment` | 母公司產業 | 有效，1,069 筆、11 頁 [ind] |
| `parent=formosa-plastics` | 母公司 slug | 有效（母公司頁的 CSV／排序連結即用此參數） |
| `all_offense[]=` | Primary／secondary offense type 或 mega-scandal | 索引到的 URL 有此參數，未實測 |
| `company_op=` + `company=` | 公司名稱搜尋 | **未能確認**：`company_op=contains&company=Formosa` 與 `contains_any` 都回傳 100,000 筆（等於未過濾），可能需要其他表單欄位同時帶入，或 op 值不同 |
| 其他（索引到但未實測） | `case_category`、`penalty_op`+`penalty`、`govt_level`、`pres_term`、`free_text`、`case_type`、`ownership[]`、`naics[]`、`city`、`advanced_mode=true`、`*_sum` 系列（`major_industry_sum`、`offense_group_sum`、`primary_offense_sum`、`agency_sum`、`agency_sum_st`、`hq_id_sum`、`scandal_sum`） | 參數名見 [Quick Start][qs] 範例與 Advanced Search 索引 URL |

其他事實：
- 列表上限 100,000 筆（User Guide）。
- 摘要類頁面（`/hq_id/X`、`/parent/X`、`/summary?...`、`/prog.php?...`）與查詢字串頁互通。
- Global 對應參數：`jurisdiction_sum=Taiwan`（428 筆、5 頁）、`parent=`、`order=company|parent_name|major_industry|vtg_offense_category|penalty_year|jurisdiction|penalty_usd`。Global 的「HQ 國家」查詢參數**未能確認**：`?hq_id=Taiwan`、`?hq_id_sum=Taiwan` 皆只回付款橫幅無資料；`?jurisdiction[]=Taiwan&hq_id[]=Taiwan` 回傳與純 jurisdiction 相同的 428 筆，表示 `hq_id[]` 被忽略。可改用 [Parent Roster by HQ][ghq] 取得 38 家台灣母公司後逐一走 `/parent/{slug}`。

## 4. 匯出／API

| 項目 | 事實 | 來源 |
|---|---|---|
| Export 按鈕 | 每個結果頁與摘要頁都有 **Download results as CSV or XML or Save your search**，連結格式 `?{同查詢}&detail=csv_results` / `detail=xml_results` | [hq_id/Taiwan][tw]、[parent/formosa-plastics][par] |
| 未登入點下去 | `?hq_id=Taiwan&detail=csv_results` 回傳標題為 **"Subscriber Portal"** 的登入頁，無資料 | 實測 [csv] |
| 訂閱價格（US 版） | Tier 1 US$25/月或 250/年：每次搜尋最多 1,000 筆 + 5 個 saved searches；Tier 2 US$45/450：5,000 筆 + 10；Tier 3 US$150/1,500：10,000 筆 + 25。訂閱同時含 Subsidy Tracker。 | [Plans][plans] |
| 訂閱價格（Global） | 同價位但額度小很多：100／500／1,000 筆每次搜尋；另有 **US$5 一次性購買 50 筆** | [Global Plans][gplans]、[One Time][gone] |
| UK 版 | 下載免費（有上限） | [版本比較][cmp] |
| 公開 API | 三站 User Guide、Plans、首頁皆**無任何 API 說明**；未能確認存在 | [ug]、[gug]、[plans] |
| Bulk / 完整資料集 | 「need access to a full dataset (with corporate identifiers) for academic purposes, contact Philip Mattera」；版本比較頁寫「for academic or commercial use, contact Philip Mattera」（pmattera@goodjobsfirst.org） | [Plans][plans]、[版本比較][cmp] |
| 第三方轉售 | CSRHub 將 Violation Tracker 列為其資料來源之一（表示有商業授權案例，條件未公開） | https://www.csrhub.com/datasource/good-jobs-first-violation-tracker |

## 5. 存取限制

### robots.txt（實際內容，US 與 Global 相同）

```
# Directories
Disallow: /resource/
Disallow: /gen/
Disallow: /devel/
# Sitemaps
Sitemap: https://subsidytracker.goodjobsfirst.org/sitemap_index.xml
```

沒有 `User-agent` 行（技術上不成立為有效規則組），沒有 Crawl-delay，未禁止 `/violation-tracker/` 或 `/parent/`；Sitemap 指到 Subsidy Tracker 的網域（疑為複製貼上）。來源：[robots.txt][robots]、[Global robots.txt][grobots]

### 實際 HTTP 行為

- `curl`（帶 Chrome UA、Accept header）對所有路徑回 `HTTP/2 403`，header 含 `server: cloudflare`、`cf-mitigated: challenge`、`accept-ch: Sec-CH-UA-*`，body 為 Cloudflare「Just a moment...」JS challenge 頁。WebFetch 同樣 403。goodjobsfirst.org 主站與 UK 站亦相同。
- 頁面本身是 **server-rendered HTML**（PHP，`prog.php`、`login.php`；抽取服務拿到的是完整表格，非 SPA），只是前面有 Cloudflare 的 bot management。一旦通過 challenge（真實瀏覽器），HTML 可直接解析。
- 未觀察到 rate limit 訊息（本次約 40 個請求、多數並行，皆正常）。**未能確認**通過 challenge 後的實際速率限制。

### Terms of Service（2024-08-27 修訂）

- 適用範圍條款列出 goodjobsfirst.org、violationtrackeruk.goodjobsfirst.org、covidstimuluswatch.org、corp-research.org；**未明列** violationtracker.goodjobsfirst.org 與 violationtrackerglobal，但兩站頁尾／Plans 頁都屬同一組織服務，實務上應視為適用。
- §3 Proprietary Rights：內容受著作權保護，一切權利歸 Good Jobs First。
- §5.1 License：僅授予「limited, non-exclusive... revocable license to access and use the Services **only for your own internal use**」，並須遵守「posted or notified limitations on the amount of data that can be downloaded」。
- §5.2 Acceptable Use 明文禁止：「using 'bots,' scraping, or other automated processing activities that send requests to our servers at a rate that either imposes burdens on our systems **or circumvents any technological blockers** to such activities that we have put in place」；亦禁止「breach or circumvent any security or authentication measure」。
- **沒有** Creative Commons、開放資料或署名再利用條款；沒有明文允許商業使用。
- 含美國使用者強制仲裁條款（§14）。
- 來源：[Terms of Service][tos]、[Privacy Policy][priv]

## 6. 姊妹資料庫比較（官方比較表，2024-09-30）

| | Violation Tracker Global | Violation Tracker (U.S.) | Violation Tracker UK |
|---|---|---|---|
| 公司範圍 | 僅 1,900 家大型母公司相連案件 | 所有規模 | 所有規模 |
| 罰款門檻 | ≥ US$5,000 | ≥ US$5,000 | 全部（含 0 元警告） |
| 時間 | 2010– | 2000– | 2010– |
| 私人訴訟 | 之後加入 | 有 | 無 |
| 司法轄區 | 60+（含 US、UK） | 1 | 1 |
| 監管機關數 | 800 | 450 | 80 |
| 筆數 | 65,000 | 700,000 | 120,000 |
| 下載 | 訂閱或一次性付費 | 訂閱 | 免費 |

來源：[版本比較][cmp]

對台灣企業的適用性：
- **Global 是唯一收錄台灣本地機關（公平會、金管會、環境部、勞動部、職安署）罰款的版本**，且每筆有原幣金額、美元換算與台灣機關原始連結；Formosa Plastics 在 Global 有 158 筆（台灣 105、美國 51、越南 2）。
- Global 的限制：只收約 1,700 家大型母公司（台灣 38 家）、2010 起、環境／勞動類靠機關網站公開程度；下載額度極小。
- US 版對「台資海外廠」（美國）覆蓋最完整（Formosa Plastics 美國廠 83 筆、含 2000–2009）。
- UK 版對本專案價值低。

## 對 formosa-oversee 的建議下一步

1. **本週可直接做的**：以 Global 的 [Parent Roster by HQ][ghq] 台灣段（38 家）為母公司主清單，人工或半自動整理每家的 `/parent/{slug}` 摘要（罰款總額、筆數、Top jurisdictions、Top offense groups）；US 版對應 `hq_id=Taiwan` 的 201 筆與 Top 10 母公司作為美國廠補充。這層資料不需登入。
2. **不要寫繞過 Cloudflare 的爬蟲**：ToS §5.2 明文禁止規避技術阻擋；robots.txt 未禁止但條款優先。若要批次資料，走正規路徑：
   - 寄信給 Philip Mattera（pmattera@goodjobsfirst.org）說明公益／研究用途，申請台灣相關子集（US `hq_id=Taiwan` + Global `jurisdiction=Taiwan` + Global HQ=Taiwan），並確認署名與再發布條件；
   - 或訂閱 US Tier 1（US$25/月）手動下載 `hq_id=Taiwan`（201 筆 < 1,000 上限，一次搜尋即可全拿）；Global 的 428 筆需 Tier 2（500 筆／次）或拆多個搜尋。
3. **在 dashboard 中以「外部連結 + 引用」呈現**：每家企業卡片放 Violation Tracker / Global 母公司頁連結與官方摘要數字，並註明「Source: Violation Tracker, Good Jobs First」與擷取日期；這符合 internal-use 授權下的一般引用實務，但若要重製整批紀錄仍應先取得書面同意。
4. **對台灣本地違規，優先考慮直接用 Global 標註的一手來源**：環境部 `data.moenv.gov.tw` EMS_P_46 裁處資料集、勞動部 `announcement.mol.gov.tw` 違法事業單位公告、公平會與金管會裁罰新聞——這些是台灣政府開放資料，授權條件比 Violation Tracker 寬鬆，可作為 Global 的驗證與擴充來源。
5. 修正 `dashboard/docs.md` 中的查詢 URL：`?hq_id=Taiwan&order=pen_year&sort=desc&page=1` 在抽取時失敗，改為 `?hq_id=Taiwan&order=pen_year&sort=desc`（或 `/hq_id/Taiwan`）。

### 對應 dashboard 現行資料管線的補充回答

現況：`scripts/fetch-gcs-data.js` 從私有 GCS bucket 拉 EPA ECHO 的 `facilities.csv` / `violations.csv`，以台灣上市公司代號（如 1210、1216）＋投審會境外投資公司名稱做模糊匹配到 EPA facility，輸出 `data/epa-data.json`；`lib/api.js` 多為 mock，`violations` / `enforcement` 陣列多為空。

#### Q1. VT 的公司／母公司如何對到台灣公司代號？

- **VT 公開頁面沒有 ticker、LEI、CIK、統編或任何結構化識別碼**。可用來輔助匹配的只有：`Current Parent Company`（標準化名稱 + URL slug，如 `formosa-plastics`）、`HQ Country of Current Parent`（Taiwan）、`Ownership Structure`（publicly traded / privately held…）、`Major Industry` / `Specific Industry`。「with corporate identifiers」的完整資料集是付費／申請才有的（[Plans][plans]、[版本比較][cmp]），內含哪種識別碼未公開。
- **匹配單位應該是 VT 的 parent slug，而不是每筆紀錄的 `Company` 欄**。`Company` 是機關原始文字（如 "Formosa Plastics Corporation, LP - Formosa Plastics Corporation, Texas"、"BUMBLE BEE FOODS LLC"），與投審會境外公司名的模糊匹配才有用；但 VT 已經替我們把這些對到母公司了，直接吃 parent 層即可。
- **規模小到可以人工建對照表**：US 版 `hq_id=Taiwan` 的母公司數未直接顯示（Top 10 見 [hq_id/Taiwan][tw]），Global 的 [Parent Roster by HQ][ghq] Taiwan 段是 38 家，兩者聯集估計 40–50 家。建議新增一個手工維護的 `data/vt-parent-map.json`：`{ "tw-1301": { "vtSlug": "formosa-plastics", "vtgSlug": "formosa-plastics", "vtName": "Formosa Plastics" }, ... }`，由人工核對一次即可，之後只維護新增。
- 注意 VT 的母公司粒度可能與台灣上市主體不同：Formosa Plastics（台塑集團）在 VT 是一個 parent，涵蓋台塑 1301、南亞 1303（VT Global 另有獨立的 Nan Ya Plastics）、台化、台塑化（Global 有 Formosa Petrochemical Corporation）與 Formosa Plastics Corp. USA。Foxconn 的 parent 名為 "Foxconn Technology Group (Hon Hai Precision Industry Company)"，其下含 Sharp。對照表需允許一個 VT parent 對多個台灣代號（或反向），並保留「集團層」旗標。
- HQ 國家欄可反過來當品質檢查：對照表裡的每個 slug 開 `/parent/{slug}`，`Headquartered in` 應為 Taiwan；不是的話代表 VT 認定的最終母公司不在台灣（例如被外資併購的子公司）。

#### Q2. VT 欄位 → dashboard `violations` / `enforcement` 欄位對應

VT 的每筆紀錄本質上是「已結案且有金額的執法結果」，對應到我們的 **`enforcement`** 陣列比 `violations` 合適（見 Q4）。建議對應：

| VT 欄位（個別紀錄頁） | 建議 dashboard 欄位 | 備註 |
|---|---|---|
| 紀錄 URL slug（`/violation-tracker/{slug}`） | `enforcement[].id`，建議前綴 `vt:` / `vtg:` | Global 另有 `VTG Record ID`（如 `VTG24-72849`）可直接用 |
| `Penalty` | `penaltyAmount`（number, USD） | 頁面有 `$` 與千分位，需清洗；帶 `(*)` 者為重複計算，另存 `isDuplicateFlagged: true` |
| Global：`Penalty Amount in Original Currency` / `Penalty Currency` / `U.S. Dollar Equivalent…` | `penaltyOriginal`, `penaltyCurrency`, `penaltyAmount` | 台灣案件原幣為 TWD，dashboard 可同時顯示 |
| `Date`（若有）／`Year` | `date`（ISO）／`year` | Date 格式如 "September 20, 2012"；部分只有 Year |
| `Agency`（全名）；列表頁為代碼如 `EPA`、`TX-ENV`、`DOJ_ANTITRUST` | `agency`, `agencyCode` | 代碼只在列表頁出現，全名只在紀錄頁 |
| `Level of Government`（federal / state / local） | `agencyLevel` | 可與 EPA ECHO 的 federal/state 對齊 |
| `Action Type`（agency action / private lawsuit） | `actionType` | 訴訟案 Agency 欄會是 "private lawsuit-federal" |
| `Civil or Criminal Case` | `caseType` | |
| `Offense Group` | `category` | 九類：environment-related、safety-related、employment-related、competition-related、consumer-protection-related、financial、government-contracting-related、healthcare-related、miscellaneous（[Offense Groups][og]）。可直接對應 dashboard 的環境／勞動／法規三分法：environment→環境；safety、employment→勞動；其餘→法規 |
| `Primary Offense` / `Secondary Offense Type` | `offenseType`, `offenseTypeSecondary` | 約 100 類，如 "environmental violation"、"air pollution violation"、"workplace safety or health violation" |
| `Violation Description` | `description` | 不是每筆都有；DOJ 案為新聞稿摘錄 |
| `Source of Data`（連結） | `sourceUrl` | 原始機關 URL（EPA ECHO、TCEQ PDF、justice.gov、ftc.gov.tw…） |
| `Archived Source` | `archivedSourceUrl` | web.archive.org |
| `Facility State` / `Facility County` / `Facility City`（若有） | `facilityState`, `facilityCounty`, `facilityCity` | 可與 `facilities[].state` 交叉比對，把 VT 案件掛到既有 facility |
| `Link to ECHO`（EPA 案件才有） | `echoFacilityUrl` → 解析出 registryId | **這是 VT 與 EPA ECHO 資料能直接 join 的唯一鍵**；本次兩筆樣本都沒有此欄，未能確認格式 |
| `Company` | `respondentName` | 機關原始文字 |
| `Current Parent Company` + slug | 對應到公司 `id`（經 Q1 對照表） | |
| `Parent at the Time of the Penalty Announcement` | `parentAtTime` | 併購歷史 |
| `HQ Country of Current Parent` / `Major Industry` / `Ownership Structure` | 公司層 `metadata` | 非案件層 |
| （固定值） | `metadata.dataSource: "Violation Tracker (Good Jobs First)"`, `metadata.sourceUrl`, `metadata.retrievedAt` | 引用需求 |

列表頁只有 7 欄（Company、Parent、Parent Industry、Primary Offense、Year、Agency code、Penalty），**沒有日期、來源 URL、描述**；要填滿上表必須開每一筆紀錄頁。

#### Q3. 逐頁抓 `hq_id=Taiwan` 的 HTML 是否在授權範圍？頁數估算

頁數：

| 目標 | 列表頁 | 紀錄頁 | 合計請求數 |
|---|---|---|---|
| US 版 `hq_id=Taiwan`（201 筆） | 3 | 201 | ~204 |
| Global `jurisdiction_sum=Taiwan`（428 筆） | 5 | 428 | ~433 |
| Global 38 家台灣 HQ 母公司（439 筆，與上列部分重疊） | 38 個 parent 頁（每頁 100 筆，Formosa Plastics 需 2 頁） | ~439 | ~480 |
| 全部去重後 | 約 50 | 約 900–1,000 | **約 1,000 次請求，一次性** |

授權分析（以 [Terms of Service][tos] 原文為準，非法律意見）：

- §5.2 禁止的是「以**造成系統負擔的速率**、**或規避我方所設技術阻擋**」的 bots／scraping。1,000 次一次性請求、每秒 < 1 次，不構成負擔；**但站方已部署 Cloudflare JS challenge 對所有非瀏覽器請求回 403，這就是條款中的 "technological blockers"**。任何用 headless browser、第三方 render 服務或偽造 header 讓程式通過 challenge 的做法，字面上都落入「circumvents」，不論速率多慢。
- §5.1 只授權「your own internal use」。把抓來的紀錄放進公開 dashboard 並重製欄位內容，超出 internal use；只放連結與我們自己整理的統計數字則爭議較小。
- robots.txt 未禁止這些路徑，但 robots.txt 不覆蓋 ToS。
- **結論**：程式化逐頁抓取 → 不建議。三條合規替代路徑，成本由低到高：
  1. 人在瀏覽器裡開頁面，手動（或用瀏覽器擴充的「儲存頁面」）存下 3 + 5 + 38 個列表／母公司頁的 HTML，再離線解析成 JSON。列表頁沒有日期與來源 URL，只夠填 `penaltyAmount`、`year`、`agencyCode`、`offenseType`、`respondentName`、`parent`；夠做公司層彙總。
  2. 訂閱 US Tier 1（US$25 一個月即可退訂）下載 `hq_id=Taiwan` 完整 CSV（201 筆 < 1,000 上限，含全部欄位）；Global 需 Tier 2（500 筆／次）下載 `jurisdiction=Taiwan` 428 筆，或 Tier 1 拆成每家母公司各一次。合計最低約 US$70（US Tier 1 + Global Tier 2 各一個月）。ToS 仍是 internal use，公開重製前應先詢問。
  3. 寄信 Philip Mattera 申請「台灣相關子集」並明確詢問：可否在公開 dashboard 顯示逐筆紀錄、署名格式、更新頻率。這是唯一能拿到「corporate identifiers」與明確再發布許可的路徑。

#### Q4. VT 與 EPA ECHO 的資料性質差異與呈現建議

| | EPA ECHO（現有管線） | Violation Tracker |
|---|---|---|
| 收錄單位 | 設施（facility）層的合規狀態、檢查、違規（含未罰款的 non-compliance、通知、逾期申報） | 公司層的**已結案、有金額（≥ US$5,000）**執法結果 |
| 主鍵 | ICIS_FACILITY_ID / NPDES_ID / Registry ID | 母公司 slug + 紀錄 slug；EPA 案件另附 ECHO 連結 |
| 領域 | 僅環境（CAA / CWA / RCRA…） | 環境、職安、勞動、反托拉斯、金融、消費者保護等九類 |
| 地理 | 僅美國 | US 版僅美國；Global 含台灣本地機關與其他國家 |
| 金額 | 部分有（formal enforcement 的 penalty） | 每筆都有，且是修正後金額 |
| 時效 | 近乎即時（每週更新） | 每月更新，收錄的是結案時點 |
| 缺點 | 無法看跨領域、無台灣本地 | 看不到未罰款的違規、看不到進行中案件、< US$5,000 全部被過濾 |

呈現建議：

1. **資料模型上分兩層**：`violations[]` 放 ECHO 的合規違規（facility 層、可能無金額），`enforcement[]` 放「已結案有罰款的執法結果」，VT 全部進 `enforcement[]`，ECHO 的 formal enforcement 也進 `enforcement[]` 並標 `source`。兩者用 `sourceUrl` / ECHO registryId 去重（VT 的 EPA 案件會與 ECHO 的 penalty 重複）。
2. **UI 上用不同視覺語言**：ECHO 違規以「合規狀態時間軸／季度格」呈現（有無違規、是否 significant non-compliance）；VT 執法以「罰款事件」呈現（金額、機關、類別 badge），並在卡片標「來源：Violation Tracker, Good Jobs First」與擷取日期。不要把兩者加總成一個「違規次數」，因為計數基準不同（ECHO 一季一個狀態、VT 一案一筆）。
3. **類別 badge 用 VT 的 Offense Group** 做跨來源統一：ECHO 全部歸 environment-related；VT 依其 Offense Group。這樣「環境／勞動／法規」三分法在兩個來源上有一致的定義（見 Q2 對應）。
4. **金額顯示區分幣別與時點**：US 版與 ECHO 是 USD 名目金額；Global 台灣案件顯示 TWD 原幣 + 當時 USD 換算。避免把不同年份金額直接相加後未註明。
5. **覆蓋範圍聲明**：在資料說明頁寫明 VT 只含 ≥ US$5,000 且已結案的案件、US 版只含美國、Global 只含 1,700 家大型母公司；ECHO 只含美國環境。否則使用者會把「VT 沒紀錄」誤讀為「沒違規」。

## 未能確認事項

- `Link to ECHO` 欄位的實際格式（本次開的 EPA/TCEQ 樣本沒有此欄），因此 VT ↔ ECHO 的 registryId join 是否可行未驗證。

- 公司名稱搜尋的 URL 參數組合（`company_op`／`company` 單獨帶入回傳全部 100,000 筆）。
- Global 版「母公司 HQ 國家」的查詢參數名稱（`hq_id`、`hq_id_sum`、`hq_id[]` 皆無效）。
- 通過 Cloudflare challenge 後是否另有 rate limit。
- 訂閱下載的 CSV 實際欄位清單（User Guide 說「contain full individual entries」，未能取得樣本）。
- 是否存在任何 API（三站文件皆未提及，只能說「未見」）。
- Terms of Service 適用網域清單未明列 violationtracker 與 violationtrackerglobal 兩站。
- 向 Philip Mattera 申請完整資料集的授權條件、費用與是否允許公開再發布。
- 原 docs.md URL 帶 `page=1` 時失敗的確切原因（可能是抽取服務端問題而非站方限制）。

[home]: https://violationtracker.goodjobsfirst.org/
[ug]: https://violationtracker.goodjobsfirst.org/pages/user-guide
[qs]: https://violationtracker.goodjobsfirst.org/pages/quick-start
[ds]: https://violationtracker.goodjobsfirst.org/pages/violation-tracker-data-sources
[dss]: https://violationtracker.goodjobsfirst.org/pages/local-state-data-sources
[ul]: https://violationtracker.goodjobsfirst.org/pages/update-log
[ten]: https://goodjobsfirst.org/violation-tracker-marks-10-years-of-documenting-corporate-misconduct/
[tw]: https://violationtracker.goodjobsfirst.org/hq_id/Taiwan
[ind]: https://violationtracker.goodjobsfirst.org/?major_industry=electrical+and+electronic+equipment&order=company&sort=desc
[rec1]: https://violationtracker.goodjobsfirst.org/violation-tracker/-au-optronics-corporation
[rec2]: https://violationtracker.goodjobsfirst.org/violation-tracker/tx-formosa-plastics-corporation-texas-17
[par]: https://violationtracker.goodjobsfirst.org/parent/formosa-plastics
[csv]: https://violationtracker.goodjobsfirst.org/?hq_id=Taiwan&detail=csv_results
[plans]: https://violationtracker.goodjobsfirst.org/plans
[robots]: https://violationtracker.goodjobsfirst.org/robots.txt
[grobots]: https://violationtrackerglobal.goodjobsfirst.org/robots.txt
[tos]: https://goodjobsfirst.org/terms-of-service/
[priv]: https://goodjobsfirst.org/privacy-policy/
[cmp]: https://goodjobsfirst.org/comparison-of-violation-tracker-versions/
[gug]: https://violationtrackerglobal.goodjobsfirst.org/pages/user-guide
[gds]: https://violationtrackerglobal.goodjobsfirst.org/pages/data-sources
[gtw]: https://violationtrackerglobal.goodjobsfirst.org/jurisdiction/Taiwan
[ghq]: https://violationtrackerglobal.goodjobsfirst.org/top-hq-parents
[grec]: https://violationtrackerglobal.goodjobsfirst.org/violation-tracker-global/taiwan-tokin-corporation
[gplans]: https://violationtrackerglobal.goodjobsfirst.org/plans
[gone]: https://subscribe.goodjobsfirst.org/plans/global-one-time-2/
[ukug]: https://violationtrackeruk.goodjobsfirst.org/pages/user-guide
[og]: https://violationtracker.goodjobsfirst.org/pages/offense-groups

## 附錄：MOPS 公司資料的「英文全稱」錯位問題（2026-09-30 發現）

`scripts/mops_company/mops_company_info.csv` 的「英文全稱」欄在部分區段（主要是上市 28xx–29xx 金融股與其他零星區段，粗估約 160 列）整段往下錯一列：
某列掛的是上一家公司的英文全稱，自己的全稱在下一列。「英文簡稱」欄正確。範例：2886 兆豐金掛 `Yuanta Financial Holding`、2887 台新新光金掛 `Mega Financial Holding`、3481 群創掛 `VIVOTEK INC.`。

- 成因待查，出在 `mops_company_info.py` 逐家抓 `fetch_company_english_name` 的階段，疑似 MOPS 在限流時回傳前一次查詢的結果。
- **對 EPA ECHO 對照（`dashboard/data/facilities.csv`）的影響：0 筆。** 92 家中有 4 家落在錯位區，但沒有任何一筆設施是靠錯位後的英文全稱匹配到的。
- 對 Violation Tracker 母公司對照的影響：`seed-company-mapping.py` 與 `resolve-ownership.py` 以英文簡稱判斷錯位：本列全稱與簡稱不符、下一列相符時改用下一列。判斷規則是字首四字相同，或簡稱字母依序出現在全稱中（處理 INX、FFHC、AUO 這類縮寫）。
- TWSE OpenAPI `t187ap03_L` 只有英文簡稱、沒有英文全名，無法直接重建；根治要重跑 MOPS 爬蟲並在抓取時驗證回傳的公司代號。
