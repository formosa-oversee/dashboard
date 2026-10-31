# Formosa Oversee - 台資企業海外永續資訊揭露平台

Formosa Oversee 整理台灣上市公司海外據點的環境紀錄：污染事件、罰款紀錄，以及美國 EPA 的違規與執法資料，讓公眾可以查詢、比較。網站：https://formosaoversee.com 。本專案是用 Next.js 14 與 Chakra UI 建構的靜態網站。

## 功能

- **企業列表**：可依污染事件或罰款紀錄排序，搜尋公司名稱、產業或地區
- **公司頁**：美國 EPA 廠區與違規紀錄、污染事件、罰款紀錄
- **污染地圖**：EPA 廠區與海外污染事件的位置
- **專題報導**

## 資料來源

- 美國環保署 EPA ECHO：水污染、空污、有害廢棄物違規與聯邦執法案件
- 污染事件：各國主管機關與法院的公開文件、公司自行揭露的文件與媒體報導，收錄規則見 [`docs/pollution-news-spec.md`](docs/pollution-news-spec.md)
- 罰款紀錄：Violation Tracker（Good Jobs First），經同意非營利使用
- 持股與公司基本資料：公開資訊觀測站（MOPS）

資料在 build 時轉成 `data/epa-data.json`，前端不打 API。管線說明見 [`CLAUDE.md`](CLAUDE.md)。

## 技術棧

- **前端框架**: Next.js 14（靜態匯出，部署在 GitHub Pages）
- **UI 庫**: Chakra UI
- **圖標**: React Icons

## 開始使用

### 安裝

1. 克隆此專案
   ```
   git clone https://github.com/formosa-oversee/dashboard.git
   cd dashboard
   ```

2. 安裝依賴
   ```
   npm install
   ```

3. 啟動開發服務器
   ```
   npm run dev
   ```

4. 在瀏覽器中訪問 [http://localhost:3000](http://localhost:3000)

## 專案結構

- `/pages`: 網站頁面 (首頁、企業列表、企業詳情)
- `/components`: 可重用組件
- `/lib`: 工具函數、API 接口和主題設置
- `/styles`: 全局樣式
- `/public`: 靜態文件

## 貢獻

歡迎對本專案進行貢獻！請隨時提交 Issue 或 Pull Request。

## 許可證

MIT 許可證 