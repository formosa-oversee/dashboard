# 新聞事件掛公司頁：持股事實盤點（2026-10-21）

只收事實，不做規格決定。「有效持股」＝沿路持股相乘、多條路徑加總、上限 100%（`resolve-ownership.py` 的算法）。

兩種口徑並列：

- **resolver 口徑**：只走該上市公司自己的 MOPS 子公司圖（`OwnershipGraph.reach(code)`），不穿過其他上市公司。
- **穿透口徑**：把台塑四寶、福懋之間的交叉持股（關聯企業 20–50%，以及 FVOCI <20%）也當成路徑。這是我另外算的，resolver 目前不支援。試算腳本是一次性的，沒有保留在 repo。

探查用的一次性腳本沒有保留在 repo。

---

## 0. 先講結構性發現（影響規格）

| # | 發現 | 依據 |
|---|---|---|
| 1 | repo 的 MOPS 檔（2025Q1–Q2）**只有子公司（控制）**，沒有 20–50% 的關聯企業，也沒有 <20% 的 FVOCI 持股。所以台塑河靜、台塑美國、FG INC（對南亞／台化）、SSMC、福欣特殊鋼、天龍投資，在 resolver 裡都**找不到持股路徑**。≥20% 規則剛好卡在關聯企業這一段，現有資料不夠用。 | `grep` MOPS 三檔；`probe_resolve.py` 對 Formosa Ha Tinh 回傳 `unresolved` |
| 2 | **repo 對 FPC USA 的判斷已過時**：台塑 1301 直接持有台塑美國（FPC USA）**22.66%**，採權益法，是關聯企業。2026-08-01 台塑工業美國（Formosa Industries Corp.）併入 FPC USA 後，持股升到 **24.82%**。CURATED 的 `FPG_USA_NOTE` 寫「比例未揭露」和「無上市公司持股路徑」都不對。 | 台塑 115Q2 合併財報附註（關聯企業表、轉投資表）；MOPS 1301 重大訊息 2026-03-06 17:47:37「公告本公司增加投資台塑美國公司」；MOPS 1301 2026-10-12「2026年第3季自結合併損益」（台塑工業美國 8/1 起併入台塑美國） |
| 3 | 1605 華新在 MOPS `subsidiaries_union.csv` **只有 1 列**，中國子公司全缺；MOPS 的 Everising 29.50% 也已過時，2025-10-21 起是 51.00%。 | MOPS 檔；華新 2Q26 英文合併財報 Note 15 |
| 4 | 名稱撞名：越南「台灣興業責任有限公司」英文名也是 **Formosa Industries Corporation**（Hưng Nghiệp Formosa，Nhơn Trạch, Đồng Nai），由台化 42.5%、南亞 42.5%、福懋 10% 持有。這和台塑 1301 的美國子公司 Formosa Industries Corp.（已併入 FPC USA）不是同一家。新聞比對要注意。 | Fubon 轉投資頁（1303/1326/1434）；nhadautu.vn |
| 5 | resolver 名稱比對落空：`European Semiconductor Manufacturing Company`、`WaferTech`、`Formosa Industries Corp`（MOPS 只有中文「台塑工業美國」）、`Formosa Ha Tinh …` 都回 `unresolved`。 | `probe_resolve.py` |
| 6 | 台積電 2026-05 把世界先進 5347 持股從 27.1% 賣到 **19%**，不再是關聯企業（改列 FVTOCI）。 | TSMC 2Q26 合併財報（SEC 6-K 2026-08-14） |

---

## 1. 台塑集團

### 1a. Formosa Ha Tinh Steel Corporation（FHS，越南河靜）／Formosa Ha Tinh (Cayman) Limited（FHS-C）

- FHS-C 持有 FHS **100%**（鉅亨 2021-08-31）。FHS 2008-06-12 成立（中鋼官網）。
- FHS-C 的股權：台塑四寶各 11.43%，福懋 3.85%，中鋼 20.45%。另外 2018 年報導：台塑美國 14.23%、JFE 4.09%、台塑集團合計 75.45%。剩約 11.7% 推測由麥寮汽電、台朔重工等集團非上市公司持有（未驗證）。
- 四寶的 11.43% 都列 **FVOCI**（金融資產），不是關聯企業。中鋼的 20.45% 在 Fubon 轉投資頁也列「綜合公允」。

