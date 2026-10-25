#!/usr/bin/env bash
# 下載 ECHO Exporter 欄位說明（echo_exporter_columns.xlsx）列到的每個 EPA 資料來源的全量檔，合計約 9GB，不進 git。
# 各檔的內容、連結方式與我們廠區的覆蓋情形見 docs/echo-data-sources.md。
# 用法：scripts/download-echo-sources.sh [目錄]   （預設 ../epa-downloads，即 formosa-oversee/epa-downloads）
set -euo pipefail
DIR="${1:-$(cd "$(dirname "$0")/../.." && pwd)/epa-downloads}"
mkdir -p "$DIR/tri" "$DIR/ghgrp"
cd "$DIR"

ECHO=https://echo.epa.gov/files/echodownloads
get() {   # get <url> <檔名>：先寫 .part，完整下載後才改名；失敗重試 3 次
  [ -s "$2" ] && { echo "已有 $2"; return; }
  curl -sS --retry 3 --retry-delay 10 -o "$2.part" "$1" && mv "$2.part" "$2" && echo "完成 $2"
}

# ECHO：設施總表與欄位說明
get "$ECHO/echo_exporter.zip" echo_exporter.zip                       # 每個 FRS 廠區一列，彙整各計畫編號與近 5 年合規摘要
get "$ECHO/echo_exporter_columns.xlsx" echo_exporter_columns.xlsx
# 各計畫系統
get "$ECHO/frs_downloads.zip" frs_downloads.zip                       # FRS：廠區 ↔ 各系統編號（PROGRAM_LINKS）
get "$ECHO/ICIS-AIR_downloads.zip" ICIS-AIR_downloads.zip             # 空污（2014 起；含 AFS 遷移過來的歷史）
get "$ECHO/afs_downloads.zip" afs_downloads.zip                       # 舊空污系統 AFS（2014 停用，2019 最後一版）
get "$ECHO/npdes_downloads.zip" npdes_downloads.zip                   # 水污 ICIS-NPDES：許可證、單一事件／時程違規、處分、稽查
get "$ECHO/npdes_eff_downloads.zip" npdes_eff_downloads.zip           # 水污放流水超標（解壓約 16GB）
get "$ECHO/rcra_downloads.zip" rcra_downloads.zip                     # 有害廢棄物 RCRAInfo
get "$ECHO/SDWA_latest_downloads.zip" SDWA_latest_downloads.zip       # 飲用水 SDWIS（解壓約 5.5GB）
get "$ECHO/case_downloads.zip" case_downloads.zip                     # EPA 聯邦執法案件 ICIS FE&C
get "$ECHO/POLL_RPT_COMBINED_EMISSIONS.zip" POLL_RPT_COMBINED_EMISSIONS.zip   # TRI／GHG／NEI 逐年逐污染物排放
get "$ECHO/echoacs2023_demographics.zip" echoacs2023_demographics.zip # 廠區周邊 1／3／5 英里人口統計（ACS 2023）

# TRI 年度檔（ECHO 沒有逐筆化學物質資料）。API 對 HEAD 回 500，只能直接 GET
for y in $(seq 1987 "$(date +%Y)"); do
  get "https://data.epa.gov/efservice/downloads/tri/mv_tri_basic_download/${y}_US/csv" "tri/${y}_US.csv" || echo "略過 TRI $y（下載失敗）"
  # 還沒發布的年份會回 200 加一行 JSON 錯誤訊息，不是 CSV
  if [ -f "tri/${y}_US.csv" ] && ! head -c 7 "tri/${y}_US.csv" | grep -q '^1. YEAR'; then
    echo "略過 TRI $y（尚未發布）"; rm -f "tri/${y}_US.csv"
  fi
done
# GHGRP 溫室氣體申報彙總（逐年、逐廠，xlsx）。新年度發布後要到 https://www.epa.gov/ghgreporting/data-sets 更新網址
get "https://www.epa.gov/system/files/other-files/2024-10/2023_data_summary_spreadsheets.zip" ghgrp/2023_data_summary_spreadsheets.zip
