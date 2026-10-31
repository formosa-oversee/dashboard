# 鴻海、豐泰印度經濟特區的「違規類別」審查，以及七邦會議紀錄掃描（2026-10-31）

spec 第 7 節「其他公司」O20 的查證紀錄、O21 待補的依據，附同一輪查過但沒有收的範圍。印度的連線限制與「違規類別」的定義見 `2026-10-30-india-official-records.md`（O19）。

## 查了哪些來源

- 只用環境部舊環評系統 environmentclearance.nic.in（robots `Allow: /`）。各邦污染控制委員會、中央污染控制委員會、國家綠色法庭、PARIVESH 的情況和 O19 那一輪相同，都沒有用。
- 範圍：坦米爾納德、安得拉、特倫甘納、卡納塔克、古吉拉特、北方邦、哈里亞納七邦，SEAC 與 SEIAA 會議紀錄索引中 2017-03 以後的全部 PDF，共 6,731 份。
- 約 2,800 份是沒有文字層的掃描檔，用 tesseract 補 OCR（150 dpi）。截至 2026-10-31 上午，坦米爾納德 2023 年以後的掃描檔已全部 OCR；其他邦的掃描檔還在處理，所以下面的結果只涵蓋有文字層的檔案與已經 OCR 的部分。
- 搜尋方式：
  - 用 MOPS 子公司表裡台灣上市公司的印度子公司英文名、核心名與品牌名，比對全文。
  - 另外從「violation」附近抽出申請人名稱（904 個），逐一對台資，只有緯創（O19）與 Cheyyar SEZ Developers（O21，待補）兩個。FIH India Developer（O20）是用子公司名比對找到的，它的違規類別寫在議程內文，不在申請人名稱旁。
- 引用的頁面都已經看過 PDF 影像，不只看文字層。SEAC 第 361、531、671 次是掃描檔，引文出自自己做的 OCR，再對照影像確認。

## O20：鴻海 FIH India Developer（Sriperumbudur）

### 來源

| 文件 | 網址 | 封存 | 用到的頁 |
|---|---|---|---|
| 坦米爾納德邦 SEIAA 第 627 次會議紀錄（2023-06-06） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/1406202370101116627thseiaaminutes.pdf | https://web.archive.org/web/20261030220210/https://environmentclearance.nic.in/writereaddata/FormB/agenda/1406202370101116627thseiaaminutes.pdf | 3–4（議程 3，File No. 10001） |
| 坦米爾納德邦 SEAC 第 380 次會議紀錄（2023-05-17） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/1406202382575937380seacminutes.pdf | https://web.archive.org/web/20261030220145/https://environmentclearance.nic.in/writereaddata/FormB/agenda/1406202382575937380seacminutes.pdf | 6–7 |
| 坦米爾納德邦 SEAC 第 531 次會議紀錄（2025-02-07） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/0603202526041962531stSEACSignedMinutes.pdf | https://web.archive.org/web/20261030234449/https://environmentclearance.nic.in/writereaddata/FormB/agenda/0603202526041962531stSEACSignedMinutes.pdf | 89–91（議程 531-20） |
| 環境部辦公室備忘錄 F. No. 22-21/2020-IA.III（2021-07-07） | https://environmentclearance.nic.in/writereaddata/OM/135319091%241._OM_07_07_2021.pdf | https://web.archive.org/web/20261030082752/https://environmentclearance.nic.in/writereaddata/OM/135319091$1._OM_07_07_2021.pdf | 5（定義 i） |
| 鴻海 107 年度年報 | https://image.honhai.com/financy_by_year/2018_annual_rpt_c1_1592655280_1594174023.pdf | https://web.archive.org/web/20261030220632/https://image.honhai.com/financy_by_year/2018_annual_rpt_c1_1592655280_1594174023.pdf | 575 |
| 鴻海 110 年度年報 | https://image.honhai.com/financy_by_year/2021%E5%85%AC%E5%8F%B8%E5%B9%B4%E5%A0%B1_1654509531.pdf | https://web.archive.org/web/20261030220650/https://image.honhai.com/financy_by_year/2021%E5%85%AC%E5%8F%B8%E5%B9%B4%E5%A0%B1_1654509531.pdf | 534 |
| 鴻海 111 年度年報 | https://image.honhai.com/financy_by_year/R1205000194%E9%B4%BB%E6%B5%B7%E7%B2%BE%E5%AF%86%E5%B9%B4%E5%A0%B1(%E4%B8%8A%E5%82%B3%E7%89%881).pdf | https://web.archive.org/web/20261030220729/https://image.honhai.com/financy_by_year/R1205000194%E9%B4%BB%E6%B5%B7%E7%B2%BE%E5%AF%86%E5%B9%B4%E5%A0%B1(%E4%B8%8A%E5%82%B3%E7%89%881).pdf | 560、575 |

