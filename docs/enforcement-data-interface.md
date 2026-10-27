# Enforcement 資料接口設計：Violation Tracker 與 EPA ECHO 共存

狀態：草案 v2（2026-09-10）。已依 `violation-tracker-data-access.md` 研究結果更新欄位對應與取得路徑。

**2026-10-25 上線**：Good Jobs First 以書信同意本專案非營利使用 VT 資料，快照與 `data/enforcement.json` 改為進 git，公司頁新增「罰款紀錄」分頁（`#enforcement` 直接開啟）。實作與本草案的差異：
- 只顯示 `shown` 的紀錄：掛得到上市公司、不是國內案件（jurisdiction Taiwan）、不是收購前（`attribution.preAcquisition`）。2026-09-10 快照 629 筆中顯示 172 筆、19 家公司；不顯示的原因寫在 `hiddenReason`。
- 公司層彙總叫 `enforcementSummary`（`count`、`penaltyTotalUSD`、`latestYear`），不是 `summary`；`metadata.dataSources` 沒有做。
- 類別是依 Primary Offense 歸的七類（`lib/enforcement.js`），列表頁快照沒有 Offense Group 欄。
- 沒有紀錄頁 slug 的 101 筆（`get_page_text` 抓的頁）連到 VT 母公司頁。

## 1. 兩種資料的本質不同，分開存

| | EPA ECHO（現有 `violations`） | Violation Tracker（新增至 `enforcement`） |
|---|---|---|
| 粒度 | 設施（facility）層級 | 公司／母公司層級，有時附設施地點 |
| 內容 | 合規違規：排放超標、遲交報告、RNC 狀態 | 執法結果：罰款、和解、裁罰 |
| 罰款金額 | 沒有（`fine: 'N/A'`） | 有，且是核心欄位 |
| 機關 | 幾乎全是 EPA / 州環保機關 | 環保、勞動、消費者、金融等多種聯邦與州機關 |
| 主鍵 | `NPDES_VIOLATION_ID` | US 版：紀錄頁 slug（如 `tx-formosa-plastics-corporation-texas-17`）；Global：`VTG Record ID`（如 `VTG24-72849`） |
| 對到公司的方式 | 投審會名稱模糊匹配 → `公司代號` | VT `parent` 欄位 → 人工維護的對照表 → `公司代號` |

結論：**`violations` 維持 EPA ECHO 專用；`enforcement` 由 Violation Tracker 填入。** 兩個陣列各自有 `source` 欄位，前端用 `source` 決定呈現方式，未來加第三個來源（如台灣環境部裁處）也不必改結構。

## 2. `enforcement` 單筆記錄 schema

```js
{
  // 識別
  caseId: 'VT-tx-formosa-plastics-corporation-texas-17', // US 版：'VT-' + 紀錄頁 slug；Global：直接用 'VTG24-72849'
  source: 'Violation Tracker',    // 'Violation Tracker' | 'Violation Tracker Global'，與 violations[].source 同一組枚舉值
  sourceUrl: 'https://violationtracker.goodjobsfirst.org/violation-tracker/tx-formosa-plastics-corporation-texas-17',
  primarySourceUrl: 'https://www.tceq.texas.gov/...', // VT「Source of Data」（原始機關文件），署名與查證用
  archivedSourceUrl: 'https://web.archive.org/...',    // VT「Archived Source」，原始連結失效時的備援
  jurisdiction: 'United States',  // Global 才有；US 版固定 'United States'

  // 對應關係
  facilityId: null,               // 能對到 facilities[].facilityId 才填，否則 null
  companyNameInSource: 'Formosa Plastics Corporation, Texas', // VT「Company」原文
  parentInSource: 'Formosa Plastics',                 // VT「Current Parent Company」原文
  parentSlug: 'formosa-plastics',                     // VT /parent/{slug}，對照表的匹配鍵
  matchConfidence: 'manual',      // 'manual' | 'exact' | 'fuzzy'，與 facilities 的「匹配分數」概念對齊

  // 案件內容
  date: '2006-03-15',             // VT 紀錄頁同時有 Year 與 Date，優先取 Date；只有 Year 時填 'YYYY-01-01'
  datePrecision: 'day',           // 'day' | 'year'
  agency: 'Texas Commission on Environmental Quality', // VT 的 Agency 全名
  agencyCode: 'TX-ENV',           // VT 列表頁的機關代碼，方便篩選
  agencyLevel: 'state',           // 對應 VT「Level of Government」：'federal' | 'state' | 'local' | 'unknown'
  actionType: 'agency action',    // VT「Action Type」
  civilOrCriminal: 'civil',       // VT「Civil or Criminal Case」
  offenseGroup: 'environment-related offenses', // VT「Offense Group」原文
  offenseType: 'environmental violation',       // VT「Primary Offense」原文
  description: '',                // VT「Violation Description」，多數為空

  // 罰款（Global 有原幣別，US 版只有 USD；一律以 USD 欄位做加總）
  penaltyAmountUSD: 27634,        // number；Global 取「U.S. Dollar Equivalent at the Time of the Penalty Announcement」
  penaltyAmountOriginal: 27634,   // number；Global 取「Penalty Amount in Original Currency」
  penaltyCurrency: 'USD',         // Global 取「Penalty Currency」，如 'TWD'
  isDuplicateFlagged: false,      // VT 列表頁金額帶 (*) 表示與其他紀錄重複計算；summary 加總時排除

  // 呈現輔助（與 violations[].plantSite 同格式，讓廠區篩選器共用）
  facilityCity: 'Point Comfort',  // VT「Facility City」，可能為空
  facilityState: 'TX',            // VT「Facility State」
  plantSite: 'Point Comfort, TX'
}
```

