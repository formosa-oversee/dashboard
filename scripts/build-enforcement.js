/**
 * 將 Violation Tracker 列表頁快照（TSV）轉成 enforcement schema，輸出 data/enforcement.json
 * 見 docs/enforcement-data-interface.md。
 *
 * 輸入：data/violation-tracker/<date>-us-hq-taiwan-p*.tsv
 *   欄位：recordSlug, company, parentSlug, industry, offenseType, year, agencyCode, penaltyText
 * 輸入：data/violation-tracker/<date>-us-hq-taiwan-parents.json  （parentSlug → parent 名稱）
 * 輸入：data/company-mapping.json（可選；vtSlug → companyCodes）
 */
const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '../data');
const VT_DIR = path.join(DATA, 'violation-tracker');
const SNAPSHOT_DATE = process.argv[2] || latestSnapshotDate();

function latestSnapshotDate() {
  const dates = fs.readdirSync(VT_DIR).map(f => f.match(/^(\d{4}-\d{2}-\d{2})-us-hq-taiwan-p\d+\.tsv$/)?.[1]).filter(Boolean);
  if (!dates.length) throw new Error('data/violation-tracker/ 內沒有 *-us-hq-taiwan-p*.tsv');
  return dates.sort().at(-1);
}

// 列表頁 Agency 代碼 → 政府層級（VT 慣例：州碼-機關；純大寫為聯邦；private lawsuit 另計）
function agencyLevel(code) {
  if (/^private lawsuit/i.test(code)) return 'court';
  if (/^[A-Z]{2}-/.test(code)) return 'state';
  if (code === 'MULTI-AG') return 'multi';
  return 'federal';
}

function parsePenalty(text) {
  return {
    penaltyAmountUSD: Number(text.replace(/[^0-9.]/g, '')) || 0,
    isDuplicateFlagged: text.includes('(*)'),
  };
}

const mappingPath = path.join(DATA, 'company-mapping.json');
const mapping = fs.existsSync(mappingPath) ? JSON.parse(fs.readFileSync(mappingPath, 'utf8')) : [];
const usMap = Object.fromEntries(mapping.filter(m => m.vtSlug).map(m => [m.vtSlug, m]));
const gMap = Object.fromEntries(mapping.filter(m => m.vtgSlug).map(m => [m.vtgSlug, m]));

function readJsonIfExists(p) { return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {}; }
const usParents = readJsonIfExists(path.join(VT_DIR, `${SNAPSHOT_DATE}-us-hq-taiwan-parents.json`));

const records = [];
let noSlugSeq = 0;

