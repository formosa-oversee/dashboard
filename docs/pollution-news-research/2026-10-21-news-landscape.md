# 污染新聞版圖：台塑（1301）、華新麗華（1605）、台積電（2330）

調查日期：2026-10-21。範圍：2015–2026 年為主，另收幾件指標性的舊事件。
目的：提供事實，讓團隊決定公司頁「相關新聞」分頁要涵蓋哪些範圍。本文件不含產品建議。

## 驗證標記

- **[已驗證]**：我用 WebFetch 或 curl 開過頁面（HTTP 200），標題、日期或內文與敘述相符。
- **[搜尋確認]**：頁面擋爬蟲（403、Cloudflare）或沒開，只能從搜尋結果摘要確認。
- **[未驗證]**：找不到可佐證的頁面，或來源間互相矛盾。

## 對應本站設施的方法

依據是 `data/epa-data.json`（95 家公司）和 `data/ownership-resolution.json`：

- **tw-1301**：共 11 個設施，分布在 Point Comfort TX（TX0085570、TXR15285Z、TXR1575HM、TXR05GN80、TXR15979T）、Illiopolis IL（IL0001350、IL0042366、ILR10C876）、Baton Rouge LA（LA0006149、LAR10N976）和 Delaware City DE（DE0000612）。ECHO 違規紀錄共 2,406 筆，大多來自 IL0001350（1,551 筆）和 TX0085570（626 筆）。
  - 注意：專案自己的 ownership 註記寫明，FPC USA 及其 TX、LA、DE 各廠是台塑集團的私人關係企業，不是 1301 的 MOPS 子公司。2026-08-01 Formosa Industries Corp.（1301 100% 持有）併入 FPC USA 後，1301 才持有存續公司股權，比例未揭露。
- **tw-6505（台塑化）**：有 FG LA LLC 在 St. James 的兩個設施（LAR10N960、LAR10N958）。
- **tw-2330**：26 個設施，多數位於 Phoenix AZ 5088 W Innovation Cir，另有 IRWP 再生水廠 AZC110436，以及 TSMC Washington（Camas WA，WAR003032）。ECHO 違規 44 筆，幾乎全部在 TSMC Washington 的雨水許可上。
- **tw-1605（華新麗華）**：`epa-data.json` 裡沒有這家公司，因此本站沒有任何華新設施。

---

## 1. 台塑（1301）與集團關係企業

### 持股路徑重點

- **Formosa Ha Tinh Steel（FHS，越南河靜）**
  - 2014-03 時，台塑、南亞、台化、台塑化經由「台塑集團投資（開曼）」（四家各持 25%）與福懋（開曼），再透過「台塑河靜（開曼）」間接持有 FHS。四家各 14.75%，福懋 4.963%。[已驗證] https://news.cnyes.com/news/id/954928 （2014-03-20）
  - 中鋼持股在 2015-02 由 5% 增至 25%。[已驗證] https://www.fastmarkets.com/insights/taiwans-china-steel-raises-stake-in-formosa-ha-tinh-steel/ （2015-02-16）
  - 2016 年報導指出，四寶合計持股降到 50% 以下，釋出的股份由麥寮汽電、台塑美國（FPC USA）認購。[已驗證] https://technews.tw/?p=164961 （2016-06-25，轉載財訊）
  - 2023 年公視引述，台塑集團合計持有 75.431%。[已驗證] https://news.pts.org.tw/article/639185 （2023-05-30）
  - 2019 年另有報導寫「台塑近八成、中鋼 20%、JFE 4%」，與上述數字不一致。[搜尋確認]
  - FHS 不在 `overseas-footprint.csv` 裡，因為它是關聯企業，不是任何單一上市公司的子公司。1301 目前的實際持股需以年報為準。[未驗證]
- **FPC USA 系統（Formosa Plastics Corp., Texas／Louisiana／Delaware／Illinois）**
  - 屬私人關係企業。2026-08-01 FIC 併入 FPC USA，由 FPC USA 存續。[已驗證] https://www.fpcusa.com/formosa-plastics-corporation-merger/ （2026-08-01）、https://www.chemanalyst.com/NewsAndDeals/NewsDetails/formosa-plastics-usa-completes-merger-with-formosa-43683 （2026-08-03）
  - Business Wire 原稿網址回 403。[搜尋確認]
- **FG LA LLC（路易斯安那「陽光計畫」）**
  - 持股路徑：台塑化 6505 → FG INC.（57%）→ FG LA LLC（100%）（MOPS CSV）。FG INC. 其餘 43% 的持有人不在 CSV 裡。
  - 2020 年環團稱轉投資方是「台塑化、南亞、台化」，台塑董事長則稱「台塑未投資」。[已驗證] https://news.pts.org.tw/article/482449 （2020-06-10）、https://www.ettoday.net/news/20200610/1734355.htm

### 事件表

