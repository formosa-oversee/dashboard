# EPA 資料來源盤點：ECHO Exporter 列到的每個來源

狀態：2026-10-25 全部下載並逐一確認。資料版本是 EPA 2026-10-17／18 的全量檔。

ECHO Exporter 每個 EPA 設施登記（FRS 廠區）一列，把各個法規系統的編號與近 5 年合規摘要彙整在一起。欄位說明 `echo_exporter_columns.xlsx`（EPA 2012 版）寫出每一欄來自哪個系統。本文件逐一下載那些系統的全量檔，確認內容、怎麼對到我們的廠區、我們的廠區在裡面有多少筆紀錄，以及網站目前有沒有用到。

下載：`scripts/download-echo-sources.sh [目錄]`。預設下載到 `formosa-oversee/epa-downloads/`，合計約 9GB，不進 git。

## 1. 我們的廠區

我們 196 個設施（`data/facilities.csv` 加補充資料）的 NPDES 許可證在 Exporter 全部對得到，共 165 個 FRS 廠區。另外加上沒有 NPDES 許可證的 Continental Carbon Ponca City，總共 166 個。以下的「我們的筆數」都以這 166 個廠區、廠區底下所有系統編號為準，包含 `NOT_OWNED` 的 3 個同名誤配，以及收購以前的紀錄。

| 系統編號 | 有這類編號的廠區 | 編號數 |
|---|---|---|
| NPDES（水污） | 165 | 477（我們的資料只有 196 張，見 §4.1） |
| ICIS-Air（空污） | 32 | 35 |
| RCRAInfo（有害廢棄物） | 50 | 62 |
| SDWIS（飲用水） | 2 | 3 |
| TRI（有毒化學物質排放） | 31 | 31 |
| E-GGRT（溫室氣體） | 7 | 7 |
| ICIS FE&C 案件 | 25 | 218 |

FRS 計畫連結表另外連到 Excel 沒有列的系統：EIS（國家排放清冊 NEI）20、TSCA 29、CEDRI（電子申報）15、ICIS 21、RMP（化學災害風險管理計畫）8、SEMS（超級基金場址）3。

## 2. 來源總表

| 來源 | Excel 裡的欄位 | 下載檔 | 解壓大小 | 對到我們的方式 | 我們的筆數 | 網站 |
|---|---|---|---|---|---|---|
| FRS 設施登記 | `REGISTRY_ID`、地址、座標 | `frs_downloads.zip` | 1.2GB | `REGISTRY_ID` | 166 廠區、717 個系統連結 | 只用來對編號 |
| AFS（舊空污系統，2014 停用） | `AFS_IDS`、`CAA_*`（2012 版欄位名） | `afs_downloads.zip`（2017 年最後一版） | 0.8GB | ICIS-Air 編號去掉州碼後的 10 碼 | 23 個空污編號對得到 | 不用，見 §3.2 |
| ICIS-Air（空污） | `AIR_IDS`、`CAA_*` | `ICIS-AIR_downloads.zip` | 0.8GB | `PGM_SYS_ID` | 違規 125、正式處分 152、非正式 322、排放檢測 527（不合格 35）、稽查 1,639 | 違規、處分、不合格檢測已上線 |
| ICIS-NPDES（水污） | `NPDES_IDS`、`CWA_*` | `npdes_downloads.zip` | 2.3GB | `NPDES_ID` | 單一事件違規 112、時程違規 106、正式處分 59（罰款 US$386 萬）、非正式處分 388、稽查 930 | 違規、處分已上線（2026-10-25 起由全量檔重建），見 §4.2 |
| ICIS-NPDES 放流水超標 | `CWA_3_YR_EFFLUENT_EXCEEDANCES` | `npdes_eff_downloads.zip` | 約 16GB | `NPDES_ID` | 7,326 | 已上線（全量檔重建） |
| RCRAInfo（有害廢棄物） | `RCRA_IDS`、`RCRA_*` | `rcra_downloads.zip` | 0.6GB | `ID_NUMBER` | 違規 403、處分 171、稽查 492 | 違規、處分已上線 |
| SDWIS（飲用水） | `SDWA_IDS`、`SDWA_*` | `SDWA_latest_downloads.zip` | 5.2GB | `PWSID` | 3 個廠內供水系統、35 筆違規 | 不用，見 §3.3 |
| TRI（有毒化學物質） | `TRI_IDS`、`TRI_*` | TRI 年度檔 `tri/<年>_US.csv`（ECHO 沒有逐筆檔） | 約 2.5GB | `TRIFD` 或 `FRS ID` | 見 §3.4 | 只顯示 Exporter 的最近一年總量 |
| GHGRP 溫室氣體 | `GHG_IDS`、`GHG_CO2_RELEASES` | `ghgrp/2023_data_summary_spreadsheets.zip`（xlsx） | 30MB | `Facility Id` 或 `FRS Id` | 7 個廠區 2011–2023 逐年排放 | 只顯示 Exporter 的最近一年總量 |
| ICIS FE&C 聯邦案件 | `FEC_*` | `case_downloads.zip` | 0.4GB | `REGISTRY_ID`、`CASE_NUMBER` | 案件 50、EPA 稽查 50 | 案件已上線 |
| 人口統計（Census ACS） | `FAC_PERCENT_MINORITY`、`FAC_POP_DEN` | `echoacs2023_demographics.zip` | 2.5GB | `REGISTRY_ID` | 166 廠區 × 1／3／5 英里，共 459 列 | 不用 |
| 排放彙整（ECHO 自己整理） | Exporter 沒有對應欄位 | `POLL_RPT_COMBINED_EMISSIONS.zip` | 0.9GB | `REGISTRY_ID` | TRI 2015–2024（26 廠區）、GHG 2015–2023（7）、NEI 2008–2020（17），共 2,875 列 | 不用 |

