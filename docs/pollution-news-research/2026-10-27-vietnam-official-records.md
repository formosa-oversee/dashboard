# 越南省級處分決定書：建大越南（2026-10-27）

spec 第 7 節「其他公司」O5、O6 的查證紀錄，以及兩筆待補來源的越南案件。資料管線、名稱對照與原始檔在 repo 外的 `formosa-oversee/overseas-enforcement/`（`map_vn/`、`vn_reverse/`），這裡只記個別事件的依據。

## 怎麼找到的

- 2026-10-25 第二輪越南名稱對照時，在越南媒體找到建大越南 2020、2024 與光寶越南 2026 的罰款報導，每筆都只有一家媒體，未達第 3 節門檻。
- 2026-10-27 改找官方文件：同奈省入口網 dongnai.gov.vn 的「Khen thưởng - Xử phạt」>「Xử phạt」分類，公告省人民委員會主席簽發的行政處罰決定，每篇附決定書 PDF，現存公告從 2024 年起。2025-07 平福省併入同奈省，入口網沿用平福的系統，所以檔案路徑是 `uploads/binhphuoc/`；兩份決定書的抬頭都是「ỦY BAN NHÂN DÂN TỈNH ĐỒNG NAI」，受罰地址都在江田工業區。
- 2024 年的報導（Tạp chí Điện tử Thanh tra 2024-11-20）寫的是 2.1 億越南盾的處分，查到原件是 2024-05-09 的 1335/QĐ-XPHC；同一分類另有 2025-07-04 的 296/QĐ-XPHC，是原本不知道的第二筆。
- 兩份 PDF 是省人委會電子簽章的副本（「SAO Y」），掃描件，決定書號碼與日期是手寫；用 tesseract（vie）OCR 後逐頁看影像核對。

## 受罰法人與持股

- 決定書：Công ty Cao su Kenda (Việt Nam)，一人有限公司，稅號（企業代碼）3600248720，總公司 Hố Nai 工業區，工廠在 Giang Điền 工業區（同奈省），2007 年首次登記。
- 越南國家工商登記：bocaodientu.dkkd.gov.vn（財政部）的公開查詢，2026-10-27 用「CAO SU KENDA」查到 CÔNG TY CAO SU KENDA (VIỆT NAM)，英文名 KENDA RUBBER (VIETNAM) CO., LTD.，稅號 3600248720，另有 Giang Điền 工業區的營業地點。同省沒有其他 Kenda 法人（Nghệ An 的 Kenda Mai Oanh 是另一家公司）。先前從第三方網站得到的稅號 3601453994 在登記系統查無，不用。
- MOPS 114 年第 2 季（2025Q2）建大子公司表：本公司直接持有「建大橡膠（越南）有限公司」100%，業務為車輛用內外胎之生產及銷售。名稱、業務、地點都對得上，歸屬 2106，effectivePct 100。
- `controlSince` 取 2007（決定書記載的首次登記年），早於兩個事件；實際投資可能更早。
- 決定書載有法定代表人姓名，事件與這份紀錄都不寫。

## O5：1335/QĐ-XPHC（2024-05-09）

- 簽發：同奈省人民委員會主席。依據：工業區管理委員會 2024-04-09 違規筆錄 02/BB-VPHC、2024-04-12 建議書，公司 2024-04-12 曾提書面說明。
- 行為 1：鍋爐燒 FO 重油並加裝廢氣處理系統，但 2022-11-21 核准的環評（378/QĐ-KCNĐN）登記燃料是 DO 柴油，屬未依環評核准內容執行；第 45/2022/NĐ-CP 第 10 條第 1 項 d 點，0.7 億越南盾。
- 行為 2：輪胎廠（年產 1,650 萬條）多項製程與廢棄物處理設施未依核准環評施作；同條 g 點，1.4 億越南盾。
- 合計 2.1 億越南盾。加重、減輕情節皆無；無附加處分、無補救措施。
- 來源：決定書 PDF、公告頁（2024-05-10 刊登）、Tạp chí Điện tử Thanh tra 2024-11-20 報導（同日另有 moitruong.net.vn、thiennhienmoitruong.vn 內容相近的報導，未收）。

## O6：296/QĐ-XPHC（2025-07-04）