| # | 時間 | 事件 | 地點／廠區 | 營運實體 → 上市母公司 | 類型 | 對應本站設施 |
|---|---|---|---|---|---|---|
| F1 | 1998-12 起，1999 運回 | 汞污泥約 3,000 噸傾倒於柬埔寨，引發暴動，一名碼頭工人死亡 | 柬埔寨施亞努港 | 台塑 1301（仁武廠廢料） | 污染事故（跨境廢棄物） | 否 |
| F2 | 2004-04-23 | PVC 廠爆炸，5 死 3 重傷，約 150 名居民撤離，廠房永久關閉。CSB 於 2007-03-06 發布最終報告 | 美國 Illiopolis, IL | Formosa Plastics Corp. Illinois（FPC USA 系統，私人關係企業） | 污染事故（工安爆炸） | 是：Illiopolis IL0001350／IL0042366／ILR10C876 |
| F3 | 2005-10-06 | 烯烴廠丙烯外洩爆炸起火，多名工人受傷，Point Comfort 與 Port Lavaca 居民就地避難 | 美國 Point Comfort, TX | Formosa Plastics Corp., Texas | 污染事故（工安爆炸） | 是：Point Comfort |
| F4 | 2009-09-29 | EPA／DOJ 和解：承諾投入逾 1,000 萬美元污染控制，另付民事罰款 280 萬美元（違反 CAA、CWA、RCRA、EPCRA） | Point Comfort TX、Baton Rouge LA | FPC Texas、FPC Louisiana | 環境裁罰 | 是：Point Comfort、Baton Rouge LA0006149 |
| F5 | 2009 調查，2011-05 裁罰 | 仁武廠土壤與地下水遭氯化溶劑污染。2003 年已知卻未通報，環保署依水污法重罰新台幣 8,000 萬元 | 台灣高雄仁武 | 台塑 1301 本身 | 環境裁罰 | 否（台灣） |
| F6 | 2016-04-06 起 | 河靜鋼廠排放含酚、氰化物的廢水，中部四省大量死魚。2016-06-30 越南政府認定 FHS 須負責，台塑承認並賠償 5 億美元 | 越南河靜、廣平、廣治、承天順化 | FHS ← 台塑河靜（開曼）← 四寶＋福懋（另有中鋼、JFE、麥寮汽電、FPC USA） | 污染事故 | 否（ECHO 不涵蓋越南） |
| F7 | 2019-06-11 迄今 | 7,875 名越南受害者在台北地院跨國求償約 1.4 億元。2019-10-14 地院以無管轄權駁回，2020-03 高院駁回，2020 年 10–11 月最高法院改認台灣有管轄權。至 2026-04 仍未進入實體判決 | 台北地院（事件地在越南） | 被告：台塑集團、中鋼、JFE 與 FHS 董事 | 訴訟 | 否 |
| F8 | 2017-07-31 起訴，2019-06 判決，2019-10-15 宣布和解，2019-12 法院核准 | Waterkeeper 與 Diane Wilson 依 CWA 提起公民訴訟，指控塑膠粒排入 Lavaca Bay／Cox Creek。法官 Hoyt 判 Formosa 敗訴並稱其為「serial offender」。和解金 5,000 萬美元，分 5 年付入信託，並承諾「零排放」。此前 TCEQ 已於 2019-01 罰款 121,875 美元 | Point Comfort, TX | Formosa Plastics Corp., Texas 與 FPC USA | 訴訟／和解（另有州級裁罰） | 是：Point Comfort TX0085570（NPDES）及雨水許可 |
| F9 | 2020–2026 | 和解後依每次排放計罰：2021-04-30 第五巡迴上訴法院裁定只有「新排放」才觸發付款。至 2025-01 累計罰款逾 2,400 萬美元，另花 3,200 萬美元清除舊污染，每週三次各付 65,000 美元 | Point Comfort, TX | 同 F8 | 和解後罰款 | 是：Point Comfort |
| F10 | 2021-09-13 | EPA／DOJ 依 CAA 112(r) 風險管理計畫和解：民事罰款 285 萬美元，另需至少 140 萬美元改善。起因是 2013-05 至 2016-10 間一連串火災、爆炸與外洩，造成工人二、三度灼傷及吸入氯氣送醫 | Point Comfort, TX | Formosa Plastics Corp., Texas | 環境裁罰 | 是：Point Comfort |
| F11 | 2019 至 2026-02 | 「陽光計畫」石化園區（約 94 億美元）爭議：2020-11-04 陸軍工兵團暫停濕地許可；2022-09-14 州法院撤銷約 15 張空污許可；2024-01-19 上訴法院推翻並恢復許可；2026-02-05 環團控告 LDEQ 第四度展延 PSD 許可。至今尚未興建 | 美國 Louisiana St. James Parish | FG LA LLC ← FG INC.（台塑化 6505 持 57%） | 環評／許可爭議、訴訟 | 在 tw-6505：LAR10N960／LAR10N958，不在 tw-1301 |
| F12 | 2024-02/03 | TCEQ 草案許可准 LNRA 每年自 Lavaca River 引水最多 310 億加侖，蓄水庫建在 Formosa 自有土地，用於 Point Comfort 擴廠 | Point Comfort, TX | FPC Texas（間接） | 資源使用（水） | 間接 |
| F13 | 2024-07 | 德州州政府與 Formosa 的 agreed final judgment：2019-06 至 2021-09 間有 9 起排放事件未依時通報，民事罰款 47.5 萬美元，另付律師費 7.5 萬美元 | Point Comfort, TX | Formosa Plastics Corp., Texas | 環境裁罰 | 是：Point Comfort |
| F14 | 2023-05-30、2026-05-27/28 | 跨國團體赴台塑股東會抗議：2023 年由越南受害者與 Diane Wilson 出席；2026 年 Diane Wilson、Sharon Lavigne、Nancy Bui 在凱道開記者會並出席股東會，主題結合 FHS 十週年與台美貿易協定 | 台北 | 台塑集團 | 其他（倡議） | 否 |

### 各事件來源

- **F1**
  - [已驗證] Cambodia Daily，"Second Test Confirms Waste's High Toxicity"（1998-12-31）https://english.cambodiadaily.com/1998/12/31/second-test-confirms-wastes-high-toxicity/
  - [已驗證，標題與日期] Grist，"Made in Taiwan"（1999-06-11）https://grist.org/article/in18/
  - 中文：天下雜誌 https://www.cw.com.tw/article/5036110 [搜尋確認，頁面 403]
