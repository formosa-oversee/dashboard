import dynamic from 'next/dynamic';

/**
 * 每篇專題的內文元件，key 是 lib/reports.js 的 slug。
 * 用 next/dynamic 各自拆成獨立的 chunk：讀者只下載正在看的那一篇，篇數再多單篇頁也不會變重。
 * 靜態匯出時仍會把全文輸出進 HTML（ssr 預設開啟）。
 */
export const ARTICLES = {
  'kumamoto-jasm': dynamic(() => import('./kumamoto-jasm')),
  'kumamoto-notes-1': dynamic(() => import('./kumamoto-notes-1')),
  'kumamoto-notes-2': dynamic(() => import('./kumamoto-notes-2')),
  'kumamoto-notes-3': dynamic(() => import('./kumamoto-notes-3')),
};
