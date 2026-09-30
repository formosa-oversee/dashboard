# Enforcement 資料接口設計：Violation Tracker 與 EPA ECHO 共存

狀態：草案 v2（2026-09-10）。已依 `violation-tracker-data-access.md` 研究結果更新欄位對應與取得路徑。

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
- 產出的靜態網站會公開整批紀錄，這已超出 internal use。**上線前必須取得 Good Jobs First 書面同意**，否則前端只呈現母公司頁連結與官方摘要數字（研究筆記建議 3）。

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
| `group-affiliate` | 集團關係企業，無上市公司持股路徑（例：FPC USA 台塑美國） | 是，以代表上市公司呈現並標示 |
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
| Formosa Plastics Corporation, Texas／U.S.A.／LA／DE 等 | 台塑 1301 | 台塑集團關係企業（無持股路徑） | FPC USA 為私人持有；台塑 1301 的美國子公司是 Formosa Industries Corp.，2026-08-01 併入 FPC USA |
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
