# 緯創印度廠未取得環境許可就完成擴建的處分，以及印度、墨西哥、巴西的查找範圍（2026-10-30）

spec 第 7 節「其他公司」O19 的查證紀錄，附同一輪查過但沒有收的來源。

## 查了哪些來源

印度：
- 各邦污染控制委員會（坦米爾納德、卡納塔克、安得拉、特倫甘納、北方邦、古吉拉特）從台灣逾時、連線重置或拒絕，判斷是地域封鎖，沒有繞過。馬哈拉施特拉、哈里亞納連得到，但台資廠在這兩邦很少，只確認連線。
- 中央污染控制委員會（cpcb.gov.in）robots `Disallow: /`（只開放 `/web/`），不抓。
- 國家綠色法庭（greentribunal.gov.in）的裁判查詢要驗證碼，不碰。
- parivesh.nic.in 拒絕連線。
- 環境部舊環評系統 environmentclearance.nic.in 的 robots 是 `Allow: /`，可以用。各邦專家評估委員會（SEAC）的會議紀錄與環境部的辦公室備忘錄都在這裡。O19 就出自這裡。

墨西哥、巴西：
- 墨西哥環保署 PROFEPA 新聞稿（gob.mx，robots 沒有禁止）：2016-06 到 2026-10 的標題索引 5,742 篇，篩出可能與污染有關的 1,558 篇，抓到內文 1,540 篇。用 192 家墨西哥、巴西台資子公司的核心名與品牌名比對，只命中一篇，是頒發清潔生產認證的正面新聞稿，不收。PROFEPA 新聞稿多半只寫「una empresa」，不寫公司名，所以沒命中不代表沒有違規。
- 墨西哥環境部 SEMARNAT：robots 對所有爬蟲 `Disallow: /`，不抓。州環境機關（哈利斯科、奇瓦瓦、下加州、新萊昂）逾時或回 403。
- 巴西聯邦環保署 IBAMA：robots 明文禁止 ClaudeBot，不抓。聖保羅州環保局 CETESB 被 AWS WAF 擋下（挑戰頁），沒有繞過。其他州機關與聯邦公報多數連不上。

## O19：緯創印度 Kolar 廠

### 來源

| 文件 | 網址 | 封存 | 用到的頁 |
|---|---|---|---|
| 卡納塔克邦 SEIAA 第 231 次會議紀錄（2023-03-10） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/2103202371718475231stfinalproceeding.pdf | https://web.archive.org/web/20261030094958/https://environmentclearance.nic.in/writereaddata/FormB/agenda/2103202371718475231stfinalproceeding.pdf | 59–65（議程 231.1.11） |
| 卡納塔克邦 SEAC 第 286 次會議紀錄（2022-10-13） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/2710202218763084286thSEACMeetingMinutes.pdf | https://web.archive.org/web/20261030094832/https://environmentclearance.nic.in/writereaddata/FormB/agenda/2710202218763084286thSEACMeetingMinutes.pdf | 55（議程 286.30） |
| 卡納塔克邦 SEAC 第 291 次會議紀錄（2023-02-14） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/0603202387420750291STFinalMoM.pdf | https://web.archive.org/web/20261030094937/https://environmentclearance.nic.in/writereaddata/FormB/agenda/0603202387420750291STFinalMoM.pdf | 107–111（議程 291.60） |
| 卡納塔克邦 SEAC 第 309 次會議紀錄（2023-11-17） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/1811202391871501309thSEACminutes.pdf | https://web.archive.org/web/20261030081803/https://environmentclearance.nic.in/writereaddata/FormB/agenda/1811202391871501309thSEACminutes.pdf | 6–7（議程 309.5） |
| 環境部辦公室備忘錄 F. No. 22-21/2020-IA.III（2021-07-07，違規案件的認定與處理程序） | https://environmentclearance.nic.in/writereaddata/OM/135319091%241._OM_07_07_2021.pdf | https://web.archive.org/web/20261030082752/https://environmentclearance.nic.in/writereaddata/OM/135319091$1._OM_07_07_2021.pdf | 5（定義 i）、8（第 12(b)(i) 條） |
| 緯創 110 年度年報 | https://www.wistron.com/file/d83f1c36-23ed-4156-a6fe-ae1e330a1a61/2021_WistronAnnualReport_CH.pdf | 無（見下） | 70 |
| 緯創 112 年度年報 | https://www.wistron.com/file/68173a96-ff3e-418a-bbef-2794c9fdc443/2023_WistronAnnualReport_CH.pdf | 無（見下） | 42、78、89 |

