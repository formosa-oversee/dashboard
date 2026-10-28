/**
 * 污染事件（data/news.json）的顯示字典與期間格式 —— 公司頁事件卡與地圖事件圖層共用。
 * 規格見 docs/pollution-news-spec.md。
 */

export const EVENT_TYPES = {
  'pollution-incident': { label: '污染事故', color: 'red' },
  'enforcement': { label: '環境執法', color: 'purple' },
  'litigation': { label: '訴訟', color: 'blue' },
  'eia-dispute': { label: '環評爭議', color: 'cyan' },
  'industrial-accident': { label: '化學品事故', color: 'orange' },
  'community-health': { label: '社區健康', color: 'pink' }
};

// 指控與已確定的事實要分得出來
export const EVENT_STATUSES = {
  alleged: { label: '指控', color: 'yellow' },
  investigating: { label: '調查中', color: 'yellow' },
  concluded: { label: '官方調查已有結論', color: 'gray' },
  penalized: { label: '已裁罰', color: 'red' },
  settled: { label: '已和解', color: 'green' },
  ruled: { label: '已判決', color: 'red' },
  ongoing: { label: '持續中', color: 'orange' }
};
const OPEN_ENDED = new Set(['alleged', 'investigating', 'ongoing']);

export const eventPeriod = (event) => {
  if (event.dateEnd && event.dateEnd !== event.dateStart) return `${event.dateStart} – ${event.dateEnd}`;
  if (!event.dateEnd && OPEN_ENDED.has(event.status)) return `${event.dateStart} 起`;
  return event.dateStart;
};

// 地點座標的定位精度（news-events.json 的 locations[].coordinates.precision），由細到粗
export const LOCATION_PRECISIONS = {
  facility: { label: '廠區位置', note: '標記在廠區本身' },
  'industrial-park': { label: '只定位到工業區', note: '標記在工業區中心，不是廠房位置' },
  city: { label: '只定位到城鎮', note: '標記在城鎮中心，不是廠房位置' },
  region: { label: '只定位到地區', note: '標記在地區中心，不是廠房位置' }
};
export const PRECISION_ORDER = Object.keys(LOCATION_PRECISIONS);

// 地圖事件圖層用藍色定位針，跟 EPA 圖層的灰黃橘紅圓點在顏色與形狀上都分得開（色盲也能靠形狀分）
export const MAP_EVENT_COLOR = '#2C5282';
