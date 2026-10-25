// 環境違規記錄（EPA ECHO）的顯示用字典。violations[].program 由 scripts/fetch-gcs-data.js 標：
// CWA 是原本的水污染（ICIS-NPDES），其餘來自 data/echo-programs.json（scripts/build-echo-programs.py）。

export const ECHO_PROGRAMS = {
  CWA: { label: '水污染', color: 'blue' },
  CAA: { label: '空氣污染', color: 'purple' },
  RCRA: { label: '有害廢棄物', color: 'orange' },
  FEC: { label: 'EPA 執法案件', color: 'red' },
};

export const RECORD_KINDS = {
  violation: '違規認定',
  'stack-test': '排放檢測未通過',
  informal: '非正式處分（警告、違規通知）',
  formal: '正式處分',
  case: '聯邦執法案件',
};

export const programInfo = (program) => ECHO_PROGRAMS[program] || ECHO_PROGRAMS.CWA;

export const ECHO_PROGRAMS_NOTE =
  '來自美國環保署 ECHO：水污染（Clean Water Act）、空氣污染（Clean Air Act）、有害廢棄物（RCRA）的違規認定與處分，' +
  '以及 EPA 主辦的聯邦執法案件。空污與廢棄物紀錄是同一廠區（EPA 設施登記）層級的。' +
  '處分與違規可能是同一件事的不同階段，筆數不等於違規次數；罰款金額與「罰款紀錄」分頁可能重複，不要相加。' +
  '台灣母公司取得控制以前的空污、廢棄物紀錄不列入。';
