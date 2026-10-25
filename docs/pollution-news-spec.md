# 污染事件與報導：spec（試點：台塑、華新麗華、台積電）

狀態：草案 v1（2026-10-21）。由 grilling 流程整理，決策由 Claude 自答、標「使用者確認」的已經過使用者確認；決策紀錄在第 10 節。

## 1. 目標與範圍

把公司頁空白的「相關新聞」分頁，改成有查證來源的**污染事件**清單。先用台塑 1301、華新麗華 1605、台積電 2330 三家試點，資料格式與收錄規則要能直接擴到全站。

| 收 | 不收 |
|---|---|
| 台灣上市公司**境外**據點（美國、越南、印尼、日本、中國大陸等）的事件 | 台灣本地廠區的事件（環境部與國內媒體已有完整紀錄，收了會模糊「境外」定位） |
| 污染事故、環境違規與罰款、環境訴訟與和解、環評爭議、社區健康抗爭、有化學物質外洩的工安事故 | 用水用電、碳排、ESG 報告、擴廠投資、公關稿、純勞工議題 |
| 台灣母公司**持有期間**發生的事件 | 收購前發生的事件（與 `violations-supplement.csv` 排除收購前違規的規則一致） |

不在這次範圍：首頁與地圖呈現、自動抓新聞、夥伴投稿流程（見第 9 節）。

## 2. 資料單位：事件，不是單篇報導

一個事件（例：河靜鋼廠 2016 年海洋污染）底下掛多篇來源。理由：

- 同一事件常有幾十篇報導，逐篇列會洗版，也看不出事件全貌。
- 收錄門檻、狀態（指控／已裁罰／已和解）、歸屬都是事件層級的屬性。
- 台灣媒體有沒有報導，是這個網站在意的訊號；放在同一事件底下比較才看得出來。

## 3. 收錄與查證規則

每個事件都要符合：

1. **來源門檻**：至少 1 份官方、法院或公司本身的文件，或至少 2 家互相獨立的媒體。同一通訊社稿件的轉載算 1 家；轉述同一篇報導或同一位消息來源說法的報導，也只算 1 家。
2. **連結**：每個來源都要有可開啟的原始網址，並附 Wayback Machine 封存網址。不接受 `'#'` 或查不到的連結。封存失敗時 `archiveUrl` 留 `null`、在 `note` 寫原因，`build-news.py` 會列出警告。
3. **摘要**：自己寫，2–3 句、陳述事實，指控一定要寫明是誰的說法（「越南政府調查認定……」「環團指控……」）。不轉貼報導全文或圖片，只存標題、媒體、日期、網址與摘要（repo 是公開的）。
4. **狀態**要分清楚尚未確定與已確定：`alleged`（指控）、`investigating`（調查中）、`concluded`（官方調查已有結論，例如 CSB 報告）、`penalized`（已裁罰）、`settled`（已和解）、`ruled`（已判決）、`ongoing`（持續中的爭議）。
5. **公司回應**有就收，當成 `kind: 'company'` 的來源，不另立事件。公司自己揭露的違規（永續報告書、企業依法向環境資訊公開平台申報的紀錄，例：山東企业环境信息依法披露系统）也是 `company`：平台是官方的，內容是公司填的。前端統一標「公司文件」。被指控實體同期的**官方合規紀錄**也要一併列出（例：印尼 PROPER 評等為藍），當成 `kind: 'official'` 的來源，讓讀者同時看到指控與官方評等。
6. **持有期間**：事件起始日早於台灣母公司取得控制（`controlSince`）的不收。
7. **園區層級的處分不掛到進駐廠商**：官方只點名園區管理方（例：印尼環境部 2025-06 對 IMIP 的處分）時，不歸屬到園區內的台企，摘要也不得暗示。
8. **倡議活動不單獨成事件**：記者會、股東會抗議、NGO 報告，當作來源掛在被指控的那個事件底下。這也是「台灣媒體有沒有報」的主要訊號（例：2026-05 Diane Wilson 在台北的記者會，掛在 Point Comfort 塑膠粒事件下）。
9. **工安的界線**：有化學物質、危險廢棄物或污染物外洩的才收；單純的墜落、壓傷等職災不收。
10. 只有單一來源，或頁面擋爬蟲而無法開啟確認的，先列「待補來源」，不上線。

## 4. 歸屬：事件掛在哪些公司頁

沿用 `scripts/resolve-ownership.py` 的資金鏈規則（`docs/enforcement-data-interface.md` 第 8 節）：

- 由事件的營運實體（`entities`）沿 MOPS 持股鏈追到台灣上市公司，算有效持股。
- 多家上市公司共同持股時，每家都掛，並在卡片上標持股比例與路徑。
- 一家上市公司符合下列任一條件，事件才出現在它的公司頁：
  1. 它自己的有效持股 ≥ 20%（IFRS 重大影響門檻）。
  2. 它所屬的集團合計持有 ≥ 50%（集團控制），而且它本身有持股。集團成員寫在 `CURATED` 的 `GROUPS`，每個集團附依據。
