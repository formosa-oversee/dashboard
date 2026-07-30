/**
 * 由座標的小數位數推估定位精度。
 *
 * EPA ECHO 各廠區的座標精度差很多：多數到小數 5–6 位（公尺、公分級），
 * 但少數只到小數 2 位（約 1 公里）。以較粗的那一軸為準，
 * 免得把 1 公里級的座標當成確切廠址呈現。
 */

// 緯度 1 度約 111 公里
const METERS_PER_DEGREE = 111000;

// 精度粗於此值才值得在地圖上畫誤差圈；再細的圈在一般縮放下小於一個像素
export const CIRCLE_THRESHOLD_METERS = 100;

const countDecimals = (value) => {
  const matched = String(value).match(/\.(\d+)$/);
  return matched ? matched[1].length : 0;
};

const formatDistance = (meters) => {
  if (meters >= 1000) return `約 ${(meters / 1000).toFixed(1)} 公里`;
  if (meters >= 1) return `約 ${Math.round(meters)} 公尺`;
  return '公分級';
};

export const getCoordinateAccuracy = (lat, lng) => {
  const decimals = Math.min(countDecimals(lat), countDecimals(lng));
  const meters = METERS_PER_DEGREE / Math.pow(10, decimals);

  return {
    decimals,
    meters,
    label: formatDistance(meters),
    // 只有粗略座標需要誤差圈，精確的畫了反而看不見
    showCircle: meters >= CIRCLE_THRESHOLD_METERS,
  };
};
