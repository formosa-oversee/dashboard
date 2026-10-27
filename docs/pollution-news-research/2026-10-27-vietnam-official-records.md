# 越南省級處分決定書：同奈省（2026-10-27）

spec 第 7 節「其他公司」O5–O12 的查證紀錄，以及兩筆待補來源的越南案件。資料管線、名稱對照與原始檔在 repo 外的 `formosa-oversee/overseas-enforcement/`（`map_vn/`、`vn_reverse/`），這裡只記個別事件的依據。

## 怎麼找到的

- 2026-10-25 第二輪越南名稱對照時，在越南媒體找到建大越南 2020、2024 與光寶越南 2026 的罰款報導，每筆都只有一家媒體，未達第 3 節門檻。
- 2026-10-27 改找官方文件：同奈省入口網 dongnai.gov.vn 的「Khen thưởng - Xử phạt」>「Xử phạt」分類，公告省人民委員會主席簽發的行政處罰決定，每篇附決定書 PDF，現存公告從 2024 年起。2025-07 平福省併入同奈省，入口網沿用平福的系統，所以檔案路徑是 `uploads/binhphuoc/`；兩份決定書的抬頭都是「ỦY BAN NHÂN DÂN TỈNH ĐỒNG NAI」，受罰地址都在江田工業區。
- 2024 年的報導（Tạp chí Điện tử Thanh tra 2024-11-20）寫的是 2.1 億越南盾的處分，查到原件是 2024-05-09 的 1335/QĐ-XPHC；同一分類另有 2025-07-04 的 296/QĐ-XPHC，是原本不知道的第二筆。
- 兩份 PDF 是省人委會電子簽章的副本（「SAO Y」），掃描件，決定書號碼與日期是手寫；用 tesseract（vie）OCR 後逐頁看影像核對。

## 受罰法人與持股

- 決定書：Công ty Cao su Kenda (Việt Nam)，一人有限公司，稅號（企業代碼）3600248720，總公司 Hố Nai 工業區，工廠在 Giang Điền 工業區（同奈省），2007 年首次登記。
- 越南國家工商登記：bocaodientu.dkkd.gov.vn（財政部）的公開查詢，2026-10-27 用「CAO SU KENDA」查到 CÔNG TY CAO SU KENDA (VIỆT NAM)，英文名 KENDA RUBBER (VIETNAM) CO., LTD.，稅號 3600248720，另有 Giang Điền 工業區的營業地點。同省沒有其他 Kenda 法人（Nghệ An 的 Kenda Mai Oanh 是另一家公司）。先前從第三方網站得到的稅號 3601453994 在登記系統查無，不用。
- MOPS 114 年第 2 季（2025Q2）建大子公司表：本公司直接持有「建大橡膠（越南）有限公司」100%，業務為車輛用內外胎之生產及銷售。名稱、業務、地點都對得上，歸屬 2106，effectivePct 100。
- `controlSince` 取 2007（決定書記載的首次登記年），早於兩個事件；實際投資可能更早。
- 決定書載有法定代表人姓名，事件與這份紀錄都不寫。

## O5：1335/QĐ-XPHC（2024-05-09）

- 簽發：同奈省人民委員會主席。依據：工業區管理委員會 2024-04-09 違規筆錄 02/BB-VPHC、2024-04-12 建議書，公司 2024-04-12 曾提書面說明。
- 行為 1：鍋爐燒 FO 重油並加裝廢氣處理系統，但 2022-11-21 核准的環評（378/QĐ-KCNĐN）登記燃料是 DO 柴油，屬未依環評核准內容執行；第 45/2022/NĐ-CP 第 10 條第 1 項 d 點，0.7 億越南盾。
- 行為 2：輪胎廠（年產 1,650 萬條）多項製程與廢棄物處理設施未依核准環評施作；同條 g 點，1.4 億越南盾。
- 合計 2.1 億越南盾。加重、減輕情節皆無；無附加處分、無補救措施。
- 來源：決定書 PDF、公告頁（2024-05-10 刊登）、Tạp chí Điện tử Thanh tra 2024-11-20 報導（同日另有 moitruong.net.vn、thiennhienmoitruong.vn 內容相近的報導，未收）。