- 兩個條件都不符合的股東，只寫在持股路徑說明裡，不出現在它的公司頁。
- 為什麼要有第 2 條：河靜鋼廠（FHS）由台塑、南亞、台化、台塑化各直接持有 11.43%，福懋 3.85%，中鋼 20.45%（台塑 115Q2 財報、中鋼官網）；台塑集團合計約 75%（公視 2023）。只看單一公司的話，這起事件只會出現在中鋼的頁面，不會出現在實際經營的台塑集團各公司。門檻定 50% 而不是 20%，是因為把事件掛到集團每個成員，要以集團實際控制經營為前提。
- **持股看最新財報，收購前看集團取得控制的年份**：卡片顯示最新一季財報的持股，並註明不一定是事件當時的比例。「收購前不收」（第 3 節第 6 條）以台灣母公司或其集團取得控制的年份（`controlSince`）判斷，不以個別上市公司持股何時過 20% 判斷，與 EPA 違規資料的歸屬做法一致。例：2005 年台塑發言人稱當時台塑只持有 FPC USA 6%，但 FPC USA 自 1978 年起就由台塑集團設立並控制，所以 2004、2005 年的事件仍掛台塑。
- **卡片上顯示的持股比例**，用 resolver 的「自身鏈」口徑：只沿該公司自己的持股路徑相乘，不把台塑四寶之間的交叉持股算進去，並在卡片上註明。用穿透口徑的話，同一筆持股會因交叉持股被重複計入，數字也難以向讀者解釋。

### 持股資料的來源

- MOPS 的兩個檔（`subsidiaries_union.csv`、`oversea_subsidiaries_union.csv`）**只收子公司**（控制）。20–50% 的關聯企業不在裡面，resolver 因此追不到 FHS、FPC USA、南亞與台化持有的 FG INC. 等持股。
- 試點先把這些關聯企業持股寫進 `CURATED`，依據引用財報附註「採用權益法之投資」（例：台塑 115Q2 合併財報）。要擴到全站時，再另外建立「採權益法投資」的 MOPS 資料集（見第 9 節）。
- MOPS 2025Q2 快照會過時，例如華新的 Everising 持股已從 29.5% 增為 51%。試點的持股數字以最新一季財報為準，`basis` 寫明是哪一季。
- 英文名查不到的實體（例：ESMC、WaferTech、FHS），在 `attributionOverride` 指定 MOPS 中文子公司名或財報名稱。
- 華新在印尼的「工廠 ↔ 公司 ↔ 華新」對照見 `docs/pollution-news-research/2026-10-21-walsin-structure.md`：華新沒有持有 IMIP、IWIP 園區公司的股份；Labota 電廠 Unit 1（350 MW）屬 WNII（92%）、Weda Bay 電廠 Unit 7（380 MW）屬 Sunny Metal（79.61%）；IWIP 的 PT Westrong Metal Industry 只在 2022-12 到 2024-01 持有 29.5%，這段期間的事件才可歸屬；供煤的 PT Transcoal Minergy 有效持股 9%，不歸屬。官方發現若只寫「Labota PLTU」而沒有指明機組，不能直接算 WNII（園區還有其他業主的機組）。
- 注意撞名：越南「台灣興業」的英文名也是 Formosa Industries Corporation（台化、南亞、福懋持有），和台塑在美國的子公司是兩家不同的公司。`entity` 一律要和國家一起比對。

## 5. 資料模型與管線

```
data/news-events.json        人工整理（進 git）：事件、來源、營運實體
        │  scripts/build-news.py（需要 MOPS，在本機跑，與 npm run attribution 同一套）
        ▼  驗證欄位 → 解析持股鏈 → 補新聞專屬公司的基本資料
data/news.json               產出（進 git，CI 不需要 MOPS）
        │  scripts/fetch-gcs-data.js 建置時合併
        ▼
data/epa-data.json           company.news[]；只有新聞、沒有 EPA 設施的公司也產生公司
```

`npm run news` = `python3 scripts/build-news.py && npm run fetch-data`。

### `data/news-events.json` 單筆事件

```js
{
  id: 'formosa-ha-tinh-2016-marine-pollution',   // slug，永久不變
  title: '台塑河靜鋼廠排放廢水，越南中部四省海域大量魚群死亡', // 自己寫的中文標題
  summary: '……',                                   // 2–3 句，見第 3 節
  type: 'pollution-incident',  // 'pollution-incident' | 'enforcement' | 'litigation' | 'eia-dispute' | 'industrial-accident' | 'community-health'
  status: 'settled',           // 見第 3 節
  dateStart: '2016-04-06',
  dateEnd: '2016-06-30',       // 持續中留 null
  datePrecision: 'day',        // 'day' | 'month' | 'year'
  locations: [                 // 一個事件可能涉及多個廠區（例：華新的 Morowali 與 Weda Bay）
    {
      country: '越南',
      plantSite: '河靜省, 越南',      // '地點, 國家'；美國寫 'City, State, 美國'
    },
  ],
  entities: [                  // 營運實體，給 resolver 追持股鏈；名稱要和國家一起比對（見第 4 節撞名）
    { name: 'Formosa Ha Tinh Steel Corporation', country: '越南' },
  ],
  attributionOverride: null,   // MOPS 追不到時人工指定 [{ companyCode, entity, kind, effectivePct, controlSince, path, basis }]；effectivePct 用百分比（寫成小數會自動換算），basis 要寫財報季別或公告
  groupControl: [],            // 集團規則用：[{ group, entity, totalPct, members: [代號], basis }]
  related: {
    eventIds: [],              // 同一事件的後續（例：河靜鋼廠污染 → 越南受害者台北訴訟）
    echoFacilityIds: [],       // 能對到網站上的 EPA 設施才填
    enforcementCaseIds: [],    // 能對到 enforcement[].caseId 才填
  },
  sources: [
    {
      kind: 'official',        // 'official' | 'court' | 'company' | 'media' | 'ngo'
      outlet: 'Government of Vietnam',
      outletRegion: 'local',   // 'taiwan' | 'local' | 'international'
      language: 'vi',
      title: '原文標題',
      date: '2016-06-30',
      url: 'https://...',
      archiveUrl: 'https://web.archive.org/...',
    },
  ],
  addedAt: '2026-10-21',
}
```