- 會議紀錄的封存都用原檔（`id_`）下載回來比對，md5 和直接從 environmentclearance.nic.in 下載的檔案相同。
- 鴻海年報的封存以 gzip 壓縮存放，用 `curl --compressed` 解壓後比對，和直接下載的檔案相同。sha256：107 年度 `27aa4c99ef8e1aa150d14c2fcb3f27759de017b9d7cfae93c04b428d72c83b9d`、110 年度 `62631842e9e6be59bc6f35df81177751a7edb16c819ccd81948cdb8e81188c0b`、111 年度 `e9e226c631523feb378b7eabc991bc3b6a8d386014061e58eb6ba7a29a9bead6`。
- image.honhai.com 沒有 robots.txt（回 S3 AccessDenied）。年報連結是從鴻海官網投資人頁面取得的，doc.twse 的 robots 禁止抓取，沒有用。

### 審查經過

- **SEAC 第 380 次（2023-05-17，第 6–7 頁）**：
  - 特區在 SIPCOT 工業區第二期，總面積 63.03 公頃，其中 Bharat FIH（BFIH）49.73 公頃、Foxconn Hon Hai Technology India Mega Development（FHHI）13.30 公頃。
  - 既有建築 319,102 平方公尺（BFIH 142,815.1、FHHI 176,286.49），FHHI 擬增建 115,456 平方公尺，合計 434,558 平方公尺。屬 2006 年環評通知第 8(b) 項區域開發。
  - 委員會建議以違規類別核發 ToR，並註明 ToR 須以 W.P.(MD) No. 11757 of 2021 的結果為準。
  - 附加 ToR 第 2 條：在場址內外補種，彌補「3600 Nos. of trees cut-off during development of the existing site」，數量是砍掉的 10 倍。
  - 同一頁的文字層有一處把面積寫成 53.03 公頃，是 OCR 誤讀（影像與 49.73 + 13.30 都是 63.03）。
- **SEIAA 第 627 次（2023-06-06，第 3–4 頁）**：接受 SEAC 建議，以違規類別核發 ToR。條件：
  - 一年內依 S.O. 804(E) 提出獨立章節，評估違規期間的生態損害，並提出補救計畫與自然及社區資源增益計畫。
  - 「the action will be initiated by the competent authority under section 15 read with section 19 of the Environment (Protection) Act, 1986 against violation」。
- **SEAC 第 531 次（2025-02-07，第 89–91 頁）**：
  - 公司申請修改 ToR，把建築面積從 434,558 增為 479,036.52 平方公尺（SIA/TN/INFRA2/505870/2024）。
  - 委員會寫明「The construction work was started without obtaining Prior EC. Hence, ToR under violation category was issued earlier」。這是找到的紀錄裡唯一寫出違規內容的一句，第 380 次與第 627 次都沒寫。
  - 紀錄也整理了訴訟經過：違規處理程序 2021-07-15 起被馬德拉斯高等法院暫停；最高法院 2024-01-02 暫停兩份相關備忘錄；最高法院 2025-01-06 裁定事後許可申請可以繼續審查，但在另有裁定前不得核發最後許可。
  - 公司與顧問要求延後補件，案件延後。
