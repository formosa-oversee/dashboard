import { Link as ChakraLink } from '@chakra-ui/react';
import { Intro, Chapter, SubHead, P, Cite } from '../../components/report/Prose';
import { Photo, DataTable } from '../../components/report/Figures';

// Source: cloud manuscript, retrieved 2026-10-30. Images preserve original bytes and credits.
// Verified editorial exception: the DOCX contains exactly six photos, not nine diagrams.
export const TOC = [{"id": "section-1", "num": "1", "label": "越南：死魚沿著海岸往南漂，污染不只停在工廠外"}, {"id": "section-2", "num": "2", "label": "補償金到了，為何有些居民仍說：「還沒有得到公道」？"}, {"id": "section-3", "num": "3", "label": "美國德州：一粒塑膠顆粒，讓在地漁民打贏一場水污染訴訟"}, {"id": "section-4", "num": "4", "label": "路易斯安那：已有違規紀錄的廠，與尚未興建的新廠，不能混為一談"}, {"id": "section-5", "num": "5", "label": "跨海的回聲傳回台灣：地方居民要的，是可驗證的改善"}, {"id": "section-6", "num": "6", "label": "證據不是裝飾：本篇報導如何查核"}];
export const REVISIONS = [{"date": "2026-10-30", "text": "依雲端稿製作網頁版，保留圖說與來源；圖文整合段依實際內嵌素材更正為 6 張照片；21 筆來源連結另行核對補入，非從原稿擷取；第 8 筆採 Texas Tribune、第 14 筆採 2017 年 7 月 14 日越南政府公告並更新書目。依核准修正圖四圖說、移除編輯對話殘留，圖五副標移回正文。"}];
export default function Article() { return <>
<Intro>
<Photo src={"/reports/formosa-plastics-overseas-pollution/image5.jpg"} alt={"圖 1｜2016 年5 月1 日，越南民眾上街抗議中部沿海死魚事件，要求台塑負責。攝影：AFP；刊載：VOA 越南語照片集。"} caption={"圖 1｜2016 年5 月1 日，越南民眾上街抗議中部沿海死魚事件，要求台塑負責。攝影：AFP；刊載：VOA 越南語照片集。"} width={648} height={432} />

<P>{"2016 年，越南中部沿海出現大規模魚群死亡；十年後，受影響漁民的補償與跨國救濟仍被持續討論。另一端，美國德州海灣的居民撿拾塑膠顆粒、累積證據，把地方水污染訴訟帶進聯邦法院。看似相距遙遠的兩片海岸，指向同一個提問：一個跨國企業集團的環境責任，應從哪一道國界開始、又在哪裡結束？"}</P>

<P>{"本專題以越南河靜鋼鐵、美國德州 Point Comfort 廠區及路易斯安那州的工業爭議為核心，對照官方紀錄、法院文件、社區倡議、企業公開回應，梳理「已確認污染」「監管處分」與「尚待裁決的風險」三種不同事實層次。"}</P>

<P>{"01  /  VIETNAM  /  HA TINH"}</P>
</Intro>
<Chapter id="section-1" title={"越南：死魚沿著海岸往南漂，污染不只停在工廠外"}>

<P>{"2016 年4 月，越南中部海岸接連出現異常大量死魚。越南政府於同年6 月30 日對外公布調查結果：河靜省永安港一帶的台塑河靜鋼鐵興業責任有限公司（Formosa Ha Tinh Steel，FHS），在建廠與試運轉期間發生違規及事故，排放含苯酚、氰化物與含鐵化合物的廢水，造成河靜、廣平、廣治、承天順化四省海洋生物大量死亡。"}</P>
<Photo src={"/reports/formosa-plastics-overseas-pollution/image3.jpg"} alt={"圖 2｜越南承天順化省海灘，居民展示撿拾的死魚；為2016 年事件的現場影像。攝影：AFP；刊載：ABC News，2016/6/6。"} caption={"圖 2｜越南承天順化省海灘，居民展示撿拾的死魚；為2016 年事件的現場影像。攝影：AFP；刊載：ABC News，2016/6/6。"} width={584} height={390} />

<P>{"這場事件不是單純的「海水變髒」。漁民突然失去漁獲，水產收購、冷藏運送、餐飲、海濱旅遊與製鹽活動也受到衝擊。"}{"越南"}{"官方曾統計四省沿岸清出的死魚超過100 公噸，並將漁撈、養殖、漁業後勤及觀光等列入補償對象。"}</P>
<SubHead>{"官方確立因果，企業承諾支付五億美元"}</SubHead>

<P>{"河靜鋼鐵於2016 年6 月28 日承認事件責任，向越南政府與人民公開致歉，承諾支付5 億美元，用於經濟損失補償、轉業協助與海洋環境修復，並改善廢水處理系統。越南政府同年8 月底宣布已收到全額款項。"}</P>

<P>{"然而，「5 億美元已付款」不等於「每一位受災者皆獲公平救濟」。越南官方說明此筆款項由政府接收，再按受影響產業、區域與身分分配；不同漁民、製鹽業者、收購商和旅遊從業者的損失，難以由同一套行政金額衡量。2016 年越南媒體報導，當時個人補償級距約為130 至1,600 美元；這是當年的官方方案範圍，不代表所有申請者都已實際領取。"}</P>

<P>{"曾有一條更早的訴訟路徑：2016 年9 月底，來自義安省瓊瑠縣等地的居民把506 件求償訴狀送進河靜奇英地區法院。法院10 月退回，理由包括未充分檢附個別損失證據，以及政府已有具效力的事件處理決定。居民於是連「進入審理」都面臨障礙。此數字是「訴狀件數」，不能和2019 年在台提告的「7,875名居民」相加當作受害總數。"}</P>

<P>{"然而，賠償款支付的對象是越南政府，後續仍須由行政體系認定受災資格與分配。對漁村而言，最難量化的問題或許不是一季少捕了多少魚，而是市場對海產品的信任要花多久才能恢復，以及下一代是否還願意以海維生。"}</P>

<P>{"「對企業而言，五億美元或許是一次性付款；對靠海生活的家庭而言，失去的收入與工作網絡卻可能延續多年。」"}</P>

<P>{"02  /  VIETNAM  /  COMMUNITY VOICES"}</P>
</Chapter>
<Chapter id="section-2" title={"補償金到了，為何有些居民仍說：「還沒有得到公道」？"}>

<P>{"官方支付紀錄與民間受害經驗，描述的往往不是同一件事。越南政府宣稱已收足台塑河靜鋼鐵支付的5 億美元；但人權觀察（Human Rights Watch）於2024 年指出，部分居民反映申請補償遭遇阻礙，也質疑補償分配缺乏透明度。對民間團體而言，「政府收款完成」不能直接推論為「所有受害戶都已獲得合理補償」。"}</P>
<Photo src={"/reports/formosa-plastics-overseas-pollution/image4.jpg"} alt={"圖 3｜2016 年5 月1 日，河內民眾舉牌抗議，要求保護海洋環境；對應居民發聲與補償爭議。攝影：AFP；刊載：VOA 越南語照片集。"} caption={"圖 3｜2016 年5 月1 日，河內民眾舉牌抗議，要求保護海洋環境；對應居民發聲與補償爭議。攝影：AFP；刊載：VOA 越南語照片集。"} width={584} height={390} />

<P>{"2019 年，公視新聞訪問一名越南漁民阮先生，他表示當時仍未拿到補償，希望台塑河靜鋼鐵給予公道；接受公視採訪的台灣律師則指出，部分漁民為了生活，被迫出售漁具或漁船。這些是受訪者當時的陳述，不能直接代表所有受災民眾，但揭示補償標準、領取與實際損失之間的落差。"}</P>
<SubHead>{"將污染從越南法庭帶到台灣"}</SubHead>

<P>{"2019 年，約7,875 名越南居民在台灣提出民事損害賠償訴訟，試圖向海外投資企業與相關責任方求償。最高法院於2020 年撤銷先前否認我國法院管轄權的裁定，要求高等法院更為裁定；但其後案件也面臨跨境委任書認證等程序爭議。2025 年憲法法庭對其中一名聲請人的憲法審查聲請作成不受理裁定，並非對污染損害責任完成實體審判。附加的制度門檻同樣值得追蹤：法院程序曾要求大量越南原告將委任文件交由台灣駐越南機構認證。2025 年憲法法庭第114 年審裁字743 號裁定，揭露其中一位聲請人因未補正認證文件，致相關抗告遭程序駁回；憲法法庭本身則因聲請要件不合而不受理。這不是法院認定污染事件沒有發生，而是跨境訴訟仍難通過文書及程序關卡。地方的反饋不只有訴訟。人權觀察記錄，越南民眾曾以遊行、請願要求調查透明與補償，部分參與者後來遭逮捕或判刑。這使跨國救濟不只關乎環境科學，也涉及居民能否安全發聲、取得證據與參與程序。"}</P>
<SubHead>{"真正的損失，能被行政表格完整量化嗎？"}</SubHead>

<P>{"《自由亞洲電台》2024 年訪問廣平省一名修船業者，他稱自己被歸類為一般技術工，獲得約1,700萬越南盾補償，僅相當於其自認損失的一部分。這類個別陳述尚需核對行政文件與實際收入紀錄，但足以指出補償分類可能影響不同職業的救濟結果"}{"。"}{"2026 年適逢事故十週年，獨立環境媒體Mongabay 仍追蹤漁民申訴與跨境訴訟的困境。十年過去，討論焦點從「誰排放污染」逐漸轉向「誰有權評估損失、誰能證明補救已完成」。《Mongabay》2026 年4 月的十週年報導引述越南政府核可的受災名單，約有51 萬人、13 萬戶列於補償範圍；但列入名單並不等於實際獲得足額救濟。該報導也記錄受害者團體反映訴訟委任認證時遭遇安全疑慮。人權觀察在2024 年記載「至少41 名倡議者被判刑，當時31 人在獄中」；到2026 年其他媒體估計的人數已有不同，不能將不同年份的在押數字視作同時點事實。"}</P>

<P>{"03  /  UNITED STATES  /  TEXAS"}</P>
</Chapter>
<Chapter id="section-3" title={"美國德州：一粒塑膠顆粒，讓在地漁民打贏一場水污染訴訟"}>

<P>{"越南的災害以大量死魚進入國際視野；德州的證據則小得多。美國德州 Point Comfort 石化廠附近，社區志工在海灣與溪流邊撿拾塑膠粒（nurdles）與塑膠粉末。這些工業原料若進入水體，可能隨潮汐與沉積物擴散。前捕蝦漁民、環境倡議者 Diane Wilson 與水域守護團體多年累積採樣及記錄，2017 年依法提起聯邦《清潔水法》公民訴訟。"}</P>
<Photo src={"/reports/formosa-plastics-overseas-pollution/image1.jpg"} alt={"圖 4｜德州 Cox Creek、台塑第06 號排水口附近，水面可見塑膠顆粒。來源頁記為2019 年；San Antonio Bay Estuarine Waterkeeper。"} caption={"圖 4｜德州 Cox Creek、台塑第06 號排水口附近，水面可見塑膠顆粒。來源頁記為2019 年；San Antonio Bay Estuarine Waterkeeper。"} width={518} height={390} />

<P>{"Wilson 的投入始於1989 年前後對漁獲減少的疑問；2008 年，她從一名廠內人士取得塑膠原料粒可能流出廠區的線索。往後她與同伴以日期、座標、照片及實物袋裝方式長期紀錄。San Antonio BayEstuarine Waterkeeper 公布，他們某個四年期間"}{"搜"}{"集2,428 份塑膠粒與粉末樣本，成為2017 年公民訴訟的重要基礎。另一份專題引用「約3,000 萬顆塑膠粒」的估算，惟不同報導採集期間、樣本及顆粒單位不一，本文以可核對的樣本份數為主要指標。"}</P>



<P>{"2019 年，聯邦法院認定 Point Comfort 廠區長期違反塑膠排放許可條件。當年12 月法院核准5,000萬美元的和解協議，設立 Matagorda Bay Mitigation Trust，用於灣區生態修復、環境研究與地方計畫；協議也要求廠區達成塑膠「零排放」及後續採樣監測。這筆款項不是直接支付給個人的賠償金。"}<Cite ids={[8]} /></P>

<P>{"這場訴訟的意義，在於把居民日復一日的巡守轉化為可採信的排放證據。美國《清潔水法》容許符合條件的公民對違規排放者提告，和解條款並以第三方監測、持續付款與生態修復連結「判決之後」的監督。2025 年調查報導提及，台塑已另投入約3,200 萬美元清理既有塑膠殘留；這筆企業清理成本不屬於最初5,000 萬美元公益和解金，不能混算。"}</P>
<SubHead>{"居民盯的是「之後」，不是「和解那一天」"}</SubHead>

<P>{"2025 年《Texas Tribune》與《Inside Climate News》合作報導指出，Wilson 將和解資金引導地方復育與漁業計畫，與此同時，後續監測仍持續驗出塑膠。2026 年6 月，Wilson 帶著整理的資料赴台灣向台塑相關股東會陳情；她提交的資料稱，自2020 年相關要求生效起，962 次廢水檢測均檢出塑膠，衍生約4,100 萬美元的協議違約付款。"}</P>

<P>{"德州的監管爭議也不只有塑膠顆粒。2021 年，美國司法部宣布與台塑達成另一項和解，處理 PointComfort 廠區涉及《清潔空氣法》化學事故預防規定的爭點，民事罰款約285 萬美元，且要求改善風險管理。這與2019 年水污染和解是兩個不同法律案件，不能把金額或違規次數任意相加。對這些居民而言，勝訴並非句點。只要測試仍有異常，真正重要的就是污染是否停止、改善措施是否有效，以及在地漁業與海灣能否恢復。這起官司特別值得注意的，是居民把反覆撿到的顆粒轉成可以經受法院審視的證據：採樣地點、時間、數量與第三方方法，讓日常觀察不再只是「我覺得海變髒了」。"}</P>

<P>{"04  /  UNITED STATES  /  LOUISIANA"}</P>
</Chapter>
<Chapter id="section-4" title={"路易斯安那：已有違規紀錄的廠，與尚未興建的新廠，不能混為一談"}>

<P>{"台塑在美國的環境爭議，不是每個案件都長得一樣。2009 年，美國司法部宣布，台塑位於德州 Point Comfort 及路易斯安那州 Baton Rouge 的兩座既有石化廠，同意支付280 萬美元民事罰款，並投入超過1,000 萬美元改善空氣、水及有害廢棄物污染控制。美國環保署當時指出，調查發現多項設備洩漏監測與修復缺失，以及部分廢水排放違規。"}{"【數字釐清】美國司法部原始公告"}{"區分為「280 萬美元民事罰款」及「超過1,000 萬美元污染改善支出」；合計支出約達1,280 萬美元以上，不能全部標示為行政裁罰或刑事罰金。"}</P>
<Photo src={"/reports/formosa-plastics-overseas-pollution/image2.jpg"} alt={"圖 5｜Sharon Lavigne 參與2021 年10 月反對台塑擬建石化計畫的抗議。攝影：Jamie Henn／Twitter；刊載：Black Catholic Messenger。"} caption={"圖 5｜Sharon Lavigne 參與2021 年10 月反對台塑擬建石化計畫的抗議。攝影：Jamie Henn／Twitter；刊載：Black Catholic Messenger。"} width={518} height={390} />
<SubHead>{"另一場戰役，還發生在開工前"}</SubHead>

<P>{"路州 St. James Parish 的 Sunshine Project 是另一項規劃中的大型塑膠製造計畫，不能把其預估排放直接算成已發生污染。地方團體 RISE St. James 長年質疑，該案會在既有工業污染負擔沉重的地區再增加空氣污染與健康風險。2026 年2 月，RISE St. James 等團體起訴路州環境品質部門，挑戰該計畫空污預建許可第四度展延，要求重新依較新的標準審查。"}</P>

<P>{"依2018 年公布的規劃，Sunshine Project 擬由台塑關係企業FG LA LLC 投資約94 億美元，在約2,400英畝土地設置十座化工廠與附屬設施。倡議團體引用空污許可指出，若按原方案投產，許可允許每年超過800 噸有毒空氣污染物；這是「許可允許／模型估算的未來排放」，不是當地現已測得800 噸污染。該案所在地位於石化設施密集、被公眾稱作「癌症巷」的區域，當地黑人社群對累積暴露風險長期表示擔憂。"}</P>

<P>{"許可拉鋸有兩條程序，不能混為一次勝負：美國陸軍工兵團2020 年暫停濕地相關許可，2021 年要求進行完整環境影響評估；路州空氣許可則在2022 年遭下級法院撤銷，2024 年上訴法院推翻原判、恢復許可。即使空氣許可恢復，也不代表聯邦濕地"}{"許"}{"可與開發程序全部完成。2026 年2 月5 日，RISE St.James 等團體再次挑戰空污預建許可第四度展延，要求依更新的細懸浮微粒標準審查。"}</P>

<P>{"但當地也存在支持投資的政治聲音。2025 年《Louisiana Illuminator》報導，St. James Parish 議會通過重申支持 Formosa 計畫的決議；環境正義組織則批評，地方居民對健康風險的疑慮被排除在決策之外。這說明工業投資所帶來的就業與稅收期待，可能與居民要求的健康保障形成真實而複雜的政策衝突。RISE St. James 的Sharon Lavigne 在2026 年聲明中稱，社區不應成為「犧牲區」；企業與支持建廠的地方政治代表則強調新增就業、投資及稅收機會。2024 年上訴法院亦支持州環保部門原核發許可的決定。環境正義團體的健康風險主張和行政、司法對許可的判斷，應在報導中分別標示，避免把任何一方立場寫"}{"成"}{"已確定的醫學因果結論。Earthjustice 指出，團體此次挑戰的是環境機關延展預建空污許可的決定，並非聲稱新廠已違法排"}{"放"}{"；對方要求企業若要繼續推進計畫，應依更新後的空氣品質標準重新申請。此類爭議的焦點，是在風險尚未成真前，社區能否提出充分參與與審查要求。"}</P>

<P>{"「St. James 不是可以被犧牲的地方。」"}</P>

<P>{"Sharon Lavigne，RISE St. James 代表；依 Earthjustice 2026/2/5 聲明譯述"}</P>

<P>{"05  /  ACCOUNTABILITY  /  WHAT CHANGES"}</P>
</Chapter>
<Chapter id="section-5" title={"跨海的回聲傳回台灣：地方居民要的，是可驗證的改善"}>

<P>{"2026 年5 月，德州居民代表 Diane Wilson、路州的 Sharon Lavigne，以及關注越南河靜事件的Nancy Bui，前往台灣向企業股東與主管機關傳達訴求。《Inside Climate News》記錄，三人強調來自不同海岸的污染經驗，卻有相似的困境：地方證據與居民聲音往往難以在集團治理層級獲得持續回應。"}</P>

<P>{"三個案例呈現不同的問責路徑：越南漁民對外求償、美國漁民的實物採證，以及St.James 居民對新廠許可提出訴訟。第一案已確認污染但民事賠償仍卡在程序；第二案透過公民訴訟促成和解與後續監測；第三案尚未投產，爭的是如何在污染發生前避免新增風險"}{"，"}{"只有把案件階段拆開，才能合理比較企業在全球不同據點的行為。"}</P>
<SubHead>{"企業並非沒有回應，但回應仍需要與成效分開核對"}</SubHead>

<P>{"在越南事件中，河靜鋼鐵已公開致歉、承認責任並付款；越南官方後來公布海域監測與環境復原成果。台塑美國公司也在2025 年媒體詢問時表示，已安裝塑膠顆粒污染控制設備、改善排水系統並持續研究過濾技術。在2026 年台灣股東會，企業高層則表示，面對嚴格的排放要求，已投入大量資源持續改善。這些答覆是重要的企業立場，但不能取代公開監測數據、在地受害者經驗與主管機關的合規認定。"}</P>
<Photo src={"/reports/formosa-plastics-overseas-pollution/image6.jpg"} alt={"跨海的煙囪・圖 6"} caption={""} width={518} height={390} />

<P>{"圖 6｜德州 Cox Creek，David Sumpter 與 Ronnie Hamrick 以網具採集台塑排水口附近的塑膠顆粒。來源頁記為2018 年；San Antonio Bay Estuarine Waterkeeper"}{" "}</P>
<SubHead>{"一份真正有用的海外永續資訊，至少要回答四個問題"}</SubHead>

<P>{"【Formosa Oversee 的資料整理原則】每則事件應標註「國家及廠區 → 法律實體與持股關係 → 來源類"}{"型 → 違規／訴訟／許可階段 → 金額及性質 → 在地社群回應 → 企業回應 → 後續改善證據」。例如越南"}{"5 億美元屬企業支付政府的補償；德州5,000 萬美元為法院核准的公益和解；路州800 噸為建廠許可允許"}{"的年排放量。三者不能被相加，也不能都標成「已遭裁罰」。"}</P>

<P>{"此外，跨海倡議者曾赴台灣股東會陳情，把廠區問題直接帶給母國股東與企業治理部門。然而「台塑集"}{"團」是集團統稱，不是單一在各國皆同一的訴訟當事人。公開資訊系統若不對應廠區與法人，便可能把"}{"某一子公司、合資事業的責任，錯誤地直接寫成所有關係企業都被法院認定違法。"}</P>

<P>{"第一，案件究竟屬於官方認定違規、民事和解、媒體揭露，還是尚待審查的建廠風險？第二，當地廠"}{"區、法律實體與台灣關係企業之間，持股與管理鏈條是否可追溯？第三，污染事件發生後，補救措施有"}{"沒有獨立證據持續驗證？第四，受影響居民是否有機會提出異議，而且能得到回覆？"}</P>

<P>{"資料也有其限度。法規裁罰能證明某一期間的法定違規或和解事實，卻未必衡量健康的全部長期影"}{"響；居民訪談揭露切身經驗，也不應被誤當成未經驗證的醫學因果判定。透明化的價值，正是在於保留"}{"這些來源差異，而不是把任何爭議都濃縮成一個不透明分數。"}</P>

<P>{"這也正是跨國企業永續揭露最常缺少的一段：不只公布減排目標與慈善捐款，更要讓一筆裁罰、一場"}{"訴訟、一份在地採樣，能夠順著企業治理關係回到董事會與資本市場。在越南海岸與美國海灣，人們提"}{"出的問題從未只是「企業有沒有道歉」，而是「環境與生活，到底改變了多少」。"}</P>

<P>{"SOURCES  /  查核說明與資料來源"}</P>
</Chapter>
<Chapter id="section-6" title={"證據不是裝飾：本篇報導如何查核"}>

<P>{"採證方法｜越南部分以越南政府公告、台灣司法裁判與 NGO／媒體採訪交叉比對；德州部分以聯邦和解"}{"文件、法律扶助組織公告及後續調查報導為主；路州分清已營運廠歷史處分與未建新廠的許可挑戰。所"}{"有人物話語均為原始報導引用或譯述，並非本次獨家訪談。"}</P>

<P>{"更新時點｜資料查核至 2026 年 10 月 15 日。個別訴訟、許可、補償與監測狀態可能變更；本文以所引"}{"來源公開時點為準。"}</P>
<div id="ref-1">
<P>{"[1] 越南政府  2016-07-04｜四省海洋污染調查結果與企業責任認定   "}<ChakraLink href={"https://en.baochinhphu.vn/press-release-on-serious-environmental-incident-in-central-coast-11126326.htm"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-2">
<P>{"[2] 越南政府  2016-09-30｜補償對象範圍與死魚清理數量   "}<ChakraLink href={"https://en.baochinhphu.vn/decision-on-mass-fish-death-compensation-announced-11127115.htm"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-3">
<P>{"[3] 越南政府  2016-08-30｜確認收到5 億美元補償款   "}<ChakraLink href={"https://baochinhphu.vn/formosa-da-chuyen-du-500-trieu-usd-boi-thuong-cho-viet-nam-102208352.htm"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-4">
<P>{"[4] Human Rights Watch  2024-05-14｜環境災害後的抗爭、補償與受害者人權   "}<ChakraLink href={"https://www.hrw.org/news/2024/05/14/victims-vietnams-formosa-toxic-spill-deserve-justice"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-5">
<P>{"[5] 公視新聞網  2019-06-11｜漁民受訪陳述及7875 人赴台提告   "}<ChakraLink href={"https://news.pts.org.tw/article/434266"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-6">
<P>{"[6] 最高法院  2020-11-11｜109 年度台抗字第1084 號：跨國民事裁定   "}<ChakraLink href={"https://tps.judicial.gov.tw/tw/dl-12354-4e60d38e56e14ed4b9aee298880612cd.html"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-7">
<P>{"[7] 憲法法庭  2025-07-14｜114 年審裁字第743 號：憲法審查不受理   "}<ChakraLink href={"https://cons.judicial.gov.tw/docdata.aspx?fid=5511&id=356202"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-8">
<P>{"[8] Texas Tribune，Kiah Collier，2019-12-03｜聯邦法院核准台塑水污染案5,000萬美元和解   "}<ChakraLink href={"https://www.texastribune.org/2019/12/03/texas-judge-approves-settlement-agreement-water-pollution-formosa/"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-9">
<P>{"[9] Texas Tribune / Inside Climate News  2025-01-03｜Diane Wilson 與 Matagorda Bay 資金使用與監測   "}<ChakraLink href={"https://www.texastribune.org/2025/01/03/texas-pollution-settlement-formosa-plastics-diane-wilson-matagorda-bay/"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-10">
<P>{"[10] Inside Climate News  2026-06-10｜三位環境倡議者赴台；962 次測試與企業回應   "}<ChakraLink href={"https://insideclimatenews.org/news/10062026/diane-wilson-formosa-plastics-taipei-shareholder-meeting/"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-11">
<P>{"[11] 美國司法部  2009-09-29｜德州／路州既有廠和解，空污、水污及廢棄物   "}<ChakraLink href={"https://www.justice.gov/archives/opa/pr/formosa-plastics-corp-texas-and-formosa-plastics-corp-louisiana-will-spend-more-10-million"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-12">
<P>{"[12] Earthjustice  2026-02-05｜St. James 許可展延訴訟與環保團體主張   "}<ChakraLink href={"https://earthjustice.org/press/2026/groups-sue-over-formosa-plastics-permit-extensions"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-13">
<P>{"[13] Louisiana Illuminator / Verite  2025-05-06｜地方議會支持投資與居民的反對聲音   "}<ChakraLink href={"https://lailluminator.com/2025/05/06/st-james-environment/"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-14">
<P>{"[14] 越南政府，2017-07-14｜Bộ TN&MT công bố kết quả quan trắc môi trường biển 4 tỉnh miền Trung   "}<ChakraLink href={"https://baochinhphu.vn/bo-tnmt-cong-bo-ket-qua-quan-trac-moi-truong-bien-4-tinh-mien-trung-102223996.htm"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-15">
<P>{"[15] Radio Free Asia  2024-10-15｜補償分類爭議與在地修船業者受訪   "}<ChakraLink href={"https://www.rfa.org/english/news/vietnam/formosa-compensation-environment-spill-10152024124255.html/"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-16">
<P>{"[16] Mongabay  2026-04-06｜越南事故十週年與受害者救濟追蹤   "}<ChakraLink href={"https://news.mongabay.com/2026/04/10-years-after-vietnams-formosa-steel-plant-spill-justice-for-victims-remains-elusive/"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-17">
<P>{"[17] 美國司法部  2021-09-13｜德州化學事故風險管理規定和解   "}<ChakraLink href={"https://www.justice.gov/usao-sdtx/pr/texas-plastics-corporation-will-pay-nearly-3m-violating-clean-air-act"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-18">
<P>{"[18] VnExpress／Taipei Times  2016-10｜越南506 件漁民求償遭退件   "}<ChakraLink href={"https://e.vnexpress.net/news/news/provincial-court-rejects-lawsuits-filed-against-taiwanese-fish-killer-formosa-3480825.html"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-19">
<P>{"[19] San Antonio Bay Waterkeeper｜德州2,428 份樣本與公民訴訟監測   "}<ChakraLink href={"https://sanantoniobaywaterkeeper.org/clean-water-act-suits/"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-20">
<P>{"[20] Earthjustice  2024-01-19｜路州上訴法院恢復空氣許可、逾800 噸預估排放   "}<ChakraLink href={"https://earthjustice.org/press/2024/louisiana-court-ruling-reverses-lower-court-decision-and-upholds-air-permits-for-formosa-plastics-massive-petrochemical-complex-in-cancer-alley"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>
<div id="ref-21">
<P>{"[21] Center for Biological Diversity  2021-08-18｜陸軍工兵團要求完整環評   "}<ChakraLink href={"https://biologicaldiversity.org/w/news/press-releases/army-corps-orders-full-environmental-review-of-formosa-plastics-controversial-louisiana-plant-2021-08-18/"} isExternal color="green.700" textDecoration="underline">來源連結 ↗</ChakraLink></P>
</div>

<P>{"重要區分｜「台塑集團」並非單一訴訟法人；各案件的當事人、股權與法律責任須依官方文件確認。報"}{"導不能以集團名稱取代法律實體，也不能把和解視為對所有爭點的犯罪承認。"}</P>

<P>{"圖文整合｜本文使用6 張照片；攝影與刊載來源見各圖圖說。"}</P>
</Chapter>
</>; }
