# formosa-oversee / dashboard

Next.js 14 靜態匯出的企業違規監測 dashboard。資料在 build 時由 CSV 轉成 `data/epa-data.json`，前端不打 API。

## 資料管線

- 來源：EPA ECHO（美國）CSV，存放於私有 GCS bucket `gs://epa_echo_data/`（GCP 專案 `formosa-oversee`）。
- `npm run download-epa` → 用 gcloud 下載 `data/facilities.csv`。
- **水污染違規** `data/violations.csv`：`npm run water -- --dir=<全量檔目錄>`（`scripts/build-water-violations.py`）用 `facilities.csv` 的 NPDES 許可證從 EPA ICIS-NPDES 全量檔重建（2026-10-25 起，原本的 GCS 快照停在 2025-08）。`download-epa` 不再下載 GCS 的違規檔；重新下載 `facilities.csv` 後要再跑一次。規格見 `docs/enforcement-data-interface.md` 第 10 節。
- `npm run fetch-data` → `scripts/fetch-gcs-data.js` 轉成 `data/epa-data.json`。
- `npm run build` 會先跑 `fetch-data`。
- **補充資料**：`data/facilities-supplement.csv`、`data/violations-supplement.csv`（進 git，不在 GCS）由 `scripts/build-echo-supplement.py` 從 EPA ICIS-NPDES 全量檔產生，收 ECHO 覆蓋率稽核確認屬台灣母公司、但 GCS 原始 CSV 沒有的許可證；`fetch-gcs-data.js` 建置時合併。重新下載 GCS 資料不會蓋掉它們。新增工廠時改腳本內 `CONFIRMED`，每筆寫依據。
- **水污染以外的 EPA 紀錄**：`npm run programs -- --dir=<全量檔目錄>`（`scripts/build-echo-programs.py`）以我們設施的 NPDES 許可證在 ECHO Exporter 找到所屬廠區（FRS），取同廠區的空污（ICIS-Air）、有害廢棄物（RCRA）違規與處分、EPA 聯邦執法案件（ICIS FE&C），水污染的正式／非正式處分與罰款，以及 TRI／GHG 排放量 → `data/echo-programs.json`（進 git）。`fetch-gcs-data.js` 併進 `violations`，以 `program`（CWA／CAA／RCRA／FEC）區分。台灣母公司取得控制前的紀錄依腳本內 `CONTROL_SINCE` 排除，每筆寫依據（`violations.csv` 的水污染違規在建置時由 `fetch-gcs-data.js` 依同一份廠區日期排除）；沒有 NPDES 許可證的工廠加在 `EXTRA_SITES`；同一工廠在 FRS 的其他登記（溫室氣體申報、碼頭等）加在 `SAME_SITE`。查證後不歸台灣母公司的廠區或許可證列在 `NOT_OWNED`（同名誤配，或持證人是承包商、公用事業、地主；可寫 FRS REGISTRY_ID 或 NPDES 許可證號），建置時連設施與水污染違規一起拿掉，公司沒剩設施就整家不顯示，有污染事件或 VT 紀錄的改當成不在 EPA 資料裡的公司（2026-10-27 使用者決定；逐張查持證人的方法與結果見 `docs/echo-data-sources.md` 第 5 節）。全量檔用 `scripts/download-echo-sources.sh` 下載到 `formosa-oversee/epa-downloads/`（約 9GB，不進 git）。規格見 `docs/enforcement-data-interface.md` 第 9 節；ECHO Exporter 列到的每個 EPA 資料來源（FRS、AFS、ICIS-Air、NPDES、RCRA、SDWIS、TRI、GHGRP、FE&C、人口統計）的內容、我們廠區的覆蓋情形與已知缺口見 `docs/echo-data-sources.md`。
- 公司主鍵是台灣上市公司代號（`companyCode`，如 1210），以投審會境外投資名稱模糊匹配到 EPA facility。
- 原本的 mock data（`lib/api.js`）已於 2026-10-21 刪除。
- 研究筆記放在 `docs/`。資料模型接口見 `docs/enforcement-data-interface.md`。

## gcloud 認證（與其他專案隔離）

這台機器有多個 gcloud 帳號。本專案**不要**用 `gcloud config configurations activate` 切換全域設定，
一律透過環境變數指定具名 configuration `formosa`（綁定有 bucket 讀取權限的帳號、專案 `formosa-oversee`；帳號設定在本機 configuration，不寫進 repo）：

```bash
export CLOUDSDK_ACTIVE_CONFIG_NAME=formosa   # 只影響目前 shell
npm run gcloud:login                          # token 過期時重新登入（互動式，只能由人執行）
npm run gcloud:check                          # 確認能列出 bucket
npm run download-epa                          # 已內建該環境變數
```

- 設定檔在 `~/.config/gcloud/configurations/config_formosa`；credential 本身在同一個 gcloud 目錄內跨 configuration 共用，所以登入一次即可。
- 若需要完全獨立的 credential 目錄（例如 CI 或另一個人的機器），改用 `CLOUDSDK_CONFIG=~/.config/gcloud-formosa` 再 `gcloud auth login`。
- agent 遇到 `Reauthentication failed. cannot prompt during non-interactive execution` 時，請使用者執行 `npm run gcloud:login`，不要自行重試。