設計取捨：
- **金額用 number 不用字串**，前端才能加總、排序；EPA 的 `fine: 'N/A'` 是歷史包袱，不沿用。
- **原文欄位保留**（`companyNameInSource`、`parentInSource`、`offenseGroup`），方便回溯與人工核對，翻譯留給前端字典。
- **`facilityId` 可為 null**。VT 多數記錄只有城市／州，強行對設施會製造假匹配。
- **`matchConfidence`** 明示這筆是怎麼對上公司的，dashboard 可以只顯示 manual/exact，fuzzy 留給審核。

## 3. 公司層級的變更

```js
{
  id: 'tw-1301',
  // ...現有欄位不變...
  violations: [ /* EPA ECHO，不變 */ ],
  enforcement: [ /* 上述 schema */ ],
  summary: {                       // 新增：build 時預先計算，列表頁直接用
    violationCount: 12,
    enforcementCount: 3,
    totalPenaltyUSD: 4200000,        // 只加 penaltyAmountUSD
    latestEnforcementDate: '2023-06-01'
  },
  metadata: {
    dataSources: [                 // 由單一 dataSource 字串改為陣列
      { name: 'EPA ECHO', lastUpdated: '2025-10-13T11:07:36Z' },
      { name: 'Violation Tracker', lastUpdated: '2026-09-10T00:00:00Z', snapshotFile: 'violation-tracker/2026-09-10-us-hq-taiwan.csv', license: 'Good Jobs First ToS, internal use' }
    ]
  }
}
```

`metadata.dataSource`（字串）保留一個 release 週期相容，前端改讀 `dataSources` 後移除。

## 4. 公司對照表 `data/company-mapping.json`

VT 公開頁面沒有 ticker、LEI、CIK 等識別碼，只有 Current Parent 名稱與 URL slug。**匹配單位是 parent slug，不是每筆的 Company 原文。** 台灣相關 parent 約 40 到 50 家，一次人工核對即可，之後只在 VT 新增母公司時補。

```json
[
  {
    "vtSlug": "formosa-plastics",
    "vtgSlug": "formosa-plastics",
    "companyCodes": ["1301", "1303", "1326", "6505"],
    "level": "group",
    "note": "VT 把台塑集團在美子公司統一掛在一個 parent 下；Global 另有獨立的 Nan Ya Plastics、Formosa Petrochemical，需分別對應"
  },
  { "vtSlug": "hon-hai-precision-industry", "vtgSlug": "hon-hai-precision-industry", "companyCodes": ["2317"], "level": "company", "note": "" }
]
```

- **一對多是常態**：VT 的 parent 是集團層，我們的主鍵是個別上市公司。`level: 'group'` 的紀錄在前端掛到集團下每家公司時，必須標示「集團層紀錄」，且 `summary.totalPenaltyUSD` 只在其中一家（`companyCodes[0]`）計入，避免同一筆罰款在列表頁被加總多次。
- US 版與 Global 的 slug 可能不同，分開存。
- 品質檢查：每個 slug 的 `/parent/{slug}` 頁「Headquartered in」應為 Taiwan，不是則寫進 note 說明為何納入（例如台資海外控股）。
- 對不上的 VT 記錄不丟棄，寫到 `data/violation-tracker/unmatched.json` 供人工補表。

## 5. 管線改動與資料取得路徑

研究結論：Violation Tracker 在 Cloudflare challenge 之後，Terms of Service §5.2 明文禁止規避技術阻擋的 scraping，且授權僅限 internal use。因此**不寫爬蟲**，原始資料改由人工取得：

| 路徑 | 適用 | 說明 |
|---|---|---|
| 訂閱後手動下載 CSV | US 版 `hq_id=Taiwan` 201 筆 | Tier 1（US$25/月）單次搜尋上限 1,000 筆，一次即可全拿 |
| 訂閱後手動下載 CSV | Global jurisdiction=Taiwan 428 筆、HQ=Taiwan 439 筆 | 需 Tier 2（US$45/月，500 筆／次）或拆多次搜尋；兩站各訂一個月合計約 US$70 |
| 寄信申請完整子集 | 兩站台灣相關全部 | 向 Good Jobs First 說明公益用途，同時確認署名與再發布條件 |

原始 CSV 是 Good Jobs First 的著作物，**不進公開 git repo**，放進與 EPA 相同的私有 GCS bucket，走既有的 gcloud 認證下載流程：

```
gs://epa_echo_data/violation-tracker/<date>-us-hq-taiwan.csv       # 手動下載後上傳
gs://epa_echo_data/violation-tracker/<date>-global-taiwan.csv

scripts/download-epa-data.js         # 修改：一併下載 violation-tracker/ 目錄到 data/violation-tracker/（.gitignore）
scripts/resolve-ownership.py         # 新增：受罰實體 → MOPS 持股鏈 → 負責的台灣母公司，輸出 data/ownership-resolution.json（進 git，見第 8 節）
scripts/build-enforcement.js         # 新增：讀快照 + ownership-resolution.json + company-mapping.json → data/enforcement.json（.gitignore）
scripts/fetch-gcs-data.js            # 修改：轉完 EPA 後，若 data/enforcement.json 存在則依 companyId 併入 enforcement[]，並計算 summary
```

- `npm run build` 不強制依賴 VT 資料；沒有 `enforcement.json` 就照舊產出，`enforcement` 為空陣列。
- 訂閱 CSV 的實際欄位清單尚未確認，`build-enforcement.js` 的欄位對應表寫成獨立常數，拿到檔案後只改一處。
- 產出的靜態網站會公開整批紀錄，這已超出 internal use。**上線前必須取得 Good Jobs First 書面同意**，否則前端只呈現母公司頁連結與官方摘要數字（研究筆記建議 3）。→ 2026-10-25 已取得書信同意（非營利使用），快照與 `enforcement.json` 改為進 git。

## 6. 前端接點