// ---- US 版：hq_id=Taiwan 列表頁 ----
// 欄位：recordSlug, company, parentSlug, industry, offenseType, year, agencyCode, penaltyText
for (const f of fs.readdirSync(VT_DIR).filter(f => f.startsWith(`${SNAPSHOT_DATE}-us-hq-taiwan-p`) && f.endsWith('.tsv')).sort()) {
  for (const line of fs.readFileSync(path.join(VT_DIR, f), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const [recordSlug, company, parentSlug, industry, offenseType, year, agencyCode, penaltyText] = line.split('\t');
    const m = usMap[parentSlug];
    records.push({
      caseId: recordSlug ? `VT-${recordSlug}` : `VT-noslug-${++noSlugSeq}`,
      source: 'Violation Tracker',
      sourceUrl: recordSlug ? `https://violationtracker.goodjobsfirst.org/violation-tracker/${recordSlug}` : null,
      primarySourceUrl: null, archivedSourceUrl: null,
      jurisdiction: 'United States',
      facilityId: null,
      companyNameInSource: company,
      parentInSource: usParents[parentSlug] || parentSlug,
      parentSlug, parentIndustry: industry,
      companyCodes: m?.companyCodes || [], matchLevel: m?.level || null, matchConfidence: m ? 'manual' : 'unmatched',
      date: `${year}-01-01`, datePrecision: 'year',
      agency: null, agencyCode, agencyLevel: agencyLevel(agencyCode),
      actionType: null, civilOrCriminal: null,
      offenseGroup: null, offenseType, description: null,
      ...parsePenalty(penaltyText),
      penaltyAmountOriginal: null, penaltyCurrency: 'USD',
      facilityCity: null,
      facilityState: /^[a-z]{2}-/.test(recordSlug) ? recordSlug.slice(0, 2).toUpperCase() : null,
      plantSite: null,
    });
  }
}

// ---- Global 版：jurisdiction=Taiwan 列表頁 ----
// 欄位：recordSlug, company, parentSlug, parentName, industry, offenseCategory, year, penaltyUSDText
for (const f of fs.readdirSync(VT_DIR).filter(f => f.startsWith(`${SNAPSHOT_DATE}-global-taiwan-p`) && f.endsWith('.tsv')).sort()) {
  for (const line of fs.readFileSync(path.join(VT_DIR, f), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const [recordSlug, company, parentSlug, parentName, industry, offenseCategory, year, penaltyText] = line.split('\t');
    const m = gMap[parentSlug];
    records.push({
      caseId: recordSlug ? `VTG-${recordSlug}` : `VTG-noslug-${++noSlugSeq}`, // 正式 VTG Record ID 需紀錄頁
      source: 'Violation Tracker Global',
      sourceUrl: recordSlug ? `https://violationtrackerglobal.goodjobsfirst.org/violation-tracker-global/${recordSlug}` : null,
      primarySourceUrl: null, archivedSourceUrl: null,
      jurisdiction: 'Taiwan',
      facilityId: null,
      companyNameInSource: company,
      parentInSource: parentName,
      parentSlug, parentIndustry: industry,
      companyCodes: m?.companyCodes || [], matchLevel: m?.level || null, matchConfidence: m ? 'manual' : 'unmatched',
      date: `${year}-01-01`, datePrecision: 'year',
      agency: null, agencyCode: null, agencyLevel: 'unknown', // 列表頁無機關欄；台灣機關（環境部／勞動部／公平會／金管會）需紀錄頁
      actionType: null, civilOrCriminal: null,
      offenseGroup: null, offenseType: offenseCategory, description: null,
      ...parsePenalty(penaltyText),
      penaltyAmountOriginal: null, penaltyCurrency: 'TWD', // 原幣金額需紀錄頁；列表頁只有 USD 換算
      facilityCity: null, facilityState: null, plantSite: null,
    });
  }
}

// ---- 資金鏈歸屬：data/ownership-resolution.json（scripts/resolve-ownership.py 產生）----
// 把「VT 母公司層級」換成「受罰實體 → MOPS 持股鏈 → 負責的台灣母公司」。
const resolutionPath = path.join(DATA, 'ownership-resolution.json');
const resolution = fs.existsSync(resolutionPath) ? JSON.parse(fs.readFileSync(resolutionPath, 'utf8')) : { entities: [] };
const byEntity = new Map(resolution.entities.filter(e => e.source !== 'EPA ECHO').map(e => [e.key, e]));
let attributed = 0;
for (const r of records) {
  const e = byEntity.get(`${r.source}|${r.companyNameInSource}`);
  if (!e) continue;
  attributed++;
  const resp = e.responsible || {};
  const year = Number(r.date.slice(0, 4));
  r.attribution = {
    responsible: resp,
    groupCodes: e.groupCodes || null,
    ultimateParent: e.ultimateParent || null,
    effectiveOwnershipPct: e.effectivePct ?? null,
    ownershipPath: e.path || [],
    method: e.method,
    confidence: e.confidence,
    controlSince: e.controlSince || null,
    preAcquisition: e.controlSince ? year < e.controlSince : false,
    note: e.note || e.pathNote || null,
  };
  if (resp.kind === 'listed' || resp.kind === 'group-affiliate' || resp.kind === 'group-assumed' || resp.kind === 'merger') {
    const codes = [resp.code, ...(e.ultimateParent ? [e.ultimateParent.code] : [])].filter(Boolean);
    r.companyCodes = [...new Set(codes)];
    r.matchLevel = resp.kind === 'listed' ? 'entity' : resp.kind;
    r.matchConfidence = e.confidence || 'low';
  } else {
    // 台灣非上市母公司（private / state-owned）或外資母公司：不掛到任何上市公司
    r.companyCodes = [];
    r.matchLevel = resp.kind || 'unresolved';
    r.matchConfidence = resp.kind === 'foreign' ? 'foreign' : (e.confidence || 'low');
  }
}

const unmatched = {};
for (const r of records.filter(r => r.companyCodes.length === 0)) {
  const k = `${r.source}|${r.parentSlug}`;
  unmatched[k] ||= { source: r.source, slug: r.parentSlug, parent: r.parentInSource, records: 0, penaltyUSD: 0 };
  unmatched[k].records++; if (!r.isDuplicateFlagged) unmatched[k].penaltyUSD += r.penaltyAmountUSD;
}
fs.writeFileSync(path.join(DATA, 'enforcement.json'), JSON.stringify({ snapshotDate: SNAPSHOT_DATE, source: 'Violation Tracker / Violation Tracker Global (Good Jobs First), internal use only', count: records.length, records }, null, 2));
fs.writeFileSync(path.join(VT_DIR, 'unmatched.json'), JSON.stringify(Object.values(unmatched).sort((a, b) => b.penaltyUSD - a.penaltyUSD), null, 2));

for (const src of ['Violation Tracker', 'Violation Tracker Global']) {
  const rs = records.filter(r => r.source === src);
  const total = rs.filter(r => !r.isDuplicateFlagged).reduce((s, r) => s + r.penaltyAmountUSD, 0);
  console.log(`${src}: ${rs.length} 筆，罰款合計（排除 (*)）US$${total.toLocaleString()}`);
}
const byKind = {};
for (const r of records) {
  const k = `${r.source === 'Violation Tracker' ? 'US' : 'Global'} ${r.matchLevel}`;
  byKind[k] ||= { records: 0, usd: 0 };
  byKind[k].records++; if (!r.isDuplicateFlagged) byKind[k].usd += r.penaltyAmountUSD;
}
console.log(`資金鏈歸屬：${attributed}/${records.length} 筆套用 ownership-resolution.json`);
for (const [k, v] of Object.entries(byKind).sort()) console.log(`  ${k.padEnd(24)} ${String(v.records).padStart(4)} 筆  US$${v.usd.toLocaleString()}`);
console.log(`snapshot ${SNAPSHOT_DATE}: 共 ${records.length} 筆；未掛上市公司的受罰實體 ${Object.keys(unmatched).length} 家（外資、台灣非上市母公司；見 data/violation-tracker/unmatched.json）`);
