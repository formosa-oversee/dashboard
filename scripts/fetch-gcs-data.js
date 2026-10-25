const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * 從 Google Cloud Storage 獲取 EPA ECHO CSV 資料
 * 並轉換為靜態 JSON 檔案
 */

// 載入 GCS 配置
const GCS_CONFIG = require('../gcs-config.js');

// 輸出目錄
const DATA_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(DATA_DIR, 'epa-data.json');

/**
 * 設施 → 台灣母公司的持股鏈（scripts/resolve-ownership.py 產生的 data/ownership-resolution.json）。
 * 檔案不存在時不影響建置，facility.ownership 為 null。
 */
function loadFacilityOwnership() {
  const file = path.join(DATA_DIR, 'ownership-resolution.json');
  const index = new Map();
  if (!fs.existsSync(file)) return index;
  try {
    const { entities = [] } = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const e of entities) {
      if (e.source !== 'EPA ECHO') continue;
      index.set(e.key, {
        responsible: e.responsible ? { kind: e.responsible.kind, code: e.responsible.code || null, name: e.responsible.name || null } : null,
        groupName: e.groupName || null,
        entityInMops: e.entityInMops || null,
        effectivePct: e.effectivePct ?? null,
        path: e.path || [],
        method: e.method,
        confidence: e.confidence,
        note: e.note || e.pathNote || null,
      });
    }
  } catch (err) {
    console.warn(`⚠️ 無法讀取 ownership-resolution.json：${err.message}`);
  }
  return index;
}
const FACILITY_OWNERSHIP = loadFacilityOwnership();

/**
 * 公司基本資料：facilities.csv 與 data/company-info.json 的公司欄位同名，用同一套對應。
 */
function companyInfoFromRow(row) {
  return {
    name: row['投資公司名稱'],
    englishName: row['投資公司英文全稱'],
    chairman: row['董事長'],
    foundedDate: row['成立日期'],
    listedDate: row['上市日期'],
    capital: row['實收資本額(元)'],
    website: row['公司網址'],
    address: row['住址'],
    industry: row['產業類別'] || 'N/A',
    logoUrl: row['LOGO網址']
  };
}

function readDataJson(name) {
  const file = path.join(DATA_DIR, name);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.warn(`⚠️ 無法讀取 ${name}：${err.message}`);
    return null;
  }
}

const DATA_SOURCE_LABELS = { news: '污染事件（官方文件與新聞報導）', enforcement: 'Violation Tracker（Good Jobs First）' };

/**
 * 不在 EPA 資料裡、但有污染事件或 Violation Tracker 紀錄的公司（scripts/build-company-info.py 產生的 data/company-info.json）。
 * 另外建立公司物件，標 inEpaData: false，前端不顯示 0 筆違規。
 */
function addCompaniesOutsideEpa(companies) {
  companies.forEach(company => { company.inEpaData = true; });
  const byCode = new Set(companies.map(c => c.companyCode));
  let added = 0;
  for (const [code, row] of Object.entries(readDataJson('company-info.json')?.companies || {})) {
    if (byCode.has(code)) continue;
    const info = companyInfoFromRow(row);
    companies.push({
      id: `tw-${code}`,
      ...info,
      englishName: info.englishName || info.name,
      shortName: row['公司簡稱'] || null,
      parentCompany: null,
      companyType: '台灣上市公司',
      companyCode: code,
      facilities: [],
      violations: [],
      enforcement: [],
      news: [],
      inEpaData: false,
      metadata: {
        dataSource: (row.sources || []).map(s => DATA_SOURCE_LABELS[s] || s).join('、'),
        lastUpdated: new Date().toISOString()
      }
    });
    added++;
  }
  console.log(`🏢 不在 EPA 資料裡的公司：${added} 家`);
}

/**
 * 污染事件（scripts/build-news.py 產生的 data/news.json，規格見 docs/pollution-news-spec.md）。
 * 事件掛到持股達門檻的公司（companyCodes）。檔案不存在時不影響建置，news 為空陣列。
 */
