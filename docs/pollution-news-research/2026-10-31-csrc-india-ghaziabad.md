# 國際中橡印度 Ghaziabad 碳黑廠停產（2026-10-31）

spec 第 7 節「其他公司」O22 的查證紀錄，以及 2018-11 那次停工命令列待補的依據。印度的連線限制見 `2026-10-30-india-official-records.md`。

## 怎麼找到的

- 2026-10-30 查印度時，國際中橡的 Continental Carbon India Limited（CCIL）只找到媒體報導，持股也還沒查，所以先列在 repo 外的筆記，沒有進 spec。
- 這次的進展：
  - 持股從國際中橡官網的年報、財報查清楚。
  - 在 106 年度合併財報的期後事項找到公司自己的記載，達到第 3 節第 1 條的門檻。

## O22：2017-12 停產，2018-03-28 獲准恢復生產

### 來源

| 文件 | 網址 | 封存 | 用到的頁 |
|---|---|---|---|
| 中國合成橡膠（今國際中橡）106 年度年報 | https://media.taiwancement.com/web_csrc/report/stockholders/107%20106%E5%B9%B4%E5%A0%B1.pdf | https://web.archive.org/web/20261031054244/https://media.taiwancement.com/web_csrc/report/stockholders/107%20106%E5%B9%B4%E5%A0%B1.pdf | PDF 172（印刷頁 -151-）合併財報附註三五；245（-224-）個體財報附註三十；125 子公司表 |
| CitySpidey，〈CPCB orders temporary closure of Continental Carbon〉（2018-11-17） | https://www.cityspidey.com/news/7080/cpcb-orders-temporary-closure-of-continental-carbon/ | https://web.archive.org/web/20201108131358/https://www.cityspidey.com/news/7080/cpcb-orders-temporary-closure-of-continental-carbon/ | 文末背景段 |

- 年報 PDF 的封存用原檔（`id_`）下載回來比對，md5 和直接下載的相同。sha256：106 年度年報 `61e6725866822f4a42e52c3b7c6dbf5084707d7022ca6eb806d2368202ab6881`。
- media.taiwancement.com、www.csrcgroup.com 都沒有 robots.txt（回 404）。年報連結取自國際中橡官網投資人頁面（`investors2.html`），沒有用 doc.twse。
- 106 年度年報附註三五用 pdftotext 抽出來是亂碼，轉成圖片判讀。合併財報與個體財報兩處文字相同，事件引用合併財報那頁。
- CitySpidey 主站從台灣連 443 逾時（2026-10-31）。robots 的 Wayback 封存（20250101）是 `User-agent: * Allow: /`，只禁止 /includes/、/search/ 等目錄，/news/ 允許。文章用 Wayback 2020-11-08 的封存判讀。

### 財報記載（附註三五「重大之期後事項」）

- 印度最高法院 2017 年 10 月下旬對德里首都圈（NCR）的油品發布禁令，涵蓋碳黑原料油（CBFS），但沒有清楚定義禁止使用的油品種類。CCIL 向中央與地方政府查證，都沒有得到明確澄清。
- 2018-03-07 拜會環境部（MoEF），環境部承諾向最高法院爭取豁免；取得豁免前，禁令仍不能排除對 CCIL 的適用。
- 2018-03-28 CCIL 收到環境部與北方邦污染控制委員會（U.P. Pollution Control Board）通知，可以使用硫含量符合管制的 CBFS 生產，「CCIL 公司現得不受禁令拘束恢復生產」。
- 財報寫的原因是首都圈燃油禁令，沒有寫這座廠排放超標。

### 媒體報導（只用背景段）

- CitySpidey 2018-11-17 文末：北方邦污染控制委員會（UPPCB）2017 年 12 月認定公司違反 1981 年《空氣（污染防治）法》，下令關廠，工廠 2018 年 4 月復工。
- 這句沒有其他可開啟的媒體佐證。摘要寫明是 CitySpidey 的說法（決策 26），標題也不寫成「違反空氣法」。
- 這篇的主文是 2018-11 CPCB 的停工命令，列待補，見下一節。
- 另有市調公司 1 家的產業新聞頁面提到這次停工，頁面沒有日期、作者和出處，不列為來源。

### 狀態與日期