只寫在這裡、沒有列為網站來源的過程紀錄：
- SEAC 第 285 次（2022-09-16，議程 285.58）：https://web.archive.org/web/20261030095348/https://environmentclearance.nic.in/writereaddata/FormB/agenda/0710202254342826285thSEACMinutes.pdf
- SEAC 第 287 次（2022-11-18，議程 287.87）：https://web.archive.org/web/20261030094853/https://environmentclearance.nic.in/writereaddata/FormB/agenda/0612202219360755287thSEACMinutes_compressed.pdf
- SEAC 第 288 次（2022-12-22，議程 288.61）：https://web.archive.org/web/20261030094912/https://environmentclearance.nic.in/writereaddata/FormB/agenda/0801202379857315288thfinalMoM.pdf
- SEIAA 第 228 次（2023-01-11，議程 228.14）：https://web.archive.org/web/20261030095020/https://environmentclearance.nic.in/writereaddata/FormB/agenda/1901202363017446228seiaaproceedings.pdf

七份會議紀錄的 Wayback 封存都用原檔（`id_`）下載回來比對，md5 和直接從 environmentclearance.nic.in 下載的檔案相同。

- 兩份年報的 Wayback 存檔請求都回 HTTP 520，原因是 wistron.com 前面的 Akamai 擋掉了 archive.org，curl 也一樣被擋。年報是用一般啟動的 Chrome 在頁面內下載的。wistron.com 的 robots.txt（2026-10-30 用同一個 Chrome 讀取，curl 回 403）只對 Googlebot、Bingbot、Baiduspider、DuckDuckBot、Yahoo Slurp 列出 `Disallow` /CMS/、/image/、/_next/，沒有 `User-agent: *` 群組，也沒有禁止 /file/。本地檔留存備查：110 年度 188 頁，sha256 `1565536899284e03b3668f921f75bbda05bd5e36ada915e5f92ddb50a87ab06f`；112 年度 197 頁，sha256 `40e3a53aac31e90d38a7827eb712458f860f645b5ee257917759385b7111b71f`。

### 怎麼找到審查紀錄

- environmentclearance.nic.in 的卡納塔克邦頁面（`Staterecord.aspx?State_Name=Karnataka`）列有 SEAC 與 SEIAA 會議紀錄的索引（`report/Minutes_report_B_SEAC.aspx?state_id=10`、`report/minutes_meeting_report_b.aspx?state_id=10`）。
- 取 2022-05 到 2023-05 的 78 份（SEAC 45、SEIAA 33）下載，對文字層搜尋公司名、村名與檔號 151 CON。其中 5 條索引連結在網站上就是斷的（檔名被截斷，回 404）。SEAC 第 289 次（2023-01-13）落在這個案子第 288 次與第 291 次之間，只有這條斷連結，讀不到。其餘 4 條是 SEAC 第 279、282、283 次的重複連結（同一次會議另有完整連結，已下載）與 SEIAA 舊案上傳紀錄。
- 命中的有 SEAC 第 285、286、287、288、291 次與 SEIAA 第 228、231 次，同一份 PDF 在索引裡常以正本、附錄、更正的名義重複列出。
- 環評系統的「EC Granted」查詢（2023 年、新建工程類）沒有結果。卡納塔克邦 2022 年後的案件改在 PARIVESH 系統，PARIVESH 從台灣拒絕連線，所以 2023-04-18 的環境許可函本身沒有拿到。

### 審查經過

以下都已經看過 PDF 影像，不只看文字層（文字層是 OCR，數字和案號常讀錯）。

- **起點**：公司 2020 年申請時，已營運的建築 92,064.19 平方公尺，2019-11-20 取得邦污染控制委員會的營運同意（CFO）。工業廠房建築面積 15 萬平方公尺以下免環境許可，SEIAA 2019-07-09 曾經函覆確認。公司 2020-06-11 為擴建到 184,567.03 平方公尺申請評估範圍（ToR，檔號 SEIAA 87 CON 2020）。
- **SEAC 第 285 次（2022-09-16）**：公司表示已營運的建築 92,064.19 平方公尺。委員會要公司說明到當時為止已經蓋了多少，公司沒有提出可採信的文件，也沒說清楚，案件延後。
- **SEAC 第 286 次（2022-10-13，第 55 頁）**：公司說明營運中的建築 92,064.19 平方公尺，施工中尚未營運的 92,502.84 平方公尺；「due to lack of knowledge」多蓋了超過 15 萬平方公尺門檻的 34,567 平方公尺，承認違反 2006 年環評通知。委員會要公司依環境部 2021-07-07 的 SOP 補資料。
- **SEAC 第 287 次（2022-11-18）**：公司撤回原申請，請委員會改以違規類別審查。委員會決定先現勘。
- **SEAC 第 288 次（2022-12-22）**：小組 2022-11-26 現勘後，建議 SEIAA 核發標準 ToR，並加列條件：依 SOP 估算罰款，提出損害評估、補救與社區增益計畫，基地東側的溪溝與湖泊要依規定留緩衝帶、湖水要採樣分析等。
- **SEIAA 第 228 次（2023-01-11）**：照 SEAC 建議，決定核發標準 ToR 與附加 ToR。第 291 次會議紀錄寫 SEIAA 2023-01-19 以違規類別核發 ToR。
- **SEAC 第 291 次（2023-02-14，第 107–111 頁）**：
  - 新案號 SIA/KA/INFRA2/416856/2023。公司具結未取得許可就蓋好的建築尚未運轉。
  - 依 SOP 第 12(b)(i) 條（擴建產能尚未投產：擴建成本的 1%）計算罰款。擴建的 92,502.84 平方公尺建造成本 438.6 crore 盧比，超出門檻的 34,568 平方公尺建造成本 1,63,90,33,439 盧比，罰款 1,63,90,334 盧比（16,390,334）。
  - 公司表示擴建沒有造成損害、不需補救計畫，另提出社區資源增益計畫。委員會要求補件後，公司提出修正的損害評估、補救與社區增益計畫。
  - 委員會認定環境基線數據在標準內，建議核發環境許可。