- 之後到 2026-10 公開的坦米爾納德會議紀錄（已全部 OCR）沒有再出現這個案子，也沒看到環境許可、罰款或起訴。坦米爾納德 2026 年的 SEIAA 會議紀錄只公開了一部分。
- 同一特區的 FHHI 員工宿舍另有一般環境許可（SEAC 第 377 次、SEIAA 第 624 次，2023-05），不是違規案件，不收。

### 狀態與日期

- status 用 concluded：主管機關正式把案件列為違規類別（SEIAA 627），且有 SEAC 531 寫明的違規內容，但沒有看到罰款或處分。
- dateStart 用 SEIAA 核發違規類別 ToR 的 2023-06-06。

### 持股

- 111 年度年報第 560 頁（印刷頁 556）的關係企業組織圖 6-2-1-6-2：
  - 鴻海 → Foxconn (Far East) Limited（Cayman）→ FIH Mobile Limited 64% → Executstar International Limited → Excel True Holdings Limited → Eastern Source Investments Limited → Wise Excel Limited → FIH India Developer Private Limited 99.999997%。
  - Eastern Source 另直接持有 FIH India Developer 0.000003%。圖上沒有標比例的都是 100%。
  - 有效持股 64%。
- 最新一期（§4）：
  - 富智康 2026 年中期報告（https://www.fihmobile.com/assets/upload/images/2026/09/17/77e80926f8bcb88bf4b83e13.pdf，Wayback 20261031000241，sha256 `3c0a163121cf3a8284d571aa2997029bcf033053609b39c5b2aadc16a674fd40`）PDF 第 60 頁主要股東表：2026-06-30 Foxconn (Far East) Limited 持有 508,103,452 股，64.443%。2025 年報（https://www.fihmobile.com/assets/upload/images/2026/04/16/b2cc350d2f1eff3df057b4be.pdf，Wayback 20261031000300，sha256 `cfb8d28fcb79e63fbc2a7b8d9098c5be639366cbb698439b7fe89eb6448a478c`）PDF 第 49 頁，2025-12-31 相同。和 111 年度年報的 64% 一致，卡片不改。fihmobile.com 的 robots 是 `Allow: *`。
  - 鴻海 113 年度年報只有上冊（137 頁），沒有關係企業資料；2025 年報第 149 頁把關係企業資料改指向 MOPS 關係企業三書表（mopsov，robots 禁止抓取，沒讀）；MOPS 2025 子公司表只列到 Foxconn (Far East)；2026 年第 2 季合併財報只列富智康整個子集團。所以 FIH India Developer 最後一次逐家列名是 111 年度年報。SEAC 2025-02-07 第 531 次會議紀錄仍以它為申請人。
- 107 年度年報第 575 頁的關係企業基本資料已列出 FIH India Developer（設立 2006/7/7，地址 Sipcot High-Tech Sez, Plot No.M2A & M2B, Sunguvarchatram），controlSince 取 2018，早於事件（決策 38 第 1 條）。110 年度年報第 534 頁的組織圖是同一條路徑。
- 富智康是香港上市公司，依決策 30、36 只列在路徑中。
- 特區內的兩家廠商：Bharat FIH 在同一張組織圖上（FIH Mobile 旗下）。FHHI 列在 111 年度年報第 575 頁的關係企業基本資料（Foxconn Hon Hai Technology India Mega Development Private Limited，設立 2015/11/12）。SEAC 第 380 次把它寫成「Foxcon Hon Hoi India Mega development projects Pvt Ltd (FHHI)」；同一工業區的 FHHI 宿舍案（SEAC 第 377 次、SEIAA 第 624 次）用的是年報上的全名，簡稱同為 FHHI，所以視為同一家。

### 定位

