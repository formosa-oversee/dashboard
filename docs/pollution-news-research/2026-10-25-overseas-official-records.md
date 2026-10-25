# 海外官方資料庫比對：韓國 env-info.kr、印尼 PROPER（2026-10-25）

spec 第 7 節「其他公司」O1–O4 的查證紀錄。資料管線、原始檔與比對結果在 repo 外的 `formosa-oversee/overseas-enforcement/`（`map_kr/`、`id_kppu/`），那裡的資料授權多半未確認，所以只把個別紀錄寫成事件、附原始連結，不把整份資料集放進這個公開 repo。

## 怎麼找到的

- 台資子公司名單：`data/overseas-footprint.csv` 依國家去重（韓國 123 家、印尼 160 家）。
- 韓國：env-info.kr 2021–2025 全庫索引 16,662 筆（空白搜尋分頁列出，與各年度總數相符），用子公司韓文名、英文名、別名比對；韓文名與事業者登錄號來自 bizno.net，再用 env-info 明細頁的地址、產品、代表人確認。
- 印尼：PROPER 2014–15、2016–17、2018–19、2022–23（含兩次更正）、2023–24 結果 SK，共 18,871 列，正規化全名比對；華新兩家用人工對照（見 `2026-10-21-walsin-structure.md` A6）。
- 只收「高」信心、而且持股鏈能用財報或 MOPS 確認的命中。

## O1–O3：韓國 env-info.kr

env-info.kr 是韓國依《環境技術及環境產業支援法》的環境資訊公開制度平台，由環境部與韓國環境產業技術院（KEITI）營運，企業每年申報。違規欄是企業自己填的，所以來源 kind 用 `company`（spec 第 3 節第 5 條，與 W6 山東披露系統同樣處理）。

明細頁是 GET 網址，不需登入或 session，可以直接開：
`https://www.env-info.kr/user/register/viewUserSearch2.do?YEAR=<年度>&COMP_ID=<企業編號>&OPEN_YN=Y`

| 企業 | COMP_ID | 年度 | 「환경관련 법규 위반」欄 |
|---|---|---|---|
| 에이에스이코리아（ASE Korea，경기 파주시 산업단지길 76，207-81-00390） | 00000000000000149233 | 2021 | 2021.05.13 대기배출시설 운영일지(SEMS) 미작성，과태료 납부 |
| | | 2022 | 空白 |
| | | 2023 | 2023.03.17 경기도청，대기환경보전법 제40조 방지시설 관리 위반，(경고)개선 명령；2023.03.22 경기도청，제23조 배출시설 신고 미이행（특정 유해물질 변경신고），(경고)개선 명령 |
| | | 2024、2025 | 「-」 |
| 엠이엠씨코리아(주)（MEMC Korea，충남 천안시 서북구 성거읍 망향로 854，312-81-10958） | 00000000000000149873 | 2023 | 2023.10.13 충청남도청，대기환경보전법 제23조 제2항 변경신고 미이행，제84조 행정처분(과태료)，변경신고 이행 완료 |
| | | 2022、2024、2025 | 「-」 |

- 2024、2025 年度明細頁 2026-10-25 重抓，兩家都沒有違規。
- 申報沒有金額欄；2021 年度格式沒有處分機關與法條欄。
- 過去夥伴 Excel 判定韓國「無違規紀錄」，這兩家是這次比對才找到的。
- 授權：只引用事實、自己寫摘要並附原始連結，沒有轉載資料集。韓國著作權法第 7 條、第 24 條之 2 對公共著作物另有自由利用規定，但企業申報內容不一定屬於公共著作物，所以不轉載原文表格。

### 持股

- ASE Korea → 日月光投控 3711：MOPS 2025Q2 子公司表，A.S.E. Holding 持有 ASE Investment (Labuan) 70.1%、ASE Test 持有 29.9%（ASE Test 由 A.S.E. Holding 10.2%、J&R Holding 89.8% 持有，兩者都是日月光半導體 100% 子公司），Labuan 持有 ASE (Korea) 100%，有效 100%。日月光集團 1999 年向 Motorola 買下坡州廠設立 ASE Korea（ASE 官網沿革、The Register 1999-07-01〈Motorola to spin off two factories〉）。`controlSince` 1999。
- MEMC Korea → 環球晶 6488（GWBV 100%，有效 100%）、中美晶 5483（持有環球晶 46.64%，MOPS 2025Q2；2026 年媒體稱約 47%）。環球晶 2016-12-02 完成收購 SunEdison Semiconductor。`controlSince` 2016。兩家都過 20%，都掛。