| 頁面 | 現況 | 變更 |
|---|---|---|
| `pages/companies/index.js` | 只顯示 `violationCount` | 加「罰款總額」欄，讀 `summary.totalPenaltyUSD` |
| `pages/companies/[id].js` | 只有違規表，`totalEnforcements` 僅計數 | 新增「執法與罰款」分頁；廠區篩選器同時套用到 `enforcement[].plantSite` |
| `pages/companies/[id]/facilities/[facilityId].js` | 以 `facilityId` 篩 `violations` | 同法篩 `enforcement`，`facilityId` 為 null 的不顯示在設施頁 |
| 兩張表的來源標示 | 無 | 每列顯示 `source` badge，並附 `sourceUrl` 連回原始紀錄（VT 授權若要求署名，這裡就是署名點） |

呈現原則：
- **不把 `violations` 與 `enforcement` 加總成單一「違規次數」**。ECHO 是設施層合規狀態（含未罰款、近即時），VT 是公司層已結案且罰款 ≥ US$5,000 的執法結果，兩者是不同的量。列表頁分兩欄：合規違規數、罰款總額。
- ECHO 用合規時間軸呈現，VT 用罰款事件卡片。
- 類別 badge 統一採 VT 的 Offense Group 九類；ECHO 全部歸 environment-related。
- 資料說明頁寫明兩來源的覆蓋邊界，避免「VT 沒紀錄」被讀成「沒違規」。
- 未來若把 ECHO 的 formal enforcement action 也放進 `enforcement[]`，以 `source: 'EPA ECHO'` 區分，並用 `primarySourceUrl` 或 registryId 與 VT 去重。

## 7. 研究結果已確認與仍待確認

已確認（見 `violation-tracker-data-access.md` 第 2、5 節）：
- 紀錄頁有完整 Date，`datePrecision` 預設 `'day'`。
- 有 Facility City / State / County，但沒有 EPA facility ID；`facilityId` 對應只能靠城市加州名對 `facilities[]`，預期多數為 null。紀錄頁另有「Link to ECHO」欄位，若 CSV 內含此欄可直接對到 ECHO facility。
- Global 有原幣別與 USD 等值兩組金額，schema 已分開存。
- 授權不允許快照進公開 repo，改走私有 GCS bucket。

仍待確認：
- 訂閱 CSV 的實際欄位名稱（決定 `build-enforcement.js` 的對應常數）。
- 「Link to ECHO」是否出現在 CSV 中。
- 對外公開整批紀錄的書面授權與署名格式。


## 8. 資金鏈歸屬：工廠 ↔ 公司 ↔ 控股（2026-09-30）

VT 的「Current Parent」與 ECHO 的名稱匹配都只到母公司層級，且有錯。`scripts/resolve-ownership.py` 把每個受罰實體沿公開資訊觀測站（MOPS）的子公司持股鏈往上追，找出實際出錢、負責的台灣母公司。

```bash
npm run attribution      # = resolve-ownership.py → build-enforcement.js → fetch-gcs-data.js
```

### 資料來源

| 來源 | 內容 |
|---|---|
| MOPS 海外轉投資（`oversea_subsidiaries_union.csv`） | 投資公司 → 海外子公司、持股比例 |
| MOPS 合併報表子公司（`subsidiaries_union.csv`） | 投資公司 → 子公司、持股比例、子公司若上市則有代號 |
| `data/facilities.csv` | ECHO 設施與既有的境外子公司匹配，提供英文名 ↔ 中文子公司的對照 |
| `resolve-ownership.py` 內 `CURATED` | 人工確認規則，每條都寫明依據；處理 MOPS 查不到的私人／國營母公司、合資、併購時點 |

MOPS 檔案放在 sibling repo `formosa-oversee/scripts/mops_company`，可用 `MOPS_DIR` 覆寫。產出的 `ownership-resolution.json` 進 git，所以 CI 建置不需要 MOPS。

### 解析順序

1. `CURATED` 人工規則。
2. `self`：實體就是上市公司本身，比對英文簡稱與修正錯位後的英文全稱。
3. `mops-*`：實體英文名對上 MOPS 子公司節點，或 ECHO 既有匹配的境外子公司，由持股圖算出路徑與有效持股（沿路相乘、多條路徑加總、上限 100%）。
4. `vt-parent-mapping`：只剩 VT 母公司層級對照，無路徑。
5. `foreign`：外資母公司、無台灣資金鏈。

### `responsible.kind`

| kind | 意義 | 是否掛到上市公司 |
|---|---|---|
| `listed` | 有上市公司持股鏈（或實體就是上市公司） | 是 |
| `group-affiliate` | 集團關係企業，無上市公司持股路徑（目前沒有實例；FPC USA 原歸此類，2026-10-21 更正為 `listed`，見下表） | 是，以代表上市公司呈現並標示 |
| `group-assumed` | 實體身分未能確認，暫依 VT 母公司 | 是，低信心 |
| `merger` | 因合併承繼（例：新光人壽 → 台新新光金） | 是 |
| `private` / `state-owned` | 台灣非上市母公司（豐群水產、台灣中油） | 否，另列 |
| `foreign` | 外資母公司 | 否 |

`controlSince` 是台灣母公司取得控制的年份，早於此年的紀錄在 `enforcement.json` 標 `attribution.preAcquisition = true`。前端呈現時應區分「收購前責任（承繼）」與「持有期間」，例如夏普 2016 年以前的 LCD 聯合行為罰款。

### 對 VT 母公司層級的更正