## O6：296/QĐ-XPHC（2025-07-04）

- 簽發：同奈省人民委員會主席（合併後）。依據：2025-06-23 違規筆錄 69/BB-VPHC、工業區管理委員會 2025-06-24 建議書。
- 行為：環評 2018-10-16 核准（232/QĐ-KCNĐN），2019 年投產，但一直沒有取得環保設施完工確認書；依 2020 年環保法第 42 條第 2 項 d 點與第 45/2022/NĐ-CP 第 46 條第 3 項，完工確認書視同環境許可證，所以以「無環境許可證」論處。
- 第 45/2022/NĐ-CP 第 14 條第 3 項 c 點，議定罰額以個人計 1.6 億，依第 6 條第 2 項對組織加倍：3.2 億越南盾。
- 決定書寫明不加處停止排放源：公司已取得環境許可證 33/GPMT-KCNĐN（2024-04-22，2025-04-04 換發 32/GPMT-KCNĐN），工業區管理委員會 2025-02-18 已通知廢棄物處理設施試運轉完成，且停業會影響 1,600 多名員工；廠址符合工業區規劃，不要求遷廠。
- 這與 2020 年待補案（下節）的「未取得完工確認書就運轉」是同一個問題的延續，摘要沒有提 2020 年案，因為它還沒有達到門檻。

## 同奈省「Xử phạt」分類掃描（O7–O12 的來源）

- 抓取：名稱對照 agent 用 `map_vn/r3a/scripts/crawl_dongnai_xuphat.py` 抓列表頁 `https://dongnai.gov.vn/vi/news/Xu-phat/page-N/`，每頁間隔 1 秒，失敗重試 2 次，已存檔的頁面不重抓（快取在 `map_vn/r3a/raw/dn_xuphat_page*.html`）。第 8 頁以後的內容是重複的，但腳本要連續兩頁沒有連結才停，結果抓到上限 400 頁；之後不要再重爬列表，直接用快取。
- 範圍：去重後 421 篇公告（`map_vn/r3a/out/dongnai_xuphat_links.tsv`，文章編號 43526–62372，約 2024-05 起至抓取當天）。公告標題是受罰組織的越南文名，決定書 PDF 才有稅號。
- 這一輪的比對只是局部：agent 拿自己負責的 107 家子公司裡已找到越南文名的公司，對公告標題的公司名，命中健鼎、豐泰兩家，再讀決定書 PDF（OCR）核對稅號與地址。其餘 421 篇沒有逐份讀 PDF。
- 完整掃描（2026-10-27 完成）：
  - 範圍：421 篇公告中有 338 份是對法人的處分決定書（公告日期 2024-05-02 至 2026-06-08），PDF 下載成功 337 份。
  - 稅號：OCR 決定書第 1–3 頁（稅號多在第 2 頁），291 份讀到稅號；其餘 47 份多為投資登記或勞動類，只寫投資登記證號或專案代碼。
  - 英文名：有稅號用稅號、沒有就用越南文名查國家工商登記。82 份沒有取得英文名：43 份登記本身沒有英文名（多為越南本地公司）、2 份登記查無、34 份沒有稅號、3 份稅號 OCR 位數不對。
  - 比對規則：工商登記英文名或越南文名（去重音、法人字尾、「Viet Nam」正規化後）與 MOPS 越南子公司（`shared/all_VN.csv`，528 家）或各輪名稱對照的名稱逐字相同，或稅號與名稱對照查到的稅號相同。命中 7 份，就是 O5–O11。越南文名常與英文名對不上（例：CÔNG TY TNHH TỶ THẠC＝YIH SHUO FOOTWEAR），所以以登記英文名為主。
  - 盲點補查：MOPS 子公司表只展開到另一家上市公司為止。例如寶成只列到香港上市的裕元（合計 51.36%），裕元在越南的工廠不在 MOPS 名單裡。用裕元 2025 年報的主要子公司表補比對，命中 Pou Sung Vietnam（O12）；裕元年報列的其他越南子公司在 338 份裡沒有出現。MOPS 以「…及其所屬子公司」合併列示、沒有展開的母公司有鴻海 2317、東元 1504、中光電 5371，338 份裡也沒有相關名稱。沒有英文名或沒對上的決定書另外逐份看過有沒有與台灣有關的名稱，結果見「不收」與「待確認持股」。
  - 速率：個別公告頁與 PDF 每 3 秒最多 1 次，工商登記每 6 秒 1 次，都有快取；列表頁只抓過一次。腳本與中間檔在 repo 外的 `vn_reverse/`（`scripts/dn_ocr_match.py`、`out/dongnai_scan.json`、`out/dn_followup.csv`）。