- 簽發：同奈省人民委員會主席（合併後）。依據：2025-06-23 違規筆錄 69/BB-VPHC、工業區管理委員會 2025-06-24 建議書。
- 行為：環評 2018-10-16 核准（232/QĐ-KCNĐN），2019 年投產，但一直沒有取得環保設施完工確認書；依 2020 年環保法第 42 條第 2 項 d 點與第 45/2022/NĐ-CP 第 46 條第 3 項，完工確認書視同環境許可證，所以以「無環境許可證」論處。
- 第 45/2022/NĐ-CP 第 14 條第 3 項 c 點，議定罰額以個人計 1.6 億，依第 6 條第 2 項對組織加倍：3.2 億越南盾。
- 決定書寫明不加處停止排放源：公司已取得環境許可證 33/GPMT-KCNĐN（2024-04-22，2025-04-04 換發 32/GPMT-KCNĐN），工業區管理委員會 2025-02-18 已通知廢棄物處理設施試運轉完成，且停業會影響 1,600 多名員工；廠址符合工業區規劃，不要求遷廠。
- 這與 2020 年待補案（下節）的「未取得完工確認書就運轉」是同一個問題的延續，摘要沒有提 2020 年案，因為它還沒有達到門檻。

## 待補來源

| 案件 | 現有來源 | 缺什麼 |
|---|---|---|
| 建大越南 2020-12-11，同奈省人委會 4708/QĐ-XPVPHC，3.6 億越南盾（未取得環保設施完工確認書就運轉、硫化車間沒有廢氣處理、擅改煉膠車間廢氣處理技術） | Báo Thanh tra 2020-11-21、12-18、12-25 三篇（同一家） | 決定書原件或第二家獨立媒體。dongnai.gov.vn「Xử phạt」分類只回溯到 2024 年，舊入口網的 Wayback 封存還在找。 |
| 光寶越南 2026-04-22，海防市農業與環境廳，3.2 億越南盾＋停止無許可排放源 4.5 個月（未取得環境許可證就運轉） | VietnamFinance 2026-04-27（kinhdoanhnet 是轉載；nongnghiepmoitruong d757974 經查是別家公司） | 海防市的決定書或第二家獨立媒體。haiphong.gov.vn 從台灣連線逾時。受罰法人已用國家工商登記確認：CÔNG TY TNHH LITE ON VIỆT NAM＝LITE-ON VIETNAM CO., LTD.，稅號 0201315592，海防 VSIP，與 MOPS 上 2301 直接 100% 的子公司同名。 |

## 沒查到的

- 公司年報「環保支出資訊」與永續報告書：光寶官網的 PDF 都在 robots.txt 禁止的 `/upload/media/` 下，建大官網回 500，doc.twse.com.tw 的 robots.txt 禁止所有爬取，都沒有讀。

## 封存

| 網址 | 封存 |
|---|---|
| https://dongnai.gov.vn/uploads/binhphuoc/news/2024/05/2024qd1335.pdf | https://web.archive.org/web/20261027023128/https://dongnai.gov.vn/uploads/binhphuoc/news/2024/05/2024qd1335.pdf |
| https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-ve-viec-xu-phat-vi-pham-hanh-chinh-doi-voi-cong-ty-cao-su-kenda-viet-nam-43568.html | https://web.archive.org/web/20261027023052/https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-ve-viec-xu-phat-vi-pham-hanh-chinh-doi-voi-cong-ty-cao-su-kenda-viet-nam-43568.html |
| https://dongnai.gov.vn/uploads/binhphuoc/news/2025/07/296_qd_qdub_2025.pdf | https://web.archive.org/web/20261027023233/https://dongnai.gov.vn/uploads/binhphuoc/news/2025/07/296_qd_qdub_2025.pdf |
| https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-trong-linh-vuc-moi-truong-doi-voi-cong-ty-cao-su-kenda-viet-nam-54210.html | https://web.archive.org/web/20261027023155/https://dongnai.gov.vn/vi/news/Xu-phat/quyet-dinh-xu-phat-vi-pham-hanh-chinh-trong-linh-vuc-moi-truong-doi-voi-cong-ty-cao-su-kenda-viet-nam-54210.html |
| https://thanhtravietnam.vn/xa-hoi/xu-phat-cong-ty-cao-su-kenda-viet-nam-210-trieu-dong-211402.html | http://web.archive.org/web/20241126202418/https://thanhtravietnam.vn/xa-hoi/xu-phat-cong-ty-cao-su-kenda-viet-nam-210-trieu-dong-211402.html |