| VT 實體 | VT 母公司 | 資金鏈結果 | 依據 |
|---|---|---|---|
| Taiwan Semiconductor Corporation | 台積電 2330 | 台半 5425 | 台半利澤廠 2021 年水污罰 142.8 萬元與 VT 紀錄相符 |
| Formosa Plastics Biomedical Technology | 台塑 1301 | 台化 1326（88.59%） | MOPS：台化 → 台塑生醫 |
| Formosa Plastics Petrochemical | 台塑 1301 | 台塑化 6505 | 中文名「台塑石化」直譯 |
| Formosa Chemicals and Fibre | 台塑化 6505 | 台化 1326 | 台化為獨立上市公司 |
| Formosa Plastics Corporation, Texas／U.S.A.／LA／DE 等 | 台塑 1301 | 台塑 1301 的關聯企業（`curated-associate`，有效持股 24.82%） | 台塑 115Q2 合併財報：直接持有 FPC USA 22.66%（權益法）；台塑工業美國 2026-08-01 併入後增為 24.82%（MOPS 重大訊息 2026-10-12）。2026-09-30 版誤記為「私人持有、無持股路徑」，2026-10-21 更正 |
| Carrefour（家樂福台灣） | 外資 | 統一 1216（家福 100%，2023 起） | MOPS：統一企業 → 家福 |
| Philips & Lite-On Digital Solutions | 外資 | 光寶科 2301（100%） | MOPS：光寶科 → 飛利浦建興 |
| Nissan Taiwan | 外資 | 裕日車 2227 | 裕隆日產為 Nissan 在台代理 |
| Bumble Bee | （FCF 未上市） | 豐群水產（台灣私人），2020 起 | 列為台灣非上市母公司 |
| CPC Corporation, Taiwan CNPC | （未對照） | 台灣中油（國營） | 列為台灣非上市母公司 |

### ECHO 設施的 `ownership` 欄位

`fetch-gcs-data.js` 在每個 facility 加上 `ownership`（responsible、path、effectivePct、confidence、note）。既有的 ECHO 名稱匹配若在 MOPS 找不到持股路徑，會用「該公司有沒有美國子公司、名稱有沒有共同字」分級：

| confidence | 條件 |
|---|---|
| `high` | MOPS 有持股路徑，或設施就是上市公司本身 |
| `medium` | 有美國子公司且名稱有共同的非品牌字，或人工確認 |
| `weak` | 只有品牌字相同（例：DELTA GROUP ELECTRONICS 對台達電），美國可能有同名無關公司 |
| `unverified` | 美國子公司在 MOPS 只有中文名，無法比對 |
| `suspect` | MOPS 顯示該公司沒有美國子公司，或名稱毫無共同字（例：TO-FU RESTAURANT 對豆府、RIGHT OF WAY 對正道） |

2026-09-30 的結果：169 個設施中 30 個 `suspect`、17 個 `weak`；5,862 筆 ECHO 違規中有 1,420 筆落在 `suspect` 設施上，主要是榮運（821）、耿鼎（300）、豆府（248）。前端目前仍照舊顯示，是否隱藏或加註由產品決定。

這個分級只看名稱，`high` 也會錯。2026-10-27 改成逐張查許可證持證人，查證是誤配或持證人是承包商的都拿掉（第 9 節 `NOT_OWNED`），方法與結果見 `docs/echo-data-sources.md` 第 5 節。

### 核對狀態（2026-09-30）

自動檢查全部通過：

| 檢查 | 結果 |
|---|---|
| VT 紀錄有資金鏈歸屬 | 629 / 629 |
| ECHO 設施有 `ownership` | 196 / 196（含補充的 27 個許可證） |
| 持股比例超過 100%、未知公司代號、curated 節點找不到 | 0 |
| `CURATED` 規則從未命中 | 0 / 47 |
| production（formosaoversee.com）頁面資料含 `ownership` | 已確認 |

仍無法確認、維持低信心的項目：

- VT「Formosa Plastics Energy Technology」（14 筆空污）：中文實體未能確認。唯一名稱接近的台塑新智能科技 2022 年才成立，VT 紀錄始於 2011 年，所以維持集團層級。
- 國泰金 2882、第一金 2892 的 MOPS 子公司清單不完整：國泰世華、國泰人壽、第一銀行只有「作為投資人」的紀錄，持股比例未知；國泰產險不在清單中。
- VT 列表頁沒有「Parent at the Time of the Penalty」與「Link to ECHO」欄位，收購時點靠公開資訊人工判定，案件層級無法與 ECHO 一對一對應。

### ECHO 覆蓋率稽核：台灣母公司的美國工廠有沒有漏

`scripts/audit-echo-coverage.py` 反過來檢查：從 MOPS 取出所有台灣上市公司的美國子公司（1,072 個英文名），加上已確認的集團關係企業（FPC USA、Formosa Industries、FG LA、夏普美國），在 EPA ECHO 全部設施中比對名稱，列出 `data/facilities.csv` 沒有的工廠。

```bash
curl -o /tmp/echo_exporter.zip https://echo.epa.gov/files/echodownloads/echo_exporter.zip   # EPA 全量設施檔，約 440MB，不進 git
npm run audit:echo -- --exporter=/tmp/echo_exporter.zip                                     # 本機比對，約 1 分鐘
```

ECHO 的查詢 API 會限流（HTTP 429），逐一查 700 個名稱不可行，所以改用全量檔。精準度規則：搜尋詞要含全美設施名中罕見的字，且命中不超過 40 個設施；比對到的設施再以 NPDES 許可證判斷「完整／部分／完全沒有」涵蓋。結果在 `data/echo-coverage-audit.json`，是候選清單，須人工確認。

2026-09-30 結果：566 個候選設施，31 個完整涵蓋、16 個部分涵蓋、519 個不在我們資料中（多數沒有任何違規紀錄）。有違規或罰款紀錄、且確認屬台灣母公司的缺漏：