Exporter 其他欄位不是獨立的資料來源：`FAC_DERIVED_*`、`FAC_NAA_FLAG`、`FAC_CHESAPEAKE_BAY_FLG`、`FAC_US_MEX_BORDER_FLG` 是 EPA 用座標套疊邊界算出來的；`FAC_MYRTK_UNIVERSE` 對應的 myRTK 網站已經停用；`FAC_FEDERAL_FLG` 來自 EPA 內部系統 IDEA，沒有公開下載。

## 3. 各來源確認結果

### 3.1 FRS

`FRS_PROGRAM_LINKS.csv` 是廠區 ↔ 各系統編號的總表，比 Exporter 完整：Exporter 只列 NPDES、空污、RCRA、SDWA、TRI、GHG、案件，FRS 另外有 EIS、TSCA、RMP、SEMS 等。

一個實體工廠可能有好幾個 FRS 廠區。例如 FPC Point Comfort 的溫室氣體申報掛在另一個登記 110071160841（2023 年 529 萬公噸 CO₂e），不在我們以 NPDES 找到的 110018925957 底下。見 §4.3。

### 3.2 AFS

AFS 是 2014 年以前的空污系統，ICIS-Air 上線時把歷史資料遷移過去。比對我們 23 個對得到的空污編號：

- 高優先違規（HPV）全部在 ICIS-Air 裡，只有 FPC Point Comfort 兩筆的起算日不同。
- 處分與稽查筆數大致相同。AFS 多出的部分集中在 2014 年以前，例如 FPC Baton Rouge AFS 276 筆、ICIS-Air 193 筆，多半是稽查與合規狀態紀錄。

所以不另外匯入 AFS，用 ICIS-Air 就好。

### 3.3 SDWIS

只有兩個廠區有廠內供水系統：FPC Point Comfort（TX0290072、TX0290074，供 2,650 人）與 Continental Carbon Sunray（TX1710019，60 人）。35 筆違規全部是監測或申報類（MR、MON），沒有健康類違規。數量少、性質輕，暫不放上網站。

### 3.4 TRI

31 個廠區有 1987–2024 年的 TRI 申報，逐年、逐化學物質列出排入空氣、水、土地的量，並標示是否致癌、是否 PFAS。2025 年的資料 EPA 還沒發布。

歷年廠內排放累計（含台灣母公司取得控制以前的年份）最多的是 FPC Point Comfort 3,344 萬磅（2024 年 173 萬磅）、FPC Baton Rouge 2,726 萬磅、APG Polytech 2,031 萬磅（大多是 2018 年以前 M&G 時期）、Continental Carbon Ponca City 632 萬磅、Phenix City 627 萬磅、TSRC Plaquemine 567 萬磅（2024 年 37.5 萬磅）。致癌物排放以 APG Polytech 433 萬磅、FPC Point Comfort 414 萬磅、FPC Delaware City 363 萬磅最多。我們的廠區都沒有 PFAS 排放申報（TRI 從 2020 年起才要求申報 PFAS）。

網站目前只顯示 Exporter 的最近一年總量，逐年趨勢與致癌物可以加上去。

TRI 申報者會填外國母公司。用 MOPS 上市櫃公司英文名稱比對這一欄，找到 11 個廠區，10 個已在資料中，新的一個是東元 1504 的 TECO-Westinghouse Motor（Round Rock TX，1987–2024 累計 31.3 萬磅）。這一欄是 EPA 標準化後的**目前**母公司，舊年份也顯示現任母公司（例：MEMC 2003 年就標 GlobalWafers），只能用來找廠，不能判斷當年持股。

### 3.5 GHGRP

7 個廠區有 2011–2023 年的逐年直接排放量。最近一年：FPC Baton Rouge 32.0 萬、Continental Carbon Ponca City 24.2 萬、Sunray 15.5 萬、Phenix City 13.8 萬（2022）、WaferTech 7.3 萬、TCI Texarkana 6.9 萬公噸 CO₂e；FPC Delaware City 2018 年以後低於申報門檻。

漏掉的大排放源見 §4.3：FPC Point Comfort 529 萬、南亞 Lake City 12.8 萬、APG Polytech 4.0 萬公噸。

### 3.6 人口統計

