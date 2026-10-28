# 污染事件地點座標（2026-10-27／28）

`data/news-events.json` 每個地點的 `coordinates`（lat、lng、precision、source、note）怎麼來的。規則見 `docs/pollution-news-spec.md` 第 5 節與決策 31。

- **美國的 10 個事件（11 個地點）**：直接用網站上 EPA ECHO 廠區的座標（`source` 指向本站廠區頁），精度標「廠區」。用的廠區：Point Comfort 3601368154、Baton Rouge 3411996、Illiopolis 800000669、台積電亞利桑那 3601820587、FG LA 陽光計畫 3601242192。
- **境外 19 處（用在 22 個地點，同一廠的事件共用座標）**：由 agent 查 OpenStreetMap、Wikidata、Nominatim 與官方地址頁；每個座標都來自當次打開過的頁面，沒有憑記憶填。廠區級的點都確認落在該公司的 OSM 範圍內。確認不到廠區就降一級（工業區 → 城鎮），不估算。
- **O12 寶成 Pou Sung**：由海外裁罰 session 隨事件一起提供（Bàu Xéo 工業區，工業區級）。
- 查找過程中發現明安 Advanced Multitech（O10、O11）在仁澤第三工業區，不是第二；海外裁罰 session 回決定書影像核對後已更正（commit afbb7ac）。

## 境外地點