| 工廠 | 台灣母公司 | 涵蓋 | ECHO 紀錄 | 缺的許可證 |
|---|---|---|---|---|
| FPC Texas，Point Comfort TX | 台塑集團關係企業（1301 代表） | 部分 | 12 季不合規、6 次罰款、US$3,655,889 | TX0085570（主廠排放許可）、TXR15285Z |
| Continental Carbon，Ponca City OK | 國際中橡 2104（66.67%） | 完全沒有 | 4 季不合規、2 次罰款、US$71,600 | 無 NPDES，屬空污／廢棄物 |
| Continental Carbon，Sunray TX | 國際中橡 2104 | 部分 | 4 季不合規、1 次罰款、US$9,300 | TXR05EU88 |
| Ocean Alexander Marine Center，Seattle WA | 東哥 8478 | 部分 | 12 季不合規 | WAG030060 |
| EMD Specialty Materials（Arlon EMD），Rancho Cucamonga CA | 台光電 2383 | 完全沒有 | 10 季不合規 | CAZ469513 |
| Test Rite Product Corp，Ontario CA | 特力 2908 | 完全沒有 | 10 季不合規 | CAZ494423 |
| Tulex Pharmaceuticals，Cranbury NJ | 易威 1799 | 完全沒有 | 2 季不合規 | 無 NPDES |
| TSMC Arizona Corporation，Phoenix AZ | 台積電 2330 | 部分 | 1 季不合規 | AZC112964 等工地雨水許可 |

另外 FG LA（台塑化 6505 經 FG INC. 持股 57%，路易斯安那 St. James「Sunshine Project」）有 3 張工地雨水許可、目前沒有違規，也不在我們資料中。

同名誤配、不是缺漏：Barrette Outdoor Living（對新麗 9944 的 American Outdoor Living）、Mira Mobile Home Community（對泰金 6629 的 Mira Home）。

#### 已補進網站（2026-09-30）

確認屬台灣母公司的許可證，由 `scripts/build-echo-supplement.py` 從 EPA ICIS-NPDES 全量檔（`npdes_downloads.zip`、放流水超標 `npdes_eff_downloads.zip`）取出設施與違規，寫入 `data/facilities-supplement.csv`、`data/violations-supplement.csv`（進 git），建置時合併。GCS 的原始 CSV 不動。

```bash
npm run supplement -- --npdes=/tmp/npdes_downloads.zip --eff=/tmp/npdes_eff_downloads.zip
npm run attribution
```

| 台灣母公司 | 補進的工廠 | 許可證 | 補進違規 |
|---|---|---|---|
| 台塑集團關係企業（1301 代表） | FPC Texas Point Comfort 主廠、鐵路調車場 | TX0085570、TXR15285Z、TXR05GN80、TXR1575HM | 626（1987–2025） |
| 台塑化 6505（新公司頁） | FG LA，St. James Sunshine Project | LAR10N958、LAR10N960 | 0 |
| 國際中橡 2104 | Continental Carbon Sunray、Phenix City | TXR05EU88、ALD000238、ALU011379 | 0 |
| 台光電 2383（新公司頁） | Arlon EMD，Rancho Cucamonga | CAZ469513 | 1 |
| 特力 2908（新公司頁） | Test Rite，Ontario CA、Oakwood GA | CAZ494423、GAR1544B7 | 2 |
| 台積電 2330 | TSMC Arizona 工地與辦公區 | AZC112312、AZC112964、AZC113138、AZC113140、AZC113891 | 0 |
| 大成不銹鋼 2027 | TCI Texarkana、Primus Pipe and Tube | TX0097055、TXR1533GK、FLR10SJ36 | 2 |
| 其他既有公司 | 保瑞 Upsher-Smith、力山 Power Tool Specialists、美食-KY 85°C、長榮 Everport、大成 Amy Food、鴻海 Sharp Memphis | 各 1–2 張 | 3 |

合計補進 27 個許可證、634 筆違規；網站由 92 家公司、169 個設施、5,862 筆違規，變成 95 家、196 個設施、6,496 筆。補完後重跑稽核：完整涵蓋由 31 個升到 50 個，部分涵蓋由 16 個降到 4 個。

**2026-10-27 更正**：逐張查持證人後，上表有 9 張拿掉。台積電 5 張、特力 GAR1544B7、TCI TXR1533GK、Primus FLR10SJ36 的持證人是承包商或開發商；力山 CAZ513140（Air & Power Tool Specialists，Artesia CA）是同名誤配，力山的 Power Tool Specialists 在北卡。見 `docs/echo-data-sources.md` 第 5 節。

控制時點：TCI Texarkana 是 2018-10 向 Arconic 買下，TX0097055 在 2000–2010 年的 556 筆違規屬前業主（Alcoa／Arconic），不納入；夏普美國以 2016 年為起點。

刻意不納入：

| 候選 | 原因 |
|---|---|
| SCR000483 南亞南卡 | 已在 GCS 原始資料，許可證號被轉成「SCR 483.00」所以稽核沒認出 |
| WAG030060「MORRIS & CO DBA OCEAN ALEXANDER」 | 同品牌經銷商，與東哥的持股關係未能確認 |
| TXR05M678「ALUMAX MILL PRODUCTS」 | 前業主名下的許可證 |
| LAR10O047 Bo-Mac Contractors | FG LA 工程承包商的許可證，不是工廠本身 |
| Continental Carbon Ponca City OK、Tulex Pharmaceuticals NJ | 沒有 NPDES 許可證，違規屬空污／其他法規，當時網站只收水污違規。Ponca City 已於 2026-10-25 以第 9 節的 `EXTRA_SITES` 補進；Tulex 只有 2 季廢棄物不合規，易威 1799 還沒有公司頁，暫不納入 |
| Barrette Outdoor Living、Mira Mobile Home Community、Chroma Corp（IL） | 同名誤配 |


## 9. 水污染以外的 EPA 紀錄：空污、有害廢棄物、聯邦執法案件（2026-10-25）

