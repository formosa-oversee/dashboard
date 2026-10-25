// 罰款紀錄（Violation Tracker，data/enforcement.json）的顯示用字典。
// VT 列表頁只有 Primary Offense 與機關代碼；類別是我們依 Primary Offense 歸的，不是 VT 的 Offense Group 欄位。

export const VT_SNAPSHOT_NOTE = '經 Good Jobs First 同意，以非營利用途使用';

export const OFFENSE_CATEGORIES = {
  environment: { label: '環境', color: 'green' },
  safety: { label: '安全', color: 'orange' },
  employment: { label: '勞動', color: 'yellow' },
  competition: { label: '反競爭', color: 'red' },
  consumer: { label: '消費者保護', color: 'pink' },
  financial: { label: '金融', color: 'blue' },
  other: { label: '其他', color: 'gray' },
};

const OFFENSE_TYPES = {
  'environmental violation': ['環境違規', 'environment'],
  'air pollution violation': ['空氣污染', 'environment'],
  'water pollution violation': ['水污染', 'environment'],
  'hazardous waste violation': ['有害廢棄物', 'environment'],
  'solid waste violation': ['廢棄物', 'environment'],
  'oil spill': ['漏油', 'environment'],
  'workplace safety or health violation': ['職業安全衛生', 'safety'],
  'railroad safety violation': ['鐵路安全', 'safety'],
  'aviation safety violation': ['航空安全', 'safety'],
  'product safety violation': ['產品安全', 'safety'],
  'labor relations violation': ['勞資關係', 'employment'],
  'wage and hour violation': ['工資與工時', 'employment'],
  'benefit plan administrator violation': ['員工福利計畫', 'employment'],
  'labor standards violation': ['勞動基準', 'employment'],
  'employment discrimination': ['就業歧視', 'employment'],
  'price-fixing or anti-competitive practices': ['聯合定價或反競爭', 'competition'],
  'anti-competitive practices': ['反競爭行為', 'competition'],
  'consumer protection violation': ['消費者保護', 'consumer'],
  'aviation consumer protection violation': ['航空消費者保護', 'consumer'],
  'anti-money-laundering deficiencies': ['洗錢防制缺失', 'financial'],
  'investor protection violation': ['投資人保護', 'financial'],
  'banking violation': ['銀行業違規', 'financial'],
  'insurance violation': ['保險業違規', 'financial'],
  'Jones Act violation': ['違反瓊斯法（沿岸航運）', 'other'],
  'trade violations': ['貿易違規', 'other'],
  'export control violation': ['出口管制', 'other'],
  'tax violations': ['稅務違規', 'other'],
  'telecommunications violation': ['電信違規', 'other'],
  'theft of trade secrets': ['竊取營業秘密', 'other'],
};

export const offenseInfo = (offenseType) => {
  const [label, category] = OFFENSE_TYPES[offenseType] || [offenseType || '未分類', 'other'];
  const { label: categoryLabel, color } = OFFENSE_CATEGORIES[category];
  return { label, category, categoryLabel, color };
};

const STATES = {
  AL: '阿拉巴馬州', AZ: '亞利桑那州', CA: '加州', DE: '德拉瓦州', GA: '喬治亞州', LA: '路易斯安那州',
  NJ: '紐澤西州', NY: '紐約州', OH: '俄亥俄州', SC: '南卡羅來納州', TX: '德州', WA: '華盛頓州',
};

const AGENCIES = {
  OSHA: '職業安全衛生署（OSHA）',
  EPA: '聯邦環保署（EPA）',
  FRA: '聯邦鐵路管理局（FRA）',
  FAA: '聯邦航空總署（FAA）',
  DOJ_ANTITRUST: '司法部反托拉斯署',
  DOJ_NATSEC: '司法部國家安全司',
  'MULTI-AG': '多州檢察長聯合',
  CBP: '海關暨邊境保護局（CBP）',
  ACPD: '運輸部航空消費者保護處',
  NLRB: '國家勞資關係委員會（NLRB）',
  FCC: '聯邦通訊委員會（FCC）',
  CFTC: '商品期貨交易委員會（CFTC）',
  FED: '聯準會',
  CPSC: '消費品安全委員會（CPSC）',
  WHD: '勞工部工資工時處',
  EBSA: '勞工部員工福利安全署',
  USAO: '聯邦檢察官',
  'private lawsuit-federal': '民事訴訟（聯邦法院）',
  'TX-ENV': '德州環境品質委員會（TCEQ）',
  'CA-ARB': '加州空氣資源委員會',
  'CA-LACDA': '洛杉磯郡檢察官',
  'CA-MULTI': '加州多個機關',
  'WA-AG': '華盛頓州檢察長',
  'NY-DFS': '紐約州金融服務署',
};

export const agencyLabel = (code) => {
  if (!code) return '—';
  if (AGENCIES[code]) return AGENCIES[code];
  const m = code.match(/^([A-Z]{2})-ENV$/);
  if (m) return `${STATES[m[1]] || m[1]}環保機關`;
  return code;
};

export const formatUSD = (v) => {
  if (v >= 1e8) return `US$${(v / 1e8).toFixed(1)} 億`;
  if (v >= 1e6) return `US$${Math.round(v / 1e4).toLocaleString()} 萬`;
  if (v >= 1e4) return `US$${(v / 1e4).toFixed(1)} 萬`;
  return `US$${(v || 0).toLocaleString()}`;
};