- **F2**
  - [已驗證] CSB 最終報告新聞稿（2007-03-06）https://www.csb.gov/csb-issues-final-report-and-safety-video-on-formosa-plastics-explosion-in-illinois-concludes-that-company-and-previous-owner-did-not-adequately-plan-for-consequences-of-human-error/
  - [已驗證] CSB 2005-10-06 新聞稿，內文提到 Illiopolis 事故：https://www.csb.gov/csb-deploys-investigation-assessment-team-to-site-of-formosa-plastics-explosion-in-point-comfort-texas/
- **F3**
  - [已驗證] 同上 CSB 2005-10-06 新聞稿。
  - [搜尋確認] KHOU 報導：https://khou.com/article/news/workers-injured-after-blast-at-formosa-plastics-plant-in-point-comfort/285-320984673
  - 受傷人數各家報導從 13 到 16 人不等。
- **F4**
  - [已驗證] EPA 新聞稿（2009-09-29）https://www.epa.gov/archive/epapages/newsroom_archive/newsreleases/6aef3a2a3a324b11852576410053a31c.html
  - [已驗證] 中文：地球公民基金會轉譯（2010-05-20）https://www.cet-taiwan.org/story/201005/733
  - [搜尋確認] DOJ 新聞稿頁面存在但內容渲染為空：https://www.justice.gov/archives/opa/pr/formosa-plastics-corp-texas-and-formosa-plastics-corp-louisiana-will-spend-more-10-million
- **F5**
  - [已驗證] Taipei Times，"Formosa Plastics hit with NT$80m fine"（2011-05-05）https://www.taipeitimes.com/News/biz/archives/2011/05/05/2003502414
  - [搜尋確認] ICIS（2010-03-26）https://www.icis.com/explore/resources/news/2010/03/26/9345993/pollution-charge-may-shut-formosa-s-jenwu-taiwan-vinyls-facility/
  - 沒找到可開啟的中文主要來源。
- **F6**
  - [已驗證] Viet Nam News，"Formosa blamed for fish death"（2016-06-30）https://vietnamnews.vn/society/298928/formosa-blamed-for-fish-death.html
  - [已驗證] Viet Nam News，"PM announces Formosa compensation"（2016-10-01）https://vietnamnews.vn/society/343737/pm-announces-formosa-compensation.html
  - [已驗證] Mongabay 十週年報導（2026-04-06）https://news.mongabay.com/2026/04/10-years-after-vietnams-formosa-steel-plant-spill-justice-for-victims-remains-elusive/
  - [已驗證] 中文：公視（2017-04-05）https://news.pts.org.tw/article/354530
  - [已驗證] 中文：環境資訊中心（2017-03-15）https://e-info.org.tw/node/203502
- **F7**
  - [已驗證] 公視（2019-06-11）https://news.pts.org.tw/article/434266
  - [已驗證] RFA（2019-06-11）https://www.rfa.org/english/news/vietnam/suit-06112019145124.html
  - [已驗證] BHRRC（2019-10-30）https://www.business-humanrights.org/en/taipei-court-dismisses-lawsuit-filed-by-8000-vietnam-marine-disaster-victims
  - [已驗證] RFA 報導最高法院裁定（2020-12-03）https://www.rfa.org/english/news/vietnam/appeal-12032020160820.html
  - [已驗證] FIDH 中文聲明（2022-01-21）：https://www.fidh.org/%E4%B8%AD%E6%96%87/%E5%8F%B0%E7%81%A3-%E6%9C%80%E9%AB%98%E6%B3%95%E9%99%A2%E8%A3%81%E5%AE%9A%E5%8F%B0%E5%A1%91%E8%B6%8A%E9%8B%BC%E6%A1%88%E6%99%82
  - [已驗證] Mongabay（2026-04-06），寫明至今仍無實體判決。
  - 最高法院裁定的確切日期，各來源分別寫 2020-10-18 與 2020-11。[未驗證確切日]
- **F8**
  - [已驗證] Texas Tribune（2019-06-28）https://www.texastribune.org/2019/06/28/federal-judge-rules-lawsuit-formosa-plastics-texas-pollution-case/
  - [已驗證] Texas Tribune（2019-10-15）https://www.texastribune.org/2019/10/15/formosa-plastics-pay-50-million-texas-clean-water-act-lawsuit/
  - [已驗證，200] Texas Tribune（2019-12-03）https://www.texastribune.org/2019/12/03/texas-judge-approves-settlement-agreement-water-pollution-formosa/
  - [已驗證] TRLA 新聞稿（2019-10-15）https://trla.org/news-releases/formosa-plastics-agrees-to-pay-50-million-settlement-for-polluting-texas-waterways
  - [已驗證] TRLA 談 TCEQ 罰款（2019-01-18）https://trla.org/journal/texas-fines-formosa-plastics-for-polluting-state-waters
  - [搜尋確認] ELAW 保存的 consent decree，檔名標 27 Nov 2019：https://elaw.org/resource/us_formosa_consentdecree_27nov2019
  - 中文：公視 2023-05-30 有提及（見上）。
- **F9**
  - [已驗證] 第五巡迴上訴法院意見書 No. 20-40575（2021-04-30）https://www.ca5.uscourts.gov/Opinions/unpub/20/20-40575.0.pdf
  - [已驗證] Courthouse News（2021-03-31）https://www.courthousenews.com/owner-of-plastics-plant-asks-for-limits-on-settlement-payments/
  - [已驗證] Texas Tribune／Inside Climate News（2025-01-03）https://www.texastribune.org/2025/01/03/texas-pollution-settlement-formosa-plastics-diane-wilson-matagorda-bay/
  - [未驗證日期] Plastics News，"Formosa faces $2.2M in new penalties…"（頁面 403）https://www.plasticsnews.com/news/formosa-faces-22m-new-fines-texas-plastic-pollution