`data/violations.csv` 與補充資料只有 ICIS-NPDES 的水污染違規（第 10 節）。`scripts/build-echo-programs.py` 把同一廠區在其他法規下的紀錄，以及水污染的處分與罰款補進來。

```bash
scripts/download-echo-sources.sh                 # → ../epa-downloads（約 9GB，不進 git）；這支只需要其中 5 個檔
npm run programs -- --dir=../epa-downloads       # → data/echo-programs.json（進 git），約 1 分鐘
npm run fetch-data
```

其他 EPA 來源（AFS、SDWIS、TRI 年度檔、GHGRP、人口統計等）的確認結果與缺口見 `docs/echo-data-sources.md`。

### 怎麼對到廠區

EPA 的 FRS（Facility Registry Service）替每個實體廠區配一個 `REGISTRY_ID`，ECHO Exporter 每列一個廠區，列出它在各法規下的許可證或登記編號（`NPDES_IDS`、`AIR_IDS`、`RCRA_IDS`、`TRI_IDS`、`GHG_IDS`）。

1. 我們 196 個設施的 NPDES 許可證，在 Exporter 全部對得到，共 165 個廠區。一個廠區常有好幾張 NPDES 許可證，例如 FPC Texas 有主廠排放許可和兩張雨水許可。
2. 用廠區的空污編號到 ICIS-Air、廢棄物編號到 RCRAInfo、`REGISTRY_ID` 到 ICIS FE&C 案件檔、我們的 NPDES 許可證到 ICIS-NPDES 處分檔取逐筆紀錄。
3. 空污、廢棄物是廠區層級的紀錄，掛在主要設施，也就是個別許可證優先於通用許可證的那一個，避免同一筆在公司頁算好幾次。水污染處分是許可證層級的，掛在該許可證的設施（`facilityId`）。
4. 沒有 NPDES 許可證的台灣母公司工廠，以前因為網站只收水污而沒有納入，列在 `EXTRA_SITES`，用 `REGISTRY_ID` 當設施編號另建設施，持股鏈沿用同一子公司的既有設施。目前有 Continental Carbon Ponca City OK（國際中橡 2104），以及 2026-10-27 補進的 E Ink Fremont CA（元太 8069）、Upsher-Smith Maple Grove 與 Plymouth MN（保瑞 6472）。
5. 同一座工廠在 FRS 常有好幾個登記：名稱、地址寫法不同就分開建檔，例如溫室氣體申報、碼頭、同廠區另一棟建物。查到的列在 `SAME_SITE`，以 Exporter 的地址、座標確認屬同一工廠後，把它們的空污、廢棄物、TRI、GHG 編號與排放量併進我們的廠區，聯邦案件也以這些 `REGISTRY_ID` 對。廠區輸出 `relatedRegistries` 記併入了哪些登記。排放量是各登記最近申報年度的數字，編號不重複才加總。

### 收錄的紀錄

| `program` | 來源檔 | `kind` | 內容 |
|---|---|---|---|
| `CAA` | `ICIS-AIR_VIOLATION_HISTORY` | `violation` | 高優先違規（HPV）與聯邦應報違規（FRV），含污染物、解除日期 |
| `CAA` | `ICIS-AIR_STACK_TESTS` | `stack-test` | 只收結果為 Fail 的煙道排放檢測 |
| `CAA` | `ICIS-AIR_INFORMAL_ACTIONS` | `informal` | 違規通知（NOV）、警告信 |
| `CAA` | `ICIS-AIR_FORMAL_ACTIONS` | `formal` | 行政命令、司法案件，含罰款 |
| `RCRA` | `RCRA_VIOLATIONS` | `violation` | 違反的條文、認定日期、回復合規日期 |
| `RCRA` | `RCRA_ENFORCEMENTS` | `informal`／`formal` | 處分類型代碼第 3 碼是 1 的是非正式，其餘是正式；罰款取 `FMP_AMOUNT`（最終罰款） |
| `CWA` | `NPDES_FORMAL_ENFORCEMENT_ACTIONS` | `formal` | 行政命令（EPA 309 條命令、州的罰款／非罰款命令、同意令）、司法案件；罰款是聯邦與州／地方合計 |
| `CWA` | `NPDES_INFORMAL_ENFORCEMENT_ACTIONS` | `informal` | 只收 `OFFICIAL_FLG=Y`：警告信、違規通知、不合規通知。`N` 是電話／email、內部審查、「無須處理」等，不是對業者的處分 |
| `FEC` | `CASE_*` | `case` | EPA 主辦的聯邦案件，跨 CAA、RCRA、CWA、EPCRA、TSCA 等法規；罰款是各結案的聯邦與州／地方罰款合計 |

另外每個廠區記 TRI 有毒化學物質廠內排放量（磅）、TRI 排放與移轉總量、GHG 溫室氣體排放量（公噸 CO₂e），都是 Exporter 的最近申報年度數字，顯示在設施頁。

去重：ICIS-Air 處分檔同一處分每個適用計畫各一列，只算一筆；RCRA 違規檔同一天同一條文的多列無法區分，也只算一筆；NPDES 同一封警告信寄給同廠區好幾張許可證時各一列，只算一筆。EPA 主辦的空污、水污處分同時出現在 ICIS-Air／ICIS-NPDES 與 FE&C 時，案件號相同，保留 FE&C 那筆（`duplicateOf: 'FEC'`，前端不顯示）。目前水污有一筆：FPC 的 06-2006-3410 多媒體同意令（US$280 萬）。

### 前端