| 上市公司 | resolver 口徑 | 路徑 | 穿透口徑（不含台塑美國持股） | 穿透口徑（含台塑美國 14.23%，2018 數字） | ≥20%？ | controlSince |
|---|---|---|---|---|---|---|
| 中鋼 2002 | 無路徑（MOPS 無節點） | 中鋼 →（China Steel Asia Pacific Holdings 100%）→ FHS-C 20.45% → FHS 100% | 20.45% | 20.45% | **是**（剛好過線） | **2011**（2011-06-21 首次投資，中鋼官網）。2015 年 19%，2016-01 增至 25%，2018 年增資未跟、降到 20.46% |
| 台塑 1301 | 無路徑 | 1301 → FHS-C 11.43% → FHS | 16.79% | **20.04%**（併購後 24.82% 時為 20.35%） | 直接持股否；穿透後約等於 20%，看口徑 | 台塑集團 **2008**（FHS 成立）；2014-09 改組成直接持有 FHS-C（之前間接 14.75%） |
| 台化 1326 | 無路徑 | 1326 → FHS-C 11.43% | 17.94% | 18.63% | 否（另有麥寮汽電、台朔重工的持股未知） | 同上 2008／2014 |
| 南亞 1303 | 無路徑 | 1303 → FHS-C 11.43% | 15.27% | 15.52% | 否 | 同上 |
| 台塑化 6505 | 無路徑 | 6505 → FHS-C 11.43% | 12.10% | 12.18% | 否 | 同上 |
| 福懋 1434 | 無路徑 | 1434 → FHS-C 3.85% | 4.35% | — | 否 | 2014-09 移轉 4.963% 給 FHS-C |
| 中碳 1723 | MOPS 有節點「台塑河靜中碳（開曼）公司」0.00% | 另一家焦化合資，已終止合資清算 | — | — | 否 | — |

外資共同持有：**JFE Steel**（2015 年 5%，2018 年稀釋到 4.09%）。2016-04 海洋污染事件發生在所有台灣股東取得持股之後。

### 1b. Formosa Plastics Corporation, U.S.A.（台塑美國）與 Texas／Louisiana／Delaware 廠

- resolver 現況：走 CURATED → `group-affiliate`、1301 代表、`effectivePct: null`。只在 `SRC_US + formosa-plastics` slug 下命中。ECHO 管線替 1301 設施帶這個 slug，所以 ECHO 也命中。不帶 slug 的 `EPA ECHO` 查詢回 `unresolved`。
- 實際：FPC Texas／Louisiana／Delaware 是 FPC USA 的全資子公司（公司資料寫「three wholly-owned chemical manufacturing subsidiaries」）。

| 上市公司 | 直接 | 路徑 | 穿透 | ≥20%？ | controlSince |
|---|---|---|---|---|---|
| 台塑 1301 | **22.66%**（關聯企業、權益法）；**2026-08-01 起 24.82%** | 1301 → FPC USA 22.66%／24.82% → FPC Texas／LA／DE 100% | 22.83%／24.99% | **是** | 台塑集團 1978 年成立 FPC USA，1981 年買下第一座美國工廠（Baton Rouge）。1301 何時起 ≥20%：**未驗證** |
| 台化 1326 | 2.93%（FVOCI） | — | 4.88% | 否 | — |
| 南亞 1303 | 0.51%（FVOCI） | — | 1.80% | 否 | — |
| 台塑化 6505 | 0 | — | 0.55% | 否 | — |

Formosa Industries Corp. 的影響：換股交易是 1 股換台塑美國新股 1.5316 股，1301 取得 8,841 股，累計 78,495 股、24.82%，交易總額 US$292,169,500。結果是 1301 持股提高，路徑從「1301 → FIC 100%」改為「1301 → FPC USA 24.82%」。FIC 原有的事件改由 FPC USA 承接；原 FIC 轉投資的台塑烯烴美國（OL3）也從 8/1 起併入台塑美國。

