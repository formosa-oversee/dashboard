import { getCompanyData } from './gcs-api-server';

/**
 * 專題文末「延伸閱讀」要的公司與污染事件（只在 getStaticProps 用，會讀 data/epa-data.json）
 * 只回傳連結需要的欄位，避免把整家公司的違規資料塞進頁面 props。
 */
export const getReportRelations = (report) => {
  const companies = report.companies
    .map(c => ({ ...getCompanyData(c.code), shortName: c.name }))
    .filter(c => c.id);

  const events = report.relatedEventIds.map(eventId => {
    const owner = companies.find(c => (c.news || []).some(e => e.id === eventId));
    if (!owner) return null;
    const event = owner.news.find(e => e.id === eventId);
    return { id: event.id, title: event.title, companyId: owner.id };
  }).filter(Boolean);

  return {
    companies: companies.map(c => ({ id: c.id, code: c.companyCode, name: c.shortName })),
    events,
  };
};