`fetch-gcs-data.js` 的 `attachEchoPrograms` 把紀錄併進 `violations`，`violations.csv` 的水污染違規標 `program: 'CWA'`、沒有 `kind`；水污染處分也是 `CWA`，`kind` 是 `formal`／`informal`。公司頁「環境違規記錄」分頁多了類別篩選（水污染／空氣污染／有害廢棄物／EPA 執法案件）、類別欄、罰款欄，案件編號連到 EPA 設施報告或案件報告。設施的 `programs` 旗標依廠區實際登記設定，設施頁顯示 TRI／GHG 排放量與 EPA 設施報告連結。

呈現原則沿用第 6 節：

- 違規認定與處分常是同一件事的不同階段，筆數不等於違規次數。
- 這些罰款與 Violation Tracker 的罰款大量重疊（VT 的環境類紀錄多半就是從 ECHO 來的），公司頁只在違規分頁內顯示「EPA 紀錄中的罰款合計」，不加進列表頁的罰款總額。
- 歸屬信心沿用設施的 `ownership.confidence`，`suspect`／`weak` 設施的空污、廢棄物紀錄照樣顯示（2026-09-30 的決定）。

### 取得控制前的紀錄

和 VT 的 `controlSince`、補充資料的 `CONFIRMED` 年份同一原則：台灣母公司取得控制以前的紀錄屬前業主，不納入。年份來源依序是 `build-echo-supplement.py` 的 `CONFIRMED`、`ownership-resolution.json` 的 `controlSince`、本腳本的 `CONTROL_SINCE`（每筆寫依據）。沒有日期的紀錄無法判斷，保留。

`echo-programs.json` 的紀錄由本腳本排除。`violations.csv` 的水污染違規保留原樣，建置時 `fetch-gcs-data.js` 用輸出廠區的 `controlSince` 排除（同一設施在幾個廠區時取最晚的日期），所以有 `controlSince` 的廠區即使沒有其他紀錄也會輸出。

2026-10-25 對所有有空污或廢棄物紀錄的廠區逐一查證取得控制的日期（年報、SEC 文件、官方公告、CSB 報告），依據寫在 `CONTROL_SINCE`。同一天第二批查了只有水污染違規、可能是收購來的高信心匹配：Corpus Christi Polymers 要排除；東哥 Pacific Coast Yachting Seattle（集團最晚 2015-07 起使用此址）、榮剛 Alloy Tool Steel（2010 收購）、寶綠特 Stockton（2013 自設）、大成 Primus Pipe and Tube Wildwood（2017-08-01 收購）的違規都在取得控制之後，日期照樣記在 `CONTROL_SINCE`；其餘四個是同名誤配（見下）。排除的筆數如下：

「其他紀錄」是 `echo-programs.json` 的空污、廢棄物、水污處分與聯邦案件，「水污染違規」是 `violations.csv` 在建置時排除的筆數。TCI Texarkana 另有 556 筆 2000–2010 年的水污染違規，`build-echo-supplement.py` 產生補充資料時就沒有收。

| 廠區 | 台灣母公司取得控制 | 前業主 | 其他紀錄 | 水污染違規 |
|---|---|---|---|---|
| Bristol Metals，Bristol TN（大成不銹鋼 2027） | 2025-04-04 | Ascent Industries（前 Synalloy） | 90 筆，全部 | — |
| Corpus Christi Polymers，Corpus Christi TX（遠東新 1402，持股 1/3） | 2018-12-28 | M&G USA（破產） | — | 204 筆，全部 |
| MEMC，O'Fallon MO（環球晶 6488） | 2016-12-02 | SunEdison Semiconductor | 46 筆，全部 | 154 筆 |
| FPC Illiopolis IL（台塑 1301） | 2002-04 | Borden Chemicals and Plastics | 39 筆 | 6 筆 |
| KEMET，Simpsonville SC（國巨 2327） | 2020-06-15 | — | 25 筆 | — |
| TCI Texarkana TX（大成不銹鋼 2027） | 2018 | Arconic | 19 筆 | （補充資料已排除 556 筆） |
| Upsher-Smith，Denver CO（保瑞 6472） | 2024-04-01 | Sawai | 15 筆，全部 | — |
| APG Polytech，Apple Grove WV（遠東新 1402） | 2018-03-01 | M&G Polymers USA | 39 筆，全部 | 123 筆 |
| Arlon EMD，Rancho Cucamonga CA（台光電 2383） | 2021-01-18 | CriticalPoint Capital | 5 筆，全部 | — |
| 宏遠美國，Forest City NC（宏遠 1460） | 2016-10 | 不明的前一位使用者 | 4 筆，全部 | — |
| Continental Carbon Phenix City AL、Ponca City OK（國際中橡 2104） | 1995 | Witco | 各 3 筆 | — |
| FPC Baton Rouge LA（台塑 1301） | 1981 | ICI 子公司 | 2 筆 | — |
| Continental Coatings，Fontana CA（永記 1726） | 2012-11 | 不明 | 2 筆 | — |
| FS Precision Tech，Compton CA（復盛應用 6670） | 2004-09 | Coastcast | 1 筆 | — |
| Upsher-Smith，Plymouth MN（保瑞 6472，2026-10-27 補進） | 2024-04-01 | Sawai | 13 筆 | — |
| Sharp Manufacturing，Memphis TN（鴻海 2317） | 2016-08-12 | 夏普（鴻海入股前） | 6 筆 | — |
| E Ink，Fremont CA（元太 8069，2026-10-27 補進） | 2012-11 | SiPix Imaging | 2 筆 | — |
| Upsher-Smith，Maple Grove MN（保瑞 6472，2026-10-27 補進） | 2024-04-01 | Sawai | 1 筆 | — |

另外查到七個既有 ECHO 匹配是同名誤配，不是台灣母公司的工廠，列在 `NOT_OWNED`，不掛任何空污、廢棄物紀錄與水污處分（後四個是第二批查到的）：