function attachNews(companies) {
  companies.forEach(company => { company.news = []; });
  const news = readDataJson('news.json');
  if (!news) return;

  const byCode = new Map(companies.map(c => [c.companyCode, c]));
  for (const event of news.events || []) {
    for (const code of event.companyCodes || []) {
      const company = byCode.get(code);
      if (!company) {
        console.warn(`⚠️ 事件 ${event.id} 的公司 ${code} 不在資料中`);
        continue;
      }
      company.news.push({ ...event, holdings: (event.attribution || []).filter(a => a.companyCode === code) });
    }
  }
  companies.forEach(c => c.news.sort((a, b) => (b.dateStart || '').localeCompare(a.dateStart || '')));

  const withNews = companies.filter(c => c.news.length > 0).length;
  console.log(`📰 污染事件：${(news.events || []).length} 個事件，掛到 ${withNews} 家公司`);
}

/**
 * 罰款紀錄（scripts/build-enforcement.js 產生的 data/enforcement.json，Violation Tracker，Good Jobs First 書信同意非營利使用）。
 * 只放 shown 的紀錄（掛得到上市公司、境外、非收購前），欄位只留前端用得到的。
 * 罰款合計排除 VT 標 (*) 的重複計算紀錄。檔案不存在時 enforcement 為空陣列。
 */
function attachEnforcement(companies) {
  companies.forEach(company => {
    company.enforcement = [];
    company.enforcementSummary = { count: 0, penaltyTotalUSD: 0, latestYear: null };
  });
  const data = readDataJson('enforcement.json');
  if (!data) return;

  const byCode = new Map(companies.map(c => [c.companyCode, c]));
  const records = (data.records || []).filter(r => r.shown);
  for (const r of records) {
    const a = r.attribution || {};
    const resp = a.responsible || {};
    const hops = (a.ownershipPath || []).map(p => (p.pct != null ? `${p.investee}（${p.pct}%）` : p.investee));
    for (const code of r.companyCodes) {
      const company = byCode.get(code);
      if (!company) {
        console.warn(`⚠️ 罰款紀錄 ${r.caseId} 的公司 ${code} 不在資料中`);
        continue;
      }
      company.enforcement.push({
        caseId: r.caseId,
        source: r.source,
        sourceUrl: r.sourceUrl,
        parentUrl: r.parentUrl,
        snapshotDate: data.snapshotDate,
        jurisdiction: r.jurisdiction,
        companyNameInSource: r.companyNameInSource,
        parentInSource: r.parentInSource,
        year: r.date.slice(0, 4),
        agencyCode: r.agencyCode,
        agencyLevel: r.agencyLevel,
        offenseType: r.offenseType,
        penaltyAmountUSD: r.penaltyAmountUSD,
        isDuplicateFlagged: r.isDuplicateFlagged,
        facilityState: r.facilityState,
        holding: {
          role: resp.code === code ? 'responsible' : 'ultimate-parent',
          effectivePct: a.effectiveOwnershipPct ?? null,
          path: [resp.short || resp.name, ...hops].filter(Boolean),
          method: a.method || null,
          confidence: r.matchConfidence,
          note: a.note || null,
        },
      });
    }
  }
  for (const c of companies) {
    c.enforcement.sort((x, y) => y.year.localeCompare(x.year) || y.penaltyAmountUSD - x.penaltyAmountUSD);
    c.enforcementSummary = {
      count: c.enforcement.length,
      penaltyTotalUSD: c.enforcement.filter(r => !r.isDuplicateFlagged).reduce((s, r) => s + r.penaltyAmountUSD, 0),
      latestYear: c.enforcement[0]?.year || null,
    };
  }
  const withRecords = companies.filter(c => c.enforcement.length > 0).length;
  console.log(`⚖️ 罰款紀錄（Violation Tracker ${data.snapshotDate}）：${records.length} 筆，掛到 ${withRecords} 家公司`);
}