## O7：288/QĐ-XPHC（2025-07-02），健鼎越南

- 受罰：Công ty TNHH Electronic Tripod Việt Nam (Biên Hòa)，一人有限公司，稅號 3600240030，邊和第二工業區 3A 路 31 號，1995-09-22 首次登記。國家工商登記英文名 TRIPOD VIETNAM (BIENHOA) ELECTRONIC COMPANY LIMITED，與 MOPS 2025Q2 健鼎本公司直接持有 100% 的子公司同名。
- 經過：省公安經濟警察 2025-06-02 違規筆錄 72/BB-VPHC 與同日檢測報告；公司 2025-06-03 發文提出異議、請求重新檢視兩項檢測結果；省公安 2025-06-18 查核後維持建議。
- 行為：廢水量屬每日 4,000 至 4,500 立方公尺級距，決定書原文「thông số Clo」超過技術規範 2.78 倍（沒有寫明是 QCVN 40 的餘氯 Clo dư 或氯化物 Clorua），第 45/2022/NĐ-CP 第 18 條第 3 項 v 點，11.5 億越南盾；總礦物油（Tổng dầu mỡ khoáng）超過 1.2 倍，同條第 7 項加罰 10%，1.15 億。合計 12.65 億越南盾，另須支付採樣分析費 17,135,258 越南盾。
- 沒有要求補救措施，理由是資料不足以認定這項違規造成的環境狀況。加重、減輕情節皆無。

## O8：3573/QĐ-XPHC（2024-11-26），豐泰 Dona Standard

- 受罰：Công ty TNHH Giày Dona Standard Việt Nam，稅號 3600834796，春祿工業區，2006-06-23 首次登記。國家工商登記英文名 VIETNAM DONA STANDARD FOOTWEAR CO., LTD，與 MOPS 2025Q2 豐泰子公司同名（本公司與 Growth-Link Overseas 合計持有 Dona Orient Holdings 100%，DOH 持有 100%）。
- 決定書號碼手寫，OCR 讀成 2572，影像與公告標題都是 3573。
- 行為：廠區 1、2、4 各兩項。取得環保設施完工確認書前就正式運轉，以無環境許可證論處（第 14 條第 3 項 c 點，各 3 億）；未申報比核准環評多裝的機器與粉塵、廢氣處理設施（第 10 條第 1 項 d 點，各 0.6 億）。合計 10.8 億越南盾。
- 減輕情節：主動申報、坦承違規；已依 2020 年環保法申請環境許可證並納入變更內容；當地沒有收到環境陳情。同樣理由不加處停止排放源；廠址符合工業區規劃，不要求遷廠。

## O9：1128/QĐ-XPHC（2025-04-11），三陽 VMEP

