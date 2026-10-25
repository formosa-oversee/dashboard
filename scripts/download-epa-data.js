const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * 使用 gcloud 或 gsutil 下載 EPA 資料
 * 這個腳本提供多種下載方式
 */

const DATA_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(DATA_DIR, 'raw-epa-facilities.csv');

/**
 * 方法 1: 使用 gsutil (如果已安裝 Google Cloud SDK)
 */
async function downloadWithGsutil() {
  try {
    console.log('🔄 嘗試使用 gsutil 下載設施資料...');
    
    // 確保已登入 Google Cloud
    try {
      await execAsync('gcloud auth list --filter="status:ACTIVE" --format="value(account)" | head -1');
      console.log('✅ Google Cloud 認證已啟用');
    } catch (authError) {
      console.log('⚠️ 請先執行: gcloud auth login');
      return false;
    }
    
    const facilitiesFile = path.join(DATA_DIR, 'facilities.csv');
    
    // 下載設施資料
    const facilitiesCommand = `gsutil cp gs://epa_echo_data/integrated_facility_matches_updated.csv ${facilitiesFile}`;
    await execAsync(facilitiesCommand);
    console.log('✅ 設施資料下載成功！');
    
    // 違規資料（violations.csv）2026-10-25 起改由 scripts/build-water-violations.py 從 EPA 全量檔重建，
    // GCS 的 comprehensive_violations_full.csv 停在 2025-08，不再下載以免蓋掉
    console.log('ℹ️ 違規資料請跑 python3 scripts/build-water-violations.py --dir=<全量檔目錄>');
    
    return true;
  } catch (error) {
    console.log('❌ gsutil 下載失敗:', error.message);
    return false;
  }
}

/**
 * 方法 2: 使用 curl 與認證
 */
async function downloadWithCurl() {
  try {
    console.log('🔄 嘗試使用 curl 下載...');
    
    // 嘗試不同的 URL 格式
    const urls = [
      'https://storage.googleapis.com/epa_echo_data/integrated_facility_matches_cleaned.csv',
      'https://storage.cloud.google.com/epa_echo_data/integrated_facility_matches_cleaned.csv'
    ];
    
    for (const url of urls) {
      try {
        console.log(`嘗試 URL: ${url}`);
        const command = `curl -L "${url}" -o "${OUTPUT_FILE}"`;
        await execAsync(command);
        
        // 檢查下載的檔案是否有效
        if (fs.existsSync(OUTPUT_FILE)) {
          const content = fs.readFileSync(OUTPUT_FILE, 'utf8').substring(0, 100);
          if (!content.includes('<?xml') && !content.includes('Error')) {
            console.log('✅ 使用 curl 下載成功！');
            return true;
          }
        }
      } catch (error) {
        console.log(`URL ${url} 失敗:`, error.message);
      }
    }
    
    return false;
  } catch (error) {
    console.log('❌ curl 下載失敗:', error.message);
    return false;
  }
}

/**
 * 主要執行函數
 */
async function main() {
  console.log('🚀 開始下載 EPA 設施資料...');
  
  // 確保資料目錄存在
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // 嘗試各種下載方法
  const success = await downloadWithGsutil() || await downloadWithCurl();
  
  if (!success) {
    console.log('⚠️ 自動下載失敗');
    process.exit(1);
  }
  
  console.log('✅ EPA 資料下載完成！');
  console.log('🔄 現在可以執行 npm run fetch-data 來處理資料');
}

// 如果直接執行此腳本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