- `concluded`：停產來自禁令與關廠命令，不是罰款，也不是法定罰則。前例是 O2 改善命令、W2 mise en demeure、W6 責令封堵。
- `dateStart` 取 2017-12（month），依 CitySpidey 寫的關廠月份；最高法院禁令的時間（2017 年 10 月下旬）寫在摘要。
- `dateEnd` 取 2018-03-28，財報記載的獲准恢復生產日期。

### 持股

| 文件 | 封存 | 用到的頁 | 內容 |
|---|---|---|---|
| 中國合成橡膠 105 年度年報（2017 年刊印） | https://web.archive.org/web/20261031054221/https://media.taiwancement.com/web_csrc/report/stockholders/106%20105%E5%B9%B4%E5%A0%B1.pdf | PDF 232（-228-）、234 | 組織圖（2016-12-31）：中國合成橡膠 → CSRC (BVI) 100% → CSRC (Singapore) 100% → Continental Carbon India 100.00%；董監資料（2017-04-30）：88,917,140 股、100.00% |
| 中國合成橡膠 106 年度年報 | 同上表 | PDF 125 | 合併財報子公司表：2017-12-31、2016-12-31 都是 100.00% |
| 國際中橡 2026 年第二季合併財報（英文版） | https://web.archive.org/web/20261031054342/https://media.taiwancement.com/web_csrc/report/financial/115%202Q%20%E8%B2%A1%E5%A0%B1.pdf | PDF 21、65 | 2026-06-30、2025-12-31：CSRC (Singapore) 持有 Continental Carbon India Pvt Ltd. 100.00%（408,390,634 股） |

- sha256：105 年度年報 `20e9ffd414546705f3417b5ba1ccbe8d2210aa538dcdf8b5a9b94e1c82eaa7dc`、2026Q2 財報 `ee8818c086a52511d1b56d69b00662faf373362c4d4f91af7ce9a74c19ae181f`。
- 中國合成橡膠 2018 年以分割方式轉型為投資控股公司，更名國際中橡投資控股，上市代號同為 2104（107 年度年報股東會決議事項）。
- 105 年度年報在事件前刊印，controlSince 取 2016（決策 38 第 1 款）。
- 之前筆記寫的「IFC 揭露約 66.7%」是誤植：105 年度年報同頁的 66.67% 是美國 Continental Carbon Company 的持股。

### 定位

- OSM 沒有這座廠。公司官網只列聯絡地址，找不到可核對的廠區位置，依決策 31 降為城鎮。
- 座標用 OSM 的 Ghaziabad 城市節點（node 2521085873，28.6712, 77.4120）。

## 待補：2018-11 CPCB 停工命令

- 內容：CitySpidey 2018-11-17 主文。
  - 中央污染控制委員會（CPCB）空氣實驗室 2018-10-29 稽查，認定鍋爐煙囪排放超過《環境（保護）法》的標準。
  - CPCB 下令立即停工，到改善並取得 CPCB 許可才能復工。
  - 文中引用 CPCB 通知，也有公司營運主管的反駁。
- 缺的：CPCB 依《環境（保護）法》第 5 條發的命令原件，或第二家獨立媒體。
- 國際中橡 114 年度年報（Wayback 20261031054317）PDF 第 77 頁（印刷頁 -73-）TCFD 實體風險段寫「印度廠區 2018 年底因當地空污嚴重造成停產」，只證明停產，原因寫成空污嚴重，沒有寫主管機關命令。
- 國際中橡 107 年度年報的財報附註只有 CCIL 的稅務案，沒有提到這次停工。
- 查過但用不了的：
  - Times of India 2018-12-25 的報導只見於 India Environment Portal 轉載，該站 robots `Disallow: /`，沒有抓。ToI 原文在 ToI 網站與 Wayback 都找不到。
  - CitySpidey 另外兩篇（居民抗議、行政區關廠名單）是同一家，不增加獨立來源。
  - 國際中橡 2018（英文版）、2019 年永續報告書沒有提到印度廠停工。
  - 印度子公司官網的 2017–2020 年股東會通知是掃描檔，OCR 後沒有相關內容。
- 可以再找：CPCB 網站的 Section 5 directions 清單、國家綠色法庭判決（Crossings Republik 居民有沒有提告）。兩者都要先看 robots。
- 上線時再給編號。