const PROGRAM_LABELS = { CWA: '水污染', CAA: '空氣污染', RCRA: '有害廢棄物', FEC: 'EPA 執法案件' };
const toEpaDate = (iso) => (iso ? `${iso.slice(5, 7)}/${iso.slice(8, 10)}/${iso.slice(0, 4)}` : 'N/A');

/**
 * 水污染以外的 EPA 紀錄（scripts/build-echo-programs.py 產生的 data/echo-programs.json）：
 * 同一廠區的空污、有害廢棄物紀錄與 EPA 聯邦執法案件，併進 violations，program 欄位區分。
 * 廠區層級的紀錄掛在主要設施（site.facilityIds[0]）；沒有 NPDES 許可證的廠區（newFacility）另建設施。
 * 也把廠區的監管計畫、TRI／GHG 排放量、EPA 設施報告連結寫到設施上。檔案不存在時不影響建置。
 */
function attachEchoPrograms(companies) {
  companies.forEach(c => c.violations.forEach(v => { v.program = 'CWA'; v.programLabel = PROGRAM_LABELS.CWA; }));
  const data = readDataJson('echo-programs.json');
  if (!data) return;

  const byCode = new Map(companies.map(c => [c.companyCode, c]));
  const siteByKey = new Map();
  for (const site of data.sites || []) {
    const company = byCode.get(site.companyCode);
    if (!company) {
      console.warn(`⚠️ 廠區 ${site.name} 的公司 ${site.companyCode} 不在資料中`);
      continue;
    }
    const nf = site.newFacility;
    if (nf && !company.facilities.some(f => f.facilityId === site.facilityIds[0])) {
      // 持股鏈與持股比例沿用同一子公司的既有設施
      const like = FACILITY_OWNERSHIP.get(nf.ownershipFrom);
      const sibling = company.facilities.find(f => `${company.companyCode}|${f.facilityId}` === nf.ownershipFrom);
      company.facilities.push({
        facilityId: site.facilityIds[0],
        name: site.name,
        registryId: site.registryId,
        address: nf.address || 'N/A',
        city: site.city || 'N/A',
        state: site.state || 'N/A',
        zipCode: nf.zipCode || 'N/A',
        country: 'USA',
        industry: 'N/A',
        coordinates: { latitude: nf.latitude || null, longitude: nf.longitude || null },
        shareholding: sibling?.shareholding,
        ownership: like ? { ...like, note: nf.basis } : null,
        programs: { air: false, water: false, waste: false, toxics: false }
      });
    }
    for (const id of site.facilityIds) {
      const facility = company.facilities.find(f => f.facilityId === id);
      if (!facility) continue;
      facility.programs = {
        ...facility.programs,
        air: site.programIds.air.length > 0,
        waste: site.programIds.waste.length > 0,
        toxics: site.programIds.toxics.length > 0,
      };
      facility.echo = { registryId: site.registryId, dfrUrl: site.dfrUrl, releases: site.releases, controlSince: site.controlSince };
    }
    siteByKey.set(`${site.companyCode}|${site.registryId}`, { company, site });
  }

  let added = 0;
  for (const r of data.records || []) {
    const hit = siteByKey.get(`${r.companyCode}|${r.registryId}`);
    if (!hit || r.duplicateOf) continue;
    const { company, site } = hit;
    const facility = company.facilities.find(f => f.facilityId === site.facilityIds[0]);
    const resolved = r.resolvedDate ? `RE - Returned to Compliance ${toEpaDate(r.resolvedDate)}` : null;
    company.violations.push({
      violationId: r.caseNumber && r.program === 'FEC' ? r.caseNumber : r.id,
      facilityId: site.facilityIds[0],
      program: r.program,
      programLabel: PROGRAM_LABELS[r.program],
      kind: r.kind,
      violationCode: r.violationCode || (r.program === 'FEC' ? (r.statutes || []).join('、') : r.caseNumber) || null,
      violationTypeDesc: r.type,
      description: (r.program === 'FEC' ? [r.caseName, r.outcome] : [r.description, r.pollutants && `污染物：${r.pollutants}`]).filter(Boolean).join('；') || 'N/A',
      date: toEpaDate(r.date),
      endDate: 'N/A',
      comment: r.program === 'FEC' ? r.description || '' : '',
      agencyType: r.agency || 'N/A',
      status: resolved || r.status || (r.kind === 'violation' ? 'Unknown' : 'N/A'),
      source: 'EPA ECHO',
      sourceUrl: r.sourceUrl || site.dfrUrl,
      plantSite: `${facility?.name || site.name}, 美國`,
      penaltyUSD: r.penaltyUSD || null,
      fine: r.penaltyUSD ? `$${r.penaltyUSD.toLocaleString('en-US')}` : 'N/A',
      monitoringPeriodEndDate: null,
      valueReceivedDate: null
    });
    added++;
  }
  // 水污染與其他類別混在同一張表，依日期新到舊排，沒有日期的放最後
  const sortKey = (v) => (/^\d\d\/\d\d\/\d{4}$/.test(v.date) ? v.date.slice(6) + v.date.slice(0, 2) + v.date.slice(3, 5) : '');
  companies.forEach(c => c.violations.sort((x, y) => sortKey(y).localeCompare(sortKey(x))));
  const counts = {};
  (data.records || []).forEach(r => { if (!r.duplicateOf) counts[r.program] = (counts[r.program] || 0) + 1; });
  console.log(`🏭 水污染以外的 EPA 紀錄：併入 ${added} 筆（${Object.entries(counts).map(([k, n]) => `${PROGRAM_LABELS[k]} ${n}`).join('、')}）`);
}