## Violation Tracker 資料規範

- **授權**：Good Jobs First 以書信同意本專案（非營利組織）使用 VT 資料（"Yes you're allow to use without profit"，使用者 2026-10-25 轉述）。VT 快照、`data/enforcement.json` 都進 git，公司頁「罰款紀錄」分頁公開顯示。網站上要標示來源（Violation Tracker, Good Jobs First）、快照日期與「經同意非營利使用」。不得用於營利。
- **不要寫任何繞過 Cloudflare 的爬蟲**抓 violationtracker.goodjobsfirst.org 或 Global 站。其 Terms of Service §5.2 明文禁止，見 `docs/violation-tracker-data-access.md` 第 5 節。授權只涵蓋使用資料，不涵蓋規避技術阻擋。
- 原始資料由人工瀏覽、訂閱下載或向 Good Jobs First 申請取得，放在 `data/violation-tracker/`。
- 列表頁快照在 `data/violation-tracker/`，三種各自取最新日期（`build-enforcement.js`、`resolve-ownership.py` 都這樣讀），都是透過使用者自己的 Chrome（claude-in-chrome 擴充）正常瀏覽讀取，未繞過任何阻擋：
  - US 版 `hq_id=Taiwan`：`<date>-us-hq-taiwan-p*.tsv`。2026-10-28 共 203 筆、每筆都有紀錄 slug（比 2026-09-10 的 201 筆多兩筆 Pioneer Electronics (USA)，VT 誤掛群創，`resolve-ownership.py` 改判為日本先鋒、不顯示）。
  - Global 版 `jurisdiction=Taiwan`（台灣國內案件，網站不顯示）：`2026-09-10-global-taiwan-p*.tsv` 428 筆，p4–p5 由 `get_page_text` 抓、無 slug。分頁真實網址是 `/?jurisdiction_sum=Taiwan&page=N`。
  - Global 版總部在台灣的母公司在台灣、美國以外的紀錄：`<date>-global-hq-taiwan-abroad.tsv`（多一欄 jurisdiction）。Global 的 HQ 國家查詢參數無效，改從 `/top-hq-parents` 的 Taiwan 段（38 家）逐一開 `/parent/{slug}`，記錄表有 Jurisdiction 欄。2026-10-28 共 28 筆（歐盟、南韓、中國、巴西、香港、英國、捷克、越南、義大利、印度、澳洲）。美國紀錄 US 版都有且較多，不重複收。
  - 抓法：`javascript_tool` 回傳約 1,000 字就截斷，且含 `?=&%` 的輸出會被擋。先把整頁列存進 `sessionStorage`、分段讀出，並在頁面上算 djb2 checksum，寫成檔後在本機重算比對（VT 的 `(*)` 後面是不換行空白 U+00A0）。