- **F10**
  - [已驗證] EPA 新聞稿（2021-09-13）https://epa.gov/newsreleases/texas-plastics-corporation-will-pay-nearly-3-million-violating-clean-air-act-0
  - [搜尋確認] DOJ 新聞稿：https://www.justice.gov/opa/pr/texas-plastics-corporation-will-pay-nearly-3-million-violating-clean-air-act
  - [搜尋確認] Chemical Week 報導 2013-05 PE-1 廠火災 16 人受傷。
- **F11**
  - [已驗證] Earthjustice（2022-09-14）https://earthjustice.org/press/2022/louisiana-court-vacates-air-permits-for-formosas-massive-petrochemical-complex-in-cancer-alley
  - [已驗證] Earthjustice（2024-01-19）https://earthjustice.org/press/2024/louisiana-court-ruling-reverses-lower-court-decision-and-upholds-air-permits-for-formosa-plastics-massive-petrochemical-complex-in-cancer-alley
  - [已驗證] Earthjustice（2026-02-05）https://earthjustice.org/press/2026/groups-sue-over-formosa-plastics-permit-extension
  - [已驗證] Earthjustice Formosa 文件庫：https://earthjustice.org/library/formosa
  - [搜尋確認] Louisiana Illuminator（2021-01-05）https://lailluminator.com/2021/01/05/judge-dismisses-formosa-plastics-lawsuit-but-permit-remains-suspended/
  - [已驗證] 中文：公視（2020-06-10）https://news.pts.org.tw/article/482449
  - 2024-03 環團請求州最高法院審理，結果[未驗證]。
- **F12**
  - [已驗證] Texas Tribune／ICN（2024-03-08）https://www.texastribune.org/2024/03/08/texas-reservoir-formosa-chemical-expansion/
- **F13**
  - [搜尋確認] Texas Register（2024-07-19，頁面 403）https://www.sos.texas.gov/texreg/archive/July192024/In%20Addition/In%20Addition.html
- **F14**
  - [已驗證] 公視（2023-05-30）https://news.pts.org.tw/article/639185
  - [已驗證] 聯合報（2026-05-27）https://udn.com/news/story/7266/9528373

### 相關但未列入主表

- 2002 年 Baton Rouge 與 LDEQ 和解，罰款 30 萬美元。
- 2016 年 EPA Region 6 對 Baton Rouge 的 CAA 同意令（CAA-06-2016-3361），金額未見。
- 以上兩件都只有搜尋確認。Delaware City 廠查無重大新聞。

---

## 2. 華新麗華（1605）

### 持股路徑（MOPS 2025Q2，`overseas-footprint.csv`）

- **PT. Walsin Nickel Industrial Indonesia（WNII）**：華新直接持有 50%。廠房位於 IMIP，Central Sulawesi 的 Morowali，生產鎳生鐵（NPI），並有自備電廠。
  - 來源是公司在 Jobstreet 與台大實習網的介紹頁。[搜尋確認]
- **PT. Sunny Metal Industry**：華新 → Walsin Singapore Pte. Ltd.（100%）→ Sunny Metal（50.10%）。位於 IWIP，North Maluku 的 Weda Bay，生產鎳冰銅。
  - GEM 資料顯示，Weda Bay power station 的 Unit 7（燃煤，380 MW，2022 年運轉）由 Sunny Metal 100% 持有，Walsin 持 50.1%、PT Harum Energy 持 10.6%。[已驗證] https://www.gem.wiki/Weda_Bay_power_station
- **PT. Walhsu Metal Industry**：由 Sunny Metal 持有 99.90%，所在園區[未驗證]。
- **PT. Walsin Everising Specialty Steel Indonesia**：Walsin Singapore 持有 29.5%。
- **Cogne Acciai Speciali S.p.A.**（義大利 Aosta 特殊鋼廠）：華新 → Walsin Lihwa Europe（100%）→ MEG S.A.（100%）→ Cogne（71.83%）。
- **美國子公司**：Walsin America LLC、Borrego Energy（太陽能開發商）。本站沒有這些子公司的 ECHO 設施。

### 事件表

