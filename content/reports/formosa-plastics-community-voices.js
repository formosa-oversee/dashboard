import { Link as ChakraLink } from '@chakra-ui/react';
import { Intro, Chapter, SubHead, P } from '../../components/report/Prose';
import { Photo, DataTable } from '../../components/report/Figures';

// Source: cloud manuscript, retrieved 2026-10-30. Images preserve original bytes and credits.
export const TOC = [{"id": "section-1", "num": "1", "label": "背景：台塑在越、美、台的爭議"}, {"id": "section-2", "num": "2", "label": "一、河靜的十字架：教會帶頭，漁民上街"}, {"id": "section-3", "num": "3", "label": "二、跨海求援：從河靜到台北的十年串連"}, {"id": "section-4", "num": "4", "label": "三、拉瓦卡灣的塑膠粒巡守隊：一場三十年的監督"}, {"id": "section-5", "num": "5", "label": "四、癌症巷的祈禱：一個黑人社區與祖先的墳"}, {"id": "section-6", "num": "6", "label": "五、台塑怎麼說"}, {"id": "section-7", "num": "7", "label": "六、圖解：誰在倡議、何時行動"}, {"id": "section-8", "num": "8", "label": "參考資料"}];
export const REVISIONS = [{"date": "2026-10-30", "text": "依雲端定稿製作網頁版，保留原文、圖說與來源。"}];
export default function Article() { return <>
<Chapter id="section-1" title={"背景：台塑在越、美、台的爭議"}>

<P>{"企業的污染紀錄通常以罰款金額、判決字號和排放數據寫成。這篇專題換一個角度：讓越南的神父與漁民、德州的蝦農、路易斯安那的黑人社區，以及在台灣奔走的律師與研究員自己說話。"}</P>

<P>{"他們的處境差異很大。在越南，舉著布條走上街就可能入獄；在美國，居民能把塑膠粒搬進聯邦法院；在台灣，民間團體則一年一年拿著委託書走進台塑股東會。但他們的訴求驚人地一致：停止污染、公開真相、給受害者一個說話的位置。"}</P>

<P>{"以下引述均來自新聞報導、NGO 新聞稿與受訪內容，外文引述為本文翻譯，出處列於文末。"}</P>
</Chapter>
<Chapter id="section-2" title={"一、河靜的十字架：教會帶頭，漁民上街"}>

<P>{"2016 年台塑河靜鋼鐵廠廢水造成中部四省魚群暴斃後，越南最有組織的抗議力量不是政黨或工會，而是天主教榮市教區（Vinh Diocese）。在這個由共產黨嚴密管控宗教團體的國家，教堂成了漁民集結、申訴與打官司的據點。"}</P>
<Photo src={"/reports/formosa-plastics-community-voices/image5.jpg"} alt={"台塑河靜鋼鐵廠廠區，2016 年 7 月攝。攝影：Linhcandng，Wikimedia Commons，CC BY-SA 3.0。"} caption={"台塑河靜鋼鐵廠廠區，2016 年 7 月攝。攝影：Linhcandng，Wikimedia Commons，CC BY-SA 3.0。"} width={785} height={1400} />
<P><ChakraLink href="https://commons.wikimedia.org/wiki/File:Formosa_H%C3%A0_T%C4%A9nh_6.jpeg" isExternal color="green.700" textDecoration="underline">原圖來源：Wikimedia Commons</ChakraLink></P>
<Photo src={"/reports/formosa-plastics-community-voices/image7.jpg"} alt={"2016 年 4 月 21 日，越南承天順化省富祿縣，一名村民展示他在海灘上撿拾的死魚。圖片來源：法新社。"} caption={"2016 年 4 月 21 日，越南承天順化省富祿縣，一名村民展示他在海灘上撿拾的死魚。圖片來源：法新社。"} width={1200} height={800} />
<SubHead>{"「越南不需要台塑」"}</SubHead>

<P>{"2016 年 8 月，約 4,000 名教友試圖遊行到奇英縣政府陳情，遭 200 多名警察攔阻並毆打。9 月初，Quy Hoa 與 Phu Yen 兩個堂區的數千名教友再度走上街頭。一名參與者告訴自由亞洲電台，他們舉著許多布條要台塑離開，因為「越南不需要台塑」。"}</P>

<P>{"教區的正義與和平委員會也在 7 月向政府請願，要求緊急救助漁民，指出許多漁民「因失去收入、沒有工作而負債累累」。"}</P>
<SubHead>{"圍廠、訴訟與黑旗"}</SubHead>

<P>{"2016 年 10 月 2 日，河靜數千名居民直接到鋼鐵廠外抗議，要求台塑公開資訊、公平賠償，並停止把廢水排入當地的 Quyen 河。一名抗議者說，她會持續抗爭，「直到我們得到合理賠償、台塑離開越南」。"}</P>

<P>{"到了 12 月，人們仍在街頭。神父 Mai Xuan Ai 對 RFA 說：「人們很憤怒，因為政府沒有把賠償發給人民。」當天的布條寫著破壞環境是犯罪，要台塑妥善賠償並離開越南。"}</P>

<P>{"2017 年 4 月 6 日災難一週年，教友們帶著畫有魚骨的黑旗走上街頭與海灘。Dong Son 堂區神父 Bui Khiem Cuong 說，他們要求政府「把台塑趕出這個國家」。"}</P>
<SubHead>{"主教：我們不能坐視"}</SubHead>

<P>{"榮市教區主教阮泰和（Paul Nguyen Thai Hop）親自帶團到台灣，替漁民向台塑總部陳情。他說明教會為何出面時表示，身為教區領袖，「我們不能坐視人民受苦」。他也質疑，5 億美元只夠支應 2016 年，之後的生計誰來負責？"}</P>
<SubHead>{"代價：抹黑、暴力與重刑"}</SubHead>

<P>{"抗爭很快遭到反撲。帶領漁民提告的神父鄧友南（Dang Huu Nam）被官媒指控「製造社會不安」；教友向 RFA 透露，官方組織的反制集會參加者多是退伍軍人協會成員，有人說現場「根本沒有一個天主教徒」。親政府的「紅旗會」也多次包圍教堂、辱罵神父，將他們標籤為「反動敵人」。"}</P>

<P>{"以直播記錄警察暴力的部落客黃德平（Hoang Duc Binh），2018 年 2 月被判刑 14 年；部落客「蘑菇媽媽」阮玉如瓊在 2017 年被判 10 年。聯合國有毒物質與人權特別報告員 Baskut Tuncak 批評，因提高環境與公衛意識而關押部落客和社運人士「是不可接受的」。美國國務院也表示對判決「深感不安」。國際特赦組織則把黃德平列為良心犯，要求立即無條件釋放。"}</P>
</Chapter>
<Chapter id="section-3" title={"二、跨海求援：從河靜到台北的十年串連"}>

<P>{"當越南境內的聲音被一一壓制，受害者把戰場搬到台塑的家門口。串連的主力有三股：越南天主教會與海外越僑團體「台塑受害者正義會」（Justice for Formosa Victims），在台的越南神父，以及台灣的環境與人權團體，後者並組成「監督台塑越鋼聯盟」。"}</P>
<SubHead>{"2019：在股東會門口遞狀"}</SubHead>

<P>{"2019 年 6 月 11 日，台塑股東會當天，7,875 名越南居民在台北地院提出跨國訴訟。環境權保障基金會等團體在聲明中說，越南人民在國內求助無門，「台塑不能隱藏在越南政府身後」。律師團召集人、環境法律人協會理事長張譽尹曾參與 RCA 污染訴訟，他說看到台灣企業到越南重演先進國家的污染輸出，身為台灣人「深感羞恥」。"}</P>
<SubHead>{"2020：「台灣能幫忙，台灣法院也能」"}</SubHead>

<P>{"訴訟兩度以「無管轄權」被駁回後，原告與聲援團體走到最高法院前，喊出「Taiwan can help, so can Taiwan court!」，借用當時台灣防疫外交的口號，要求法院勇於受理本國企業的跨國侵權。神父阮文雄指出，受害者沒有參與 5 億美元的協商，在越南上訴時連通往法院的道路都被警察封鎖。"}</P>
<SubHead>{"2022：委任狀認證，「第一關就卡住」"}</SubHead>

<P>{"最高法院要求數千名原告親赴台灣駐越南代表處認證委任狀後，聯盟召開記者會。環境權保障基金會研究員孫興瑄說明，認證前得先到越南外交部確認身分，等於讓原告曝光，「第一關就已經卡住」。律師郭鴻儀也批評，司法機關「不能假裝不知道」受害者為求正義遭騷擾、入獄的處境。2024 年 5 月，人權觀察也公開呼籲台灣法院考慮其他認證方式，並說法院「不應對越南政府的鎮壓視而不見」。"}</P>
<SubHead>{"2023：三地受害者第一次同台"}</SubHead>

<P>{"2023 年 5 月 30 日，德州的威爾森、路易斯安那的拉維恩與代表越南受害者的裴南茜（Nancy Bui）一起拿著委託書走進台塑股東會，這是海外三地代表首次同時來台。裴南茜談到法院的認證要求時說，對受害者而言「等同於是對他們判死刑」，因為發聲就可能被捕。她也描述漁民被迫抵押房子、出國打工，孩子留給祖父母照顧的處境。"}</P>

<P>{"同一天的場外抗議中，在台服務越南移工的阮文雄神父形容越南的言論處境：只要提到台塑或河靜鋼鐵，「就會被公安、越南的警察追殺、抓，然後判」。孫興瑄則在會場上提醒董事長，台塑集團合計持有越鋼約 75% 股份，台塑不是局外人。"}</P>
<Photo src={"/reports/formosa-plastics-community-voices/image6.png"} alt={"2023 年 5 月 30 日，台塑海外污染案關係人在股東會前召開記者會。攝影：黃世澤／《報導者》。"} caption={"2023 年 5 月 30 日，台塑海外污染案關係人在股東會前召開記者會。攝影：黃世澤／《報導者》。"} width={1190} height={770} />
<SubHead>{"2026：十週年，走到總統府前"}</SubHead>

<P>{"2026 年 5 月 27 日，河靜事件屆滿十年，威爾森、拉維恩與裴南茜再度來台，這次在凱達格蘭大道召開記者會，並向總統府遞交民間版《企業永續盡職調查法》草案。裴南茜表示，十年後仍有數千名受害者沒有得到公正補償，要求台塑停止推卸責任。威爾森則呼籲，台美貿易協定不應成為污染者與人權侵犯者的避風港。環境正義基金會、綠色公民行動聯盟與國際特赦組織台灣分會也到場，要求金融機構重新檢視對台塑的永續連結貸款，並要求立法院盡速制定強制性的人權環境盡職調查法。"}</P>
</Chapter>
<Chapter id="section-4" title={"三、拉瓦卡灣的塑膠粒巡守隊：一場三十年的監督"}>

<P>{"在德州卡爾霍恩郡，對抗台塑的人不是大型環團，而是一名蝦船船長和幾個前台塑員工。黛安・威爾森（Diane Wilson）從 1989 年開始追查台塑 Point Comfort 廠，創立卡爾霍恩郡資源觀察，後來擔任 San Antonio Bay Estuarine Waterkeeper 執行長。她的抗爭手段包括絕食、被捕與訴訟。"}</P>
<Photo src={"/reports/formosa-plastics-community-voices/image4.jpg"} alt={"拉瓦卡灣沿岸的 Port Lavaca 漁港，台塑 Point Comfort 廠位於同一海灣對岸，2017 年攝。攝影：Adavyd，Wikimedia Commons，CC BY-SA 4.0。"} caption={"拉瓦卡灣沿岸的 Port Lavaca 漁港，台塑 Point Comfort 廠位於同一海灣對岸，2017 年攝。攝影：Adavyd，Wikimedia Commons，CC BY-SA 4.0。"} width={1000} height={666} />
<P><ChakraLink href="https://commons.wikimedia.org/wiki/File:Lavaca_Bay_coast_Port_Lavaca_Texas_DSC_1732_ad.jpg" isExternal color="green.700" textDecoration="underline">原圖來源：Wikimedia Commons</ChakraLink></P>
<SubHead>{"「海豚開始一隻隻死去」"}</SubHead>

<P>{"在 2023 年高曼環境獎的頒獎影片中，威爾森回憶起抗爭的起點：當年沒有人知道工廠在生產什麼、排放什麼，然後「所有的海豚都開始死去」。2008 年一名員工向她揭露塑膠粒長期外排，她才開始帶人下水蒐證。"}</P>
<Photo src={"/reports/formosa-plastics-community-voices/image3.jpg"} alt={"2023 年高曼環境獎得主威爾森划著獨木舟，背景為台塑廠區。圖片來源：高曼環境獎。"} caption={"2023 年高曼環境獎得主威爾森划著獨木舟，背景為台塑廠區。圖片來源：高曼環境獎。"} width={1200} height={800} />
<SubHead>{"公民蒐證打贏聯邦官司"}</SubHead>

<P>{"多年來，台塑主張水中的塑膠只是許可允許的「微量」。Waterkeeper 成員在注入拉瓦卡灣的 Cox Creek 一袋袋採樣，用數量推翻這個說法。2019 年，聯邦法官裁定台塑「持續且一再違反許可，至今仍未停止」。"}</P>

<P>{"和解達成後，威爾森強調這證明一般公民也能改變結果。她說，他們沒有專業、沒有錢、沒有支援，靠的是堅持與「一點血汗」。代表原告的 Texas RioGrande Legal Aid 律師 Amy Johnson 則指出，零排放是台塑自願同意的條件，應成為整個產業的標準。"}</P>
<SubHead>{"和解之後，巡守沒有停"}</SubHead>

<P>{"和解並未讓巡守隊解散。威爾森在 2023 年說，台塑的零排放承諾遭到反覆違反，她和律師已因此另外收取約 1,000 萬美元罰款，而這件事「仍在持續」。"}</P>

<P>{"據《報導者》整理，2020 年 6 月至 2023 年 4 月間，台塑違反和解協議達 434 次，應付罰款約 1,026.5 萬美元，全數撥入馬塔哥達灣減害信託基金。威爾森告訴記者，巡守隊每週監測三次，每次都還能找到塑膠粒或粉末。和解金中約 2,000 萬美元用來成立由在地漁民擁有的永續漁業合作社，讓曾經沒落的漁村重新買得起加工廠、冰庫與貨車。她也坦言，最終目的不是一直罰錢，而是真正做到零排放。"}</P>

<P>{"威爾森的行動也延伸到其他社區。2026 年 5 月她再度到台北，要求台灣在簽訂貿易協定時，把重大污染者排除在投資優惠之外。"}</P>
</Chapter>
<Chapter id="section-5" title={"四、癌症巷的祈禱：一個黑人社區與祖先的墳"}>

<P>{"2018 年州長宣布台塑將在 St. James Parish 興建陽光計畫時，莎倫・拉維恩（Sharon Lavigne）還是一名特教老師。她在 2018 年成立以信仰為基礎的社區聯盟 RISE St. James，後來辭去教職、全職投入抗爭。"}</P>
<SubHead>{"「他們正在殺死我們」"}</SubHead>

<P>{"St. James 位於石化工廠密集、被居民稱為「癌症巷」的河段。RISE 副會長 Stephanie Cooper 說，附近已有二十多座工廠，她曾因某座工廠的露天容器反覆罹患鏈球菌咽喉炎，改道通勤避開那座大橋後才好轉。2021 年聯合國專家發表聲明時，拉維恩只說了一句話：「他們在癌症巷這裡殺死我們。」"}</P>
<SubHead>{"被挖出來的奴隸墓地"}</SubHead>

<P>{"2019 年底，反對者透過資訊公開請求發現，台塑的考古顧問早已在預定地的前 Buena Vista 莊園找到疑似奴隸墓地。2020 年 3 月，RISE 向郡議會提交獨立考古報告，指出廠區內可能有多達七處埋葬奴隸的墓地。拉維恩說：「我們的祖先正從墳墓裡向我們呼喊」，並批評台塑知情卻沒有告知居民。"}</P>

<P>{"台塑以安全為由限制進入墓地。RISE 由憲法權利中心代理聲請禁制令，2020 年 6 月法官准許他們在 Juneteenth（奴隸解放紀念日）入內祈禱一小時。台塑律師主張 RISE 成員與墓中死者沒有關聯；法官 St. Pierre 則在庭上說：「人們正在受傷，這會是療癒的好時機。」那天，拉維恩在祖先墳前對著麥克風說，台塑「不會來這裡挖掉我們的祖先」。"}</P>
<SubHead>{"國際聲援：「環境種族主義」"}</SubHead>

<P>{"2021 年 3 月，聯合國人權理事會任命的多位特別報告員發表聲明，認為癌症巷持續設置石化廠是一種「環境種族主義」，並指出光是台塑園區就會讓 St. James 的癌症風險增加超過一倍，至少四處祖先墓地可能遭破壞。他們也提醒，企業有責任進行環境與人權影響評估。國際環境法中心（CIEL）的 Jane Patton 說，這份聲明證實了在地居民「幾十年來早已知道」的事。"}</P>
<SubHead>{"勝敗之間的韌性"}</SubHead>

<P>{"2020 年工兵團暫停濕地許可時，Healthy Gulf 的 Scott Eustis 說，不該再把濕地許可發給一家污染紀錄「如此糟糕」的公司。拉維恩更直接：「他們自稱陽光計畫，他們不會見到陽光。」"}</P>

<P>{"2024 年 1 月上訴法院恢復空氣許可，Louisiana Bucket Brigade 主任 Anne Rolfes 回應：「我們有力量，我們會用它。」2026 年 2 月，州環保局第四度展延許可，拉維恩在新一輪訴訟中問道：「還要有多少鄰居死去？」"}</P>

<P>{"2025 年 4 月，St. James 郡議會通過決議重申支持台塑，只有一名議員反對。另一個在地團體 Inclusive Louisiana 的共同創辦人 Barbara Washington 說，居民每次去開會都覺得議員早已決定站在產業那邊；她形容雙方的落差是：「他們看的是財富，我們看的是健康。」拉維恩則說，提案的正是她選區的議員，她感到被背叛，但 RISE 輸了也會繼續打下去。"}</P>

<P>{"2023 年拉維恩帶著女兒莎米拉第一次到台北參加台塑股東會。莎米拉說，她想更了解這家台灣公司，因為一切抗爭都從它開始。"}</P>
</Chapter>
<Chapter id="section-6" title={"五、台塑怎麼說"}>

<P>{"面對三地的指控，台塑的回應有一條清楚的主線：已依當地法規處理，許可都合法取得。"}</P>

<P>{"越南"}{"：2019 年民團在股東會外抗議時，河靜鋼鐵發出新聞稿，表示已支付 5 億美元給越南政府作為漁民補償，目前廢水排放均符合標準。2023 年股東會上，董事長林健男面對環團質問，回應越鋼已遵守越南政府規定，並會審慎處理。"}</P>

<P>{"德州"}{"：和解時，台塑美國主管 Ken Mounger 在新聞稿中表示，和解展現公司以安全、環保方式生產的承諾。但台塑後來也啟動爭議解決程序，主張不應為廠外發現的所有塑膠付罰款；《報導者》就罰款與越鋼評估等問題詢問台塑，未獲回應。"}</P>

<P>{"路易斯安那"}{"：聯合國專家發表聲明後，FG LA 發言人 Janile Parks 表示，園區將採用先進減排設備，並說台塑會大幅增加毒性排放的說法不正確。她也質疑「癌症巷」的稱呼，引用州腫瘤登記資料指當地癌症率並未高於全州。拉維恩反駁，社區從未有過全面的癌症篩檢，登記資料無法反映實況。2025 年 Parks 再表示，公司對延宕感到失望，但相信所有許可都合法核發，不會放棄這個計畫；Earthjustice 律師 Mike Brown 則認為台塑已無法符合新的細懸浮微粒與環氧乙烷標準，稱其說法具誤導性。"}</P>

<P>{"倡議者與企業的對話，於是常常停在同一個地方：企業說「合法」，居民問「誰來證明我們安全」。從河靜到 St. James，民間團體反覆提出的共同要求，正是由公正第三方進行環境與人權影響評估，並把結果公開。"}</P>
</Chapter>
<Chapter id="section-7" title={"六、圖解：誰在倡議、何時行動"}>
<Photo src={"/reports/formosa-plastics-community-voices/image1.png"} alt={"圖一｜三國倡議網絡 · 本專題依文中引用報導整理，非完整名單"} caption={"圖一｜三國倡議網絡 · 本專題依文中引用報導整理，非完整名單"} width={1344} height={670} />

<P>{"越南受害者靠台灣律師提告，美國社區靠自己的法院反擊，兩者最後都在台北的台塑股東會匯流。"}</P>
<Photo src={"/reports/formosa-plastics-community-voices/image2.png"} alt={"圖二｜抗爭與倡議行動時間軸 · 資料來源見文末；部分日期僅確知至月份"} caption={"圖二｜抗爭與倡議行動時間軸 · 資料來源見文末；部分日期僅確知至月份"} width={1344} height={816} />

<P>{"早期的行動集中在越南街頭；2018 年重刑判決後，抗爭轉向法院與台北，美國社區則持續在許可程序中拉鋸。"}</P>
</Chapter>
<Chapter id="section-8" title={"參考資料"}>

<P>{"外文引述均為本文翻譯，引文力求簡短，完整脈絡請見原文。"}</P>

<P>{"越南"}</P>

<P>{"Radio Free Asia，教友遊行抗議補償不足，2016-09-01："}<ChakraLink href={"https://www.rfa.org/english/news/vietnam/vietnamese-parishioners-march-to-protest-lack-of-compensation-from-fish-kill-09012016163207.html"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.rfa.org/english/news/vietnam/vietnamese-parishioners-march-to-protest-lack-of-compensation-from-fish-kill-09012016163207.html"}</ChakraLink></P>

<P>{"Radio Free Asia，數千人到河靜鋼鐵廠抗議，2016-10-03："}<ChakraLink href={"https://www.rfa.org/english/news/vietnam/formosa-spill-10032016163647.html"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.rfa.org/english/news/vietnam/formosa-spill-10032016163647.html"}</ChakraLink></P>

<P>{"Radio Free Asia，賠償爭議持續延燒，2016-12-07："}<ChakraLink href={"https://rfa.org/english/news/vietnam/formosa-spill-still-roils-12072016125227.html"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://rfa.org/english/news/vietnam/formosa-spill-still-roils-12072016125227.html"}</ChakraLink></P>

<P>{"Radio Free Asia，災難一週年示威，2017-04-06："}<ChakraLink href={"https://www.rfa.org/english/news/vietnam/vietnamese-catholics-demonstrate-to-mark-anniversary-of-formosa-chemical-spill-04062017141002.html"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.rfa.org/english/news/vietnam/vietnamese-catholics-demonstrate-to-mark-anniversary-of-formosa-chemical-spill-04062017141002.html"}</ChakraLink></P>

<P>{"Radio Free Asia，教會駁斥官方抹黑神父，2017-05-09："}<ChakraLink href={"https://www.rfa.org/english/news/vietnam/priests-05092017153359.html"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.rfa.org/english/news/vietnam/priests-05092017153359.html"}</ChakraLink></P>

<P>{"National Catholic Reporter，榮市教區的環境行動："}<ChakraLink href={"https://ncronline.org/blogs/eco-catholic/marian-devotees-vietnam-urged-take-responsibility-environment"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://ncronline.org/blogs/eco-catholic/marian-devotees-vietnam-urged-take-responsibility-environment"}</ChakraLink></P>

<P>{"AsiaNews，越南教會將抗議帶到台灣："}<ChakraLink href={"https://www.asianews.it/en/east-asia/taiwan/vietnamese-church-brings-formosa-victims-protests-to-taiwan"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.asianews.it/en/east-asia/taiwan/vietnamese-church-brings-formosa-victims-protests-to-taiwan"}</ChakraLink></P>

<P>{"AsiaNews，紅旗會攻擊乂安天主教社群："}<ChakraLink href={"https://www.asianews.it/news-en/Catholics-in-Ngh%EF%BF%BD%EF%BF%BD%EF%BF%BD-An-still-targeted-by-Red-Flag-militants-42204.html"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.asianews.it/news-en/Catholics-in-Ngh%EF%BF%BD%EF%BF%BD%EF%BF%BD-An-still-targeted-by-Red-Flag-militants-42204.html"}</ChakraLink></P>

<P>{"聯合國專家聲明（FreedEx 轉載），2018："}<ChakraLink href={"https://freedex.org/?p=1636"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://freedex.org/?p=1636"}</ChakraLink></P>

<P>{"VOA，美國國務院聲明，2018："}<ChakraLink href={"https://editorials.voa.gov/a/activists-sentenced-vietnam/4247343.html"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://editorials.voa.gov/a/activists-sentenced-vietnam/4247343.html"}</ChakraLink></P>

<P>{"UCA News，國際特赦組織要求釋放黃德平，2018："}<ChakraLink href={"https://www.ucanews.com/amp/rights-group-demands-release-of-vietnam-activist/81703"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.ucanews.com/amp/rights-group-demands-release-of-vietnam-activist/81703"}</ChakraLink></P>

<P>{"Human Rights Watch，〈台塑越鋼污染案受害者應得正義〉，2024-05-14："}<ChakraLink href={"https://www.hrw.org/zh-hans/news/2024/05/14/victims-vietnams-formosa-toxic-spill-deserve-justice"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.hrw.org/zh-hans/news/2024/05/14/victims-vietnams-formosa-toxic-spill-deserve-justice"}</ChakraLink></P>

<P>{"台灣"}</P>

<P>{"環境權保障基金會，在臺起訴記者會新聞稿，2019："}<ChakraLink href={"https://erf.org.tw/%E3%80%90%E6%96%B0%E8%81%9E%E7%A8%BF%E3%80%91%E5%8F%B0%E5%A1%91%E8%B6%8A%E5%8D%97%E9%8B%BC%E9%90%B5%E5%BB%A0%E6%B5%B7%E6%B4%8B%E6%B1%A1%E6%9F%93%E4%BA%8B%E4%BB%B6%E5%9C%A8%E8%87%BA%E8%B5%B7%E8%A8%B4/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://erf.org.tw/%E3%80%90%E6%96%B0%E8%81%9E%E7%A8%BF%E3%80%91%E5%8F%B0%E5%A1%91%E8%B6%8A%E5%8D%97%E9%8B%BC%E9%90%B5%E5%BB%A0%E6%B5%B7%E6%B4%8B%E6%B1%A1%E6%9F%93%E4%BA%8B%E4%BB%B6%E5%9C%A8%E8%87%BA%E8%B5%B7%E8%A8%B4/"}</ChakraLink></P>

<P>{"關鍵評論網／中央社，越南居民跨國求償，2019："}<ChakraLink href={"https://www.thenewslens.com/article/120668"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.thenewslens.com/article/120668"}</ChakraLink></P>

<P>{"苦勞網，越南受害者提告與台塑回應，2019："}<ChakraLink href={"https://www.coolloud.org.tw/node/93033"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.coolloud.org.tw/node/93033"}</ChakraLink></P>

<P>{"台灣人權促進會，〈Taiwan can help, so can Taiwan court!〉，2020："}<ChakraLink href={"https://www.tahr.org.tw/news/2644"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.tahr.org.tw/news/2644"}</ChakraLink></P>

<P>{"聯合報，〈台塑越鋼案程序卡關〉，2022："}<ChakraLink href={"https://udn.com/news/story/7266/6038919"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://udn.com/news/story/7266/6038919"}</ChakraLink></P>

<P>{"自由時報，民團、美議員促降低司法救濟障礙，2022："}<ChakraLink href={"https://news.ltn.com.tw/news/politics/breakingnews/4143302"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://news.ltn.com.tw/news/politics/breakingnews/4143302"}</ChakraLink></P>

<P>{"報導者，〈他們每天都還在排放汙染！〉，2023-06-01："}<ChakraLink href={"https://www.twreporter.org/a/formosa-plastics-corporation-pollution-overseas"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.twreporter.org/a/formosa-plastics-corporation-pollution-overseas"}</ChakraLink></P>

<P>{"公視新聞網，跨國團體抗議越鋼廠污染，2023-05-30："}<ChakraLink href={"https://news.pts.org.tw/article/639185"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://news.pts.org.tw/article/639185"}</ChakraLink></P>

<P>{"聯合報，〈拒絕高汙染、高人權風險投資〉，2026-05-27："}<ChakraLink href={"https://udn.com/news/story/7266/9528373"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://udn.com/news/story/7266/9528373"}</ChakraLink></P>

<P>{"美國德州"}</P>

<P>{"National Fisherman，Diane Wilson 獲高曼獎："}<ChakraLink href={"https://www.nationalfisherman.com/texas-shrimper-diane-wilson-wins-goldman-environmental-prize-for-grassroot-activism"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.nationalfisherman.com/texas-shrimper-diane-wilson-wins-goldman-environmental-prize-for-grassroot-activism"}</ChakraLink></P>

<P>{"Texas Standard／Texas Observer，聯邦法院判決："}<ChakraLink href={"https://www.texasstandard.org/?p=84827"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.texasstandard.org/?p=84827"}</ChakraLink></P>

<P>{"Texas Monthly，零排放和解："}<ChakraLink href={"https://www.texasmonthly.com/news/nurdles-formosas-agreement-stop-plastics-lavaca-bay-historic/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.texasmonthly.com/news/nurdles-formosas-agreement-stop-plastics-lavaca-bay-historic/"}</ChakraLink></P>

<P>{"DeSmog，Diane Wilson 與後續罰款，2023-04-24："}<ChakraLink href={"https://www.desmog.com/2023/04/24/texas-shrimper-activist-diane-wilson-led-fight-to-stop-plastic-pollution-goldman-prize/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.desmog.com/2023/04/24/texas-shrimper-activist-diane-wilson-led-fight-to-stop-plastic-pollution-goldman-prize/"}</ChakraLink></P>

<P>{"美國路易斯安那"}</P>

<P>{"Popular Science，癌症巷黑人社區與奴隸墓地："}<ChakraLink href={"https://www.popsci.com/story/science/louisiana-formosa-chemical-construction-slave-cemetery/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.popsci.com/story/science/louisiana-formosa-chemical-construction-slave-cemetery/"}</ChakraLink></P>

<P>{"Manufacturing.net／AP，請求法院暫停施工："}<ChakraLink href={"https://www.manufacturing.net/safety/news/21140165/court-asked-to-halt-work-at-plastics-plant"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.manufacturing.net/safety/news/21140165/court-asked-to-halt-work-at-plastics-plant"}</ChakraLink></P>

<P>{"HuffPost（生物多樣性中心彙整），2021："}<ChakraLink href={"https://www.biologicaldiversity.org/news/media-archive/a2021/EH_huffpost_3.2021.pdf"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.biologicaldiversity.org/news/media-archive/a2021/EH_huffpost_3.2021.pdf"}</ChakraLink></P>

<P>{"憲法權利中心（CCR），考古報告新聞稿，2020-03："}<ChakraLink href={"https://ccrjustice.org/node/8543"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://ccrjustice.org/node/8543"}</ChakraLink></P>

<P>{"Courthouse News，Juneteenth 禁制令，2020-06："}<ChakraLink href={"https://courthousenews.com/?p=581633"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://courthousenews.com/?p=581633"}</ChakraLink></P>

<P>{"WWL-TV，聯合國專家聲明全文，2021-03-02："}<ChakraLink href={"https://www.wwltv.com/article/tech/science/environment/un-environmental-racism-in-louisiana-cancer-alley-must-end/289-7bf5abad-9915-4328-a167-654fb4803291"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.wwltv.com/article/tech/science/environment/un-environmental-racism-in-louisiana-cancer-alley-must-end/289-7bf5abad-9915-4328-a167-654fb4803291"}</ChakraLink></P>

<P>{"DeSmog，聯合國聲明與台塑回應，2021-03-03："}<ChakraLink href={"https://www.desmog.com/2021/03/03/un-human-rights-formosa-petrochemical-cancer-alley/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.desmog.com/2021/03/03/un-human-rights-formosa-petrochemical-cancer-alley/"}</ChakraLink></P>

<P>{"生物多樣性中心，工兵團暫停許可，2020-11-04："}<ChakraLink href={"https://biologicaldiversity.org/w/news/press-releases/army-corps-suspends-permit-for-formosa-plastics-controversial-louisiana-plant-2020-11-04/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://biologicaldiversity.org/w/news/press-releases/army-corps-suspends-permit-for-formosa-plastics-controversial-louisiana-plant-2020-11-04/"}</ChakraLink></P>

<P>{"Global Sisters Report／EarthBeat，法院判決延宕工程："}<ChakraLink href={"https://www.globalsistersreport.org/news/earthbeat/court-rulings-stall-controversial-plastics-factory-louisiana"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://www.globalsistersreport.org/news/earthbeat/court-rulings-stall-controversial-plastics-factory-louisiana"}</ChakraLink></P>

<P>{"Earthjustice，上訴法院恢復許可，2024-01-19："}<ChakraLink href={"https://earthjustice.org/press/2024/louisiana-court-ruling-reverses-lower-court-decision-and-upholds-air-permits-for-formosa-plastics-massive-petrochemical-complex-in-cancer-alley"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://earthjustice.org/press/2024/louisiana-court-ruling-reverses-lower-court-decision-and-upholds-air-permits-for-formosa-plastics-massive-petrochemical-complex-in-cancer-alley"}</ChakraLink></P>

<P>{"Earthjustice，控告第四度許可展延，2026-02-05："}<ChakraLink href={"https://earthjustice.org/press/2026/groups-sue-over-formosa-plastics-permit-extensions"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://earthjustice.org/press/2026/groups-sue-over-formosa-plastics-permit-extensions"}</ChakraLink></P>

<P>{"Louisiana Illuminator／Verite News，郡議會支持台塑決議，2025-05-06："}<ChakraLink href={"https://lailluminator.com/2025/05/06/st-james-environment/"} isExternal color="green.700" textDecoration="underline" overflowWrap="anywhere">{"https://lailluminator.com/2025/05/06/st-james-environment/"}</ChakraLink></P>
</Chapter>
</>; }
