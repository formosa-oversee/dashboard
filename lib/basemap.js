/**
 * 底圖設定 —— 全站地圖與廠區詳情頁地圖共用
 *
 * CARTO Positron：淡色底圖，讓紅黃色的違規圓點跳出來。
 * 2026-09 起 CARTO raster 圖磚必須帶 API key，沒帶會回 HTTP 200 的「API KEY REQUIRED」
 * 浮水印圖（不是錯誤碼，所以 Leaflet 不會報錯），申請與管理見 carto.com/basemaps/apikey。
 *
 * NEXT_PUBLIC_ 變數會在 next build 時寫死進前端 bundle，所以 build 當下就要有值：
 * 本地放 .env.local，CI 由 GitHub secret CARTO_BASEMAPS_KEY 注入（.github/workflows/deploy.yml）。
 * 這把 key 本來就會出現在每個圖磚請求裡，放 secret 只是為了不進 git，不是保密。
 */

const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_KEY;

export const BASEMAP_URL =
  `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${CARTO_KEY ? `?key=${CARTO_KEY}` : ''}`;

// CARTO 條款要求每張地圖都標示 OpenStreetMap 與 CARTO
export const BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
