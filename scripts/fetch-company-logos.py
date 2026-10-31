"""依 data/company-logos.json 重新下載公司 logo 到 public/logos/。

每筆的 source 是 logo 檔本身的網址（公司官網或維基百科），page 是看到它的頁面。
沒有 source 的（inline-svg 從官網 HTML 內嵌的 <svg> 取出、screenshot 是官網頁首 logo 元素的截圖）檔案直接進 git，這支腳本跳過；
原檔是 SVG 的都已轉成 PNG（外部 SVG 可能夾帶腳本），原檔格式和網站用的不同時也跳過，要手動重轉。
下載前讀 robots.txt（*、ClaudeBot、anthropic-ai、Claude-Web 都要允許），每次請求間隔 1 秒。

usage: python3 -I scripts/fetch-company-logos.py [公司代號 ...]   # 不給代號就全部重抓
"""
import json, os, subprocess, sys, time, urllib.parse, urllib.robotparser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGENTS = ['*', 'ClaudeBot', 'anthropic-ai', 'Claude-Web']
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36'


def curl(url, out=None):
    # 用 curl：部分台灣網站的憑證鏈不完整，macOS 的 curl 走系統鑰匙圈才驗得過
    cmd = ['curl', '-s', '-L', '-m', '60', '-A', UA, '-w', '%{http_code}']
    cmd += ['-o', out or '/dev/stdout', url] if out else [url]
    r = subprocess.run(cmd, capture_output=True)
    if out:
        return int(r.stdout.decode()[-3:] or 0), None
    body, code = r.stdout[:-3], int(r.stdout[-3:] or 0)
    return code, body.decode('utf-8', 'replace')


def robots_ok(url, cache):
    p = urllib.parse.urlparse(url)
    base = f'{p.scheme}://{p.netloc}'
    if base not in cache:
        code, txt = curl(base + '/robots.txt')
        rp = urllib.robotparser.RobotFileParser()
        rp.parse(txt.splitlines() if code == 200 and '<html' not in txt[:500].lower() else [])
        cache[base] = rp
    return all(cache[base].can_fetch(a, url) for a in AGENTS)


def main():
    meta = json.load(open(os.path.join(ROOT, 'data', 'company-logos.json'), encoding='utf-8'))
    want = set(sys.argv[1:])
    cache = {}
    for code, e in meta['logos'].items():
        if want and code not in want:
            continue
        if not e.get('source'):
            print(code, f'{e["method"]}，沒有獨立網址，檔案在 git，跳過')
            continue
        src_ext = urllib.parse.urlparse(e['source']).path.rsplit('.', 1)[-1].lower()
        if src_ext != e['file'].rsplit('.', 1)[-1].lower():
            # SVG 都轉成 PNG（外部 SVG 可能夾帶腳本，直接開檔會在本站網域執行），動畫 GIF 取最後一格；重抓要再轉一次，這裡不自動做
            print(code, f'原檔是 {src_ext}、網站用 {e["file"]}，需要手動轉檔，跳過')
            continue
        if not robots_ok(e['source'], cache):
            print(code, 'robots 不允許，跳過', e['source'])
            continue
        out = os.path.join(ROOT, 'public', 'logos', e['file'])
        status, _ = curl(e['source'], out + '.part')
        if status == 200 and os.path.getsize(out + '.part') > 0:
            os.replace(out + '.part', out)
            print(code, 'ok', e['file'])
        else:
            os.remove(out + '.part') if os.path.exists(out + '.part') else None
            print(code, f'下載失敗（HTTP {status}），保留舊檔', e['source'])
        time.sleep(1)


main()