### 1c. FG LA LLC（Sunshine Project，St. James Parish）

FG INC.（Delaware）持有 FG LA LLC 100%。FG INC. 股權：台塑化 57%、台化 30%、南亞 10%、福懋 3%（工商時報 2017-11-10；Fubon 轉投資頁 2026Q2 數字相同）。

| 上市公司 | resolver 口徑 | 路徑 | 穿透 | ≥20%？ | controlSince |
|---|---|---|---|---|---|
| 台塑化 6505 | **57.00%**（`mops-exact`） | 6505 → FG INC. 57% → FG LA LLC 100% | 57.55% | 是 | 2017-11 之前 FG INC. 由 6505 100% 持有（FG INC. 和 FG LA 的成立年**未驗證**）；計畫 2018-04 公布 |
| 台化 1326 | 無路徑（MOPS 無 FG INC. 節點） | 1326 → FG INC. 30% → FG LA | 48.44% | **是**（直接 30% 就過線） | **2017**（2017-11 增資加入） |
| 南亞 1303 | 無路徑 | 1303 → FG INC. 10% → FG LA | 25.19%（主要經台塑化 23.11%） | 直接持股否；穿透後是 | 2017 |
| 台塑 1301 | 無路徑 | 只能經台塑化 28.56% 等 | 20.42% | 直接持股否；穿透後剛好過線 | — |
| 福懋 1434 | 無路徑 | 1434 → FG INC. 3% | 5.30% | 否 | 2017 |

### 1d. 台塑集團在中國／越南的製造實體（只列有效持股）

| 母公司 | 實體 | 有效持股 | 來源 |
|---|---|---|---|
| 台塑 1301 | 台塑工業(寧波) | 100%（台塑開曼 → 台塑香港 → 寧波） | MOPS |
| 台塑 1301 | 台塑電子(寧波) | 100% | MOPS |
| 台塑 1301 | 福建福欣特殊鋼（漳州） | **32.85%**（1301 → 天龍投資(薩摩亞) 50% → 福欣）；MOPS 無 | 1301 115Q2 財報 大陸投資表 |
| 台塑 1301 | 上偉(江蘇)碳纖複合材料 | 16.11%（FVOCI） | 同上 |
| 台化 1326 | 台化興業（寧波；PTA、PS、ABS、Phenol） | 100% | MOPS |
| 台化 1326 | 台灣興業（越南 Nhon Trach，英文 Formosa Industries Corporation） | 42.50%（穿透 49.07%） | MOPS／Fubon |
| 南亞 1303 | 台灣興業（越南） | 42.50%（穿透 43.78%）；1303 的 MOPS 圖沒有此節點 | Fubon |
| 南亞 1303 | 南亞塑膠工業（南通、寧波、廣州、惠州）、南亞電子材料（昆山、惠州）、南亞加工絲(昆山)、南亞電氣(南通)、必成玻纖(昆山) | 100% | MOPS |
| 南亞 1303 | 南亞塑膠工業(廈門) | 85% | MOPS |
| 南亞 1303 | 南亞電路板(昆山) | 66.97%（經南電 8046） | MOPS |
| 台化 1326 | 福懋同奈、福懋越南、福懋(常熟)、福懋(中山) | 37.40%（經福懋 1434） | MOPS |
| 台塑 1301 | 上述南亞、台化的中國／越南實體 | 穿透後都 <20%（例：台灣興業 6.36%） | 計算 |

---

## 2. 華新麗華 1605（尚無公司頁）

持股取自華新 **2Q26 英文合併財報**（2026-06-30）；MOPS（2025Q2）的數字並列。