### `data/news.json`（產出）

在每個事件上加 `attribution: [{ companyCode, companyName, kind, path, effectivePct, controlSince, basis }]`，另外輸出 `companies`：被歸屬到、但不在 `facilities.csv` 的上市公司基本資料。

- 用 `build-echo-supplement.py` 的 `company_cols(code)`（`ro.load_mops()`，英文全稱已修正錯位）產生，欄位與 `facilities.csv` 的公司欄位相同。不要用 `seed-company-mapping.py` 的 `full_fixed`，它的錯位判斷比較弱。
- MOPS 沒有 logo，`LOGO網址` 留空。
- `公司網址` 沒有 `http(s)://` 的補上 `https://`，否則公司頁的連結會變成相對路徑。
- `englishName` 一定要是字串（`pages/companies/index.js:64` 搜尋時會對它呼叫 `toLowerCase()`）。

`fetch-gcs-data.js` 合併時：

- 已有的公司加上 `news: [...]`，事件依 `attribution` 分到符合第 4 節任一條件的公司。
- 只有新聞的公司另外建立公司物件：`facilities`／`violations`／`enforcement` 為空陣列，`metadata.dataSource` 寫 `'污染事件（官方文件與新聞報導）'`，不沿用寫死的 `'EPA ECHO - 台灣企業境外投資'`。
- 公司物件加 `inEpaData: boolean`，前端用它分辨「EPA 有紀錄但 0 筆違規」與「不在 EPA 資料範圍」。

### `build-news.py` 的驗證（失敗就不產出）

- 必填欄位、列舉值、日期格式；`id` 不重複。
- 第 3 節的來源門檻；網址不是 `'#'`、有 `archiveUrl`。
- 事件起始日早於 `controlSince` → 錯誤。
- 解析不出任何上市公司歸屬 → 錯誤（要補 `attributionOverride`）。

## 6. 前端

| 位置 | 變更 |
|---|---|
| `pages/companies/[id].js` 分頁 | 「相關新聞」改名「污染事件」，分頁標題帶筆數。目前 `<Tabs>` 沒設 `defaultIndex`，一律開第一個分頁；改成預設開有內容的分頁：有違規的開違規，只有事件的開事件 |
| 事件卡片 | 標題、期間、地點、類型 badge、狀態 badge、2–3 句摘要、持股路徑（例：台塑 1301 →……→ Formosa Ha Tinh Steel，有效持股 x%）、來源列表 |
| 來源列表 | 每筆標 `台灣媒體`／`當地媒體`／`國際媒體`／`官方文件`／`法院`／`公司文件`，附原文連結與封存連結。取代原本的「國際新聞／國內新聞」兩區 |
| 廠區篩選 | 兩個分頁各自篩選：違規的 `plantSite` 是 EPA 設施名稱（例：「FORMOSA POINT COMFORT PLANT, 美國」），事件的是地點（例：「Point Comfort, Texas, 美國」），格式不同無法共用 |
| 統計資訊卡 | 加「污染事件數」，**不和違規數加總**（量的性質不同，與 enforcement 的呈現原則一致） |
| 只有新聞的公司（`inEpaData: false`） | 不顯示會被誤讀成「乾淨」的 0：<br>・廠區列表位置顯示「此公司在美國 EPA 資料中沒有對應設施，以下事件來自官方文件與新聞報導。」<br>・統計卡的總廠區數、總違規數顯示「不在 EPA 資料範圍」，不顯示 0<br>・違規分頁的空狀態改成同一句說明，不顯示「此廠區無相關違規記錄」<br>・麵包屑沒有廠區時不要退成「總公司」 |
| `pages/companies/index.js` 卡片 | 事件數 > 0 時多一行「污染事件：N」；只有新聞的公司不顯示「廠區數量: 0／違規記錄: 0」，改顯示「不在 EPA 資料範圍」 |
| 沒有 logo | 目前退回 `via.placeholder.com`，這個服務已停用，會變成破圖。改成公司簡稱字首的文字頭像（既有公司也一起受惠） |
| 地圖頁 | `getMapData` 的 `summary.companyCount` 改成只算有設施的公司，否則地圖頁的「N 家上市公司」會被只有新聞的公司灌大 |
| 清理 | 刪掉整個 `lib/api.js`（`getRelatedNews` 等假資料沒有任何地方 import，多數連結是 `'#'`）、`axios` 依賴，以及 `[id].js` 寫死的空 `newsData`；同步更新 `CLAUDE.md` 與 `docs/violation-tracker-data-access.md` 提到它的地方 |

排序：依 `dateStart` 新到舊。

## 7. 試點事件清單

2026-10-21 研究整理的結果。完整來源與驗證紀錄在 `docs/pollution-news-research/2026-10-21-news-landscape.md`，持股計算在 `docs/pollution-news-research/2026-10-21-ownership.md`。「✓」= 已開啟頁面確認、符合第 3 節門檻；「待補」= 未達門檻，先不上線。