- `node scripts/build-enforcement.js [YYYY-MM-DD]` 將快照轉成 `data/enforcement.json`。每筆標 `shown`：要掛得到上市公司、不是國內案件（jurisdiction Taiwan，「國內都不用」）、不是台灣母公司取得控制前的罰款，才顯示在網站；不顯示的留在檔案裡，`hiddenReason` 說明原因。前端字典（違規類型中文、類別、機關名稱）在 `lib/enforcement.js`。
- 母公司對照表 `data/company-mapping.json`（進 git）由 `npm run mapping:seed` 產生，依腳本內 `OVERRIDES`（人工確認）與 `FOREIGN`（外資母公司排除）決定。
- **資金鏈歸屬**：`npm run attribution`（resolve-ownership → build-enforcement → build-company-info → fetch-data）。`scripts/resolve-ownership.py` 把受罰實體沿 MOPS 子公司持股鏈追到負責的台灣母公司，輸出 `data/ownership-resolution.json`（進 git，只含實體名稱與持股鏈，不含 VT 金額）。規格見 `docs/enforcement-data-interface.md` 第 8 節。
- 新增或修改歸屬判斷時改 `resolve-ownership.py` 的 `CURATED`，每條都要在 `note` 寫依據（MOPS 節點、官方公告或新聞）。MOPS 檔案在 sibling repo `../scripts/mops_company`，可用 `MOPS_DIR` 覆寫。
- **ECHO 覆蓋率稽核**：`npm run audit:echo -- --exporter=<echo_exporter.zip>` 找台灣母公司在美國但 `facilities.csv` 沒有的工廠（見 `docs/enforcement-data-interface.md` 第 8 節）。ECHO 查詢 API 會回 429 限流，不要逐一打 API，改下載 EPA 全量檔 `echo.epa.gov/files/echodownloads/echo_exporter.zip` 在本機比對。
- 這個 repo 是公開的，push 到 main 會觸發 GitHub Pages 部署。
- **MOPS `mops_company_info.csv` 的「英文全稱」欄有整段錯一列的問題**（詳見 `docs/violation-tracker-data-access.md` 附錄）。做任何名稱匹配請用「英文簡稱」，或兩支腳本內已修正的英文全稱（以英文簡稱字首或縮寫字母順序判斷錯位），不要直接用原始「英文全稱」。
- **污染事件**（公司頁「污染事件」分頁）：規格見 `docs/pollution-news-spec.md`。人工整理 `data/news-events.json`（每個事件附來源與封存網址）→ `npm run news`（`scripts/build-news.py` 驗證收錄門檻、依持股決定掛在哪些公司頁 → `data/news.json` → build-company-info → fetch-data）。兩個檔都進 git，CI 不需要 MOPS。研究與查證紀錄放 `docs/pollution-news-research/`。地圖頁 `/map` 的事件圖層讀 `news.json`（`getMapEvents`，元件 `components/MapEventLayer.js`），每個地點要有 `coordinates`；事件類型、狀態、精度的中文字典在 `lib/news-labels.js`，公司頁共用。
- **公司 logo**：只用 `data/company-logos.json` 列的檔案（`public/logos/<代號>.<副檔名>`），`fetch-gcs-data.js` 的 `attachLogos` 依它設定 `logoUrl`，沒列的留 null，前端顯示公司名稱。`facilities.csv` 的「LOGO網址」外連到圖片搜尋縮圖或第三方網站，有的失效或不是該公司，不再使用。2026-11-01 取得 92／98 家：
  - 來源先用公司官網（MOPS 公司網址）：讀過 robots，禁止的不抓。robots 對 `*` 允許、只點名禁止 ClaudeBot 等 AI 爬蟲的網站（Cloudflare 預設版），使用者 2026-11-01 同意用自報身分的 UA `FormosaOversee research (non-commercial)` 抓（長興、永記、正瀚），`note` 寫明。官網 robots 禁止或只有白字 logo 的，改用維基百科條目資訊框的檔案。
  - 每筆記 `source`（圖檔網址）、`page`、`method`、`note`。
  - SVG 一律轉成 PNG（高 240px）：外部 SVG 可能夾帶腳本，直接開檔會在本站網域執行。
  - 重抓用 `scripts/fetch-company-logos.py`，沒有獨立網址或需要轉檔的會跳過。
  - 新增公司要人工挑 logo 並核對畫面。
- **不在 EPA 資料裡的公司**：污染事件或 VT 紀錄掛到、但 `facilities.csv` 沒有的上市公司，由 `scripts/build-company-info.py`（`npm run company-info`）從 MOPS 補基本資料 → `data/company-info.json`（進 git）。這些公司 `inEpaData: false`，前端不顯示 0 筆違規。
- **海外據點清單**（美國以外的延伸準備）：`python3 scripts/build-overseas-footprint.py` 從 MOPS 2025Q2 產生 `data/overseas-footprint.csv`（每列一個國家／母公司／子公司）與 `data/overseas-countries.csv`（國家摘要，給夥伴認領去找當地的環保裁罰資料來源）。網站不讀這兩個檔。中國大陸子公司只能從合併報表子公司名稱推斷；「類型（推測）」是關鍵字推測，不是官方分類。
- 專案層 `.claude/settings.local.json` 允許 claude-in-chrome 工具，但 auto mode classifier 仍可能擋 `javascript_tool`，`get_page_text` 較穩定。

## 專題報導

- 路由 `/reports`（列表）與 `/reports/<slug>`（單篇）。清單與關聯在 `lib/reports.js`：`companies` 決定哪些公司頁掛專題卡，`relatedEventIds` 對應 `data/news-events.json` 的事件 id，公司頁的事件卡會連回專題。
- 內文在 `content/reports/<slug>.js`。`<Chapter>` 內的段落、清單、表格**逐字取自定稿，不改寫**；圖表、大事記、引言框、編按是網頁版加的，數字只能取自報告內文，例外要在程式註解寫依據。版面元件在 `components/report/`，主題色跟全站一樣用 Chakra green（`tokens.js`），水藍只給跟水有關的圖（`BarChart`／`Compare` 加 `tone="water"`）。圖表配色已用 dataviz `validate_palette.js` 驗證，改色要重驗；綠跟超標紅色盲難分，不要同圖並用。
- 第一篇 `kumamoto-jasm`（台積電進駐熊本田野調查，來源 `Report_中文_2026-10定稿.docx`）。docx 內含內部審稿留言，不要把 docx 放上網站。

## 關於我們與聯絡資訊

- `/about`（`pages/about.js`）的內容取自 Young飛全球行動計畫的「行動方案 3.0」與「行動方案 2.0 國際聯結行動成果」（團隊 Google Drive 的 `04_行動方案3.0` 資料夾）；數字由 `getSiteStats()`（`lib/gcs-api-server.js`）在 build 時計算，不手寫。
- IG、email、GitHub 等聯絡資訊集中在 `lib/site.js`，頁尾與關於我們共用。
- 首頁的專題輪播在 `components/report/ReportCarousel.js`（原生水平捲動加 scroll-snap，沒有用輪播套件）；地圖頁的劇院模式與全螢幕在 `pages/map.js`。