| 地點 | 精度 | 緯度, 經度 | 來源 |
| --- | --- | --- | --- |
| 西哈努克市 Bet Trang 區（台塑汞污泥傾倒地點附近，確切地點未定位） | 城鎮 | 10.61, 103.62 | [nominatim.openstreetmap.org](https://nominatim.openstreetmap.org/search?format=jsonv2&q=Bet%20Trang&limit=5&countrycodes=kh) |
| 台塑河靜鋼鐵 FHS（永安經濟區） | 廠區 | 18.03788, 106.42154 | [www.openstreetmap.org](https://www.openstreetmap.org/way/630749161) |
| 華新鎳業 WNII（IMIP 園區內） | 工業區 | -2.841, 122.165 | [www.openstreetmap.org](https://www.openstreetmap.org/way/299975400) |
| 華新 Sunny Metal（IWIP 園區內） | 工業區 | 0.478, 127.984 | [www.wikidata.org](https://www.wikidata.org/wiki/Q108749425) |
| 台積電 JASM 熊本廠（菊陽町） | 廠區 | 32.88606, 130.84309 | [www.openstreetmap.org](https://www.openstreetmap.org/way/1178207154) |
| 華新 DMV France 蒙巴爾鋼管廠 | 廠區 | 47.62125, 4.32671 | [www.openstreetmap.org](https://www.openstreetmap.org/way/1553638518) |
| 華新 Cogne Acciai Speciali 奧斯塔鋼廠 | 廠區 | 45.73422, 7.33142 | [www.openstreetmap.org](https://www.openstreetmap.org/way/81823894) |
| 華新 Com.Steel Inox（Calusco d'Adda 鎮） | 城鎮 | 45.68, 9.48 | [en.wikipedia.org](https://en.wikipedia.org/w/api.php?action=query&format=json&prop=coordinates&titles=Calusco_d%27Adda) |
| 華新 Degerfors Long Products（瑞典 Degerfors 鎮） | 城鎮 | 59.24, 14.43 | [en.wikipedia.org](https://en.wikipedia.org/w/api.php?action=query&format=json&prop=coordinates&titles=Degerfors) |
| 煙台華新不銹鋼（煙台開發區五指山路2號） | 廠區 | 37.54832, 121.27693 | [www.openstreetmap.org](https://www.openstreetmap.org/way/668294293) |
| 日月光韓國 ASE Korea（坡州市文發洞） | 城鎮 | 37.72, 126.7 | [www.openstreetmap.org](https://www.openstreetmap.org/node/3830221577) |
| 環球晶 MEMC Korea 天安廠（天安市城居邑） | 城鎮 | 36.88, 127.2 | [nominatim.openstreetmap.org](https://nominatim.openstreetmap.org/search?format=jsonv2&q=%EC%84%B1%EA%B1%B0%EC%9D%8D%2C%20%EC%B2%9C%EC%95%88%EC%8B%9C&limit=5&countrycodes=kr) |
| 百達精密 PT Patec（Delta Silicon 1 工業區，Lippo Cikarang） | 工業區 | -6.315, 107.125 | [www.openstreetmap.org](https://www.openstreetmap.org/way/566764482) |
| 建大輪胎越南廠（江田工業區） | 工業區 | 10.896, 106.985 | [www.openstreetmap.org](https://www.openstreetmap.org/way/793350526) |
| 健鼎越南（邊和）（邊和二工業區） | 工業區 | 10.92, 106.869 | [www.openstreetmap.org](https://www.openstreetmap.org/way/306132369) |
| Dona Standard 越南鞋廠（春祿工業區） | 工業區 | 10.908, 107.413 | [www.openstreetmap.org](https://www.openstreetmap.org/way/924383400) |
| 三陽 VMEP 仁澤廠（Nhơn Trạch II 工業區，僅定位至仁澤） | 城鎮 | 10.74, 106.95 | [nominatim.openstreetmap.org](https://nominatim.openstreetmap.org/search?format=jsonv2&q=Nh%C6%A1n%20Tr%E1%BA%A1ch%202&limit=5&countrycodes=vn) |
| 明安 Advanced Multitech 擴廠（Nhơn Trạch III 工業區第二期，僅定位至仁澤） | 城鎮 | 10.74, 106.95 | [nominatim.openstreetmap.org](https://nominatim.openstreetmap.org/search?format=jsonv2&q=Nh%C6%A1n%20Tr%E1%BA%A1ch%202&limit=5&countrycodes=vn) |
| 明安 Advanced Multitech 越南廠（Nhơn Trạch III 工業區） | 廠區 | 10.7237, 106.9358 | [www.openstreetmap.org](https://www.openstreetmap.org/way/638294999) |

降級的原因與每個地點的查找紀錄見下方附錄（agent 原始紀錄，英文；`raw/` 的請求紀錄沒有放進 repo）。

## 附錄：查找紀錄

### Geocoding log (2026-10-27)

Every coordinate in `coords.json` comes from a source opened during this task. No coordinate was taken from memory. Polygon centroids were computed from the OSM API (`api.openstreetmap.org/api/0.6/way/<id>/full.json`), and each was checked to fall inside its polygon.

Tool use:
- Nominatim: 56 requests, each at least 1.2 s apart, with User-Agent `formosa-oversee-geocode/1.0 (research)`. The full list is in `raw/nom_log.txt`.
- Overpass: overpass-api.de was overloaded most of the session (502 "at capacity" pages and server-side timeouts).
  - I sent about ten small bbox/around queries in total, plus backoff retries after 502s, following the server's own instructions.
  - Four broad queries timed out. I replaced them with lighter ones.
  - Results are in `raw/ovp/`.
- Blocked or login-gated sources were skipped, not bypassed:
  - UW digital-library PDFs (401)
  - gem.wiki search (403)
  - paginebianche (blocked)

#### Corrections to the brief (please review)

- **Advanced Multitech is in Nhơn Trạch III, not Nhơn Trạch II.** Moitruong.net.vn and daibieunhandan.vn report penalty decision 3365/QĐ-XPHC.
  - Operating plant: "đường số 4, KCN Nhơn Trạch III, thị trấn Hiệp Phước".
  - Expansion: "đường số 2, KCN Nhơn Trạch III – Giai đoạn 2, xã Long Thọ" (environmental permit 68/GPMT-KCNĐN, 21/5/2024).
  - Panjiva shipping records agree: "Nhon Trach 3 IP, Hung Nghiep Formosa".
  - The keys keep the `nhontrach2` names from the brief, but the labels say Nhơn Trạch III.
- **ASE Korea is in Munbal-dong (문발동, Gyoha), not Munsan.**
  - The asekr.com footer gives the address as 10878 경기도 파주시 산업단지길 76 (문발동, ASE Korea).
  - Gyeonggi Province and Paju City describe the site as the Munbal (2) Industrial Complex.
- **Com.Steel Inox S.p.A. and Com.steel S.p.A. are different companies** in the same town.
  - Com.Steel Inox: VAT 04122860135, Via Vittorio Emanuele II 815. It was spun off from Com.steel in Nov 2023, and Cogne bought 65% in May 2024.
  - Com.steel S.p.A. (the parent): VAT 01652290139, Via Rivalotto 34-134.
  - OSM's "Com.steel Spa" node is the parent's site and was not used.

---

#### 1. kh-sihanoukville-1998 — city

**Searched:**
- Nominatim for "Bet Trang", "Bit Traing" and "Sihanoukville".
- HRW 1999 "Toxic Justice" report.
- Phnom Penh Post "Paradise Poisoned".
- Cambodia Daily.
- Taipei Times, 1999-12-04.
- UW mission report (login-gated, skipped).

**Found:**
- The Taipei Times describes the site as "About 15km outside of Sihanoukville on Cambodia's National Route 4". It names "residents of Bettrang Commune adjacent the dump site" and "Koki village, adjacent the dump site".
- HRW says the waste was dumped about 15 km from the port, behind a small military base.
- OSM relation 18020853 is "Bet Trang Quarter" (old_name "Bet Trang Commune", wikidata Q56321117). It lies inside Kampong Som (Sihanoukville). Nominatim centroid: 10.6067, 103.6159.
- Koki village is not in OSM.

**Why city:** No source gives the dump parcel. The commune is only described as *adjacent* to the dump, which may be just outside its boundary. I used the Bet Trang commune point at 2 decimals rather than the Sihanoukville centre (10.62, 103.52) because it is closer to the event and is still town-level.

#### 2. vn-hatinh-fhs — facility

**Searched:** Nominatim for "Formosa Ha Tinh Steel".

**Found:** OSM way 630749161 "Công ty TNHH Gang Thép Hưng Nghiệp Formosa Hà Tĩnh".
- name:en is Formosa Ha Tinh Steel Corporation; name:zh is 台塑河靜鋼鐵興業責任有限公司.
- wikidata is Q24027740; landuse is industrial.
- It is in Kỳ Anh / Vũng Áng. This is the steel plant, not Formosa Industries in Đồng Nai.

**Result:** centroid 18.03788, 106.42154. Wikidata P625 (18.04, 106.43) agrees.

#### 3. id-morowali-wnii — industrial-park (stepped down)

**Searched:**
- Nominatim: "Walsin Nickel Industrial Indonesia" and "Walsin" (both no result); "Indonesia Morowali Industrial Park".
- Overpass: named landuse, man_made and industrial ways inside the IMIP bbox, plus a Walsin/WNII/华新 regex.
- Web: gem.wiki pages for Morowali captive power stations.
- Wikipedia and Wikidata.

**Found:**
- OSM way 299975400 "Indonesia Morowali Industrial Park" (Bahodopi). Its polygon centroid is -2.8407, 122.1647.
- OSM inside the park has only two power-plant polygons: Sulawesi Mining and Labota. There is no WNII feature.
- GEM has no Walsin-specific page.
- CNBC Indonesia reports that WNII has a captive coal unit in the park but gives no location.

**Why industrial-park:** The plant cannot be placed within the roughly 4 × 6 km park.

#### 4. id-wedabay-sunnymetal — industrial-park (stepped down)

**Searched:**
- Nominatim: "Sunny Metal Industry", "Sunny Metal", "IWIP", "Weda Bay Industrial Park" and "Weda Bay".
- Overpass: named features in the bbox 0.42–0.53 N, 127.92–128.07 E.
- GEM "Weda Bay power station".
- Wikipedia and Wikidata.

**Found:**
- OSM has about 21 named features: Tanjung Ulie Camp (operator PT IWIP), power-plant blocks, 镍铁/镍 plots and camps. None is Sunny Metal, and there is no park polygon.
- GEM lists Unit 7 (380 MW) as owned by PT Sunny Metal Industry (Walsin Lihwa 50.1%). However, GEM places all 14 units at a single point, 0.4764, 128.0013.
- Wikidata Q108749425 "Weda Bay Industrial Park" has P625 0.47832, 127.98363. This matches the en.wikipedia article.

**Why industrial-park:** I used the Wikidata/Wikipedia park point. No source locates Sunny Metal's own kilns or furnaces.

#### 5. jp-kikuyo-jasm — facility

**Searched:** Nominatim for "Japan Advanced Semiconductor Manufacturing".

**Found:** OSM way 1178207154 "JASM".
- official_name: Japan Advanced Semiconductor Manufacturing.
- old_name: TSMC 熊本工場(建設中).
- wikidata: Q111362867; website: tsmc.com/…/jasm.

**Result:** centroid 32.88606, 130.84309. Wikidata P625 (32.88564, 130.84222) is about 90 m away.

#### 6. fr-montbard-dmv — facility

**Searched:** Nominatim for "DMV Montbard"; French company registry API (recherche-entreprises.api.gouv.fr) by SIRET.

**Found:**
- OSM way 1553638518 "DMV France": man_made=works, Route de Semur, old_name Salzgitter Mannesmann Stainless Tubes, SIRET 41035111800022, Seveso lower tier.
- The registry confirms SIRET 41035111800022 = DMV FRANCE, ROUTE DE SEMUR 21500 MONTBARD. The registry point (47.6218, 4.3240) falls inside the OSM polygon.

**Result:** centroid 47.62125, 4.32671.

#### 7. it-aosta-cogne — facility

**Searched:** Nominatim for "Cogne Acciai Speciali".

**Found:** three OSM features. I chose way 81823894, the main landuse=industrial polygon.
- Address: Strada Paravera 16, Aosta; contact cogne.com.
- Way 243217275 is a smaller adjoining parcel with the same address. Way 162621622 is a works building.

**Result:** centroid 45.73422, 7.33142.

#### 8. it-calusco-comsteel — city (stepped down)

**Searched:**
- Nominatim: "Comsteel Inox Calusco d'Adda", "Com.Steel Calusco", "Via Rivalotto 34, Calusco d'Adda", "Via Vittorio Emanuele II 815, Calusco d'Adda".
- Web pages: comsteelspa.com (contatti, azienda), comsteelinoxspa.com (contacts), Cogne press release 16, informazione-aziende.it.

**Found:**
- Com.Steel Inox S.p.A. lists its offices at "Via Vittorio Emanuele II, n. 815 Calusco D'Adda (BG)", VAT 04122860135.
- Nominatim resolves only the street, which is about 1.5 km long, not no. 815.
- The OSM node 13281319486 "Com.steel Spa" (Via Piave/Rivalotto) belongs to the parent company Com.steel S.p.A. (VAT 01652290139). The parent moved to Via Rivalotto in January 2021.

**Why city:** I could not confirm which site Inox operates. The point is the Wikipedia town coordinate (45.6833, 9.4833).

#### 9. se-degerfors-dlp — city (stepped down)

**Searched:**
- Nominatim: "Degerfors Long Products", "Outokumpu Degerfors", "Degerfors Jernverk", "Bruksparken 2, Degerfors", "Bruksparken, Degerfors", "Outokumpu" in Sweden.
- Overpass: landuse=industrial and man_made=works within 2 km of the town.
- Web: tic.io registry listing; Naturvårdsverket "Utsläpp i siffror".

**Found:**
- DLP's registered address is Bruksparken 2, 693 32 Degerfors (tic.io). Nominatim cannot find it.
- Overpass returned only the Fortum hydro plant and one **unnamed** industrial polygon (way 739563243, near 59.2295, 14.4242).
- Utsläpp i siffror lists "Outokumpu Stainless AB, Degerfors" (property BRUKET 1:13, 59.2258, 14.4312, hot-rolling quarto plate). That is a different operator on the old works site, and DLP has no separate entry I could open.

**Why city:** I did not want to put the DLP name on Outokumpu's plate mill. The point is the Wikipedia town coordinate (59.2361, 14.4297).

#### 10. cn-yantai-walsin — facility

**Searched:**
- Web: Chinese searches for the address; gem.wiki "Yantai Walsin Stainless Steel Co Ltd"; YTU recruitment page; eiacloud EIA notice.
- Nominatim: "五指山路, 烟台市" and "华新不锈钢".
- Overpass: names within 1.5 km.

**Found:**
- Address 烟台开发区五指山路2号, 400 mu, part of 华新丽华特钢事业部 (YTU page).
- OSM way 668294293 "华新不锈钢" (landuse=industrial) lies beside 五指山路. Its size (about 0.3 km²) is consistent with 400 mu.
- GEM gives "No. 2 Wuzhishan Road, 37.548627, 121.277488 (exact)", which is inside the OSM polygon about 50 m from its centroid.
- Ignored: the eiacloud EIA notice gives 117.249E, 34.965N. That is about 400 km away (Zaozhuang/Xuzhou), so it is clearly an error.
- Ignored: GEM's "also known as 烟台金澄精密线材" alias was not verified.
- A second address, 大季家郑州路/开封路, appears in job ads. It was not used.

**Result:** centroid 37.54832, 121.27693.

#### 11. kr-paju-ase — city (stepped down)

**Searched:**
- Web: Korean and English address searches; asekr.com; Gyeonggi English news.
- Nominatim: free-text and structured searches for "산업단지길 76, 파주시"; "ASE Korea"; "에이에스이코리아".
- Overpass: ASE names; addr:street=산업단지길; landuse within 1.2 km.

**Found:**
- Official address from asekr.com: 10878 경기도 파주시 산업단지길 76 (문발동). The Gyeonggi English news page puts the plant in "Paju Munbal Industrial Complex".
- OSM has the street 산업단지길 (way 471473111) but no house no. 76, no ASE building and no Munbal industrial-complex polygon.

**Why city:** I used the OSM Munbal-dong place node (37.7211, 126.7023). Do not use "Munsan" from the brief.

#### 12. kr-cheonan-memc — city (stepped down)

**Searched:**
- Web: GlobalWafers locations page.
- Nominatim: free-text and structured searches for "854 망향로 천안시"; "MEMC"; "엠이엠씨코리아".
- Overpass: MEMC/엠이엠씨/웨이퍼 names, plus landuse and named buildings within 2.5 km of the Seonggeo-eup segment of Manghyang-ro.

**Found:**
- GlobalWafers gives "854, Manghyang-Ro, Seonggeo-eup, Sebuk-gu [Seobuk-gu], Cheonan-Si, 31043". This is the only Cheonan plant listed.
- OSM has the road but not house no. 854. Overpass found SKCHASS, 종근당, 세라젬 and others nearby, but no MEMC feature.

**Why city:** The point is the Nominatim centroid of the Seonggeo-eup relation 2561572 (36.8781, 127.1976).

#### 13. id-bekasi-patec — industrial-park (stepped down)

**Searched:**
- Web: patec.co.id contact page; Panjiva and TradeAtlas snippets.
- Nominatim: "Patec Presisi Engineering", "Jalan Angsana Raya, Cikarang Selatan", "Delta Silicon".

**Found:**
- patec.co.id gives "Jl. Angsana Raya Blok L3-01 Delta Silicon Industrial Park Lippo Cikarang, Bekasi 17550". Trade records say "Delta Silicon I, Desa Sukaresmi".
- OSM way 566764482 is "Delta Silicon 1" in Sukaresmi. Delta Silicon 2, 3, 5 and 8 are separate polygons, so "Silicon 1" matters.
- The street and block are not in OSM.

**Why industrial-park:** The point is the Delta Silicon 1 centroid (-6.3153, 107.1246).

#### 14. vn-giangdien-kenda — industrial-park (stepped down)

**Searched:**
- Web: Vietnamese and English searches; daibieunhandan.vn penalty report.
- Nominatim: "Khu công nghiệp Giang Điền".
- Overpass: a Kenda name query, which timed out on the overloaded server.

**Found:**
- daibieunhandan.vn names "Công ty Cao su Kenda … địa chỉ nhà máy tại KCN Giang Điền". The head office is in KCN Hố Nai and was not used.
- OSM way 793350526 is "Khu công nghiệp Giang Điền". Nominatim found no Kenda feature, and no lot number was found.

**Result:** centroid 10.8963, 106.9845.

#### 15. vn-bienhoa2-tripod — industrial-park (stepped down)

**Searched:**
- Web: Vietnamese searches; LHU and TDTU pages on Tripod's 2023 acquisition of FICT Vietnam (formerly Fujitsu Vietnam).
- Nominatim: "Khu công nghiệp Biên Hòa II" (no result) and "…Biên Hòa 2".

**Found:**
- The park is confirmed by the LHU and TDTU pages.
- "No. 31, Road 3A" comes from a single job-board aggregator, so it was not used.
- OSM way 306132369 is "Khu công nghiệp Biên Hòa 2".

**Result:** centroid 10.9196, 106.8691.

#### 16. vn-xuanloc-dona — industrial-park (stepped down)

**Searched:**
- Web: Vietnamese and English searches; Panjiva record.
- Nominatim: "Khu công nghiệp Xuân Lộc".

**Found:**
- The Panjiva record is titled "Vietnam Dona Standard Footwear Co., Ltd. Xuan Loc I.Z Xuan Loc Dist".
- A Đồng Nai DOST item, as quoted in search snippets, gives about 28,000 workers and a DS5 factory. The page itself would not load the article.
- OSM way 924383400 is "Khu công nghiệp Xuân Lộc".

**Caveat:** With about 28,000 workers and several factories (DS1–DS5…), Dona Standard may also run plants outside the park. Only the I.Z. location is documented.

**Result:** centroid 10.9080, 107.4131.

#### 17. vn-nhontrach2-vmep — city (stepped down)

**Searched:**
- Web: thanhtra.com.vn and congthuong.vn reports on decision 1128/QĐ-XPHC.
- Nominatim: "VMEP", "Khu công nghiệp Nhơn Trạch II/2", "Đường 5C, Nhơn Trạch".
- Overpass: named landuse=industrial in the Nhơn Trạch bbox.

**Found:**
- Address: Lô 4, đường 5C, KCN Nhơn Trạch II.
- OSM has a single undivided "Khu công nghiệp Nhơn Trạch" polygon (way 366493800, about 6 × 6 km). It has no Nhơn Trạch II boundary and no road 5C.
- OSM "Công ty Hũu Hạn VMEP SYM" (way 977161171) is VMEP's **Biên Hòa** (Tam Hiệp) plant, a different site, and was not used.
- Note: news reports disagree on the fine amount (congthuong.vn attributes 355 million VND to VMEP; Báo Đồng Nai attributes that figure to Kuang Tai).

**Why city:** The point is the Nominatim centroid of relation 9806927 "Phường Nhơn Trạch" (10.7376, 106.9451).

#### 18. vn-nhontrach2-multitech-p2 — city (stepped down)

**Found:** The expansion is at đường số 2, KCN Nhơn Trạch III – Giai đoạn 2, xã Long Thọ (moitruong.net.vn).

**Why city:** No OSM polygon exists for Nhơn Trạch III or its phase 2. The commune Long Thọ no longer exists in OSM after the 2025 merger; Nominatim "Long Thọ, Đồng Nai" returned only unrelated churches. The point is the same Phường Nhơn Trạch ward centroid as key 17.

#### 19. vn-nhontrach2-multitech-p1 — facility

**Searched:** Nominatim for "Advanced Multitech".

**Found:** OSM way 638294999 "TNHH Advanced Multitech" (man_made=works) on Đường Trần Phú inside the Nhơn Trạch industrial area.
- It sits next to OSM "Formosa Đồng Nai" (way 638294998). This fits Panjiva's "Nhon Trach 3 IP, Hung Nghiep Formosa" and the official "đường số 4, KCN Nhơn Trạch III".
- Name collision checked: "Formosa Đồng Nai" and "Formosa Industries Corporation" (way 1327455594) are neighbouring Formosa entities, not this company.

**Caveat:** The polygon is a single 2018 trace (v1, 10 nodes, about 51 ha), so the outline is coarse. The centroid (10.72373, 106.93583) is given to 4 decimals. If you want to be stricter, downgrade this key to city like key 18.