- 受罰：Công ty Hữu hạn Chế tạo Công nghiệp và Gia công Chế biến hàng xuất khẩu Việt Nam（VMEP），一人有限公司，稅號 0100113864，總公司同奈省 Tam Hiệp，違規地點 Nhơn Trạch II 工業區 Lô 4 đường 5C，1992-03-25 首次登記。國家工商登記英文名 VIETNAM MANUFACTURING & EXPORT PROCESSING COMPANY LIMITED，Nhơn Trạch 2 那一址登記為機車與汽車零件組裝廠分公司（-010）。
- 持股：MOPS 2025Q1 三陽子公司表 SYI（100%）→ VMEPH 67.07% → VMEP 100%，effectivePct 67.07。VMEPH 是存託憑證 9110 越南控-DR 的發行公司；依 spec 決策 30 不另掛 9110，只寫在持股路徑。
- 經過：工業區管理委員會 2025-04-02 違規筆錄 28/BB-VPHC。
- 行為 1：環評 349/QĐ-KCNĐN（2019-10-18）要求的環保設施完工確認書未核發就正式運轉，以無環境許可證論處，第 45/2022/NĐ-CP 第 14 條第 3 項 c 點，1.6 億 × 2 = 3.2 億越南盾。行為 2：未通報廢棄物處理設施試運轉計畫，第 12 條第 2 項 a 點，0.175 億 × 2 = 0.35 億。合計 3.55 億。
- 不加處停止排放源：已主動申請環境許可證、營運穩定、未接獲陳情、近 600 名員工；決定書並依第 118/2021/NĐ-CP 第 5 條第 3 項認定違規性質單純、未對人體健康與環境造成嚴重後果。不要求遷廠。
- 另有 VnEconomy 2025-04-15 報導同一筆 3.55 億處分，這次沒有收進來源。

## O10、O11：3365/QĐ-XPHC（2024-11-12）、1776/QĐ-XPHC（2025-06-02），明安越南

- 受罰：Công ty TNHH Advanced Multitech (Việt Nam)，稅號 3600711988，總公司 Nhơn Trạch III 工業區（Formosa 分區）4 號路，2004-12-17 首次登記。國家工商登記英文名 ADVANCED INTERNATIONAL MULTITECH (VIETNAM) CORPORATION LTD，與 MOPS 2025Q2 明安直接持有 100% 的子公司同名（MOPS 公司名多了「International」，越南文名沒有，以登記英文名對上）。
- O10：工業區管理委員會 2024-11-04 違規筆錄 19/BB-VPHC。2024 年 8 月起在 Nhơn Trạch II 工業區第二期 2 號路動工擴建，超出環境許可證 68/GPMT-KCNĐN（2024-05-21）範圍，未取得重新核發的許可證；第 45/2022/NĐ-CP 第 11 條第 2 項 e 點，3.2 億越南盾。無附加處分、無補救措施。第 1 條的受罰人名稱與稅號都是 Advanced Multitech；第 3 條有一處誤植為「Công ty TNHH Hyosung Việt Nam」，應為套用範本的筆誤，只記在 note。
- O11：2025-05-22 違規筆錄 53/BB-VPHC。環評 354/QĐ-KCNĐN（2021-08-05）的工廠沒有環境許可證就運轉；第 14 條第 3 項 c 點、第 6 條第 2 項，1.6 億 × 2 = 3.2 億越南盾。決定書說公司在 Nhơn Trạch II 第一期營運穩定，所以 plantSite 寫第一期，與 O10 的第二期擴建工地分開。不加處停止排放源：違規主要屬許可程序、已主動申請許可、未接獲陳情、5,000 名員工；不要求遷廠。

## O12：255/QĐ-XPHC（2025-07-01），寶成 Pou Sung Vietnam

- 受罰：Công ty trách nhiệm hữu hạn Pou Sung Việt Nam，一人有限公司，稅號 3600710751，Bàu Xéo 工業區（Trảng Bom），2005-01-12 首次登記。國家工商登記英文名 POU SUNG VIETNAM CO., LTD.，地址相同。
- 簽發：同奈省人民委員會主席，電子簽章副本（簽章時間 2025-07-01 09:59），號碼與日期手寫，經影像核對。依據：農業與環境廳稽查違規筆錄 99/BB-VPHC（2025-06-20）、廳稽查長公文 269/TT（2025-06-20）。
- 行為與罰額（第 45/2022/NĐ-CP 的三項依第 6 條第 2 項對組織加倍）：
  1. 2023 年環保報告申報危險廢棄物 328,976 公斤，轉移聯單合計 330,337 公斤，認定申報不正確（khai báo không đúng）：第 29 條第 3 項 d 點，0.9 億。
  2. 沒有依環境許可證 531/GPMT-BTNMT（資源環境部 2024-02-12）申請文件，在生產線部分位置裝設集氣罩：第 11 條第 3 項 đ 點，3.5 億。
  3. 向稽查團提供的 2023 年廢水處理、回用與排入 Thao 河水量，與水表統計、日誌不符，認定資料不實（không trung thực）：第 43 條第 4 項 b 點，2.5 億。
  4. 向稽查團回報的取水量不實：2025-01-03 提供的日誌記水表累計讀數（chỉ số đồng hồ nước）5,820,115，現場 5,820,122，決定書未載單位；第 36/2020/NĐ-CP 第 10 條第 2 項 b 點（經第 04/2022/NĐ-CP 修正），0.15 億。
