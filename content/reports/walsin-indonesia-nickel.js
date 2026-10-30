import { Link as ChakraLink } from '@chakra-ui/react';
import { Intro, Chapter, SubHead, P } from '../../components/report/Prose';
import { Photo, DataTable } from '../../components/report/Figures';

// Source: cloud manuscript, retrieved 2026-10-30. Images preserve original bytes and credits.
// Approved statistic exception: https://formosaoversee.com/ read 2026-10-30: 95 companies, 93 events, 10 countries, 92 sites, 5,431 violations.
export const TOC = [{"id": "section-1", "num": "1", "label": "大事記"}, {"id": "section-2", "num": "2", "label": "一、透過股權持有當地子公司"}, {"id": "section-3", "num": "3", "label": "二、在地的聲音：煤灰、呼吸道疾病與一場墜落"}, {"id": "section-4", "num": "4", "label": "三、Halmahera：另一座園區、另一座燃煤電廠"}, {"id": "section-5", "num": "5", "label": "四、印尼政府查了園區，沒有點名租戶"}, {"id": "section-6", "num": "6", "label": "五、台灣這一端：報告書裡看不到的印尼"}, {"id": "section-7", "num": "7", "label": "六、華新怎麼說"}, {"id": "section-8", "num": "8", "label": "七、雅加達的另一端：印尼環團怎麼看這道縫隙"}, {"id": "section-9", "num": "9", "label": "觀點｜當「子孫公司」成為監管盲區"}, {"id": "section-10", "num": "10", "label": "平台｜把煙囪和報表連起來：Formosa Oversee 的跨國企業追溯工具"}, {"id": "section-11", "num": "11", "label": "資料來源"}];
export const REVISIONS = [{"date": "2026-10-30", "text": "依雲端定稿製作網頁版，保留原文、圖說與來源。平台統計依 2026 年 10 月 30 日官網首頁更新為 95 家上市公司、93 件污染事件；其餘統計不變。"}];
export default function Article() { return <>
<Intro>

<P>{"從台北信義區的華新麗華大樓往南約 3,000 公里，是印尼中蘇拉威西省 Morowali 縣 Bahodopi 的海岸。2013 年園區動工以前，這裡是漁村與雨林，如今已是全球最大的鎳加工聚落之一，也就是印尼 Morowali 工業園區（Indonesia Morowali Industrial Park，IMIP）。煙囪、紅土堆場與燃煤電廠沿海岸排開。華新麗華的子公司 PT Walsin Nickel Industrial Indonesia（下稱 WNII）就在園區內的 Labota 村旁生產鎳生鐵，並由一座自備燃煤電廠供電。"}</P>

<P>{"2025 年 8 月 5 日，印尼居民、工人與環保團體跨海來到台北，在華新總部前召開記者會。他們指控華新的印尼工廠與燃煤電廠造成空氣與水污染，並發生職災死亡。華新回應，營運「皆符合相關法規及環保標準」。這場陳抗在台灣只成為一日新聞，之後很快沉寂。本報導比對了公司財報、永續報告書、印尼政府公告與在地調查。從這些資料可以觀察到，問題不只是一家公司的爭議，而是一道沒有人負責看守的監管縫隙。印尼的處分停在園區層級，台灣的揭露規範則把海外子公司留在報告邊界之外。"}</P>
<Photo src={"/reports/walsin-indonesia-nickel/image1.jpg"} alt={"同一片海岸的十年變化：左為 2016 年 4 月，右為 2025 年 8 月。右圖可見大片冶煉廠、紅土堆場、港口與機場，外海停滿船隻。衛星影像：含經修改之 Copernicus Sentinel 資料（2016、2025），本平台裁切處理。"} caption={"同一片海岸的十年變化：左為 2016 年 4 月，右為 2025 年 8 月。右圖可見大片冶煉廠、紅土堆場、港口與機場，外海停滿船隻。衛星影像：含經修改之 Copernicus Sentinel 資料（2016、2025），本平台裁切處理。"} width={2800} height={1217} />
</Intro>
<Chapter id="section-1" title={"大事記"}>
<DataTable rows={[["時間", "事件", "與華新的關係"], ["2013", "IMIP 園區成立，開始開發 Bahodopi 海岸", "—"], ["2020", "華新與青山集團合資設立 WNII", "直接"], ["2021", "Labota 自備燃煤電廠 Unit 1（約 350 MW）運轉", "依 GEM 資料屬 WNII"], ["2022", "華新取得 Weda Bay 的 SMI 控股權", "直接"], ["2022-08", "Weda Bay 自備燃煤電廠 Unit 7（380 MW）運轉", "依 GEM 資料屬 SMI"], ["2023-12-24", "IMIP 內 ITSS 冶煉廠爐體爆炸，至少 20 人死亡", "非華新廠區"], ["2024-07-22", "Labota 居民連續三天抗議煤灰落塵", "TTNC 報告記錄，未指認廠商"], ["2024-07", "IWIP 周邊淹水，1,700 多人撤離、1 人死亡", "園區層級"], ["2024-09-28", "WNII 工人自輸送帶墜落身亡", "直接"], ["2024-11-10", "TTNC Watch 發表印尼台商人權報告，點名華新", "直接"], ["2025-05-30", "印尼環境部長突擊檢查 IMIP", "園區層級"], ["2025-06", "環境部公布 IMIP 違規事項並處分", "園區層級，未點名租戶"], ["2025 第二季", "華旭廠停產", "直接，見華新永續報告書"], ["2025-07-12", "印尼環境部稽查 IWIP", "園區層級，未點名 SMI"], ["2025-08-05", "印尼居民與工人到台北華新總部陳抗", "直接"], ["2026-02", "IMIP 內 PT QMB 尾礦區崩塌，造成工人死亡", "非華新廠區"], ["2026-05", "Komnas HAM 發表鎳業園區健康與環境研究", "園區層級"]]} />
</Chapter>
<Chapter id="section-2" title={"一、透過股權持有當地子公司"}>

<P>{"華新在印尼的鎳業不是單純的財務投資"}{"或"}{"委託當地廠商代工。依華新 2026 年第二季合併財報附註，三家印尼冶煉公司都列在「列入合併財務報告之子公司」名單中："}</P>

<P>{"WNII："}{"華新直接持有 50%，再透過全資的新加坡控股公司 Walsin Singapore 持有 42%，綜合持股 92%。工廠位於 IMIP，生產鎳生鐵（NPI）。2025 年銷量約 3.3 萬鎳噸，2026 年上半年淨利約新台幣 7.5 億元。"}</P>

<P>{"PT Sunny Metal Industry（SMI）："}{"Walsin Singapore 持有 50.1%，再經香港的 Berg Holding 間接持有 39.35%，綜合持股約 79.6%。工廠位於北馬魯古省 Halmahera 島的 Weda Bay 工業園區（IWIP），生產冰鎳與鎳生鐵。"}</P>

<P>{"PT Walhsu Metal Industry（華旭）："}{"SMI 持有 99.9%、WNII 持有 0.1%，生產冰鎳。依華新 2025 年永續報告書，這座「華旭廠」自 2025 年第二季起停產。"}</P>

<P>{"華新在 2020 年與中國青山集團（Tsingshan）合資設立 WNII，2021 至 2023 年間陸續增持 WNII，並分兩階段取得 SMI 的控制權。2025 年 10 月，華新又把 IMIP 內一家不銹鋼線材合資公司增資至 51%，納入合併報表。上游方面，華新也間接投資南加里曼丹的煤礦 PT Transcoal Minergy。依 2022 年的媒體報導，這項投資是為了確保印尼兩廠每年約 250 萬噸的燃煤供應。"}</P>
<Photo src={"/reports/walsin-indonesia-nickel/image2.png"} alt={"資料來源：華新麗華 2026 年第二季合併財報附註、2025 年年報。電廠容量取自 Global Energy Monitor，公司未揭露。"} caption={"資料來源：華新麗華 2026 年第二季合併財報附註、2025 年年報。電廠容量取自 Global Energy Monitor，公司未揭露。"} width={1745} height={1072} />

<P>{"這套持股結構代表兩件事。第一，WNII 與 SMI 的營收與獲利併入華新報表，由台灣上市公司實質控制。第二，持股路徑經過新加坡與香港兩層控股公司，所以在印尼當地的公司登記、處分文件或新聞裡，往往看不出它們與台灣母公司的關係。"}</P>
</Chapter>
<Chapter id="section-3" title={"二、在地的聲音：煤灰、呼吸道疾病與一場墜落"}>
<Photo src={"/reports/walsin-indonesia-nickel/image3.jpg"} alt={"IMIP 園區一隅，2023 年 7 月。前景為工人宿舍與機車停車場，後方為港口吊機與原料堆置棚。圖片來源：印尼公共工程與住宅部（Kementerian PUPR），公有領域，via Wikimedia Commons。"} caption={"IMIP 園區一隅，2023 年 7 月。前景為工人宿舍與機車停車場，後方為港口吊機與原料堆置棚。圖片來源：印尼公共工程與住宅部（Kementerian PUPR），公有領域，via Wikimedia Commons。"} width={1920} height={1233} />

<P>{"Bahodopi 一帶的空污問題，印尼媒體與研究機構已記錄多年。Mongabay Indonesia 2024 年 10 月引述的研究指出，IMIP 周邊 Fatufia、Bahomakmur、Labota 三村的 PM10、PM2.5 與二氧化硫平均濃度都超過政府標準，二氧化硫主要來自園區的自備燃煤電廠。印尼國家人權委員會（Komnas HAM）2026 年的研究引用衛生部數據：Morowali 的急性呼吸道感染（ISPA）通報量居中蘇拉威西各縣之首。委員會認為，這可能侵害了居民享有良好健康環境的權利。"}</P>

<P>{"Kurisa 漁村的 Bajau 族漁民告訴記者，電廠排出的熱廢水讓近岸海水變紅、變濁。過去以捕魚為生的一百多戶人家，現在一天只抓得到幾公斤，不少人改去撿塑膠或騎機車載客。"}</P>

<P>{"這些報導多半描述整座園區，沒有點名個別廠商。直接指向華新的，是台灣跨國企業監察（TTNC Watch）2024 年 11 月發表的《印尼台商企業與人權報告》，以及 2025 年 8 月的台北陳抗。"}{"TTNC 報告記錄了以下幾件事："}</P>

<P>{"2024 年 7 月 22 日起，Labota 居民連續三天抗議煤灰落塵。"}</P>

<P>{"當地公立小學 SD Negeri Labota 與一所伊斯蘭中學，距離 IMIP 自備電廠煙囪僅 100 至 200 公尺，有學生出現咳嗽與呼吸短促。報告寫的是「IMIP 的」電廠，沒有指認是哪一家廠商的煙囪。"}</P>

<P>{"2024 年 9 月 28 日清晨，WNII 窯爐輸送帶部門一名工人遭輸送帶擠壓，從 20 多公尺高處墜落身亡。"}</P>

<P>{"華新 2024 年永續報告書也記載當年發生「1 件印尼鎳業死亡工傷」，可以和 TTNC 的紀錄相互對照。在台北陳抗現場，一名 WNII 員工向 TaiwanPlus 表示：「這是一家高檔的公司，安全措施也應該是最高等級。」"}</P>
</Chapter>
<Chapter id="section-4" title={"三、Halmahera：另一座園區、另一座燃煤電廠"}>

<P>{"華新的第二個據點在北馬魯古省 Halmahera 島的 Weda Bay 工業園區（IWIP）。依 Global Energy Monitor 資料，SMI 擁有園區內一座 380 MW 的超臨界燃煤機組，2022 年 8 月開始運轉。TTNC 報告也記載了這座電廠。2025 年 8 月的台北陳抗中，環保團體同時點名 Morowali 與 Weda Bay 兩地的冶煉廠與燃煤電廠。"}</P>

<P>{"IWIP 周邊的環境紀錄，主要來自國際人權組織 Climate Rights International（CRI）與印尼在地團體的調查："}</P>

<P>{"森林與煤電："}{"Halmahera 鎳礦特許區內至少 5,331 公頃熱帶森林遭砍伐，園區已新建 12 座燃煤電廠，合計約 3.78 GW（CRI，2024 年 1 月）。"}</P>

<P>{"河川："}{"印尼礦業監督團體 JATAM 在 Kobe 等三條河測得鎳濃度每公升 4.37 至 4.84 毫克，標準為 0.5 毫克（CRI，2025 年 6 月）。"}</P>

<P>{"呼吸道疾病："}{"JATAM 取得的 Lelilef 衛生所數據顯示，急性呼吸道感染病例從 2020 年的 434 例增加到 2023 年的 10,579 例（CRI，2025 年 6 月）。"}</P>

<P>{"血液重金屬："}{"環保組織 Nexus3 與 Tadulako 大學 2024 年採樣 Gemaf、Lelilef 兩村 46 名居民，47% 血汞超標、32% 血砷超標（Mongabay，2025 年 7 月）。"}</P>

<P>{"淹水："}{"2024 年 7 月園區周邊淹水，1,700 多人撤離，1 人死亡（CRI，2025 年 6 月）。"}</P>

<P>{"這些調查的對象都是整座園區，沒有點名 SMI。印尼環境部 2025 年 7 月 12 日稽查 IWIP，點名的公司也不含 SMI。直接指向華新的仍是 TTNC 報告。報告記載，SMI 的部分鎳礦來自 PT Sambaki Tambang Sentosa，這家礦商與當地居民屢有衝突，2024 年 7 月曾驅離居民。"}</P>
</Chapter>
<Chapter id="section-5" title={"四、印尼政府查了園區，沒有點名租戶"}>

<P>{"2025 年 5 月 30 日，印尼環境部長 Hanif Faisol Nurofiq 突擊檢查 IMIP。6 月中，環境部公布檢查結果：園區約 1,800 公頃的設施不在原環境影響評估（AMDAL）範圍內，總懸浮微粒與 PM10 超標，並有未經許可的尾礦堆置。環境部對園區下達行政命令並處以罰款，尾礦部分則進入刑事與民事程序。另一份新聞稿指出，園區有 24 個租戶排放源沒有裝設連續排放監測系統（CEMS）。"}</P>

<P>{"這些處分的對象都是園區管理公司 PT IMIP，沒有公開點名個別租戶。唯一提到華新的段落，是部長視察時探訪 Labota 村的淹水災區，新聞稿寫該村「鄰近 PT Walcin 與 PT Kinriu 的營運範圍」。從地點與電廠資料推測，「Walcin」很可能是 Walsin 的誤拼。但印尼官方並沒有把任何違規歸到華新子公司名下。"}</P>

<P>{"這背後有制度上的原因。2020 年的《創造就業綜合法》（UU Cipta Kerja）與施行細則 PP 22/2021，把環境許可併入營業許可，公眾參與也限縮為「直接受影響者」。IMIP 列為國家戰略計畫（PSN），可以適用 2022 年第 112 號總統令的例外條款，繼續新建自備燃煤電廠。依 CREA 與 Global Energy Monitor 統計，印尼自備燃煤電廠已超過 22 GW，其中約 14 GW 屬於鎳業。在這套框架下，WNII 在印尼官方企業環境評等（PROPER）拿到代表「符合法規」的藍級，華新的永續報告書也列出了這項評等。"}</P>
<Photo src={"/reports/walsin-indonesia-nickel/image4.jpg"} alt={"通往 Morowali 鎳礦裝船碼頭的紅土運輸道路，2024 年 11 月。攝影：Marwan Mohamad／CC BY-SA 4.0，via Wikimedia Commons。"} caption={"通往 Morowali 鎳礦裝船碼頭的紅土運輸道路，2024 年 11 月。攝影：Marwan Mohamad／CC BY-SA 4.0，via Wikimedia Commons。"} width={1920} height={1080} />
</Chapter>
<Chapter id="section-6" title={"五、台灣這一端：報告書裡看不到的印尼"}>

<P>{"印尼的處分停在園區層級，台灣的資訊揭露能不能補上？比對華新 2025 年永續報告書，可以看到幾處落差："}</P>

<P>{"邊界只部分納入印尼。"}{"報告書寫明，揭露範疇「以臺灣、大陸、歐洲主要營運據點為主，部分內容涵蓋印尼及其他子公司」。"}</P>

<P>{"溫室氣體有揭露，而且量很大。"}{"WNII 與 SMI 兩廠 2025 年範疇一加範疇二排放約 594 萬噸 CO2e。其中範疇一約 261 萬噸，占報告書所列子公司範疇一排放的九成以上。"}</P>

<P>{"空污數據沒有印尼。"}{"硫氧化物、氮氧化物與粒狀物的數據表只列台灣與中國各廠。全本報告沒有提到印尼廠的脫硫設備或 CEMS。"}</P>

<P>{"燃煤占比寫 0%。"}{"依 SASB 鋼鐵業準則揭露的「燃煤占比」是 0.00%。這項指標的計算邊界是台灣、中國、馬來西亞與歐洲的不銹鋼廠區，不含實際燒煤的印尼廠。"}</P>

<P>{"職安數據缺一塊。"}{"SMI 2025 年的職安指標，以「目前正與園區確認統計基準」為由全部沒有揭露。華旭廠因停產，也不在揭露範疇內。"}</P>

<P>{"人權盡職調查還沒到印尼。"}{"公司規劃 2026 年啟動人權盡職調查，第一階段對象是台灣員工與一階供應商。報告書中沒有看到給印尼社區的申訴管道。"}</P>

<P>{"這些揭露方式在現行規範下並不違規。金管會與證交所的永續報告書規範要求依 GRI 與 SASB 揭露，但沒有要求每一家海外子公司都納入每一項指標，也沒有要求做海外環境盡職調查。經濟部的對外投資審議，重點在國家安全與關鍵技術。《企業與人權國家行動計畫》2.0 版草案已在 2025 年 7 月送行政院，配套的「臺灣企業供應鏈尊重人權方案」規劃先適用年營收 500 億元以上的上市櫃製造業，實施時程則可能延到 2028 年。陳抗後，經濟部投資促進司官員受訪時表示，目前是鼓勵企業提出永續報告書。"}</P>

<P>{"台灣媒體方面，公視、中央社、TaiwanPlus 與 New Bloom 報導過 2025 年 8 月的陳抗。本次檢索沒有找到國內主要調查媒體針對華新印尼鎳業的深度報導，也沒有找到立法院的正式質詢紀錄。"}</P>
<Photo src={"/reports/walsin-indonesia-nickel/image5.jpg"} alt={"台北信義區的華新麗華大樓。2025 年 8 月，印尼居民與工人在此陳抗。攝影：Yu tptw／CC BY-SA 4.0，via Wikimedia Commons。"} caption={"台北信義區的華新麗華大樓。2025 年 8 月，印尼居民與工人在此陳抗。攝影：Yu tptw／CC BY-SA 4.0，via Wikimedia Commons。"} width={1920} height={2238} />
</Chapter>
<Chapter id="section-7" title={"六、華新怎麼說"}>

<P>{"對於 2025 年 8 月的指控，華新以書面回應：相關資訊「部分與事實不符」，公司「都已實地查證並予以回應與澄清」，營運「皆符合相關法規及環保標準」。公司並表示，並沒有持續新建燃煤電廠，廠區設有脫硫脫硝與排放監測設備，礦源都來自政府核准的供應商。職災部分，公司表示政府調查已經結案，並「已提供家屬遠優於法定標準」的照護與撫恤。公視與中央社都指出，華新的聲明沒有正面回應污染數據與職災責任。國際商業與人權資源中心（BHRRC）的華新公司頁面，截至 2026 年 10 月中旬未見公司回應紀錄。"}</P>
</Chapter>
<Chapter id="section-8" title={"七、雅加達的另一端：印尼環團怎麼看這道縫隙"}>

<P>{"印尼官方的處分停在園區，台灣的報告書停在母公司。那麼，長期在現場工作的印尼公民團體看到的是什麼？"}</P>

<P>{"2026 年 8 月，本平台在教育部青年發展署「Young Fly 全球行動計畫」的支持下，訪談了雅加達的環境組織 AEER（Aksi Ekologi dan Emansipasi Rakyat，人民生態與解放行動）。受訪的是負責鎳礦研究的環境地質研究員 Femi Ona，以及專注北馬魯古省的生物多樣性專員 Emelda Sanata。"}</P>

<P>{"AEER 是長期追蹤印尼關鍵礦產供應鏈的團體。"}{"他們"}{"曾清查 Morowali 縣 70 張採礦許可，估計有超過 13 萬公頃森林面臨開採風險；也比對過蘇拉威西與馬魯古 206 處關鍵生物多樣性區域，發現其中 28 處與 109 張鎳礦特許區重疊，面積約 15 萬公頃。2025 年起，AEER 先後向 G7 與 G20 喊話，要求對印尼鎳業投資建立盡職調查規範。2026 年 3 月，它在雅加達推出「Pantau Mineral Kritis」（關鍵礦產監測）網站，以互動地圖呈現鋼鐵與鎳業的企業網絡與供應鏈。"}</P>

<P>{"訪談中，兩位研究員談到的三個問題，和本報導在資料裡碰到的困難幾乎一致："}</P>

<P>{"社區拿不到資訊。"}{"在 Morowali 與北馬魯古，居民多半只知道園區的名字，不知道煙囪屬於哪家租戶、母公司在哪裡。這與第四節的觀察相互印證：印尼官方的處分以園區為對象，租戶層級的資料並不公開。"}</P>

<P>{"承諾與電廠之間有落差。"}{"不少進駐園區的企業對外宣示能源轉型，園區內卻持續仰賴自備燃煤電廠供電。衡量一家公司的氣候承諾，要看它在印尼實際燒了多少煤，而不是看總部的宣言。"}</P>

<P>{"股權是最難的一關。"}{"台資、中資與印尼本地資本在同一座冶煉廠交疊，再經新加坡、香港等地的控股公司持有，單靠當地登記資料很難回推到最終母公司。AEER 的做法是逐案核對：公司、持股鏈、文件來源。"}</P>

<P>{"這次訪談讓本平台"}{"了解"}{"：印尼團體手上有現場的實證，台灣這邊有合併財報與永續報告的結構化資料，缺的是把兩者對接起來的工具。我們在訪談後寫下的心得是，透明度的核心不是單向的指控，而是建立「在地實證」與「跨國結構化資料」之間的橋樑；掌握企業真實的海外股權關聯與供應鏈足跡，是推動台灣企業海外問責最關鍵的一步。本平台與 AEER "}{"後續將"}{"持續"}{"建立連結"}{"，"}{"期望"}{"將把印尼端的個案紀錄與台灣端的持股資料逐一對接。"}</P>
</Chapter>
<Chapter id="section-9" title={"觀點｜當「子孫公司」成為監管盲區"}>

<P>{"綜合以上資料，三個本該看守的機制，各自都只看到局部："}</P>

<P>{"印尼政府："}{"處分對象是園區。24 個沒有裝監測系統的排放源，沒有公開屬於哪些租戶。"}</P>

<P>{"台灣上市規範："}{"華新依規範揭露，但空污與燃煤指標的邊界畫在印尼之外。投資人從報告書看到的燃煤占比是 0%。"}</P>

<P>{"媒體與公眾："}{"報導集中在陳抗當天。持股鏈要穿過新加坡、香港兩層，公司名稱還會被拼成「Walcin」，一般讀者很難把印尼的煙囪和台北的報表連起來。"}</P>

<P>{"本平台認為，主要的落差不在於有沒有人違法，而在於沒有人負責把這些碎片拼起來。對外投資審議與永續揭露都以母公司為單位，污染卻發生在第二、第三層的子孫公司。"}{"我們建議從三個方向著手："}</P>

<P>{"揭露邊界與合併報表一致。"}{"上市公司永續報告的空污、燃煤與職安指標，邊界應涵蓋所有列入合併報表、屬於高污染產業的海外子公司。沒有納入的，應逐一說明原因。"}</P>

<P>{"申訴管道延伸到海外社區。"}{"公司營運所在的海外社區，應有一個能用當地語言提出申訴、處理進度可以追蹤的管道。"}</P>

<P>{"建立公開的跨國資訊監控。"}{"台灣已有對外投資審議、合併財報與永續報告三套資料。把它們串成可查詢的子孫公司資料庫，再和當地政府公告、衛星影像與在地通報交叉比對，下一個「Walcin」就不會再隱形。這是本平台正在建立的工作，文末有進一步說明。"}</P>

<P>{"鎳是電動車與不銹鋼的關鍵原料。台灣企業在印尼的投資還在擴大，華新在 2025 年仍持續增資印尼的線材與煤礦相關公司。產業轉型的成本不應由 Bahodopi 的居民承擔，也不應停留在報告書的邊界之外。"}</P>
</Chapter>
<Chapter id="section-10" title={"平台｜把煙囪和報表連起來：Formosa Oversee 的跨國企業追溯工具"}>

<P>{"從華新的案例到 AEER 的訪談，我們一再碰到同一個困難：污染發生在印尼的子孫公司，處分文件用當地語言寫在園區名下，營收與獲利卻回到台北的母公司報表。要把這條線接起來，靠單篇報導不夠。有鑑於此，Formosa Oversee 正在建立一個跨國的企業追溯平台。截至 2026 年 10 月 30 日，平台收錄 95 家台灣上市公司，在 10 個國家共 93 件境外污染與勞權事件，並串接美國環保署（EPA）資料庫中 92 座台資廠區、5,431 筆違規紀錄。"}</P>

<P>{"第一個功能是污染地圖。地圖同時疊上兩層資料：美國 EPA 登錄的台資廠區與違規筆數，以及"}{"其他國家的"}{"境外污染與勞權侵害事件。使用者可以依美國、亞洲、歐洲切換區域，只看有違規的廠區，或依事件類別與狀態篩選，也可以從下拉選單指定一家公司。以華新為例，選取「1605 華新」後，地圖會標出 6 件事件：印尼 Morowali 與 Weda Bay 的空污與水污指控、中國煙台廠的粒狀物逸散、義大利 Aosta 廠周邊空氣鎳濃度超過目標值、義大利 Calusco d'Adda 與瑞典 Degerfors 子公司的廢棄物與化學品違規，以及法國 Montbard 廠的限期改善命令。圖釘的樣式會區分事件是定位到廠區、工業區還是城鎮，避免把園區層級的指控誤標成單一工廠。"}</P>
<Photo src={"/reports/walsin-indonesia-nickel/image6.jpg"} alt={"本平台污染地圖，選取華新（1605）後的畫面。右側列出 6 件境外事件，依起始日由新到舊排列，點選即可將地圖移到事件地點。圖：Formosa Oversee 網站截圖，2026 年 10 月。"} caption={"本平台污染地圖，選取華新（1605）後的畫面。右側列出 6 件境外事件，依起始日由新到舊排列，點選即可將地圖移到事件地點。圖：Formosa Oversee 網站截圖，2026 年 10 月。"} width={1706} height={1178} />

<P>{"每一件事件都附有狀態標籤，區分「社區健康指控」、「環境執法」與「污染事故」，並標示官方調查是否已有結論或已裁罰。事件下方列出持股關係：以 Aosta 的 Cogne Acciai Speciali 為例，頁面寫明華新麗華經 Walsin Lihwa Europe 與 MEG S.A. 兩層持股、有效持股 71.83%，並註明依據是華新 2026 年第二季合併財報附註；印尼兩廠則標示 WNII 有效持股 92%、SMI 79.61%。這正是本報導第一節花了整節篇幅才釐清的事，在平台上"}{"可以輕鬆取得"}{"。來源分為官方文件、公司文件、當地媒體、台灣媒體與 NGO 報告"}{"逐筆列出"}{"，並保留封存副本，避免原始連結失效。"}</P>
<Photo src={"/reports/walsin-indonesia-nickel/image7.jpg"} alt={"Aosta 事件頁面，列出狀態標籤、持股鏈與逐筆來源。圖：Formosa Oversee 網站截圖，2026 年 10 月。"} caption={"Aosta 事件頁面，列出狀態標籤、持股鏈與逐筆來源。圖：Formosa Oversee 網站截圖，2026 年 10 月。"} width={1616} height={882} />

<P>{"第二個功能是企業頁面。每家公司有一頁，整合公司登記資料與統計數字，並列出該公司名下所有海外據點的污染事件、環境違規與罰款紀錄，可依廠區篩選。收錄原則是：每個事件至少有一份官方、法院或公司文件，或兩家互相獨立的媒體報導；指控與已確定的事實以狀態標示區分。"}</P>

<P>{"平台還在初期階段；印尼、歐洲與中國的官方處分文件，沒有像美國 EPA 那樣的結構化資料庫可以直接串接。但方向已經確定：讓投資人、記者與社區，在同一個頁面上看到煙囪在哪裡、報表在哪裡，以及兩者之間的那條線。下一個「Walcin」出現時，至少不會再隱形。"}</P>
</Chapter>
<Chapter id="section-11" title={"資料來源"}>

<P>{"華新麗華，2026 年第二季合併財務報告（附註十五、附表六）；2025 年度年報；2024、2025 年永續報告書。"}<ChakraLink href={"https://esg.walsin.com/files/report-download/2025ESGreport_EN.pdf"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://esg.walsin.com/files/report-download/2025ESGreport_EN.pdf"}</ChakraLink></P>

<P>{"TTNC Watch，Report on the Human Rights and Environmental Impact of Taiwanese Businesses in Indonesia，2024-11-10。"}<ChakraLink href={"https://business-humanrights.org/en/latest-news/report-documents-human-rights-environmental-impacts-of-taiwanese-business-in-indonesia"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://business-humanrights.org/en/latest-news/report-documents-human-rights-environmental-impacts-of-taiwanese-business-in-indonesia"}</ChakraLink></P>

<P>{"印尼環境部 KLH/BPLH 新聞稿 SR.99，2025-05-30。"}<ChakraLink href={"https://kemenlh.go.id/news/detail/negara-tidak-boleh-lengah-menteri-lh-sidak-kawasan-industri-nikel-di-morowali-temukan-pelanggaran-lingkungan-serius"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://kemenlh.go.id/news/detail/negara-tidak-boleh-lengah-menteri-lh-sidak-kawasan-industri-nikel-di-morowali-temukan-pelanggaran-lingkungan-serius"}</ChakraLink></P>

<P>{"印尼環境部 KLH/BPLH，IMIP 違規事項公告，2025-06。"}<ChakraLink href={"https://kemenlh.go.id/news/detail/klhbplh-temukan-pelanggaran-lingkungan-serius-di-kawasan-industri-pt-imip"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://kemenlh.go.id/news/detail/klhbplh-temukan-pelanggaran-lingkungan-serius-di-kawasan-industri-pt-imip"}</ChakraLink></P>

<P>{"Mongabay Indonesia，2024-10-02。"}<ChakraLink href={"https://mongabay.co.id/2024/10/02/dampak-polusi-di-kawasan-industri-nikel-morowali/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://mongabay.co.id/2024/10/02/dampak-polusi-di-kawasan-industri-nikel-morowali/"}</ChakraLink></P>

<P>{"Mongabay Indonesia，2025-07-28。"}<ChakraLink href={"https://mongabay.co.id/2025/07/28/nestapa-nelayan-kurisa-setelah-kawasan-industri-nikel-datang/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://mongabay.co.id/2025/07/28/nestapa-nelayan-kurisa-setelah-kawasan-industri-nikel-datang/"}</ChakraLink></P>

<P>{"Mongabay Indonesia，2026-05-08。"}<ChakraLink href={"https://mongabay.co.id/2026/05/08/kajian-komnas-ham-sebut-kawasan-industri-nikel-korbankan-lingkungan-dan-kesehatan/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://mongabay.co.id/2026/05/08/kajian-komnas-ham-sebut-kawasan-industri-nikel-korbankan-lingkungan-dan-kesehatan/"}</ChakraLink></P>

<P>{"中央社，2025-08-05。"}<ChakraLink href={"https://www.cna.com.tw/news/ahel/202508050217.aspx"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.cna.com.tw/news/ahel/202508050217.aspx"}</ChakraLink></P>

<P>{"公視新聞網，2025-08-05。"}<ChakraLink href={"https://news.pts.org.tw/article/764080"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://news.pts.org.tw/article/764080"}</ChakraLink></P>

<P>{"TaiwanPlus，2025-08-07。"}<ChakraLink href={"https://www.taiwanplus.com/news/taiwan-news/human-rights/250807005/activists-in-taiwan-call-for-better-practices-in-indonesian-nickel-mining-sites"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.taiwanplus.com/news/taiwan-news/human-rights/250807005/activists-in-taiwan-call-for-better-practices-in-indonesian-nickel-mining-sites"}</ChakraLink></P>

<P>{"New Bloom，2025-09-18。"}<ChakraLink href={"https://newbloommag.net/2025/09/18/tw-indonesia-companies/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://newbloommag.net/2025/09/18/tw-indonesia-companies/"}</ChakraLink></P>

<P>{"CREA 與 Global Energy Monitor 印尼自備燃煤電廠統計，2026-01；GEM Wiki，Sulawesi Labota power station、Weda Bay power station。"}<ChakraLink href={"https://www.gem.wiki/Sulawesi_Labota_power_station"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.gem.wiki/Sulawesi_Labota_power_station"}</ChakraLink></P>

<P>{"Climate Rights International，Nickel Unearthed，2024-01；Ongoing Harms, Limited Accountability，2025-06。"}<ChakraLink href={"https://cri.org/wp-content/uploads/2025/06/Final-PDF_Ongoing-Harms-Limited-Accountability.pdf"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://cri.org/wp-content/uploads/2025/06/Final-PDF_Ongoing-Harms-Limited-Accountability.pdf"}</ChakraLink></P>

<P>{"Mongabay，2025-07（Nexus3 血液檢測）。"}<ChakraLink href={"https://news.mongabay.com/2025/07/indonesia-tests-shows-blood-mercury-rising-at-ground-zero-of-world-energy-transition/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://news.mongabay.com/2025/07/indonesia-tests-shows-blood-mercury-rising-at-ground-zero-of-world-energy-transition/"}</ChakraLink></P>

<P>{"印尼環境部 KLH/BPLH，IWIP 稽查新聞稿，2025-07-12。"}<ChakraLink href={"https://www.kemenlh.go.id/news/detail/iwip-dalam-pantauan-klhbplh-inspeksi-lapangan-ungkap-pekerjaan-rumah-lingkungan-untuk-segera-diselesaikan"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.kemenlh.go.id/news/detail/iwip-dalam-pantauan-klhbplh-inspeksi-lapangan-ungkap-pekerjaan-rumah-lingkungan-untuk-segera-diselesaikan"}</ChakraLink></P>

<P>{"Formosa Oversee，「2026 Young Fly 全球行動計畫 國際連結 Ep.1」AEER 訪談，2026-08-03。"}<ChakraLink href={"https://www.instagram.com/p/DbllU2Bk665/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.instagram.com/p/DbllU2Bk665/"}</ChakraLink></P>

<P>{"AEER（Aksi Ekologi dan Emansipasi Rakyat），Pantau Mineral Kritis 關鍵礦產監測平台，2026-03。"}<ChakraLink href={"https://pantaumineralkritis.id/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://pantaumineralkritis.id/"}</ChakraLink></P>

<P>{"Formosa Oversee，華新麗華股份有限公司企業頁面與污染地圖，2026-10 擷取。"}<ChakraLink href={"https://formosaoversee.com/companies/tw-1605"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://formosaoversee.com/companies/tw-1605"}</ChakraLink></P>
</Chapter>
</>; }