| # | 時間 | 事件 | 地點／廠區 | 營運實體 → 上市母公司 | 類型 | 對應本站設施 |
|---|---|---|---|---|---|---|
| W1 | 2022 起運轉 | Sunny Metal 在 IWIP 自備 380 MW 燃煤機組。GEM 引述 Rest of World（2022-11）指出，IWIP 開發污染了居民主要水源、反覆淹水，且逾 20% 礦區落在保護林內（此為園區整體問題，非華新專屬） | 印尼 Weda Bay, North Maluku | PT Sunny Metal Industry（華新經 Walsin Singapore 持 50.1%） | 資源使用（燃煤）／其他 | 否（1605 不在 epa-data） |
| W2 | 2023-12-24 | IMIP 內 PT ITSS（青山集團）爐體爆炸，死亡人數持續上升。屬園區背景事件，不是華新的設施 | 印尼 IMIP Morowali | PT ITSS（非華新） | 污染事故／工安 | 否 |
| W3 | 2024-09 | 環團指控：華新在 IMIP 的一名年輕工人遭壓傷，從 20 多公尺高處墜落死亡。華新回應稱印尼政府已調查結案，並依法撫恤 | 印尼 IMIP Morowali | 華新鎳業（WNII，50%） | 其他（職災） | 否 |
| W4 | 2024-11-10 | TTNC Watch 發表《台灣企業在印尼的人權與環境影響報告》，點名 WNII、Sunny Metal、Walhsu | 印尼 IMIP、IWIP | 同上 | 其他（NGO 報告） | 否 |
| W5 | 2025-06-17（2025-06-19 報導） | 印尼環境部查出 IMIP 多項違規：缺中央污水廠、TSP/PM10 超標、24 個租戶排放源沒有 CEMS、逾 1,200 萬噸礦渣與尾礦違法堆置、1,800 公頃超出 AMDAL 核准範圍。將處行政罰鍰、全區稽核，並準備刑事與民事訴訟。只點名園區管理方 PT IMIP，**未點名華新** | 印尼 IMIP Morowali | PT IMIP（華新 WNII 是租戶） | 環境裁罰（園區層級） | 否 |
| W6 | 2025-08-05 | 環境權保障基金會、AEER、WALHI 偕同印尼居民與華新子公司員工到台北總部陳抗，指控冶煉廠與燃煤電廠造成空污、水污，有小學距煙囪僅約 100 公尺。華新稱沒有持續新建燃煤電廠，並已設脫硫脫硝與 CEMS | 印尼 Morowali、Weda Bay | WNII、Sunny Metal 等 | 其他（倡議）、污染指控 | 否 |
| W7 | 2025-11 | Dialogue Earth／Eco-Business 報導，IMIP 周邊村落表示政府記錄違規後，看不到後續處置 | 印尼 Morowali | IMIP（園區） | 其他 | 否 |
| W8 | 2020 | Legambiente 評 Aosta 空氣品質僅勉強及格，指出 Cogne 鋼廠對市區空氣的影響在選戰中被忽略。屬區域監測爭議，沒有裁罰 | 義大利 Aosta | Cogne Acciai Speciali（71.83%） | 其他（空品爭議） | 否 |

### 各事件來源

- **W1**
  - [已驗證] GEM wiki：https://www.gem.wiki/Weda_Bay_power_station
  - [搜尋確認] Kallanish，"Walsin Lihwa controls Sunny Metal"（付費牆，日期未見）
- **W2**
  - [已驗證] Jakarta Post（2023-12-26）https://www.thejakartapost.com/id/business/2023/12/27/as-death-toll-rises-morowali-blast-brings-work-safety-squarely-into-focus
- **W3**
  - [已驗證] 中央社（2025-08-05）https://www.cna.com.tw/news/ahel/202508050217.aspx
  - [已驗證] 公視（2025-08-05）https://news.pts.org.tw/article/764080
  - 兩則都只轉述環團說法，沒有獨立的事故報導。[未驗證獨立來源]
- **W4**
  - [已驗證] BHRRC：https://www.business-humanrights.org/en/latest-news/indonesia-report-highlights-human-rights-environmental-impacts-of-taiwanese-business/
- **W5**
  - [已驗證] Indonesia Business Post（2025-06-19）https://indonesiabusinesspost.com/4556/corporate-affairs/ministry-uncovers-environmental-violations-at-indonesia-morowali-industrial-park
  - [已驗證] Petromindo（2025-06-21）https://www.petromindo.com/news/article/environment-ministry-to-sanction-imip-over-major-violations
  - [搜尋確認] Reuters 經 Creamer Media 轉載（2025-06-18）
- **W6**
  - [已驗證] 中央社、公視（同 W3）
  - [已驗證] TaiwanPlus（2025-08-07）https://www.taiwanplus.com/news/taiwan-news/human-rights/250807005/activists-in-taiwan-call-for-better-practices-in-indonesian-nickel-mining-sites
  - [已驗證] Global Voices（2025-10-26）https://globalvoices.org/2025/10/26/a-grassroots-collective-is-pushing-back-against-the-nickel-mining-industry-in-north-maluku-indonesia/
  - [已驗證] New Bloom（2025-09-18）https://newbloommag.net/2025/09/18/tw-indonesia-companies/
- **W7**
  - [搜尋確認，頁面 403] https://dialogue.earth/en/pollution/indonesian-coastal-villages-in-the-dark-over-nickel-pollution/ 、https://www.eco-business.com/news/indonesian-coastal-villages-in-the-dark-over-nickel-pollution/
- **W8**
  - [已驗證，標題與日期] Gazzetta Matin（2020-09-30）https://gazzettamatin.com/2020/09/30/qualita-dellaria
  - 重要性偏低。

### 查無資料

- 台灣本土：華新麗華的台灣廠區（台南鹽水、楊梅等）查無重大環境裁罰報導。搜尋有限，不代表沒有。
- 2026 年：查無華新專屬的污染事件。相關但非華新的有：
  - 2026-02-24：印尼環境部長考慮撤銷另一家 IMIP 租戶 PT QMB 的環境許可。[已驗證] https://www.petromindo.com/news/article/minister-weighs-revoking-imip-tenant-s-permit-after-deadly-incidents
  - 2026-05-18：華新表示印尼收緊鎳礦政策，推高了 NPI 成本。這是經營面新聞。[已驗證] https://www.petromindo.com/news/article/walsin-says-ri-nickel-policy-tightening-cuts-npi-supply-raises-production-costs

---

## 3. 台積電（2330）

### 持股路徑（MOPS CSV）

- TSMC Arizona：100%
- JASM（熊本）：73%
- ESMC（Dresden）：70%
- TSMC Washington（Camas）：台積電 → TSMC Partners → TSMC Development → TSMC Washington，各層 100%
- 台積電南京：100%

