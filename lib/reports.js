/**
 * 專題報導清單 —— 專題列表頁、單篇頁（pages/reports/[slug].js）、公司頁、首頁共用
 *
 * 新增一篇專題：
 * 1. 在下面 REPORTS 加一筆。日期用 'YYYY-MM'；列表與首頁依 publishedAt 由新到舊排。
 * 2. 內文寫在 content/reports/<slug>.js：default export 是內文元件，另外 export TOC（目次）、
 *    KEY_NUMBERS（封面下方的數字列，可省略）、REVISIONS（修訂紀錄）。
 *    定稿 docx 先跑 `python3 scripts/report-docx.py jsx <docx>` 產生逐字草稿，build 後用
 *    `python3 scripts/report-docx.py verify <docx> out/reports/<slug>.html` 核對沒有漏字。
 * 3. 在 content/reports/index.js 的 ARTICLES 註冊。漏了的話 next build 會直接報錯。
 *
 * credit 是文末署名（有的話取代「執行單位」那行）。
 * companies 決定哪些公司頁掛專題卡（name 是頁面上顯示的簡稱）；relatedEventIds 對應 data/news-events.json 的事件 id，
 * 公司頁的事件卡會連回專題。報告這一側宣告關聯，污染事件的資料格式與 build-news.py 不用改。
 */
export const REPORTS = [
  {
    slug: 'kumamoto-jasm',
    kicker: '田野調查',
    title: '台積電進駐熊本田野調查',
    headline: '五十年後，這裡的水還能不能喝？',
    // 取自報告 2.1 節「本調查的核心問題」
    deck: '在合法營運之外，企業對在地社會產生了哪些實質外部性？誰享受了利益，誰承受了成本？',
    org: '探索⁺SDGs 計畫團隊（Formosa Oversee 企業國際永續資訊揭露平台）',
    fieldworkAt: '2025-04',
    publishedAt: '2026-06',
    revisedAt: '2026-10',
    note: '本報告基於實地訪談與公開資料撰寫；居民受訪者之引述均經匿名化處理。',
    readingMinutes: 25,
    companies: [{ code: '2330', name: '台積電' }],
    relatedEventIds: ['tsmc-jasm-kumamoto-pfas'],
  },
  {
    slug: 'kumamoto-notes-1',
    kicker: '田野筆記 1/3',
    title: '熊本田野筆記・篇一',
    headline: '台積電設廠後的熊本生活：一位旅熊台灣人的觀察',
    // 定稿標題下的粗體導言
    deck: '台積電進駐三年，熊本的台灣人多了七倍，薪水漲了，超市也買得到台灣醬料；但塞車、房價和缺工，同樣落進了日常。一位在熊本生活十多年的台灣人，看著這座城市從「之前」走到「之後」。她給台積電的評語是「喜憂參半」，而我們聽到的是：好處和代價，落在不同人身上。',
    org: 'Formosa Oversee（教育部青年發展署 Young飛全球行動計畫團隊）',
    // 定稿文末署名，逐字照登
    credit: 'Formosa Oversee｜台資企業海外永續資訊揭露平台。教育部青年發展署 Young飛全球行動計畫團隊。本文依 2025 年 4 月熊本實地訪談撰寫，一般受訪者引述經同意匿名。',
    fieldworkAt: '2025-04',
    publishedAt: '2026-10',
    readingMinutes: 7,
    companies: [{ code: '2330', name: '台積電' }],
    relatedEventIds: [],
  },
];

// 'YYYY-MM' → '2026 年 6 月'
export const formatMonth = (yyyymm) => {
  const [year, month] = yyyymm.split('-');
  return `${year} 年 ${Number(month)} 月`;
};

// 「2026 年 6 月（2026 年 10 月修訂）」
export const publishedLabel = (report) =>
  formatMonth(report.publishedAt) + (report.revisedAt ? `（${formatMonth(report.revisedAt)}修訂）` : '');

export const reportPath = (report) => `/reports/${report.slug}`;

export const getReport = (slug) => REPORTS.find(r => r.slug === slug);

// 同一家公司的其他專題（單篇頁文末的延伸閱讀）
export const getSiblingReports = (report) => listReports().filter(r => r.slug !== report.slug
  && r.companies.some(c => report.companies.some(d => d.code === c.code)));

// 由新到舊；同月發布的維持 REPORTS 裡的順序
export const listReports = () =>
  REPORTS.map((r, i) => [r, i])
    .sort(([a, i], [b, j]) => b.publishedAt.localeCompare(a.publishedAt) || i - j)
    .map(([r]) => r);

export const latestReport = () => listReports()[0];

export const getReportsForCompany = (companyCode) =>
  listReports().filter(r => r.companies.some(c => c.code === String(companyCode)));

export const getReportsForEvent = (eventId) =>
  listReports().filter(r => r.relatedEventIds.includes(eventId));