- 合計 7.05 億越南盾。加重、減輕情節皆無，無附加處分；唯一的補救措施是更正 2023 年的廢水量資料。決定書沒有寫對公司有利的事實，摘要寫出第 1、4 項的原始數字，不加評語。
- 持股：
  - MOPS 2025Q2 寶成海外轉投資：寶成 100% 持有寶興投資、寶富投資；寶興持有裕元工業（集團）50.28%，寶富持有 1.08%，合計 51.36%。
  - 裕元 2025 年報（HKEXnews 2026-04-21）：附註 1 寫最終母公司是寶成；主要股東表寫寶成經兩家全資子公司 Wealthplus Holdings（48.18%）、Win Fortune Investments（3.18%）合計持有 51.36%（2025-12-31）。兩個來源的拆法不同，合計相同，effectivePct 取 51.36。附註 45 主要子公司（PDF 第 203 頁、年報頁碼 201）：Pou Sung Vietnam Co., Ltd，越南，註冊資本 US$117,000,000，2025、2024 年皆 100%，製造及銷售鞋類。
  - 只掛寶成 9904。裕元在香港上市、不在台灣上市；第 4 節本來就只算台灣上市公司，所以只寫在持股路徑。
- 地點：plantSite「Bàu Xéo 工業區, 同奈省, 越南」。coordinates 取 OSM way 321136900（Khu công nghiệp Bàu Xéo）的中心點，precision 為 industrial-park；OSM 沒有這家的廠房。

## 不收

- 信錦 Syncmold Đồng Nai 2026-04-29 罰 0.85 億越南盾：投資登記違規，不是環保事件。
- 台化 1326 持股 42.5% 的 Formosa Industries Corporation（Công ty TNHH Hưng nghiệp Formosa，稅號 3600517557）：2900/QĐ-XPVPHC（2024-10-03），未辦理調整投資登記，罰 0.85 億越南盾。投資登記案，不是環保事件。
- Công ty TNHH Sợi Long Thái Tử（工商登記英文名 TAINAN TEXTILE CO.,LTD，稅號 3603101099），疑似南紡 1440 的子公司：3854/QĐ-XPHC（2024-12-13），勞動案，罰 4.05 億越南盾並補發加班費、夜班費。不是環保事件；法人與持股也還沒確認。

## 待補來源

| 案件 | 現有來源 | 缺什麼 |
|---|---|---|
| 建大越南 2020-12-11，同奈省人委會 4708/QĐ-XPVPHC，3.6 億越南盾（未取得環保設施完工確認書就運轉、硫化車間沒有廢氣處理、擅改煉膠車間廢氣處理技術） | Báo Thanh tra 2020-11-21、12-18、12-25 三篇（同一家） | 決定書原件或第二家獨立媒體。dongnai.gov.vn「Xử phạt」分類只回溯到 2024 年，舊入口網的 Wayback 封存還在找。 |
| 光寶越南 2026-04-22，海防市農業與環境廳，3.2 億越南盾＋停止無許可排放源 4.5 個月（未取得環境許可證就運轉） | VietnamFinance 2026-04-27（kinhdoanhnet 是轉載；nongnghiepmoitruong d757974 經查是別家公司） | 海防市的決定書或第二家獨立媒體。haiphong.gov.vn 從台灣連線逾時。受罰法人已用國家工商登記確認：CÔNG TY TNHH LITE ON VIỆT NAM＝LITE-ON VIETNAM CO., LTD.，稅號 0201315592，海防 VSIP，與 MOPS 上 2301 直接 100% 的子公司同名。 |

