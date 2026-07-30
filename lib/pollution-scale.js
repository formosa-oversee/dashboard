/**
 * 污染強度分級 —— 地圖圓點、圖例、熱點清單共用同一套標準
 *
 * 分級依據是「該廠區累計的 EPA 違規筆數」。目前資料裡最高的廠區有 1500+ 筆、
 * 最低的只有 1 筆，所以用區間分級而非連續色階，避免中低量的廠區全被壓成同一色。
 */

export const POLLUTION_LEVELS = [
  { key: 'none', min: 0, max: 0, label: '無違規記錄', color: '#A0AEC0' },
  { key: 'low', min: 1, max: 9, label: '1–9 筆', color: '#ECC94B' },
  { key: 'moderate', min: 10, max: 49, label: '10–49 筆', color: '#ED8936' },
  { key: 'high', min: 50, max: 199, label: '50–199 筆', color: '#E53E3E' },
  { key: 'severe', min: 200, max: Infinity, label: '200 筆以上', color: '#822727' },
];

export const getPollutionLevel = (count) => {
  const n = Number(count) || 0;
  return POLLUTION_LEVELS.find((level) => n >= level.min && n <= level.max) || POLLUTION_LEVELS[0];
};

/**
 * 圓點半徑：用平方根壓縮尺度。
 * 線性映射會讓 1 筆的廠區小到看不見、1551 筆的廠區蓋掉半個地圖，
 * 所以取 sqrt 再設上限 26px。
 */
export const getMarkerRadius = (count) => {
  const n = Number(count) || 0;
  if (n === 0) return 4;
  return Math.min(26, 5 + Math.sqrt(n) * 0.85);
};