| 實體 | 地點 | 路徑（2026-06-30） | 有效持股 | MOPS 2025Q2 | ≥20%？ | controlSince | 外資共同持有 |
|---|---|---|---|---|---|---|---|
| PT. Walsin Nickel Industrial Indonesia（華新鎳業） | IMIP Morowali | 1605 → WNII 50%；1605 → Walsin Singapore 100% → WNII 42% | **92.00%** | 92.00% | 是 | **2020**（2020-01-10 董事會設立、合資後持股 50%；2021-07 董事會增持到 92%；2021H2 投產） | 合資方 New Hono Investment、Perlux Investment（報導稱為青山系，**未驗證**），約 8% |
| PT. Sunny Metal Industry（旭日） | Weda Bay（IWIP，北馬魯古），**不在 Morowali** | Walsin SG → Sunny 50.10%；Walsin SG → Berg Holding 75% → Sunny 39.35% | **79.61%** | 79.61% | 是 | **2022**（2022-04-11 董事會以 US$2 億向青山旗下兩家公司買 50.1%；2024-01 經 Berg 增至 79.61%） | 青山系 |
| PT. Walhsu Metal Industry | 未驗證（推測 Weda Bay） | Sunny → Walhsu 99.90%；WNII → 0.10% | **79.62%** | 79.62% | 是 | **2023**（2023-05-23 由集團設立） | 間接經 Sunny |
| PT. Walsin Everising Specialty Steel Indonesia（華新永旭） | Morowali（盤元廠，預計 2027 量產） | Walsin SG → 51.00% | **51.00%** | 29.50%（已過時） | 是 | **2024**（2024-08 取得 29.5%；印尼登記 2024-08-28；2025-10-21 增資到 51%） | 未驗證 |
| Cogne Acciai Speciali S.p.A. | Aosta，義大利 | 1605 → Walsin Lihwa Europe 100% → MEG S.A. 100% → Cogne 71.83% | **71.83%** | 71.83% | 是 | **2022**（2022-12-01 完成收購 70%；2023 年 77.60%，2024-08 70%，2025-06 71.83%） | Marzorati 家族／Com.Steel S.p.A.（約 28%） |
| Borrego Energy Holdings, LLC／Borrego Energy, LLC | 美國（太陽能 EPC，非工廠） | 1605 → Walsin America 100% → BEH 72.55% → BE 100% | **72.55%** | 72.55% | 是 | Walsin 2008 年起投資 Borrego（walsin.com）；何時 ≥20%：**未驗證**。2022-05 開發業務賣給 ECP | — |
| Cleanleaf Energy Holdings／Cleanleaf Energy, LLC | 美國（O&M） | BEH → CEH 75.86% → CE 100% | 55.04% | 59.85%（CEH） | 是 | 2023-09-14 設立 | 員工認股稀釋 |
| Dong Guan Cogne Steel Products | 東莞 | 經 Cogne 100% | 71.83% | — | 是 | — | — |

華新在中國的製造子公司（2Q26 財報）：

| 實體 | 有效持股 | 路徑 |
|---|---|---|
| Jiangyin Walsin Steel Cable（江陰華新鋼纜） | 100% | WLHL → Walsin (China) Investment → JHS |
| Shanghai Walsin Lihwa Power Wire & Cable | 95.71% | Walsin (China) → 95.71% |
| Dongguan Walsin Wire & Cable | 100% | Walsin (China) → 100% |
| Hangzhou Walsin Power Cable & Wire | 100% | Walsin (China) 15.48% + Dongguan 60% + Ace Result 24.52% |
| Hangzhou Futong Electric Industries | 51% | Hangzhou Walsin → 51% |
| Jiangyin Walsin Specialty Alloy Materials | 100% | WLHL 18.37% + CIL 81.63% |
| Yantai Walsin Stainless Steel（煙台華新） | 100% | CIL 69.79% + 江陰合金 30.21% |
| Yantai Huaxin Recycling Resources | 100% | 煙台華新 → 100%（2024-11-21 設立） |
| Changshu Walsin Specialty Steel | 100% | CIL → Walsin Specialty Steel Corp. → 100% |
| XiAn Walsin Metal Product | 100% | CIL → 100% |
| Walsin (Nanjing) Development（不動產，非製造） | 99.60% | 1605 49.05% + 華新不動產控股 99.22% × 50.95% |

其他上市公司有沒有路徑：華新科 2492 只有華新科自己的子公司，與上述實體無路徑（1605 持有華新科 18.32%，方向相反）。