| 廠區 | 被匹配到的公司 | 實際 |
|---|---|---|
| Everbrite LLC，Buena Vista VA | 永彰 4523（英文名 Everbrite Technology） | 威斯康辛的招牌廠；永彰 2023 年報沒有美國子公司 |
| Solomon Corporation，Decatur TN | 所羅門 2359 | 所羅門唯一的美國子公司是 2019 年在加州設立的 Solomon Technology (USA) |
| Chroma Corp，McHenry IL | 致茂 2360 | 伊利諾州的色母粒廠，2018 年併入 Carolina Color；致茂的美國子公司都在加州 |
| VISCO, Inc.，Eugene OR | 視陽 6782 | 1947 年在奧勒岡登記的建築金屬加工廠；視陽是隱形眼鏡廠，沒有美國子公司 |
| Standard Foods Inc，Louisville KY | 佳格 1227 | 1937 年創立的肉品冷凍食品廠，後改名 Culinary Standards；佳格的美國子公司是 Standard Foods, LLC |
| Beeline Facility，Scottsdale AZ | 裕慶 6957 | 原住民族企業 Salt River Sand and Rock 的砂石場，Beeline 是公路名；裕慶的 Beeline Corp. 在伊利諾州 |
| AMA Facility，Ama LA | 宇瞻 8271 | ADM Grain 的穀物設施，Ama 是地名；宇瞻的 AMA 是 Apacer Memory America |

**2026-10-27 決定拿掉**：這七個設施連同水污染違規都不再顯示，被拿掉的水污染違規有 VISCO 261 筆、AMA 26 筆、Beeline 6 筆、Standard Foods 5 筆、Solomon 5 筆，Everbrite 與 Chroma 原本就沒有。`echo-programs.json` 的 `excludedSites` 帶各廠區的設施編號，建置時 `fetch-gcs-data.js` 的 `removeNotOwnedSites` 依此拿掉設施與違規。`facilities.csv`、`violations.csv` 保留原樣，重新下載也不受影響。

視陽 6782、宇瞻 8271、佳格 1227、所羅門 2359、永彰 4523、致茂 2360 的 EPA 設施只有這一個，整家公司從網站拿掉；它們沒有污染事件或 VT 紀錄，之後若有，要讓 `build-company-info.py` 把它們當成不在 EPA 資料裡的公司另建。裕慶 6957 還有 7 個 HORIZON 設施（`suspect`），當時照 2026-09-30 的決定繼續顯示。

**2026-10-27 第二批**：同一天稍後逐張查網站上所有設施的許可證持證人（`docs/echo-data-sources.md` 第 5 節），再拿掉 98 張許可證的設施（同名誤配 76 張；持證人是承包商、公用事業或地主 22 張），`build-echo-supplement.py` 也拿掉 9 張（承包商 8 張、誤配 1 張）。網站設施由 199 個減為 92 個、紀錄少 1,639 筆，46 家公司的設施全是誤配而拿掉。`NOT_OWNED` 除了 FRS REGISTRY_ID，也可以寫 NPDES 許可證號，只拿掉那張許可證的設施；`excludedSites` 的這類項目帶 `npdesId`。設施全被拿掉、但有污染事件或 VT 紀錄的公司（華碩 2357、長榮航 2618），`build-company-info.py` 改當成不在 EPA 資料裡的公司。

## 10. 水污染違規改由 EPA 全量檔重建（2026-10-25）

`data/violations.csv` 原本是 GCS 上的匹配快照（`comprehensive_violations_full.csv`），最新只到 2025-08-31，之後 EPA 刪改的紀錄也沒有跟上。現在改由 `scripts/build-water-violations.py` 用同一批設施（`data/facilities.csv` 的 169 張 NPDES 許可證）到 ICIS-NPDES 全量檔重取四類違規。欄位與原檔相同，公司、設施欄位照 `facilities.csv`，違規欄位照全量檔原值，`fetch-gcs-data.js` 照舊讀。

```bash
scripts/download-echo-sources.sh                                   # npdes_downloads.zip、npdes_eff_downloads.zip
npm run programs -- --dir=../epa-downloads                         # 水污處分、各廠區 controlSince
npm run supplement -- --npdes=../epa-downloads/npdes_downloads.zip --eff=../epa-downloads/npdes_eff_downloads.zip
npm run water -- --dir=../epa-downloads                            # → data/violations.csv，約 2 分鐘
npm run fetch-data
```

- `npm run download-epa` 不再下載 GCS 的違規檔，以免蓋掉；重新下載 `facilities.csv` 後要再跑 `npm run water`。
- 補充資料的許可證（`facilities-supplement.csv`）仍由 `build-echo-supplement.py` 產生違規，兩支都要跑。
- 台灣母公司取得控制前的紀錄不在這裡刪，見第 9 節「取得控制前的紀錄」。

2026-10-25 第一次重建（EPA 2026-10 全量檔，放流水最新監測期 2026-08-31）：

| | 筆數 |
|---|---|
| 舊快照 | 5,862 |
| 重建後 | 6,319（放流水超標 6,171、單一事件 71、遵循時程 44、許可時程 33） |
| 新增 | 469，多數是 2021–2026 年的放流水超標 |
| 舊快照有、全量檔已無（EPA 刪除或更正） | 12，APG Polytech 6、FPC Baton Rouge 3、其他 3 |
| 兩邊都有、內容更新 | 改善狀態 135 筆、改善日期 154 筆 |

補充資料重建後 635 筆，多 1 筆單一事件違規。建置時再排除取得控制前的 487 筆後（Corpus Christi Polymers 204、MEMC 154、APG Polytech 123、FPC Illiopolis 6），網站的水污染違規是 6,467 筆，另有水污處分 171 筆（正式 44、非正式 127），有罰款的 9 筆合計 US$1,063,654（不含已列在聯邦案件的 06-2006-3410）。
