import fs from 'fs';
import path from 'path';
import { getCoordinateAccuracy } from './coordinate-precision';

/**
 * GCS Data API - Server Side Only (for getStaticProps)
 * 只能在 Next.js 的 getStaticProps/getStaticPaths 中使用
 */

let cachedData = null;

/**
 * 載入 GCS 處理後的 EPA 資料
 */
const loadGCSData = () => {
  if (cachedData) {
    return cachedData;
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'epa-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    cachedData = JSON.parse(rawData);
    return cachedData;
  } catch (error) {
    console.error('Error loading GCS data:', error.message);
    return [];
  }
};

/**
 * 獲取所有公司列表
 */
export const getAllCompanies = () => {
  const data = loadGCSData();
  return data.map(company => ({
    id: company.id,
    name: company.name,
    englishName: company.englishName,
    companyCode: company.companyCode,
    industry: company.industry || 'N/A',
    logoUrl: company.logoUrl || null,
    violationCount: company.violations?.length || 0,
    facilityCount: company.facilities?.length || 0
  }));
};

/**
 * 根據公司 ID 或公司代號獲取公司完整資料
 */
export const getCompanyData = (identifier) => {
  const data = loadGCSData();

  let company = data.find(c => c.id === identifier);
  if (!company) {
    company = data.find(c => c.companyCode === identifier);
  }
  if (!company) {
    company = data.find(c => c.id === `tw-${identifier}`);
  }

  return company;
};

/**
 * 獲取公司的所有設施資訊
 */
export const getCompanyFacilities = (identifier) => {
  const company = getCompanyData(identifier);

  if (!company || !company.facilities) {
    return [];
  }

  return company.facilities;
};

/**
 * 獲取所有公司 ID（用於 getStaticPaths）
 */
export const getAllCompanyIds = () => {
  const data = loadGCSData();
  return data.map(company => company.id);
};

/**
 * EPA 的違規日期是 MM/DD/YYYY，格式不合的一律當成沒有日期
 */
const parseViolationDate = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  const matched = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!matched) return null;
  const ts = Date.UTC(Number(matched[3]), Number(matched[1]) - 1, Number(matched[2]));
  return Number.isFinite(ts) ? ts : null;
};

/**
 * 地圖資料：把所有公司的廠區攤平成帶座標的點，並聚合各廠區的違規統計
 *
 * 違規歸屬邏輯與廠區詳情頁一致（violation.facilityId === facility.facilityId），
 * 而不是掛在公司層級整包算，否則同公司的乾淨廠區會被鄰廠的違規染色。
 */
export const getMapData = () => {
  const data = loadGCSData();

  const facilities = [];
  const states = new Set();
  let facilityTotal = 0;
  let violationTotal = 0;
  let mappedViolationCount = 0;
  // 座標精度粗到需要標註的廠區數（小數位數少、誤差 100 公尺以上）
  let coarseCoordinateCount = 0;

  data.forEach(company => {
    const violations = company.violations || [];
    violationTotal += violations.length;

    // 先依 facilityId 聚合：筆數、最新一筆日期、最常見類型
    const aggByFacility = {};
    violations.forEach(violation => {
      const id = violation.facilityId;
      if (!id) return;

      if (!aggByFacility[id]) {
        aggByFacility[id] = { count: 0, latest: null, types: {} };
      }
      const agg = aggByFacility[id];
      agg.count += 1;

      const type = violation.violationTypeDesc || violation.violationType || '未分類';
      agg.types[type] = (agg.types[type] || 0) + 1;

      const ts = parseViolationDate(violation.date);
      if (ts && (!agg.latest || ts > agg.latest)) {
        agg.latest = ts;
      }
    });

    (company.facilities || []).forEach(facility => {
      facilityTotal += 1;

      const lat = parseFloat(facility.coordinates?.latitude);
      const lng = parseFloat(facility.coordinates?.longitude);

      // 座標缺漏或恰好是 (0,0) 的廠區不放上地圖，否則會在幾內亞灣冒出一堆假點
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      if (lat === 0 && lng === 0) return;

      const agg = aggByFacility[facility.facilityId] || { count: 0, latest: null, types: {} };
      mappedViolationCount += agg.count;
      if (facility.state) states.add(facility.state);
      if (getCoordinateAccuracy(lat, lng).showCircle) coarseCoordinateCount += 1;

      const topType = Object.entries(agg.types).sort((a, b) => b[1] - a[1])[0];

      facilities.push({
        facilityId: facility.facilityId,
        name: facility.name || '未命名廠區',
        companyId: company.id,
        companyName: company.name,
        companyCode: company.companyCode || '',
        industry: company.industry || 'N/A',
        city: facility.city || '',
        state: facility.state || '',
        address: facility.address || '',
        lat,
        lng,
        violationCount: agg.count,
        latestViolationDate: agg.latest ? new Date(agg.latest).toISOString().slice(0, 10) : null,
        topViolationType: topType ? topType[0] : null,
        programs: facility.programs || {}
      });
    });
  });

  // 由多到少排序：一來熱點清單直接可用，二來地圖上大圓點先畫（在下層），
  // 小圓點後畫（在上層）才不會被蓋住點不到
  facilities.sort((a, b) => b.violationCount - a.violationCount);

  return {
    facilities,
    summary: {
      companyCount: data.length,
      facilityTotal,
      mappedCount: facilities.length,
      unmappedCount: facilityTotal - facilities.length,
      violationTotal,
      mappedViolationCount,
      withViolationCount: facilities.filter(f => f.violationCount > 0).length,
      stateCount: states.size,
      coarseCoordinateCount
    }
  };
};

export default {
  getAllCompanies,
  getCompanyData,
  getCompanyFacilities,
  getAllCompanyIds,
  getMapData
};