---

## 3. 台積電 2330

持股取自 TSMC **2Q26 合併財報**（SEC 6-K 2026-08-14）與 2025 年報第 8 章；成立日也取自 2025 年報第 8 章。

| 實體 | 路徑 | 有效持股 | resolver | ≥20%？ | controlSince | 外資共同持有 |
|---|---|---|---|---|---|---|
| TSMC Arizona Corporation | 2330 → 100% | 100% | `mops-exact` 100% | 是 | **2020**（2020-11-10 設立） | — |
| TSMC Washington, LLC（前 WaferTech，Camas） | 2330 → TSMC Partners 100% → TSMC Development 100% → TSMC Washington 100% | 100% | `mops-exact` 100%；名稱 "WaferTech" 回 `unresolved` | 是 | **1996**（1996-06 合資成立時 TSMC 約 57%，1998-12 增至 68%，2001 年 Q1 買斷約 100%；2023-12 改名） | 1996–2001 的合資方 Altera、ADI、ISSI |
| Japan Advanced Semiconductor Manufacturing（JASM，熊本） | 2330 → 73% | 73% | `mops-exact` 73% | 是 | **2021**（2021-12-10 設立） | Sony Semiconductor Solutions、Denso、Toyota。2024-02-06 新聞稿說第二廠投資後 TSMC 約 86.5%／SSS 6.0%／Denso 5.5%／Toyota 2.0%，但 2026-06-30 財報仍是 73% |
| European Semiconductor Manufacturing Company（ESMC）GmbH（Dresden） | 2330 → 70% | 70% | 英文全名回 `unresolved`（節點 key 含 "esmc"） | 是 | **2023**（2023-06-30 設立；2023-08-08 董事會核准） | Bosch、Infineon、NXP 各 10% |
| TSMC (Nanjing) Company Limited | 2330 → 100% | 100% | MOPS 中文節點 100% | 是 | **2016**（2016-05-16） | — |
| TSMC (China) Company Limited（上海松江） | 2330 → 100% | 100% | MOPS 中文節點 100% | 是 | **2003**（2003-08-04） | — |
| Systems on Silicon Manufacturing Co.（SSMC，新加坡） | 2330 → 39%（關聯企業） | 39% | 無（MOPS 無關聯企業） | **是** | **1999**（1999-03-30 合資成立時 32%；2006-11 增至約 39%） | NXP 約 61% |
| VisionPower Semiconductor Manufacturing（VSMC，新加坡） | 2330 → 世界先進 19% → VSMC 60% | 11.4% | 世界先進 5347 自己的圖：60% | 否（世界先進 5347 本身持有 60%） | — | NXP 40% |
| Advanced Vision Semiconductor Manufacturing（熊本 Koshi，影像感測器合資） | 2026-08-11 簽約、尚未成立；TSMC 出資約 2,820 億日圓／合計 7,470 億日圓 ≈ 38%（推算） | — | — | 成立後會 ≥20%（推算） | 未成立 | Sony 為控制股東 |

采鈺 6789（台積電 67.25%）、精材 3374（41%）、創意 3443（35%）：MOPS 沒有海外製造據點。創意的越南、上海子公司是設計服務。

---

## 4. 規則下會新增「只有新聞」公司頁的上市公司

現有公司頁是 `epa-data.json` 的 95 個 `companyCode`。1301、1303、6505、2330 已有頁。

| 代號 | 公司 | 讓它過線的實體 | 口徑 |
|---|---|---|---|
| **1605** | 華新 | WNII 92%、Sunny 79.61%、Walhsu 79.62%、Everising 51%、Cogne 71.83%、Borrego 72.55%、中國各廠 | 任何口徑都過 |
| **1326** | 台化 | FG LA（直接 30%）；台灣興業（越南）42.5%；台化興業（寧波）100% | 任何口徑都過 |
| **2002** | 中鋼 | FHS 20.45% | 任何口徑都過（剛好） |
| 5347 | 世界 | VSMC 60%（只有在 VSMC 也收進來時才會出現） | 和台積電無關 |