### 事件表

| # | 時間 | 事件 | 地點／廠區 | 營運實體 | 類型 | 對應本站設施 |
|---|---|---|---|---|---|---|
| C1 | 2014-11-19 起訴，2015-03 報導 | 製程污泥主要處理商欣瀛科技涉嫌傾倒污泥到高屏溪上游，遭台南地檢起訴。起訴後台積電仍委託約 90 多天，違反自家內規 | 台灣 | 台積電（委外清運） | 其他（廢棄物委外） | 否 |
| C2 | 2021-02 至 05 | 50 年來最嚴重乾旱：政府減供科技業用水 15%，台積電以水車運水 | 台灣竹科、中科、南科 | 台積電 | 資源使用（水） | 否 |
| C3 | 2021-07-28 | 竹科寶山二期擴建環評通過。審查焦點包括新城斷層的地震風險、再生水與綠能用量，台積電承諾事業廢棄物不進民生焚化爐 | 台灣新竹寶山 | 竹科管理局（為台積電需地） | 環評爭議 | 否 |
| C4 | 2023-06 | 工會指控 Arizona 工地多起事故，且曾把氣體外洩包裝成「槍擊演習」 | 美國 Phoenix, AZ | TSMC Arizona（100%） | 其他（職安） | 是：Phoenix 5088 W Innovation Cir 各設施 |
| C5 | 2023-08-29 | JASM 向菊陽町申請地下水採取許可，每日 1.2 萬立方公尺。地方議會擔憂地下水 | 日本熊本菊陽町 | JASM（73%） | 資源使用（水） | 否 |
| C6 | 2023-10-17 宣布撤出，2026-05-04 復活 | 龍科三期因徵收爭議引發居民抗爭，台積電宣布不進駐。2026-05 竹科擴大為 104 公頃重啟，傳出台積電已提出申請 | 台灣桃園龍潭 | 竹科管理局／台積電 | 環評／土地爭議 | 否 |
| C7 | 2024-04 至 05 | Arizona 用水爭議：CHIPS 法案 NEPA 環評草案於 2024-05-29 公布；Fortune 報導北鳳凰城廠用水與廢水的疑慮 | 美國 Phoenix, AZ | TSMC Arizona | 資源使用（水）、環評 | 是：IRWP AZC110436，以及 Phoenix 廠區 |
| C8 | 2024-05-15 發生，2024-11 開罰 | 外包槽車在 Phoenix 廠區清運廢硫酸時過壓，艙蓋噴飛，41 歲司機死亡。ADOSH 對 TSMC Arizona 開出 serious general duty citation，罰款 16,131 美元 | 美國 Phoenix, AZ | TSMC Arizona | 其他（危險廢棄物清運工安）＋裁罰 | 是：Phoenix 5088 W Innovation Cir |
| C9 | 2024-12 至 2026-06 | JASM 投產後，熊本坪井川的 PFBS、PFBA 濃度上升；2025 年 5 月起轉為下降或持平。2025-10-24 JASM 社長證實排水含微量這兩種物質。2026-06-11 縣政府在縣議會表示，不掌握第 2 工場的 PFAS 排放量（日本目前沒有 PFAS 排水標準） | 日本熊本 | JASM（73%） | 污染爭議（PFAS） | 否 |
| C10 | 2026-04-21 | 楠梓園區二階環評範疇界定會議。環團估計 5 座 2 奈米廠年用電約 112 億度，要求台積電促成更多綠電 | 台灣高雄楠梓（中油舊煉油廠址） | 南科管理局／台積電 | 環評、資源使用（電） | 否 |
| C11 | 2026-05-26 | 南科沙崙園區（4 期）環評。環團要求台積電承諾 100% 綠電 | 台灣台南沙崙 | 同上 | 環評、資源使用（電） | 否 |
| C12 | ECHO 現存紀錄 | TSMC Washington 雨水許可在本站有 43 筆違規紀錄。查無相關新聞，也查無 WA Ecology 罰款 | 美國 Camas, WA | TSMC Washington | 環境違規（無新聞） | 是：WAR003032 |

### 各事件來源

- **C1**
  - [搜尋確認，頁面 403] 天下雜誌（2015-03）https://www.cw.com.tw/article/5065621
  - 只有單一來源。
- **C2**
  - [已驗證] Fortune（2021-06-12）https://fortune.com/2021/06/12/chip-shortage-taiwan-drought-tsmc-water-usage/
  - [搜尋確認] Robeco 2021-10 報告。
- **C3**
  - [已驗證] TechNews 轉中央社（2021-07-28）https://finance.technews.tw/2021/07/28/tsmc-expansion-project-passed-eia/
- **C4**
  - [已驗證] 9to5Mac（2023-06-23）https://9to5mac.com/2023/06/23/tsmc-arizona-plant-safety/
  - 內容是工會單方說法。
- **C5**
  - [已驗證] 熊本日日新聞（2023-08-29）https://kumanichi.com/articles/1155678
- **C6**
  - [已驗證] 公視（2023-10-17）https://news.pts.org.tw/article/662274
  - [已驗證] 公視（2023-10-19）https://news.pts.org.tw/article/662669
  - [已驗證] 工商時報（2026-05-04）https://www.ctee.com.tw/news/20260504700896-431401
- **C7**
  - [已驗證] Fortune（2024-04-08）https://fortune.com/2024/04/08/tsmc-water-usage-phoenix-chips-act-commerce-department-semiconductor-manufacturing/
  - [已驗證] NIST 環評草案：https://nist.gov/document/tsmc-draft-environmental-assessment-may-29-2024-volume-1