## O4：印尼 PROPER，PT Patec Presisi Engineering

| 年度 | SK | 簽署日 | 頁／編號 | 評等 |
|---|---|---|---|---|
| 2022–23 | SK.1353/MENLHK/SETJEN/KUM.1/12/2023 | 2023-12-15 | 第 123 頁第 263 號 | MERAH |
| 2022–23 第一次更正 | SK.1377/MENLHK/SETJEN/KUM.1/12/2023 | 2023-12-29 | 第 36 頁第 263 號 | MERAH（未改） |
| 2022–23 第二次更正 | 546 Tahun 2024 | 2024-05-13 | 第 141 頁第 230 號 | MERAH（未改；現行結果） |
| 2023–24 | 129 Tahun 2025 | 2025-02-18（第 3–5 頁是掃描影像，OCR 取得） | 第 154 頁第 554 號 | MERAH |

- 兩份更正 SK 的考量都引 Permen LHK 1/2021 第 47 條：對紅色與暫緩者輔導後重新評估，合規才改藍（第 47 條第 4 項）。Patec 兩次更正都仍列紅色。
- 紅色的定義：Permen LHK 1/2021 第 33 條第 2 項 b 款，「upaya pengelolaan lingkungan hidupnya dilakukan tidak sesuai dengan ketentuan peraturan perundang-undangan」。原文取自 JDIH Kemenko Infrastruktur 的鏡像（ppkl.menlhk.go.id 原連結的網域已無法解析）：https://jdih.kemenkoinfra.go.id/dokumen/file/permen-lhk/peraturan-menteri-lingkungan-hidup-dan-kehutanan-nomor-1-tahun-2021-tentang-program-penilaian-peringkat-kinerja-perusahaan-dalam-pengelolaan-lingkungan-hidup.pdf
- 其他年度（決策 26 要列出對它有利的官方紀錄）：2014–15（SK.557，OCR）、2016–17（SK.696）、2018–19（SK.1049）的名單全文搜尋都沒有 Patec；SK.269（2018–19 更正）是純掃描未 OCR。2019–20 到 2021–22 的結果 SK 官網沒有；2024–25（SK.1581/2026）官網沒有可下載的主名單。所以查不到其他年度的評等，摘要照實寫。
- 評等期：PROPER 年度是 7 月到隔年 6 月，事件期間寫 2022-07 – 2024-06。
- SK.129/2025 的網址是 KLH NAS 的下載連結（`nas-proper.kemenlh.go.id/share.cgi?...`），proper.kemenlh.go.id 沒有另外的固定網址。

### 持股

- 百達-KY 2236 → PATEC PTE. LTD. 100% → Press Automation Technology Pte. Ltd.（PAT）100% → PT. Patec Presisi Engineering 100%（MOPS 2025Q1 子公司表）。
- 百達 2023Q2 合併財報附註：111 年（2022）1 月 PAT 向印尼股東買下 30%，持股由 70% 增為 100%（https://patec-intl.com/files/PATEC2023Q2.pdf）。
- 百達 2021 年報沿革：2006 年投資 PT. Patec Presisi Engineering；附錄子公司資料：1997 年 8 月設立，Jl. Angsana Raya Blok L3-01, Delta Silicon Industrial Park, Lippo Cikarang, Bekasi，與 PROPER 的 Kab. Bekasi 一致（http://patec-intl.com/files/PATECAnnualReport2021.pdf）。
- `controlSince` 2006，早於 2022-07 評等期起點。

## 封存

7 個原始網址 2026-10-25 用 Wayback Save Page Now 送出，封存網址寫在 `data/news-events.json` 各來源的 `archiveUrl`；沒有拿到快照的留 `null` 並在 `note` 說明。