/**
 * 從 GCS 下載檔案
 */
async function downloadFromGCS(bucketName, fileName) {
  // 優先使用配置中的完整 URL
  let url;
  if (GCS_CONFIG.urls && GCS_CONFIG.urls.facilities) {
    url = GCS_CONFIG.urls.facilities;
  } else {
    url = `https://storage.googleapis.com/${bucketName}/${fileName}`;
  }
  
  console.log(`正在下載: ${url}`);
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // 處理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFromURL(response.headers.location).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`下載失敗: ${response.statusCode} ${response.statusMessage}\n回應: ${response.body || 'No body'}`));
        return;
      }
      
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * 從任意 URL 下載檔案
 */
async function downloadFromURL(url) {
  console.log(`重定向到: ${url}`);
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`下載失敗: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * 解析 CSV 資料 - 正確處理引號和逗號
 */
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');

  // 解析單行 CSV，正確處理引號內的逗號
  function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // 雙引號轉義
          current += '"';
          i++;
        } else {
          // 切換引號狀態
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // 遇到逗號且不在引號內，分割欄位
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // 加入最後一個欄位
    result.push(current.trim());
    return result;
  }

  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

/**
 * 將數字字串轉換為字串（去除 .0 後綴）
 */
function normalizeId(value) {
  if (!value) return value;
  const str = String(value);
  // 如果是以 .0 結尾的數字字串，移除 .0
  if (str.match(/^\d+\.0+$/)) {
    return str.split('.')[0];
  }
  return str;
}

/**
 * 轉換 EPA 資料格式 - 支援台灣企業境外投資違規資料
 */
function transformEPAFacilityData(facilities, violations = []) {
  const companiesMap = new Map();
  const companyInfoMap = new Map(); // 儲存台灣公司基本資訊
  const facilityInfoMap = new Map(); // 儲存設施地址資訊

  // 先從 facilities 建立公司和設施資訊索引
  facilities.forEach(facility => {
    const companyCode = normalizeId(facility['公司代號']);
    const facilityId = normalizeId(facility['icis_facility_id']);

    // 儲存公司基本資訊
    if (companyCode && !companyInfoMap.has(companyCode)) {
      companyInfoMap.set(companyCode, companyInfoFromRow(facility));
    }

    // 儲存設施地址資訊
    if (facilityId) {
      facilityInfoMap.set(facilityId, {
        address: facility['facility_address'] || 'N/A',
        city: facility['city'] || 'N/A',
        state: facility['state'] || 'N/A',
        zipCode: facility['zip'] || 'N/A',
        latitude: facility['latitude'] || null,
        longitude: facility['longitude'] || null,
        shareholding: facility['持股比例']
      });
    }
  });

  // 首先從 facilities.csv 建立所有公司和設施
  facilities.forEach(facility => {
    const companyCode = normalizeId(facility['公司代號']);
    const companyName = facility['投資公司名稱'];
    const companyEnglishName = facility['投資公司英文全稱'];
    const facilityName = facility['facility_name'];
    const facilityId = normalizeId(facility['icis_facility_id']);
    
    if (!companyCode || !companyName || !facilityId) return;
    
    const companyId = `tw-${companyCode}`;

    if (!companiesMap.has(companyId)) {
      // 從 companyInfoMap 獲取台灣公司基本資訊
      const companyInfo = companyInfoMap.get(companyCode) || {};

      companiesMap.set(companyId, {
        id: companyId,
        name: companyName,
        englishName: companyEnglishName || companyName,
        parentCompany: null,
        companyType: '台灣上市公司',
        companyCode: companyCode,
        chairman: companyInfo.chairman,
        foundedDate: companyInfo.foundedDate,
        listedDate: companyInfo.listedDate,
        capital: companyInfo.capital,
        website: companyInfo.website,
        address: companyInfo.address,
        industry: companyInfo.industry || 'N/A',
        logoUrl: companyInfo.logoUrl,
        facilities: [],
        violations: [],
        enforcement: [],
        metadata: {
          dataSource: 'EPA ECHO - 台灣企業境外投資',
          lastUpdated: new Date().toISOString()
        }
      });
    }
    
    const company = companiesMap.get(companyId);
    
    // 建立設施資料
    let existingFacility = company.facilities.find(f => f.facilityId === facilityId);
    if (!existingFacility) {
      // 從 facilityInfoMap 獲取設施地址資訊
      const facilityInfo = facilityInfoMap.get(facilityId) || {};

      existingFacility = {
        facilityId: facilityId,
        name: facilityName,
        registryId: normalizeId(facility['npdes_id']) || facilityId,
        address: facilityInfo.address || 'N/A',
        city: facilityInfo.city || 'N/A',
        state: facilityInfo.state || 'N/A',
        zipCode: facilityInfo.zipCode || 'N/A',
        country: facility['地區別代號']?.includes('美國') ? 'USA' : 'Unknown',
        industry: 'N/A',
        coordinates: {
          latitude: facilityInfo.latitude || null,
          longitude: facilityInfo.longitude || null
        },
        shareholding: facilityInfo.shareholding,
        ownership: FACILITY_OWNERSHIP.get(`${companyCode}|${facilityId}`) || null,
        programs: {
          air: false,
          water: true, // 大部分是水污染違規
          waste: false,
          toxics: false
        }
      };
      company.facilities.push(existingFacility);
    }
  });

  // 然後處理違規資料，補充到現有的設施中
  violations.forEach(violation => {
    const companyCode = normalizeId(violation['公司代號']);
    const companyName = violation['投資公司名稱'];
    const facilityName = violation['FACILITY_NAME'];
    const facilityId = normalizeId(violation['ICIS_FACILITY_ID']);
    
    if (!companyCode || !companyName || !facilityId) return;
    
    // 跳過不完整的記錄（如果啟用過濾）
    if (GCS_CONFIG.processing.filterIncompleteRecords) {
      if (!facilityName || !violation['VIOLATION_DESC']) return;
    }
    
    const companyId = `tw-${companyCode}`;
    const company = companiesMap.get(companyId);
    
    if (!company) return; // 如果公司不存在，跳過
    
    // 確保設施存在
    let facility = company.facilities.find(f => f.facilityId === facilityId);
    if (!facility) {
      // 如果設施不存在，建立一個基本設施記錄
      const facilityInfo = facilityInfoMap.get(facilityId) || {};
      
      facility = {
        facilityId: facilityId,
        name: facilityName,
        registryId: normalizeId(violation['NPDES_ID']) || facilityId,
        address: facilityInfo.address || 'N/A',
        city: facilityInfo.city || 'N/A',
        state: facilityInfo.state || 'N/A',
        zipCode: facilityInfo.zipCode || 'N/A',
        country: violation['地區別代號']?.includes('美國') ? 'USA' : 'Unknown',
        industry: 'N/A',
        coordinates: {
          latitude: facilityInfo.latitude || null,
          longitude: facilityInfo.longitude || null
        },
        shareholding: facilityInfo.shareholding,
        programs: {
          air: false,
          water: true,
          waste: false,
          toxics: false
        }
      };
      company.facilities.push(facility);
    }

    // 建立違規記錄
    const violationRecord = {
      violationId: normalizeId(violation['NPDES_VIOLATION_ID']) || `EPA-${companyCode}-${Date.now()}`,
      facilityId: facilityId, // 加入設施 ID 以便唯一對應
      violationTypeCode: violation['VIOLATION_TYPE_CODE'],
      violationCode: violation['VIOLATION_CODE'],
      description: violation['VIOLATION_DESC'] || 'N/A',
      date: violation['SINGLE_EVENT_VIOLATION_DATE'] || violation['MONITORING_PERIOD_END_DATE'] || violation['RNC_DETECTION_DATE'] || 'N/A',
      endDate: violation['SINGLE_EVENT_END_DATE'] || 'N/A',
      comment: violation['SINGLE_EVENT_VIOLATION_COMMENT'] || '',
      agencyType: violation['SINGLE_EVENT_AGENCY_TYPE_CODE'] || 'N/A',
      rncDetectionCode: violation['RNC_DETECTION_CODE'],
      rncDetectionDesc: violation['RNC_DETECTION_DESC'],
      rncDetectionDate: violation['RNC_DETECTION_DATE'],
      rncResolutionCode: violation['RNC_RESOLUTION_CODE'],
      rncResolutionDesc: violation['RNC_RESOLUTION_DESC'],
      rncResolutionDate: violation['RNC_RESOLUTION_DATE'],
      violationType: violation['VIOLATION_TYPE'],
      violationTypeDesc: violation['VIOLATION_TYPE_DESC'],
      status: violation['RNC_RESOLUTION_DESC'] || 'Unknown',
      source: 'EPA ECHO',
      plantSite: `${facilityName}, ${violation['地區別代號']?.replace(/^\d+--/, '') || 'Unknown'}`,
      fine: 'N/A', // 這個資料集中沒有罰款資訊

      // DMR 相關欄位（如果存在）
      parameterCode: violation['PARAMETER_CODE'],
      parameterDesc: violation['PARAMETER_DESC'],
      limitValue: violation['LIMIT_VALUE_STANDARD_UNITS'],
      dmrValue: violation['ADJUSTED_DMR_STANDARD_UNITS'] || violation['DMR_VALUE_STANDARD_UNITS'],
      exceedencePct: violation['EXCEEDENCE_PCT'],
      standardUnit: violation['STANDARD_UNIT_DESC'],
      monitoringPeriodEnd: violation['MONITORING_PERIOD_END_DATE'],
      daysLate: violation['DAYS_LATE'],

      // 額外日期欄位
      monitoringPeriodEndDate: violation['MONITORING_PERIOD_END_DATE'] || null,
      valueReceivedDate: violation['VALUE_RECEIVED_DATE'] || null,
      scheduleDate: violation['SCHEDULE_DATE'] || null,
      actualDate: violation['ACTUAL_DATE'] || null
    };
    
    company.violations.push(violationRecord);
  });
  
  // 設施資料已經在前面處理過了，這裡不需要重複處理
  
  return Array.from(companiesMap.values());
}

/**
 * 主要執行函數
 */
async function main() {
  try {
    console.log('🚀 開始從 GCS 獲取 EPA 資料...');
    
    // 確保資料目錄存在
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // 檢查本地檔案是否存在
    const facilitiesFile = path.join(DATA_DIR, 'facilities.csv');
    const violationsFile = path.join(DATA_DIR, 'violations.csv');
    
    let facilitiesCSV, violationsCSV;
    
    if (fs.existsSync(facilitiesFile)) {
      console.log('📥 從本地檔案載入設施資料...');
      facilitiesCSV = fs.readFileSync(facilitiesFile, 'utf8');
    } else {
      console.log('📥 從 GCS 下載設施資料...');
      facilitiesCSV = await downloadFromGCS(GCS_CONFIG.bucket, GCS_CONFIG.files.facilities);
    }
    
    if (fs.existsSync(violationsFile)) {
      console.log('📥 從本地檔案載入違規資料...');
      violationsCSV = fs.readFileSync(violationsFile, 'utf8');
    } else {
      console.log('📥 從 GCS 下載違規資料...');
      try {
        violationsCSV = await downloadFromGCS(GCS_CONFIG.bucket, GCS_CONFIG.files.violations);
      } catch (error) {
        console.log('⚠️ 違規資料下載失敗，僅使用設施資料');
        violationsCSV = '';
      }
    }
    
    // 解析 CSV
    console.log('🔄 解析 CSV 資料...');
    const facilities = parseCSV(facilitiesCSV);
    const violations = violationsCSV ? parseCSV(violationsCSV) : [];

    // 補充資料：ECHO 覆蓋率稽核確認屬台灣母公司、但 GCS 原始 CSV 沒有的設施（scripts/build-echo-supplement.py 產生，進 git）
    for (const [file, target, idKey] of [['facilities-supplement.csv', facilities, 'icis_facility_id'], ['violations-supplement.csv', violations, 'NPDES_VIOLATION_ID']]) {
      const p = path.join(DATA_DIR, file);
      if (!fs.existsSync(p)) continue;
      const rows = parseCSV(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
      const seen = new Set(target.map(r => `${normalizeId(r[idKey] || r['ICIS_FACILITY_ID'])}|${r['npdes_id'] || r['NPDES_ID'] || ''}|${r['SINGLE_EVENT_VIOLATION_DATE'] || ''}|${r['DMR_VALUE_ID'] || ''}`));
      let added = 0;
      for (const r of rows) {
        const key = `${normalizeId(r[idKey] || r['ICIS_FACILITY_ID'])}|${r['npdes_id'] || r['NPDES_ID'] || ''}|${r['SINGLE_EVENT_VIOLATION_DATE'] || ''}|${r['DMR_VALUE_ID'] || ''}`;
        if (seen.has(key)) continue;
        seen.add(key); target.push(r); added++;
      }
      console.log(`➕ ${file}：合併 ${added} 筆`);
    }
    
    console.log(`解析完成: ${facilities.length} 設施記錄, ${violations.length} 違規記錄`);
    
    // 限制處理記錄數（用於測試）
    const recordsToProcess = GCS_CONFIG.processing.maxRecords 
      ? facilities.slice(0, GCS_CONFIG.processing.maxRecords)
      : facilities;
    
    if (GCS_CONFIG.processing.maxRecords) {
      console.log(`🔄 限制處理記錄數: ${recordsToProcess.length}`);
    }
    
    // 轉換資料格式
    console.log('🔄 轉換資料格式...');
    const transformedData = transformEPAFacilityData(recordsToProcess, violations);
    attachEchoPrograms(transformedData);
    addCompaniesOutsideEpa(transformedData);
    attachNews(transformedData);
    attachEnforcement(transformedData);

    // 儲存為 JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(transformedData, null, 2));
    
    console.log(`✅ 資料處理完成！已儲存到 ${OUTPUT_FILE}`);
    console.log(`📊 處理了 ${transformedData.length} 家公司的資料`);
    
  } catch (error) {
    console.error('❌ 處理過程中發生錯誤:', error.message);
    process.exit(1);
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  main();
}

module.exports = { main, transformEPAFacilityData, parseCSV };