- **C8**
  - [已驗證] VOA（2024-05-16）https://voanews.com/a/tsmc-says-no-damage-to-its-arizona-facilities-after-incident/7614362.html
  - [已驗證] 台灣英文新聞中文版（2024-05-16）https://www.taiwannews.com.tw/zh/news/5687660
  - [已驗證] ABC15（2024-11-08）https://abc15.com/news/local-news/investigations/tsmc-cited-for-worker-safety-violation-after-man-died-in-may
- **C9**
  - [已驗證] 熊本日日新聞（2025-04-03）https://kumanichi.com/articles/1734767
  - [已驗證] 熊本日日新聞（2025-10-08）https://kumanichi.com/articles/1911097
  - [已驗證] 熊本日日新聞（2025-10-24）https://kumanichi.com/articles/1917124
  - [已驗證] 熊本日日新聞（2026-02-18）https://kumanichi.com/articles/1958863
  - [已驗證] KAB（2026-06-11）https://www.kab.co.jp/news/article/16636551
  - [已驗證，標題] Adnkronos/Jiji（2025-12-25）https://english.adnkronos.com/2025/12/25/tsmc-kumamoto-plant-leaves-water-concerns/
- **C10**
  - [已驗證] 公視（2026-04-21）https://news.pts.org.tw/article/804765
  - [已驗證] Newtalk（2026-04-21）https://newtalk.tw/news/view/2026-04-21/1030926
- **C11**
  - [已驗證] 工商時報（2026-05-26）https://www.ctee.com.tw/news/20260526701425-431401
- **C12**
  - 出處是本站 `epa-data.json`。[搜尋] Ecology 罰款新聞稿沒有台積電。

### 背景，非台積電造成

- 台積電高雄廠址位在中油高雄煉油廠舊址，土地有油品污染，由高雄市府加速整治。[已驗證] 中央社（2021-11-11）https://www.cna.com.tw/news/ahel/202111110239.aspx

---

## 4. `lib/api.js` 三則 mock 新聞查核（key `formosa-plastics-tx`，約第 779–787 行）

### 1. "Reuters: Formosa Plastics fined $50 million for Clean Water Act violations"（2019-10-15）

**判定：事件真實，但描述不準，Reuters 出處無法驗證。**

- 對的部分：2019-10-15 確實是宣布 5,000 萬美元和解的日子（TRLA 新聞稿與 Texas Tribune 同日刊出）。
- 錯的部分：這不是政府「罰款」，而是 CWA 公民訴訟的和解（consent decree）。
  - 訴訟名稱：San Antonio Bay Estuarine Waterkeeper & Diane Wilson v. Formosa Plastics Corp., Texas & FPC USA，S.D. Tex. No. 6:17-cv-47。
  - 5,000 萬美元分 5 年付入 Matagorda Bay Mitigation Trust，原告拿不到任何一筆。
  - 法院於 2019 年 11 月底至 12 月初核准和解（ELAW 檔名標 27 Nov 2019，Texas Tribune 2019-12-03 報導核准）。
  - 責任判決在 2019-06-27/28 作出。
- Reuters 原文：reuters.com 擋爬蟲，無法確認有沒有這篇。
- 建議改用的網址：
  - https://www.texastribune.org/2019/10/15/formosa-plastics-pay-50-million-texas-clean-water-act-lawsuit/
  - https://trla.org/news-releases/formosa-plastics-agrees-to-pay-50-million-settlement-for-polluting-texas-waterways

### 2. "Bloomberg: Formosa Plastics Texas plant explosion injures several workers"（2021-05-03）

**判定：查無此事件，視為不實或無法驗證。**

多次搜尋都找不到 2021 年 5 月 Point Comfort 有爆炸。真實的相近事件有三件：

- 2005-10-06 烯烴廠丙烯爆炸（CSB）
- 2013-05 PE-1 廠火災，16 人受傷（Chemical Week，搜尋確認）
- 2021-09-13 EPA 的 285 萬美元 RMP 和解，起因是 2013 至 2016 年間的火災、爆炸與外洩造成工人灼傷和氯氣吸入（EPA，已驗證）

這則 mock 很可能把上述幾件混在一起。

### 3. "Texas Tribune: Environmental groups sue Formosa over plastic pellet discharge"（2017-08-22）

**判定：事件真實，但日期、出處與描述有誤。**

- 實際起訴日是 2017-07-31，在南德州聯邦地院 Victoria 分院（第五巡迴意見書上 USDC 案號為 6:17-CV-47）。
- 原告是一個團體加一位個人：San Antonio Bay Estuarine Waterkeeper 與 Diane Wilson，由 TRLA 代理。不是複數的「environmental groups」。
- 找不到 Texas Tribune 在 2017-08-22 的報導。該報最早相關的是 2019-03-25 的開庭報導（已驗證），裡面提到 2017 年 7 月起訴。起訴當時的報導來自 Courthouse News（`?p=357716`，頁面 403，搜尋確認）。
- 建議改用的網址：https://www.texastribune.org/2019/03/25/formosa-goes-to-federal-court-for-alleged-plastic-pollution/ ，或第五巡迴意見書。

### 附帶觀察

- mock 用的 key 是 `formosa-plastics-tx`，跟 `epa-data.json` 的 `tw-1301` 不一致。
- 同函式裡 `nan-ya-plastics` 的 mock 新聞未查核。標題看起來是虛構的，例如 "Global Chemical Report"、"Pointe Coupee Banner: Local officials praise…"。

---

## 5. 可當作持續新聞來源的系統性追蹤者

### 中文（台灣）