- OSM 標為 Foxconn 的廠區（way 660317482，Sunguvarchatram），中心 12.9227, 79.8898，精度標 facility。
- 會議紀錄的地址是 SIPCOT 工業區第二期的 Mambakkam 與 Sunguvarchatram 村，和年報地址一致。OSM 沒有標出特區本身的範圍。

## O21（待補，編號保留不用）：豐泰 Cheyyar SEZ Developers

2026-10-31 審查決定先不上線，改列待補。理由：
- 三案的「違規類別」都源自公司自己的申請，SEAC 第 361 次用同一段文字記錄。
- 同批唯一走到實質審查的 Tindivanam 案，SEAC 第 671 次認定「從來沒有違規」，理由是廠房由租地的子公司興建、當時免許可，以及 SIPCOT 已有整片土地的環境許可。
- Cheyyar 與 Bargur 也在 SIPCOT 工業區內，這兩個理由可能同樣適用；但這兩案停在補件，從沒有實質審查。以 enforcement 上線，等於把對公司不利的方向放在一個尚未確認的認定上。

上線條件：SEAC／SEIAA 或法院對 Cheyyar 或 Bargur 有實質認定，例如核發違規類別環境許可、罰款、起訴，或明確駁回公司的抗辯。以下查證保留備用。

### 來源

| 文件 | 網址 | 封存 | 用到的頁 |
|---|---|---|---|
| 坦米爾納德邦 SEIAA 第 607 次會議紀錄（2023-04-03） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/2104202324164296607SEIAAMinutes.pdf | https://web.archive.org/web/20261030220121/https://environmentclearance.nic.in/writereaddata/FormB/agenda/2104202324164296607SEIAAMinutes.pdf | 34–37（議程 18–20） |
| 坦米爾納德邦 SEAC 第 361 次會議紀錄（2023-03-10，掃描檔） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/2104202331588892361stseacminutes.pdf | https://web.archive.org/web/20261030220048/https://environmentclearance.nic.in/writereaddata/FormB/agenda/2104202331588892361stseacminutes.pdf | 103–116（議程 361-18 至 361-20） |
| 坦米爾納德邦 SEAC 第 420 次會議紀錄（2023-11-02） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/2411202342080730420thseacminutes.pdf | https://web.archive.org/web/20261030220305/https://environmentclearance.nic.in/writereaddata/FormB/agenda/2411202342080730420thseacminutes.pdf | 1–2、16–17、33–34 |
| 坦米爾納德邦 SEIAA 第 674 次會議紀錄（2023-11-20） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/2911202378596925674SEIAAMinutes.pdf | https://web.archive.org/web/20261030220330/https://environmentclearance.nic.in/writereaddata/FormB/agenda/2911202378596925674SEIAAMinutes.pdf | 2、17 |
| 坦米爾納德邦 SEAC 第 671 次會議紀錄（2026-01-28，掃描檔） | https://environmentclearance.nic.in/writereaddata/FormB/agenda/1202202633622490671SEAC-1Minutes_11zon.pdf | https://web.archive.org/web/20261030234508/https://environmentclearance.nic.in/writereaddata/FormB/agenda/1202202633622490671SEAC-1Minutes_11zon.pdf | 65–81（議程 671-10） |
| 環境部辦公室備忘錄（同 O20） | 同上 | 同上 | 5 |
| 豐泰 107 年第 4 季合併財報 | https://www.fengtay.com/uploads/images/ir/financial-report/2018Q4.pdf | https://web.archive.org/web/20261030220751/https://www.fengtay.com/uploads/images/ir/financial-report/2018Q4.pdf | 20–21 |
| 豐泰 110 年第 4 季合併財報 | https://www.fengtay.com/uploads/images/ir/financial-report/2021Q4.pdf | https://web.archive.org/web/20261030220809/https://www.fengtay.com/uploads/images/ir/financial-report/2021Q4.pdf | 16–17、66–67 |
| 豐泰 111 年第 3 季合併財報 | https://www.fengtay.com/uploads/images/ir/financial-report/2022Q3.pdf | https://web.archive.org/web/20261030220834/https://www.fengtay.com/uploads/images/ir/financial-report/2022Q3.pdf | 10、12、14–15、54 |