## 待確認持股

同奈省以無環境許可處分、屬環保範圍，但受罰法人與台灣上市公司只有名稱相近，沒有持股證據，先不上線。

| 決定書 | 受罰法人 | 違規與罰額 | 候選母公司 | 缺什麼 |
|---|---|---|---|---|
| 917/QĐ-XPHC（2025-03-21，號碼與日期手寫，經影像核對） | Công ty TNHH Kuang Tai (Việt Nam)；工商登記英文名 KUANG TAI METAL (VIETNAM) CO., LTD，稅號 3600645037，仁澤第三工業區，2003-07-18 首次登記 | 已正式運轉但沒有環境許可證（第 45/2022/NĐ-CP 第 14 條第 3 項 e 點，3.2 億）；沒有通報 2021 年環評要求的廢棄物處理設施試運轉計畫（第 12 條第 2 項 a 點，0.35 億）；合計 3.55 億越南盾。不加處停止排放源：公司已主動申請許可、避免影響員工就業，且未造成嚴重後果 | 廣隆 1537：MOPS 子公司「廣泰塑膠越南責任有限公司」（經廣泰塑膠（薩摩亞）100%），業務是塑膠，與登記的金屬業不符 | 廣隆年報子公司表上這家越南子公司的英文名、稅號或地址，或 Kuang Tai (Việt Nam) 投資登記上的投資人 |
| 1952/QĐ-XPHC（2025-06-13，號碼與日期手寫，經影像核對） | Công ty TNHH Quốc tế Gold Long John Đồng Nai Việt Nam；工商登記英文名 VIETNAM DONA GOLD LONG JOHN INTERNATIONAL CO., LTD.，稅號 3600725684，仁澤第二工業區，2004-12-30 首次登記 | 沒有環境許可證（第 14 條第 3 項 c 點），1.6 億 × 2 = 3.2 億越南盾 | 豐泰 9910：只有「Dona」字樣與豐泰越南子公司的命名相同，MOPS 豐泰子公司表沒有這家 | 豐泰年報子公司表，或這家公司投資登記上的投資人 |

## 沒查到的

- 公司年報「環保支出資訊」與永續報告書：光寶官網的 PDF 都在 robots.txt 禁止的 `/upload/media/` 下，建大官網回 500，doc.twse.com.tw 的 robots.txt 禁止所有爬取，都沒有讀。

## 封存