- **SEIAA 第 231 次（2023-03-10，第 65 頁）**：「decided to clear the proposal for issue of Environmental Clearance subject to following」。條件如下：
  - 依 Environment (Protection) Act 1986 第 19 條向管轄法院提出違規告訴。
  - 向卡納塔克邦污染控制委員會提交 18.30 lakh 盧比的銀行保證金，附補救與社區資源增益計畫及執行時程。
  - 依 SOP 第 12(b)(i) 條向卡納塔克邦污染控制委員會繳罰款 1,63,90,334 盧比。
- **2023-04-18**：SEIAA 以違規類別核發環境許可（SEAC 第 309 次會議紀錄第 6 頁；原文把 violation 拼成「vilation」，已看影像確認是原件錯字）。
- **SEAC 第 309 次（2023-11-17）**：公司申請修改許可，補列漏掉的地號 116，寫明手機組裝產能從每年 705.6 萬支擴大到 1,443.6 萬支、電路板從 722.88 萬片擴大到 1,460.88 萬片，以及員工增加 500 人造成的用水量變化。
- 找到的紀錄都沒有寫罰款是否已繳、告訴是否已提出。

### 狀態與日期

- status 用 penalized：SEIAA 的決議寫明罰款要繳給邦污染控制委員會，是主管機關的處分，不只是公司自己試算。
- dateStart 用 SEIAA 決議日 2023-03-10。

### 「違規類別」是什麼意思

- 環境部 2021-07-07 備忘錄第 5 頁的定義 i：未先取得環境許可就開始動工、安裝或開挖，或擴大產能、面積超出許可範圍的案件，都算違規案件。第 8 頁第 12(b)(i) 條：擴建產能尚未投產的，罰擴建成本的 1%。
- 這份備忘錄後來在法院遭到挑戰，網站上只引用它的定義和罰款算法，不引用其他程序。

### 持股與處分

- 110 年度年報第 70 頁的合併財報子公司表：WSSG（SMS InfoComm (Singapore)）與 WHK（Wistron Hong Kong）→ WMMI，110.12.31、109.12.31 都是 100%。controlSince 取 2020，早於 2022–2023 的審查與處分（決策 38 第 1 條）。112 年度年報第 186 頁的關係企業資料寫 WMMI 成立於 107.02.18（2018 年）。
- 112 年度年報：
  - 第 42 頁董事會重要決議：112.10.27 通過 WSSG、WHK 擬出售 WMMI 100% 股權。
  - 第 89 頁合併財報附註：出售對象是 Tata Electronics Private Ltd.，WMMI 在 112.12.31 列為待出售非流動資產（處分群組）。
  - 第 78 頁子公司表：112.12.31 仍是 100%。
- 照決策 37，卡片顯示處分前的 100%。MOPS 2025 子公司表已經沒有 WMMI。

### 定位

- 會議紀錄的地址是 Achchathanahalli 村，OSM 沒有這個村名，也沒有廠區。座標用 hobli 同名的 Narasapura 村（OSM node 245618402，13.1383, 78.0044），精度標 city。

### 沒有寫進網站的

- 有一家印度媒體報導過這件違規的罰款金額，但那個網站的 robots.txt 明文禁止 ClaudeBot，依規則不抓也不引用。罰款金額現在改用 SEIAA 會議紀錄。

## 不收

- 同一輪另有 3 筆不收：地方稅與建築許可糾紛 1 筆、勞資事件 1 筆、非台資企業 1 筆。明細記在 repo 外的查找筆記。
- 其他在印度設廠的台資企業，用網路搜尋沒有命中。但各邦污染控制委員會和國家綠色法庭都沒能直接查，沒命中不代表沒有紀錄。