只寫在這裡、沒有列為網站來源的過程紀錄（Tindivanam 案，SEAC 第 671 次已整理這段經過）：
- SEAC 第 479 次（2024-07-04）：https://web.archive.org/web/20261030234605/https://environmentclearance.nic.in/writereaddata/FormB/agenda/2808202428491344479thseacminutes.pdf
- SEAC 第 501 次（2024-09-27）：https://web.archive.org/web/20261030234424/https://environmentclearance.nic.in/writereaddata/FormB/agenda/0711202410799752501stSEACMinutesCompressed.pdf
- SEAC 第 550 次（2025-04-08）：https://web.archive.org/web/20261030234546/https://environmentclearance.nic.in/writereaddata/FormB/agenda/2705202580781521550SEACSIGNEDMINUTES.pdf

全部會議紀錄的封存都用原檔（`id_`）比對過 md5。fengtay.com 的 robots.txt 會轉址到首頁，沒有任何禁止規則。

### 審查經過

- **SEAC 第 361 次（2023-03-10）**：公司自行以違規類別申請三座特區擴建的 ToR。
  - Tindivanam（議程 361-18，第 103–108 頁）：總建築面積 297,994.08 平方公尺。
  - Bargur（議程 361-19，第 109–113 頁）：94.20 公頃，既有建築 142,819.59、擬增建 82,860.65 平方公尺。
  - Cheyyar（議程 361-20，第 114–116 頁）：總建築面積 317,115 平方公尺，列出 2014-06-30 的舊 ToR 與 2016-06-14 的 SEIAA 函。
  - 三案都寫「require prior Environmental Clearance. However, the project proponent has started the construction activities for expansion」，建議以違規類別核發 ToR，要求快速環評、生態損害評估、補救與資源增益計畫，並要求「No construction for the expansion shall be initiated at the project site without obtaining prior Environmental Clearance」。
- **SEIAA 第 607 次（2023-04-03，第 34–37 頁）**：三案都「decided to issue ToR under Violation」，並註明 ToR 不代表會取得環境許可，須以 W.P.(MD) No. 11757 of 2021 的結果為準。
- **SEAC 第 420 次（2023-11-02）**：
  - Bargur（議程 420-01，第 1–2 頁，SIA/TN/INFRA2/441712/2023）與 Cheyyar（議程 420-06，第 16–17 頁，SIA/TN/INFRA2/441796/2023；議程標題就是「Expansion of Existing Special Economic Zone without Prior Environmental Clearance」）：公司表示法院的暫停令仍有效，「they would implead in the case and move to the Court for vacating the stay」，兩案延後。
  - Tindivanam（議程 420-12，第 33–34 頁）：公司主張 SIPCOT 已在 2019-11-27 取得整片土地的環境許可，自己的工程不須事前許可、不應視為違規，要求時間取得律師意見，延後。