### 台塑 1301（含集團）

| id | 期間 | 事件 | 營運實體 → 歸屬 | 類型／狀態 | 關鍵來源 | 門檻 |
|---|---|---|---|---|---|---|
| F1 | 1998-12 | 約 3,000 噸含汞污泥運到柬埔寨施亞努港傾倒 | 台塑本身（仁武廠廢棄物）→ 1301 | pollution-incident／狀態待確認 | Cambodia Daily 1998-12-31、Grist 1999-06-11 | ✓ |
| F2 | 2004-04-23 | Illiopolis PVC 廠爆炸，5 死、約 150 人撤離 | FPC USA 旗下 Illinois 廠 → 1301 | industrial-accident（氯乙烯）／concluded | CSB 最終報告 2007-03-06 | ✓；ECHO IL0001350 |
| F3 | 2005-10-06 | Point Comfort 丙烯外洩爆炸，工人受傷 | FPC USA 旗下 Texas 廠 → 1301 | industrial-accident／concluded | CSB 2005-10-06、KHOU | ✓ |
| F4 | 2009-09-29 | EPA／DOJ 和解：Point Comfort 與 Baton Rouge 投入逾 1,000 萬美元改善，罰 280 萬美元 | FPC USA 旗下 Texas、Louisiana 廠 → 1301 | enforcement／settled | EPA 新聞稿、地球公民基金會中譯 | ✓ |
| F5 | 2016-04 起 | 河靜鋼廠排放廢水，越南中部四省海域大量魚群死亡；公司承認並賠償 5 億美元 | FHS → 中鋼 2002（20.45%，條件 1）；台塑 1301、南亞 1303、台化 1326、台塑化 6505（各 11.43%）、福懋 1434（3.85%）（條件 2，集團合計約 75%） | pollution-incident／settled | Viet Nam News 2016-06-30、2016-10-01，公視，環境資訊中心，Mongabay 2026-04-06 | ✓ |
| F6 | 2019-06 起 | 7,875 名越南受害者在台北求償；2020 年最高法院認定台灣有管轄權，至今未進入實體審理 | 同 F5；`related.eventIds: [F5]` | litigation／ongoing | 公視、RFA、BHRRC、FIDH | ✓ |
| F7 | 2017-07 至 2019-12，後續至今 | Point Comfort 塑膠粒污染，CWA 公民訴訟和解 5,000 萬美元；之後依和解再罰逾 2,400 萬美元 | FPC USA 及旗下 Texas 廠 → 1301 | litigation／settled | Texas Tribune（2019-06、10、12，2025-01）、TRLA、第五巡迴上訴法院意見書；台灣媒體：聯合報 2026-05-27（凱道記者會，依第 3 節第 8 條掛在這裡） | ✓；ECHO TX0085570 |
| F8 | 2021-09-13 | EPA 依化學事故預防規定罰 285 萬美元（2013–2016 火災爆炸） | FPC USA 旗下 Texas 廠 → 1301 | enforcement／penalized | EPA 新聞稿、DOJ 新聞稿 | ✓ |
| F9 | 2020-01 起 | 路易斯安那 St. James「陽光計畫」：LDEQ 2020-01 核發 15 張空污許可；陸軍工兵團 2020-11 重審濕地許可、2021-08 下令完整環評；州地院 2022-09 撤銷全部許可，第一巡迴上訴法院 2024-01-19 恢復，州最高法院 2024-09-04 拒絕審查；2026-02-05 環團再告許可展延 | FG LA → 台塑化 6505（57%）、台化 1326（30%）（條件 1）；南亞 1303（10%）、福懋 1434（3%）（條件 2，FG INC. 由台塑集團四家合計 100% 持有）；台塑 1301 沒有持股，不掛 | eia-dispute／ongoing | 19th JDC 判決理由書、第一巡迴上訴法院判決、FG LA 聲明、公視 2020、Taipei Times（AP）2021、Verite News 2025、The Advocate 2026 | ✓（2026-10-22 補齊） |
| F10 | 2024-07-19 – 2024-08-21 | 德州總檢察長控告 Point Comfort 廠 2019-06 至 2021-09 間 9 起排放事件未及時通報 TCEQ，合意判決罰款 47.5 萬美元 | FPC USA 旗下 Texas 廠 → 1301 | enforcement／settled | Texas Register 2024-07-19（Wayback）、EPA ECHO 案件紀錄 | ✓（2026-10-22 補齊） |
| F11 | 2002-10-09 – 2003-01-07 | Baton Rouge 廠與 LDEQ 和解：罰款 30 萬美元，另約 270 萬美元設備改善與 135 萬美元有益環境計畫；公司否認違規 | FPC USA 旗下 Louisiana 廠 → 1301 | enforcement／settled | LDEQ 新聞稿與和解書、ICIS | ✓（2026-10-22 補齊） |
| F12 | 2017-02-07 | EPA Region 6 CAFO（CAA-06-2016-3361）：Baton Rouge 廠 7 項違反化學事故預防規定，罰款 277,200 美元 | FPC USA 旗下 Louisiana 廠 → 1301 | enforcement／penalized | EPA CAFO、行政同意令、ECHO 案件紀錄 | ✓（2026-10-22 補齊） |

### 華新麗華 1605