- **環境資訊中心**
  - 「台塑」標籤：https://e-info.org.tw/tag/%E5%8F%B0%E5%A1%91 [已驗證 200]
  - 「台積電」標籤：https://e-info.org.tw/tag/%E5%8F%B0%E7%A9%8D%E9%9B%BB [已驗證 200]
  - 「台塑越鋼」與「華新麗華」沒有標籤頁（404）。
- **報導者**
  - 「台塑」標籤：https://www.twreporter.org/tag/%E5%8F%B0%E5%A1%91 [200]
  - 「台積電」標籤：https://www.twreporter.org/tag/%E5%8F%B0%E7%A9%8D%E9%9B%BB [200]
  - 沒找到報導者的台塑越鋼或華新印尼專題。
- **地球公民基金會**：https://www.cet-taiwan.org/ [200]
  - 長期追蹤台塑，早在 2009 年就轉譯德州新聞；也發表台積電用電與綠電的評論（搜尋確認）。
- **環境權保障基金會（ERF）**：2025 年華新印尼陳抗、2026 年楠梓台積電環評的主要發動者。官網 envirorights.org.tw 從本環境連不上。[未驗證]
- **TTNC Watch（台灣跨國企業監督聯盟）**：https://www.ttnc-watch.org/ [200]
  - 由 7 個人權、勞工、環境團體組成，專門監督台企的海外行為。
  - 2024-11 發表印尼報告（點名華新），2026-03-22 發表泰國報告。
  - 最貼近本站「海外子公司」定位的追蹤者。
- **台灣人權促進會**：有轉載 FIDH 2019 年越南環境正義決議。https://www.tahr.org.tw/news/2548/ [200]
- **其他**
  - 公視新聞網：台塑越鋼、華新印尼、台積電環評都有持續報導。
  - 環境正義基金會、綠色公民行動聯盟：都參加了 2026-05 的台塑記者會。
  - 熊本日日新聞（日文）：JASM 的 PFAS 與地下水議題。

### 英文

- **Business & Human Rights Resource Centre 公司頁** [皆 200]
  - Formosa Plastics：https://www.business-humanrights.org/en/companies/formosa-plastics/
  - Walsin Lihwa：https://www.business-humanrights.org/en/companies/walsin-lihwa/
  - TSMC：https://www.business-humanrights.org/en/companies/taiwan-semiconductor-manufacturing-tsmc/
  - 另外會記錄 TTNC Watch 的指控，以及企業有沒有回應。
- **Earthjustice Formosa 文件庫**：https://earthjustice.org/library/formosa [已驗證]，路易斯安那訴訟的時間軸。
- **Texas Tribune、Inside Climate News（Dylan Baddour）**：持續報導 Point Comfort。
- **Mongabay、Eco-Business、Dialogue Earth**：越南與印尼鎳業。
- **Global Energy Monitor（gem.wiki）**：IMIP、IWIP 燃煤機組的持股資料。
- **Petromindo、Indonesia Business Post**：印尼環境部的執法動態。
- **FIDH、RFA**：越南受害者訴訟。
- **Good Jobs First Violation Tracker**：專案已在使用，對爬蟲回 403。
- **CHIPS Communities United**：追蹤 Arizona 案，官網[未驗證]。

---

## 6. 2026 年的近期事件

- **台積電**
  - **2026-10-20：高雄楠梓 F22（P4 鋼構吊裝）工安事故，4 人墜落死亡。** 南科管理局下令全面停工。2026-10-21 橋頭地檢對東鋼構、上昊機械兩名現場負責人以過失致死，各諭知 100 萬元交保。
    - 這是台灣本地的工安事件，不是污染，依 spec 不收（國內事件不收）。
    - [已驗證] 自由時報 https://news.ltn.com.tw/news/society/breakingnews/5613958
    - [已驗證] ETtoday https://www.ettoday.net/news/20261021/3258646.htm
    - [已驗證] Newtalk https://newtalk.tw/news/view/2026-10-21/1066876
  - 2026-06-11：KAB 報導熊本縣不掌握新廠的 PFAS 排放量（C9）。
  - 2026-05-26：沙崙環評（C11）；2026-05-04：龍科三期重啟（C6）；2026-04-21：楠梓二階環評（C10）。
  - 2026-02-18：坪井川 PFAS 濃度持續下降（C9）。
- **台塑**
  - 2026-02-05：環團控告 LDEQ 展延陽光計畫的 PSD 許可（F11，主體為 6505）。
  - 2026-04-06 與 2026-04-11：Mongabay、Eco-Business 刊出 FHS 十週年報導（F6、F7）。
  - 2026-05-27/28：凱道記者會與股東會抗議（F14）。
  - 2026-08-01：FIC 併入 FPC USA。這是持股變動，影響 1301 對美國廠的歸屬判斷。
- **華新**：沒有華新專屬的 2026 污染事件。只有同園區其他租戶的執法消息，以及經營面新聞（見第 2 節）。

---

## 7. 未驗證／待查

- FHS 目前的股權結構，以及 1301 的實際持股：來源互相矛盾，應查 1301 與 2002 的最新年報。
- 台北地院越鋼案目前的程序狀態：可查司法院裁判書系統。
- 路易斯安那州最高法院是否受理 2024 年的空污許可上訴；陸軍工兵團新 EIS 的進度。
- Plastics News 那則「$2.2M new penalties」的日期與內容。
- 2024-07 Texas Register 刊登的 47.5 萬美元判決全文（頁面 403）。
- 2024-09 華新 IMIP 職災，目前只有環團說法，沒有獨立報導。
- PT Walhsu Metal Industry 所在的園區。
- FG INC. 其餘 43% 的持有人。
