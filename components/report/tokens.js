/**
 * 專題報導的版面 tokens
 *
 * 文章頁走長文閱讀的版型，跟 dashboard 頁分開：米白紙底、襯線標題、黑體內文。
 * 主題色是地下水的藍；圖表的強調藍與超標紅已用 dataviz validate_palette.js 對 paper 底色驗證
 * （亮度帶、彩度、色盲分辨、對比都通過）。文字連結用較深的 waterText，對比 ≥ 4.5:1。
 */
export const R = {
  ink: '#15222c',
  inkSoft: '#3d4b55',
  muted: '#66737d',
  rule: '#e2ded3',
  paper: '#fbfaf6',
  paperDeep: '#f2efe6',

  deep: '#0a2333',
  deep2: '#0f3449',

  water: '#1a74a8',
  waterText: '#135c88',
  waterMid: '#7fb4d1',
  waterTint: '#e2eff6',

  paddy: '#5e8c3e',
  alert: '#b8432f',
  alertTint: '#f5e3de',
  bar: '#c2c7c8',

  serif: '"Noto Serif TC", "Songti TC", "PMingLiU", serif',
  sans: '"Noto Sans TC", -apple-system, BlinkMacSystemFont, sans-serif',

  measure: '680px',
  anchorOffset: '88px',
};

// 只在專題頁載入的襯線字（全站的 Noto Sans TC 在 _app.js）
export const SERIF_FONT_URL =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@600;700;900&display=swap';