| id | 期間 | 事件 | 營運實體 → 歸屬 | 類型／狀態 | 關鍵來源 | 門檻 |
|---|---|---|---|---|---|---|
| W1 | 2024-11 起 | 印尼鎳業冶煉廠與自備燃煤電廠遭指控造成空污、水污，有小學距煙囪約 100 公尺；2025-08-05 居民與子公司員工到台北總部陳抗。華新回應未持續新建燃煤電廠，已設脫硫脫硝與 CEMS | WNII（Morowali，有效 92%，2020 設立）、Sunny Metal（Weda Bay，有效 79.61%，2022 設立）→ 1605 | community-health／alleged | TTNC Watch 報告（BHRRC 收錄）、中央社 2025-08-05、公視 2025-08-05、TaiwanPlus、Global Voices、New Bloom；當地媒體：Betahita 2025-08-07〈Menagih Tanggung Jawab Nikel Hingga Taipei〉（點名 WNII）、Halmahera Nesia 2025-08-07（點名 Walsin Lihwa）；公司回應見中央社、公視、Fokus Taiwan（中央社印尼文版，與中央社算同一家）；官方合規紀錄：PROPER 2023–2024（KLH SK 129/2025）評 WNII 為藍 | ✓ |
| W2 | 2025-04 起 | DREAL 稽查 DMV France 蒙巴爾廠，發現酸鹼化學品共用防漏承接槽、卸酸區結構損壞；Côte-d'Or 省長 2026-01-08 發布第 60 號省令（mise en demeure）限期改正 | DMV France（有效 71.83%，2024-11 隨 DMV 收購）→ 1605 | enforcement／concluded | Côte-d'Or 省令、DREAL 三份稽查報告（Géorisques） | ✓ |
| W3 | 2024 | ARPA Valle d'Aosta 認定 Cogne Aosta 鋼廠旁測站 PM10 鎳年均 22 ng/m³，高於 20 ng/m³ 目標值，主要來自鋼廠；大區 AIA 換證規定增產須經空品技術小組評估 | Cogne Acciai Speciali（71.83%，2022-12 收購）→ 1605 | pollution-incident／concluded | ARPA 2024、2025 空品報告、大區 P.D. 7777/2025、ANSA、AostaSera | ✓ |
| W4 | 2025 | Com.Steel Inox（Calusco d'Adda）非危險廢棄物存放在許可區外、通報延誤，遭處罰 | Com.Steel Inox（46.69%，2024-05 收購）→ 1605 | enforcement／penalized | Cogne 2025 永續報告書 GRI 2-27（公司自揭露，未列機關、日期、金額） | ✓（公司文件） |
| W5 | 2025 | 瑞典 Degerfors Long Products 危險液體與化學品沒有防漏設施，違反環境許可遭罰款 | Degerfors Long Products（71.83%，2023 收購）→ 1605 | enforcement／penalized | Cogne 2025 永續報告書 GRI 2-27、Outokumpu 2023 出售公告 | ✓（公司文件） |
| W6 | 2024-04 至 2024-10 | 山東省環保督察信訪：煙台華新不銹鋼被檢舉電爐冒黃煙；黃渤海新區生態環境分局查出車間鐵皮破損致顆粒物逸散，責令封堵，異味檢測達標 | 煙台華新不銹鋼（100%，2007 設立）→ 1605 | enforcement／concluded | 黃渤海新區生態環境分局兩份督察信訪銷號公示、山東省企業環境信息披露年報 | ✓ |
| — | 2023-06-02 | WNII 自備燃煤電廠脫硫塔（FGD）施工中焊接火花引燃，冒黑煙約 40 分鐘，無傷亡，電廠尚未運轉 | WNII | industrial-accident | CNBC Indonesia、Kompas.com、VOA Indonesia、Merdeka.com | 不收：2026-10-25 補到兩家以上獨立媒體，但沒有化學品或污染物外洩的報導，不符第 3 節第 9 條 |
| — | 2022–2023 | PT Walsin Lippo Industries（Bekasi，鍍鋅鋼線、鋁桿與電纜）的 PROPER 評等被列為「暫緩」；依 Permen LHK 1/2021 第 37、41 條，暫緩代表有環境行政處分已交改善證明、但尚未撤銷。處分機關、日期、違反項目都沒有公開；2024-05-13 複查合規改評為藍，其他年度都是藍 | PT Walsin Lippo Industries（華新直接 70%，1991 合資設立）→ 1605 | enforcement | KLH SK.1353/2023、SK.1377/2023、SK 546/2024 | 待補：官方文件只證明「有處分」，看不到內容。要向 Bekasi 縣 DLH、西爪哇省 DLH 或 KLH 執法單位申請資訊公開，或查 Cikarang 地方法院 SIPP |

2026-10-21 另外用印尼文查過 Morowali（IMIP）與 Weda Bay（IWIP），並逐一核對使用者提供的 15 個來源（`docs/pollution-news-research/2026-10-21-walsin-morowali-id.md`、`2026-10-21-walsin-weda-bay-id.md`），沒有找到新的、點名華新子公司又符合門檻的事件。