不會新增：福懋 1434（本清單實體穿透後都 <20%，雖然它自己的越南／中國子公司是 100%）、中碳 1723（0%）、采鈺／精材／創意（沒有海外製造）。

---

## 5. 來源

- MOPS 檔：`../scripts/mops_company/{oversea_subsidiaries_union,subsidiaries_union}.csv`
- 台塑 115Q2 合併財報 `202602_1301_AI1.pdf`（doc.twse.com.tw）
- MOPS 1301 重大訊息 2026-03-06 序號 7（增加投資台塑美國）、2026-10-12 序號 2（2026Q3 自結損益）：mopsov.twse.com.tw `ajax_t05st01`
- Fubon 個股轉投資概況：https://fubon-ebrokerdj.fbs.com.tw/z/zc/zcg/zcg_{1301,1303,1326,1434,6505,2002}.djhtm
- 華新 2Q26 英文合併財報：https://www.walsin.com/wp-content/uploads/2026/02/2Q26-Consolidated-Financial-Statements.pdf；3Q24：https://www.walsin.com/wp-content/uploads/2024/02/3Q24-Consolidated-Financial-Statements.pdf
- TSMC 2Q26 合併財報：https://www.sec.gov/Archives/edgar/data/1046179/000104617926000541/a2026q2consolidatedreport-.htm；2025 年報第 8 章：https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch8.pdf；Sony 合資 6-K：https://www.sec.gov/Archives/edgar/data/1046179/000104617926000539/sonysemiconductorsolutions.htm
- 中鋼官網 FHS：https://www.csc.com.tw/csc/gc/goth_ste_p2.html
- 工商時報 2014-09-17 台塑四寶調整投資架構：https://www.ctee.com.tw/news/20140917700018-439901
- 工商時報 2016-01-29 中鋼加碼至 25%：https://www.ctee.com.tw/news/20160129700073-439901
- Taipei Times 2016-07-08（四寶各 11.432%、中鋼 25%、福懋 3.847%）：https://www.taipeitimes.com/News/biz/archives/2016/07/08/2003650561
- 鉅亨 2021-08-31（FHS-C 持有 FHS 100%）：https://news.cnyes.com/news/id/4713946
- 2018 年 FHS 增資後股權（台塑美國 14.23%、中鋼 20.46%、JFE 4.09%）：工商時報 2018-04-25 https://www.chinatimes.com/newspapers/20180425000221-260202（Cloudflare 擋，數字取自搜尋摘要，**未直接讀到原文**）
- 工商時報 2017-11-10 路州投資案持股：https://www.ctee.com.tw/news/20171110700024-439901
- FPC USA × FIC 合併：https://www.businesswire.com/news/home/20260801424605/en/
- FPC USA 歷史：https://www.fundinguniverse.com/company-histories/formosa-plastics-corporation-history/
- 華新鎳業設立：https://news.cnyes.com/news/id/4433115；旭日：https://www.ctee.com.tw/news/20220411700951-439803；Everising：https://www.steelradar.com/en/walsin-lihwa-to-build-stainless-steel-wire-rod-plant-in-indonesia/
- Cogne 完成收購：https://cogne.com/en/post/press-release-2
- Borrego：https://www.walsin.com/en/walsin-lihwa-corporation-announced-the-sale-of-its-u-s-solar-development-business-to-ecp-for-restructuring-its-business-strategy-of-green-energy/
- WaferTech：https://www.sec.gov/Archives/edgar/data/0000768251/000089161896001774/0000891618-96-001774.txt；https://www.eetimes.com/?p=1127502
- JASM：https://pr.tsmc.com/english/news/3105；ESMC：https://pr.tsmc.com/system/files/newspdf/attachment/3aa7f6c53c3ced9f8617aa786b1d92dab18e59fe/2023-08-08%20ESMC_Joint%20Press%20Release%20FINAL%20(en)_wmn.pdf
- 台積電出售世界先進：https://finance.ettoday.net/news/3168015
- 福欣（天龍投資）：https://finance.technews.tw/2016/06/25/fpg-investment-dilemma/