每個廠區周邊 1、3、5 英里的人口、收入、少數族裔、貧窮人口（ACS 2023）。例如 Continental Carbon Phenix City 周邊 1 英里 2,017 人，少數族裔 1,886 人、低收入 1,331 人。可以做環境正義的呈現，目前沒有用。

## 4. 發現的缺口

§4.2 已在 2026-10-25 處理；其餘還沒處理，網站照舊。

### 4.1 同廠區其他 NPDES 許可證

我們 166 個廠區在 FRS 底下總共有 477 張 NPDES 許可證，資料裡只有 196 張。多出的 281 張有 252 張落在 3 個住宅建案的廠區（Vista Del Verde、Asante、Canyon Trails，亞利桑那）：台積電的 3 張工地許可證被 FRS 併進這些建案，建案本身的許可證與台積電無關，不應納入。其餘工廠多出的許可證只有零星幾張（MEMC 2、KEMET 2、TCI Texarkana 1、WaferTech 1），單一事件／時程違規合計 34 筆，多數在建案。

### 4.2 水污染資料是舊快照，也沒有處分（2026-10-25 已處理）

發現時：GCS 的 `violations.csv` 最新日期是 2025-08-31。放流水超標：最新檔裡我們的許可證有 7,326 筆，我們的資料沒有的 1,020 筆中，556 筆是 TCI Texarkana 2000–2010 年前業主的紀錄（刻意不收），其餘 464 筆在 2021–2026 年，主要是 VISCO Eugene OR（視陽 6782）261 筆、Evergreen Transport Calera AL 60 筆、Pacific Coast Yachting Seattle（東哥 8478）48 筆、MEMC 44 筆。水污染也只有違規，沒有處分與罰款：我們 196 張許可證有 59 件正式處分（罰款合計 US$3,863,654）、375 件非正式處分、907 次稽查。

處理：
- `violations.csv` 改由 `scripts/build-water-violations.py` 從全量檔重建，結果見 `enforcement-data-interface.md` 第 10 節。
- 正式處分與 `OFFICIAL_FLG=Y` 的非正式處分（警告信、違規通知）加進 `build-echo-programs.py`（`program: 'CWA'`）。稽查不收，和空污、廢棄物一樣。
- 取得控制前的水污染違規在建置時排除 487 筆（Corpus Christi Polymers 204、MEMC 154、APG Polytech 123、FPC Illiopolis 6）。只有水污染紀錄的收購工廠另外查證過，結果見 `enforcement-data-interface.md` 第 9 節。

### 4.3 同一座工廠的其他 FRS 廠區

同城市、名稱有品牌字的其他登記，確認屬同一工廠的：

| 公司 | 登記 | 名稱 | 內容 |
|---|---|---|---|
| 台塑 1301 | 110071160841 | FORMOSA POINT COMFORT PLANT | 溫室氣體 529 萬公噸（2023） |
| 台塑 1301 | 110000505490 | FORMOSA HYDROCARBONS COMPANY，Point Comfort | RCRA、聯邦案件 |
| 台塑 1301 | 110033933536 | FORMOSA PLASTICS MARINE TERMINAL，Point Comfort | RCRA |
| 台塑 1301 | 110051819145 | FORMOSA PLASTICS CORPORATION-TREATMENT PLANT，Baton Rouge | 廠內飲用水 |
| 南亞 1303 | 110070326649 | NAN YA PLASTICS CORPORATION AMERICA，Lake City SC | 溫室氣體 12.8 萬公噸 |
| 南亞 1303 | 110000823798、110064116772 | NAN YA PLASTICS，Wharton TX | 空污、TRI、RCRA |
| 遠東新 1402 | 110069729271、110070639169 | APG POLYTECH，Apple Grove WV | 溫室氣體 4.0 萬公噸、RCRA |
| 國巨 2327 | 110004939103、110000354152 | KEMET，Simpsonville SC | RCRA |

### 4.4 還沒收錄的台資工廠

以品牌名在 Exporter 全表搜尋，以及 TRI 的外國母公司欄位，找到資料庫裡沒有、但看起來是台灣母公司的廠區（待逐一確認持股與時點）：

- 國巨 2327：KEMET 在 Fountain Inn SC（2 次罰款）、Shelby NC、Brownsville TX（8 季不合規）、Columbus GA、Carson City NV（KEMET Blue Powder）、Knoxville TN。
- 環球晶 6488：GlobalWafers America／MEMC Southwest，Sherman TX；MEMC Moore SC（12 季不合規，需確認是否仍屬環球晶）。
- 元太 8069：E Ink Billerica MA（6 季不合規），我們只有 South Hadley。
- 保瑞 6472：Upsher-Smith Maple Grove MN（TRI）、Plymouth MN。
- 鴻海 2317：Sharp Manufacturing，Memphis TN、Jamestown TN。
- 大成不銹鋼 2027：Ta Chen Long Beach CA、Gardena CA、Morrow GA。
- 東元 1504：TECO-Westinghouse Motor，Round Rock TX（TRI 外國母公司欄位找到）。

TRI 外國母公司欄位的比對結果見 §3.4。