不收：
- 園區層級的官方處分與稽查（第 3 節第 7 條）：KLH/BPLH 2025-05、2025-06 對 IMIP，只點名 PT IMIP、ITSS、ONI，「24 個租戶排放源未裝 CEMS」沒有寫是哪些租戶；SR.99 雖然寫到「PT Walcin」，只是描述地點，沒有歸責。KLH/BPLH 2025-07-12 對 IWIP 的稽查，只點名 IWIP、Huafei、Weda Bay Nickel。
- 沒有點名華新的研究與報導：Climate Rights International 兩份報告、Nexus3 血汞檢測（只在 IWIP 兩村）、Mongabay Indonesia 三篇、Komnas HAM 研究、Teluk Weda 廢水與 Lelilef 淹水的報導。
- Mongabay Indonesia 2024-12-12 Halmahera 呼吸道疾病增加：只把 Sunny Metal 列為電廠業主之一，沒有歸因，而且是單一媒體。
- 2023-12 青山集團 ITSS 爆炸（不是華新的設施）、2024-09 WNII 工人墜落死亡（純職災）、2020 Aosta 空品爭議（重要性低、單一來源）、Labota 與 Weda Bay 燃煤機組本身（屬能源使用，不是事件）。

結果：華新是**只有新聞**的公司頁。2026-10-21 上線 W1；2026-10-25 逐一查過中國 11 個、歐洲 10 個、墨西哥、馬來西亞據點，加上印尼補查，新增 W2–W6（查核紀錄：`docs/pollution-news-research/2026-10-25-walsin-china.md`、`2026-10-25-walsin-europe.md`、`2026-10-25-walsin-mexico-malaysia-indonesia.md`）。其餘據點在可公開查詢的官方管道都沒有找到紀錄；IPE 蔚藍地圖、信用中國要登入或瀏覽器驗證，沒有查。華新 2025 永續報告書揭露的環境罰款只有台南 2 件，屬國內，不收。

### 台積電 2330

| id | 期間 | 事件 | 營運實體 → 歸屬 | 類型／狀態 | 關鍵來源 | 門檻 |
|---|---|---|---|---|---|---|
| T1 | 2024-05-15，2024-11 開罰 | Phoenix 廠區外包槽車清運廢硫酸時過壓，艙蓋噴飛，司機死亡；ADOSH 對 TSMC Arizona 開罰 16,131 美元 | TSMC Arizona（100%，2020 設立）→ 2330 | industrial-accident（危險廢棄物）／penalized | VOA 2024-05-16、台灣英文新聞、ABC15 2024-11-08 | ✓；Phoenix 廠區 ECHO 設施 |
| T2 | 2024-12 起 | 熊本坪井川 PFBS、PFBA 濃度在 JASM 投產後上升，2025-05 起回落；JASM 社長證實排水含微量；2026-06 縣府表示不掌握第 2 工場 PFAS 排放量 | JASM（73%，2021 設立）→ 2330 | pollution-incident／ongoing | 熊本日日新聞（4 篇）、KAB 2026-06-11、Jiji（Adnkronos） | ✓ |
| — | 2023-06 | 管線工會 Local 469 業務主任指稱 Arizona 工地把氣體外洩說成槍擊演習而疏散 | TSMC Arizona | alleged | 原始出處 The American Prospect 2023-06-22；9to5Mac、台灣英文新聞只是轉述同一句話。另有《衛報》2023-08 報導另一項指控（工人頭頂噴防火化學品）。ADOSH 對 TSMC Arizona 的檢查（1637540.015，2022-11 至 2023-10）沒有違規 | 待補：氣體外洩說法只有一個來源（第 3 節第 1 條）。查證紀錄見 `docs/pollution-news-research/2026-10-22-tsmc-arizona-gas-leak-candidate.json` |

不收：台灣本地事件（2014 污泥委外傾倒、2021 乾旱用水、寶山／龍科／楠梓／沙崙環評、**2026-10-20 高雄楠梓 F22 工地 4 死事故**）；用水爭議（JASM 地下水、Arizona 用水與 NEPA 環評）；TSMC Washington 的 43 筆 ECHO 雨水許可違規（沒有新聞，違規分頁已經有）。

### 其他公司（海外官方資料庫比對，2026-10-25）

來自 `formosa-oversee/overseas-enforcement/`（repo 外）的海外裁罰資料管線：用台資子公司名單比對韓國環境資訊公開系統 env-info.kr 2021–2025 全庫（16,662 筆）與印尼 PROPER 各年度結果 SK（18,871 列），只收高信心、已用財報確認持股的命中。查證紀錄：`docs/pollution-news-research/2026-10-25-overseas-official-records.md`。

| id | 期間 | 事件 | 營運實體 → 歸屬 | 類型／狀態 | 關鍵來源 | 門檻 |
|---|---|---|---|---|---|---|
| O1 | 2021-05-13 | 坡州廠未填寫大氣排放設施運轉日誌（SEMS），處罰鍰（과태료），已繳納 | ASE (Korea) Inc.（100%，1999 向 Motorola 買下）→ 3711 | enforcement／penalized | env-info.kr 2021 年度申報（公司依法申報，未列機關、條文、金額） | ✓（公司文件） |
| O2 | 2023-03-17 – 03-22 | 京畿道認定坡州廠煙囪採樣口位置不合規（大氣環境保全法第 40 條）、特定有害物質排放設施變更未申報（第 23 條），兩次改善命令（警告） | ASE (Korea) Inc. → 3711 | enforcement／concluded | env-info.kr 2023 年度申報 | ✓（公司文件） |
| O3 | 2023-10-13 | 忠清南道認定天安廠排放設施變更未申報（大氣環境保全法第 23 條第 2 項），處罰鍰 | MEMC Korea Company → 環球晶 6488（100%）、中美晶 5483（46.64%，經環球晶）；2016-12 隨 SunEdison Semiconductor 收購 | enforcement／penalized | env-info.kr 2023 年度申報 | ✓（公司文件） |
| O4 | 2022-07 – 2024-06 | PROPER 2022–23、2023–24 兩期評為紅色（環境管理不符法規要求）；2022–23 經兩次更正仍維持；決定書沒有列出不合規項目 | PT Patec Presisi Engineering（100%，2022-01 前 70%；2006 投資）→ 2236 | enforcement／concluded | KLH SK.1353/2023、SK.1377/2023、SK.546/2024、SK.129/2025 | ✓（決策 29） |

