# formosa-oversee / dashboard

Next.js 14 靜態匯出的企業違規監測 dashboard。資料在 build 時由 CSV 轉成 `data/epa-data.json`，前端不打 API。

## 資料管線

- 來源：EPA ECHO（美國）CSV，存放於私有 GCS bucket `gs://epa_echo_data/`（GCP 專案 `formosa-oversee`）。
- `npm run download-epa` → 用 gcloud 下載到 `data/facilities.csv`、`data/violations.csv`。
- `npm run fetch-data` → `scripts/fetch-gcs-data.js` 轉成 `data/epa-data.json`。
- `npm run build` 會先跑 `fetch-data`。
- 公司主鍵是台灣上市公司代號（`companyCode`，如 1210），以投審會境外投資名稱模糊匹配到 EPA facility。
- `lib/api.js` 內仍有大量 mock data，`violations` / `enforcement` 陣列多為空。
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

- **不要寫任何繞過 Cloudflare 的爬蟲**抓 violationtracker.goodjobsfirst.org 或 Global 站。其 Terms of Service §5.2 明文禁止，見 `docs/violation-tracker-data-access.md` 第 5 節。
- 原始 CSV 由人工訂閱下載或向 Good Jobs First 申請，上傳到 `gs://epa_echo_data/violation-tracker/`，不進 git。
- 2026-09-10 的列表頁快照在 `data/violation-tracker/*.tsv`：US 版 `hq_id=Taiwan` 201 筆、Global `jurisdiction=Taiwan` 428 筆。透過使用者自己的 Chrome（claude-in-chrome 擴充）正常瀏覽讀取，未繞過任何阻擋。JavaScript 抓取的頁面有紀錄 slug，`get_page_text` 抓的只有純文字、無 slug（US p2–3、Global p4–5）。Global 分頁真實網址是 `/?jurisdiction_sum=Taiwan&page=N`，`/jurisdiction/Taiwan?page=N` 會被忽略。
- `node scripts/build-enforcement.js [YYYY-MM-DD]` 將快照轉成 `data/enforcement.json`。
- 母公司對照表 `data/company-mapping.json`（進 git）由 `npm run mapping:seed` 產生，依腳本內 `OVERRIDES`（人工確認）與 `FOREIGN`（外資母公司排除）決定。
- **資金鏈歸屬**：`npm run attribution`（resolve-ownership → build-enforcement → fetch-data）。`scripts/resolve-ownership.py` 把受罰實體沿 MOPS 子公司持股鏈追到負責的台灣母公司，輸出 `data/ownership-resolution.json`（進 git，只含實體名稱與持股鏈，不含 VT 金額）。規格見 `docs/enforcement-data-interface.md` 第 8 節。
- 新增或修改歸屬判斷時改 `resolve-ownership.py` 的 `CURATED`，每條都要在 `note` 寫依據（MOPS 節點、官方公告或新聞）。MOPS 檔案在 sibling repo `../scripts/mops_company`，可用 `MOPS_DIR` 覆寫。
- VT 衍生的筆數與金額只能留在 gitignored 檔案（`data/enforcement.json`、`data/violation-tracker/`、`data/company-mapping.seed.json`）；這個 repo 是公開的，push 到 main 會觸發 GitHub Pages 部署。
- **MOPS `mops_company_info.csv` 的「英文全稱」欄有整段錯一列的問題**（詳見 `docs/violation-tracker-data-access.md` 附錄）。做任何名稱匹配請用「英文簡稱」，或兩支腳本內已修正的英文全稱（以英文簡稱字首或縮寫字母順序判斷錯位），不要直接用原始「英文全稱」。
- 專案層 `.claude/settings.local.json` 允許 claude-in-chrome 工具，但 auto mode classifier 仍可能擋 `javascript_tool`，`get_page_text` 較穩定。