| 網址 | 封存 |
|---|---|
| https://dongnai.gov.vn/uploads/binhphuoc/news/2024/05/2024qd1335.pdf | https://web.archive.org/web/20261027023128/https://dongnai.gov.vn/uploads/binhphuoc/news/2024/05/2024qd1335.pdf |
| https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-ve-viec-xu-phat-vi-pham-hanh-chinh-doi-voi-cong-ty-cao-su-kenda-viet-nam-43568.html | https://web.archive.org/web/20261027023052/https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-ve-viec-xu-phat-vi-pham-hanh-chinh-doi-voi-cong-ty-cao-su-kenda-viet-nam-43568.html |
| https://dongnai.gov.vn/uploads/binhphuoc/news/2025/07/296_qd_qdub_2025.pdf | https://web.archive.org/web/20261027023233/https://dongnai.gov.vn/uploads/binhphuoc/news/2025/07/296_qd_qdub_2025.pdf |
| https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-trong-linh-vuc-moi-truong-doi-voi-cong-ty-cao-su-kenda-viet-nam-54210.html | https://web.archive.org/web/20261027023155/https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-trong-linh-vuc-moi-truong-doi-voi-cong-ty-cao-su-kenda-viet-nam-54210.html |
| https://thanhtravietnam.vn/xa-hoi/xu-phat-cong-ty-cao-su-kenda-viet-nam-210-trieu-dong-211402.html | http://web.archive.org/web/20241126202418/https://thanhtravietnam.vn/xa-hoi/xu-phat-cong-ty-cao-su-kenda-viet-nam-210-trieu-dong-211402.html |
| https://dongnai.gov.vn/uploads/binhphuoc/news/2025/07/288_qd_qdub_2025.pdf | https://web.archive.org/web/20261027025103/https://dongnai.gov.vn/uploads/binhphuoc/news/2025/07/288_qd_qdub_2025.pdf |
| https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-trong-linh-vuc-moi-truong-doi-voi-cong-ty-tnhh-electronic-tripod-viet-nam-bien-hoa-54172.html | https://web.archive.org/web/20261027025128/https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-trong-linh-vuc-moi-truong-doi-voi-cong-ty-tnhh-electronic-tripod-viet-nam-bien-hoa-54172.html |
| https://dongnai.gov.vn/uploads/binhphuoc/news/2024/12/2024-qd-3573.pdf | https://web.archive.org/web/20261027025206/https://dongnai.gov.vn/uploads/binhphuoc/news/2024/12/2024-qd-3573.pdf |
| https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-doi-voi-cong-ty-tnhh-giay-dona-standard-viet-nam-49301.html | https://web.archive.org/web/20261027025231/https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-doi-voi-cong-ty-tnhh-giay-dona-standard-viet-nam-49301.html |
| https://dongnai.gov.vn/uploads/binhphuoc/news/2025/04/2025-qd-1128.pdf | https://web.archive.org/web/20261027030002/https://dongnai.gov.vn/uploads/binhphuoc/news/2025/04/2025-qd-1128.pdf |
| https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-hanh-chinh-trong-linh-vuc-bao-ve-moi-truong-doi-voi-cong-ty-huu-han-che-tao-cong-nghiep-va-gia-cong-che-bien-hang-xuat-khau-viet-nam-vmep-52495.html | https://web.archive.org/web/20261027030027/https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-hanh-chinh-trong-linh-vuc-bao-ve-moi-truong-doi-voi-cong-ty-huu-han-che-tao-cong-nghiep-va-gia-cong-che-bien-hang-xuat-khau-viet-nam-vmep-52495.html |
| https://dongnai.gov.vn/uploads/binhphuoc/news/2024/11/2024-qd-3365.pdf | https://web.archive.org/web/20261027030106/https://dongnai.gov.vn/uploads/binhphuoc/news/2024/11/2024-qd-3365.pdf |
| https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-doi-voi-cong-ty-tnhh-advanced-multitech-viet-nam-48645.html | https://web.archive.org/web/20261027030136/https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-doi-voi-cong-ty-tnhh-advanced-multitech-viet-nam-48645.html |
| https://dongnai.gov.vn/uploads/binhphuoc/news/2025/07/1776_qd_qd_2025.pdf | https://web.archive.org/web/20261027030233/https://dongnai.gov.vn/uploads/binhphuoc/news/2025/07/1776_qd_qd_2025.pdf |
| https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-trong-linh-vuc-moi-truong-doi-voi-cong-ty-tnhh-advanced-multitech-viet-nam-54071.html | https://web.archive.org/web/20261027030333/https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-trong-linh-vuc-moi-truong-doi-voi-cong-ty-tnhh-advanced-multitech-viet-nam-54071.html |
| https://dongnai.gov.vn/uploads/binhphuoc/news/2025/07/255_qd_qdub_2025.pdf | https://web.archive.org/web/20261027091301/https://dongnai.gov.vn/uploads/binhphuoc/news/2025/07/255_qd_qdub_2025.pdf |
| https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-doi-voi-cong-ty-tnhh-pou-sung-viet-nam-54160.html | https://web.archive.org/web/20261027091434/https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-doi-voi-cong-ty-tnhh-pou-sung-viet-nam-54160.html |
| https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0421/2026042100640.pdf | https://web.archive.org/web/20261027091511/https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0421/2026042100640.pdf |
