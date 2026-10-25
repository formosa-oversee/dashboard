/**
 * 專題報導的版面 tokens
 *
 * 文章頁走長文閱讀的版型，跟 dashboard 頁分開：米白紙底、襯線標題、黑體內文。
 * 主題色跟全站一致，用 Chakra 的 green（導覽列 green.50、標題 green.600）：
 * 封面與深色區塊是 green.900，線條與色塊 green.600，紙底上的文字連結 green.700（對比 6.4:1）。
 * 水藍只留給跟水有關的圖（地下水示意圖、水資源對照表、PFAS 圖），以 tone="water" 指定。
 *
 * 圖表配色用 dataviz validate_palette.js 對 paper 底色驗過：綠、藍、紅各自通過亮度帶、彩度與對比；
 * 但綠跟超標紅的色盲分辨只有 ΔE 6.0，綠跟藍只有 14.7，所以三者不在同一張圖並用，有超標紅的圖一律用水藍。
 */
export const R = {
  ink: '#15222c',
  inkSoft: '#3d4b55',
  muted: '#66737d',
  rule: '#e2ded3',
  paper: '#fbfaf6',
  paperDeep: '#f2efe6',

  deep: '#1c4532', // green.900
  deep2: '#22543d', // green.800
  onDeep: '#9ae6b4', // green.200，深色區塊上的小標與線條（對 deep 對比 7.4:1）
  glow: 'rgba(154,230,180,0.16)', // 深色區塊右上角的光暈

  accent: '#2f855a', // green.600
  accentText: '#276749', // green.700
  accentMid: '#8fcfa6', // 紙底上的裝飾：大引號、目次的章號
  accentTint: '#e1f2e6',

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

// 圖表的強調色組：預設品牌綠，tone="water" 換成水藍
export const toneColors = (name) => (name === 'water'
  ? { mark: R.water, text: R.waterText, tint: R.waterTint }
  : { mark: R.accent, text: R.accentText, tint: R.accentTint });

// 只在專題頁載入的襯線字（全站的 Noto Sans TC 在 _app.js）
export const SERIF_FONT_URL =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@600;700;900&display=swap';