- **SEIAA 第 674 次（2023-11-20，第 2、17 頁）**：記錄上述延後並轉知公司。Bargur 案另寫明 30 天內不補件，申請會自動從 PARIVESH 下架。
- 之後到 2026-10 公開的坦米爾納德會議紀錄（已全部 OCR），用公司名、村名、地號、檔號 9811 與 9812 搜尋，都沒有再出現 Cheyyar 與 Bargur 兩案。Bargur 工業區其他廠商的案子有出現，但那是別家公司，不算（第 3 節第 7 條）。
- **Tindivanam 的後續**（SEAC 第 671 次第 65–81 頁整理）：
  - SEAC 第 479 次（2024-07-04）要公司列出 2022-10-04 前後與 ToR 之後的施工時序，並說明為何在申請系統填報違規、現在又主張不是違規。
  - 第 501 次（2024-09-27）公司缺席，延後。
  - 第 550 次（2025-04-08）依環境部 2025-03-28 備忘錄（轉述最高法院 2025-01-06 與 02-19 的裁定）延後。
  - 第 630 次（2025-10-13）公司要求延期補件。
  - 第 671 次（2026-01-28）：
    - 律師意見說公司只在保留的 9 公頃上蓋了約 7,000 平方公尺建築，97,042 平方公尺的工業廠房是轉租土地的 India Tindivanam Footwear 興建。
    - 委員會查到：公司 2022-07-15 取得的設廠同意只涵蓋行政大樓等設施；India Tindivanam Footwear 2022-12-16 取得 60,020 平方公尺鞋廠的設廠同意；依 2014-12-22 的 S.O. 3252，2 萬到 15 萬平方公尺的工業廠房免環境許可。
    - 委員會認定公司在申請時誤報為違規（「inadvertently placed under violation category」），建議 SEIAA「Withdraw the ToR issued under violation category … as there was never a violation as stated」並結案。
- 坦米爾納德 2026 年公開的 SEIAA 會議紀錄（954、971、997、1002、1018、1020、1025、1052、1056、1071 次）都沒有 Tindivanam 案，看不到 SEIAA 是否撤回。

### 若之後上線

- 只有 Cheyyar 與 Bargur 兩案能列為地點；Tindivanam 已被 SEAC 671 認定沒有違規，只能寫在摘要裡。
- dateStart 看屆時的實質認定日期，不再用 2023-04-03 的 ToR 日期。

### 持股

- 107 年第 4 季合併財報第 20–21 頁子公司表：GLO → Lotus Footwear Enterprises Limited（LUH）88.62%，LUH → Cheyyar SEZ Developers Private Ltd. 99.99%（從事印度工業區開發業）。controlSince 取 2018（決策 38 第 1 條）。
- 110 年第 4 季第 16–17 頁、111 年第 3 季第 14–15 頁：GLO → LUH 88.00%，GLO、LUH → Cheyyar SEZ Developers 合計 100.00%。持股明細（110 年第 4 季第 66–67 頁、111 年第 3 季第 54 頁）為 LUH 99.99%、GLO 0.01%。
- 111 年第 3 季第 10 頁：本公司 → Growth-Link Overseas（GLO）100%。
- 有效持股 88% × 99.99% + 0.01% ≈ 88.0%。
- 111 年第 3 季第 12 頁另列本公司新設的 India Tindivanam Footwear Private Limited 88.00%，也就是 Tindivanam 廠房的興建者。

### 定位

- Cheyyar：OSM 標為 Cheyyar SEZ Developers Pvt. Ltd. 的範圍（way 597913161），中心 12.7221, 79.6662，精度標 facility。
- Bargur：OSM 沒有這座特區，也沒有 SIPCOT Bargur 工業區的範圍。座標用 Olaipatti 村的 ICDS 中心（node 12319956087，12.2923, 78.4172），精度標 city。會議紀錄的地址是 Uthangarai 鄉 Olaipatti 村與 Pochampalli 鄉 Balethottam 村。
- 會議紀錄寫的面積不一致：Tindivanam 第 361、479 次寫 67.75 公頃，第 420 次寫 57.75 公頃，第 671 次的租約寫 67.78 公頃。

## 不收

- 台資企業的一般環境許可申請 4 件：員工宿舍 2 件、辦公研發大樓擴建 1 件、化工廠的許可與許可修正 1 件。都不是違規案件。
- 經濟特區或工業區裡其他廠商的案子，不掛到台資開發商（第 3 節第 7 條）。
- 2026-10-31 下午七邦的掃描檔全部 OCR 完。再用 MOPS 台資印度子公司全名單（去掉公司字尾後 187 個名稱）比對全部文字，並重抽「violation」附近的申請人名稱：新命中 2 筆，都不是違規案件，不收；違規類別案件仍只有 O19、O20、O21。