不收（同一輪比對）：
- 華新力寶 PT Walsin Lippo Industries 2022–23 暫緩：見華新小節與決策 25。
- 豐泰 PT Feng Tay Indonesia Enterprises（2016–17 至 2023–24 藍）、華新 WNII 2023–24 藍：合規紀錄，沒有對應的指控或違規事件，不單獨成事件（WNII 的藍已掛在 W1）。
- 全宇生技-KY 子公司 Sabah Softwoods Hybrid Fertiliser ↔ 馬來西亞 DOE 2016、2017 起訴的 Sabah Softwoods Berhad：不同法人，持股關係查證中。
- 韓國 env-info.kr 2024、2025 年度：ASE Korea、MEMC Korea 的「환경관련 법규 위반 현황」都是空白（2026-10-25 查）。

### 試點規模

- 已上線：台塑集團 12 個（F1–F12，其中 F9 掛台塑化、台化、南亞、福懋，不掛台塑）、華新 1 個、台積電 2 個，共 15 個。2026-10-25 華新再加 W2–W6，共 20 個；同日加其他公司 O1–O4，共 24 個。O1–O4 新增 3 個只有新聞的公司頁：日月光投控 3711、中美晶 5483、百達-KY 2236（環球晶 6488 已有 EPA 公司頁）。
- F2–F4、F7、F8 掛在 1301 的依據：台塑**直接持有 FPC USA 22.66%**，屬權益法的關聯企業；2026-08-01 台塑工業美國併入後增為 24.82%（台塑 115Q2 合併財報、MOPS 重大訊息 2026-03-06 與 2026-10-12）。FPC USA 由台塑集團 1978 年設立，這些事件都在持有期間內。
- 各實體的 `controlSince` 都早於事件起始日，沒有因「收購前」被排除的事件。
- 會新增 4 個只有新聞的公司頁：

| 代號 | 公司 | 帶出它的事件 |
|---|---|---|
| 1605 | 華新麗華 | W1 |
| 1326 | 台化 | F5、F6；F9 補來源後也會掛 |
| 2002 | 中鋼 | F5、F6（持股 20.45%，剛好過線） |
| 1434 | 福懋 | F5、F6（持股只有 3.85%，靠集團規則掛上；卡片會標示比例） |

南亞 1303、台塑化 6505 已經有公司頁。

### 完成條件

- 標 ✓ 的事件都通過 `build-news.py` 驗證並上線（2026-10-21 上線 11 個，2026-10-22 補 4 個）；「待補」的不上線。
- 1301、1303、6505、2330 的公司頁顯示事件；1605、1326、2002、1434 產生只有新聞的公司頁，而且沒有會被誤讀成「乾淨」的 0。
- `npm run build` 通過，GitHub Pages 部署成功。
- `lib/api.js` 已刪除；`CLAUDE.md` 補上新聞管線與 `npm run news`。
- 第 8 節的 FPC USA 歸屬依據另外用一個 commit 更正。

## 8. 對既有資料的影響（順帶發現）

- **FPC USA 的歸屬依據要更正。** `resolve-ownership.py` 的 `CURATED` 與 `docs/enforcement-data-interface.md` 第 8 節寫「FPC USA 為私人持有、無上市公司持股路徑」，`responsible.kind` 是 `group-affiliate`。實際上台塑 1301 直接持有 22.66%（2026-08-01 起 24.82%），應改為 `listed`，依據引用台塑 115Q2 合併財報。網站上的呈現不變（仍掛 1301），但「集團關係企業（無持股路徑）」的標示是錯的。
- MOPS 2025Q2 快照有過時的持股，例如華新 Everising。`overseas-footprint.csv` 與 Notion 工廠清單也受影響，下次更新 MOPS 時一併重產。
- 華新在 MOPS 合併報表子公司檔只有 1 列，中國子公司全缺，`overseas-footprint.csv` 裡華新的中國據點因此不完整。

## 9. 之後再做

- 「採權益法投資」資料集：從各公司財報附註整理 20–50% 的關聯企業，讓 resolver 不必靠 `CURATED` 補關聯企業。
- 夥伴投稿：夥伴已在 Notion 國家認領表分工，之後可加 Notion 事件投稿表，定期匯出成 `news-events.json` 的 PR。
- 擴到全站 95 家，以及 `overseas-footprint.csv` 的 1,661 家母公司。
- 首頁、地圖呈現事件點位。
- 台灣本地事件要不要收，等境外資料量起來再決定。

## 10. 決策紀錄

| # | 問題 | 決定 | 理由 |
|---|---|---|---|
| 1 | 產出是什麼 | 填進網站公司頁，三家試點 | 分頁已存在但是空的；研究整理是副產品 |
| 2 | 新聞從哪來 | 沒有指定清單，以研究整理的事件為底稿 | 任務方若有指定清單，以清單為準補進來 |
| 3 | 只做三家還是試點 | 試點，格式可擴充 | 比照 supplement CSV：進 git、每筆附依據 |
| 4 | 收哪些地區 | 境外全收，台灣本地不收（**使用者確認 2026-10-21**） | 網站定位是台灣企業境外 |
| 5 | 怎樣算污染新聞 | 中等範圍（第 1 節） | 對準環境危害，排除公關與 ESG |
| 6 | 掛在哪家公司 | 依資金鏈規則；單一公司有效持股 ≥ 20%，或集團合計 ≥ 50% 且本身有持股，才上該公司頁（**研究後修正**） | 與 ECHO 設施歸屬一致；20% 避免小股東被掛上重大事件。原本只看單一公司，研究發現河靜鋼廠由台塑集團各公司分持 11.43%，會漏掉實際經營的集團 |
| 7 | 資料單位 | 事件，底下掛來源 | 見第 2 節 |
| 8 | 國際／國內兩區 | 取消，改成每個來源標媒體類別 | 原本的「國內」定義不清；標類別可看出台灣媒體有沒有報 |
| 9 | 華新麗華沒有公司頁 | 有事件的上市公司就產生公司頁 | 否則這次的任務對象之一無法呈現 |
| 10 | 收購前的事件 | 不收 | 與違規補充資料的規則一致 |
| 11 | 查證門檻 | 1 份官方／法院／公司文件，或 2 家獨立媒體 | 公開網站點名企業，要能經得起質疑 |
| 12 | 著作權 | 只存標題、媒體、日期、網址與自寫摘要 | repo 公開 |
| 13 | 舊假資料 | 刪除 | 沒在用、連結多為 `'#'`、內容未查證 |
| 14 | 維護方式 | 試點人工整理，經 PR 進 git | 投稿流程等試點後再設計 |
| 15 | 與 EPA／VT 紀錄的關係 | 能對上就用 `related` 互連，不合併計數 | 不同性質的量不加總 |
| 16 | 只有新聞的公司怎麼呈現空的 EPA 欄位 | 加 `inEpaData`，顯示「不在 EPA 資料範圍」而不是 0 | 0 筆違規會被讀成「這家很乾淨」，與事實不符 |
| 17 | 園區層級的處分 | 不掛到進駐廠商 | 印尼環境部只點名 IMIP 管理方，掛到華新等於替官方加罪名 |
| 18 | 倡議活動（記者會、抗議、NGO 報告） | 當作來源掛在被指控的事件下，不單獨成事件 | 避免同一爭議被算成多個事件；同時保留台灣媒體報導的訊號 |
| 19 | 工安事件的界線 | 有化學物質、危險廢棄物或污染物外洩才收 | 落實第 5 題的範圍；純職災不屬於污染 |
| 20 | 2026-10-20 台積電楠梓 F22 工地 4 死事故 | 不收（**使用者確認：國內都不用**） | 台灣本地，而且是純職災 |
| 21 | 關聯企業（20–50%）持股從哪來 | 試點寫進 `CURATED`，引用財報附註；之後建資料集 | MOPS 檔只有子公司，resolver 追不到 FHS、FPC USA 這類持股 |
| 22 | 卡片上的持股比例用哪種口徑 | 自身鏈，並註明不含集團交叉持股 | 穿透口徑會重複計入交叉持股，讀者難以理解 |
| 23 | FPC USA 的歸屬依據 | 由 `group-affiliate` 改成 `listed`（1301 直接持有 22.66%） | 財報顯示的事實；呈現不變，但依據要正確 |
| 24 | 福懋 1434 只持有 3.85%，要不要掛河靜鋼廠 | 掛，卡片標示比例 | 依集團規則一致處理；比例公開，讀者自行判斷 |
| 25 | 官方文件只證明「有處分」、看不到內容（Walsin Lippo 的 PROPER 暫緩） | 待補，不上線 | 不知道違反什麼就上線，卡片讀起來像沒有實證的指控；申請到處分內容再決定 |
| 26 | 被指控實體有官方合規紀錄（例：WNII 的 PROPER 藍） | 跟指控列在同一事件下 | 公開網站點名企業，要同時呈現對它有利的官方紀錄 |
| 27 | 早期事件用哪一年的持股判斷 | 持股用最新財報；收購前排除看集團取得控制的年份，卡片註明比例不一定是當時的 | 與 EPA 違規資料的歸屬一致；FPC USA 自 1978 年起由台塑集團控制，2005 年台塑本身只持 6% 不影響歸屬 |
| 28 | 多家媒體轉述同一位消息來源的說法，算幾個來源 | 算 1 個 | TSMC Arizona 氣體外洩說法：三家報導都引同一位工會人士的一句話，不算獨立查證 |
| 29 | PROPER 紅色（MERAH）沒有列出不合規項目，要不要上線（PT Patec Presisi，O4） | 上線，類型 enforcement／concluded；摘要寫 Permen LHK 1/2021 第 33 條第 2 項的定義、決定書沒有列出具體項目，以及該公司其他年度的評等（決策 26） | 與決策 25 不同：暫緩只證明「有處分」，看不到結論；紅色本身就是官方結論（環境管理不符法規要求），讀者看得到是誰、根據什麼法規做的判定 |
