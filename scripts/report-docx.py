#!/usr/bin/env python3
"""
專題報導：把定稿 docx 轉成 content/reports/<slug>.js 的逐字草稿，並核對網頁有沒有漏字。

  python3 scripts/report-docx.py jsx <定稿.docx> [--out content/reports/<slug>.js]
      產生草稿：TOC、REFERENCES，以及 <Chapter>/<Section>/<P>/<Ul> 的內文。
      表格先用通用的 <DataTable>（第一列當表頭），表名要自己補，也可以換成 FactSheet／Compare 等元件。
      章節 id 一律是 ch-1、ch-2…，可以改成有意義的名字（TOC 要一起改）。
  python3 scripts/report-docx.py verify <定稿.docx> out/reports/<slug>.html
      next build 之後跑：定稿從第一章起的每一段、每個表格儲存格、每筆參考資料都要出現在匯出的 HTML。
      有漏字時 exit 1。
  python3 scripts/report-docx.py comments <定稿.docx>
      列出 Word 註解（作者、時間、標註的原文）。jsx 也會把註解印到 stderr。

docx 常帶著內部審稿註解，不要把 docx 本身放上網站。只用 Python 標準函式庫。
"""
import argparse
import html
import re
import sys
import zipfile

CHAPTER = re.compile(r'^([一二三四五六七八九十]+)、(.+)$')
SECTION = re.compile(r'^(\d+\.\d+)\s*(.+)$')
REFERENCE = re.compile(r'^\[(\d+)\]\s*(.+?)(?:\s+(https?://\S+))?$')
CITATION = re.compile(r'\[(\d+(?:\s*,\s*\d+)*)\]')
TEXT = re.compile(r'<w:t(?: [^>]*)?>([^<]*)</w:t>')


def read_part(docx, name):
    with zipfile.ZipFile(docx) as z:
        return z.read(name).decode('utf8') if name in z.namelist() else ''


def runs(paragraph_xml):
    """[(文字, 是否粗體)]"""
    out = []
    for r in re.finditer(r'<w:r[ >](.*?)</w:r>', paragraph_xml, re.S):
        body = r.group(1)
        text = html.unescape(''.join(TEXT.findall(body)))
        if not text:
            continue
        bold = bool(re.search(r'<w:b(?: w:val="(?:1|true)")?/>', body))
        out.append((text, bold))
    return out


def blocks(docx):
    """依序產生 ('p', style, 是否清單項, runs) 或 ('table', rows)"""
    body = read_part(docx, 'word/document.xml').split('<w:body>', 1)[1]
    for m in re.finditer(r'<w:tbl>.*?</w:tbl>|<w:p[ >].*?</w:p>', body, re.S):
        xml = m.group(0)
        if xml.startswith('<w:tbl>'):
            rows = []
            for row in re.findall(r'<w:tr[ >].*?</w:tr>', xml, re.S):
                cells = [''.join(t for p in re.findall(r'<w:p[ >].*?</w:p>', c, re.S) for t, _ in runs(p)).strip()
                         for c in re.findall(r'<w:tc>.*?</w:tc>', row, re.S)]
                rows.append(cells)
            yield ('table', rows)
            continue
        style = re.search(r'<w:pStyle w:val="([^"]+)"', xml)
        rs = runs(xml)
        if rs and ''.join(t for t, _ in rs).strip():
            yield ('p', style.group(1) if style else '', '<w:numPr>' in xml, rs)


def chapters_only(docx):
    """跳過封面與目次：從第一個不是「目次」的 Heading1 開始"""
    started = False
    for b in blocks(docx):
        if b[0] == 'p' and b[1] == 'Heading1':
            title = ''.join(t for t, _ in b[3]).strip()
            if title == '目次':
                continue
            started = True
        if started:
            yield b


def plain(rs):
    return ''.join(t for t, _ in rs).strip()


def comments(docx):
    com = read_part(docx, 'word/comments.xml')
    doc = read_part(docx, 'word/document.xml')
    out = []
    for m in re.finditer(r'<w:comment ([^>]*)>(.*?)</w:comment>', com, re.S):
        attrs = dict(re.findall(r'w:(\w+)="([^"]*)"', m.group(1)))
        cid = attrs.get('id')
        anchor = re.search(r'<w:commentRangeStart w:id="%s"/>(.*?)<w:commentRangeEnd w:id="%s"/>' % (cid, cid), doc, re.S)
        out.append({
            'author': attrs.get('author', ''),
            'date': attrs.get('date', ''),
            'text': html.unescape(''.join(TEXT.findall(m.group(2)))),
            'anchor': html.unescape(''.join(TEXT.findall(anchor.group(1)))) if anchor else '',
        })
    return out


# ---------- jsx ----------

def jsx_text(s):
    return s.replace('{', "{'{'}").replace('}', "{'}'}").replace('<', '&lt;').replace('>', '&gt;')


def jsx_inline(rs):
    parts, first = [], True
    for text, bold in rs:
        t = jsx_text(text)
        if bold and text.strip():
            parts.append(('<RunIn>%s</RunIn>' if first else '<Mark>%s</Mark>') % t.strip())
        else:
            parts.append(t)
        if text.strip():
            first = False
    s = ''.join(parts).strip().replace('</Mark><Mark>', '').replace('</RunIn><RunIn>', '')
    return CITATION.sub(lambda m: '<Cite ids={[%s]} />' % ', '.join(n.strip() for n in m.group(1).split(',')), s)


def js(value):
    """JS 字串字面值，跟 repo 一樣用單引號"""
    if value is None:
        return 'null'
    return "'%s'" % value.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ')


def cmd_jsx(args):
    for c in comments(args.docx):
        print('註解｜%s %s｜標在「%s」：%s' % (c['author'], c['date'], c['anchor'][:30], c['text']), file=sys.stderr)

    body, toc, refs = [], [], []
    ch_n = table_n = 0
    in_ul = in_refs = False
    chapter_open = False
    I = '      '

    def close_ul():
        nonlocal in_ul
        if in_ul:
            body.append(I + '</Ul>')
            in_ul = False

    for b in chapters_only(args.docx):
        if b[0] == 'table':
            close_ul()
            table_n += 1
            body.append(I + '<Figure label="表 %d" title="">{/* 補上表名；可換成 FactSheet／Compare／Interviewees */}' % table_n)
            body.append(I + '  <DataTable rows={[')
            for row in b[1]:
                body.append(I + '    [%s],' % ', '.join(js(c) for c in row))
            body.append(I + '  ]} />')
            body.append(I + '</Figure>')
            continue
        _, style, is_li, rs = b
        text = plain(rs)
        if style == 'Heading1':
            close_ul()
            if chapter_open:
                body.append('    </Chapter>')
            ch_n += 1
            cid = 'ch-%d' % ch_n
            m = CHAPTER.match(text)
            in_refs = '參考資料' in text or '參考文獻' in text
            if m:
                body.append('    <Chapter id="%s" num="%s" title="%s">' % (cid, m.group(1), jsx_text(m.group(2))))
                toc.append({'id': cid, 'num': m.group(1), 'label': m.group(2)})
            else:
                body.append('    <Chapter id="%s" title="%s">' % (cid, jsx_text(text)))
                if not any(t['num'] == '附' for t in toc):
                    toc.append({'id': cid, 'num': '附', 'label': '附錄'})
            if in_refs:
                body.append(I + '<References items={REFERENCES} />')
            chapter_open = True
            continue
        if style == 'Heading2':
            close_ul()
            m = SECTION.match(text)
            if m:
                body.append(I + '<Section id="s%s" num="%s" title="%s" />' % (m.group(1).replace('.', '-'), m.group(1), jsx_text(m.group(2))))
            else:
                body.append(I + '<SubHead>%s</SubHead>' % jsx_text(text))
            continue
        if style == 'Heading3':
            close_ul()
            body.append(I + '<SubHead>%s</SubHead>' % jsx_text(text))
            continue
        if in_refs:
            m = REFERENCE.match(text)
            if m:
                refs.append({'n': int(m.group(1)), 'text': m.group(2).strip(), 'url': m.group(3)})
                continue
        if is_li:
            if not in_ul:
                body.append(I + '<Ul>')
                in_ul = True
            body.append(I + '  <Li>%s</Li>' % jsx_inline(rs))
            continue
        close_ul()
        body.append(I + '<P>%s</P>' % jsx_inline(rs))
    close_ul()
    if chapter_open:
        body.append('    </Chapter>')

    out = [
        "import { Chapter, Section, SubHead, P, RunIn, Mark, Ul, Li, Cite } from '../../components/report/Prose';",
        "import { Figure, DataTable, References } from '../../components/report/Figures';",
        '',
        '/**',
        ' * 由 scripts/report-docx.py 從 %s 產生的草稿。' % args.docx.split('/')[-1],
        ' * <Chapter> 內的文字逐字取自定稿，不要改寫；圖表、引言框等網頁版加的東西，數字只能取自內文。',
        ' */',
        '',
        'export const TOC = [',
        *['  { id: %s, num: %s, label: %s },' % (js(t['id']), js(t['num']), js(t['label'])) for t in toc],
        '];',
        '',
        '// 封面下方的數字列（可刪）',
        "export const KEY_NUMBERS = { title: '數字看…', items: [] };",
        '',
        'export const REVISIONS = [',
        "  { date: '網頁版', text: '依定稿製作，內文未改寫。' },",
        '];',
        '',
        'const REFERENCES = [',
        *['  { n: %d, text: %s, url: %s },' % (r['n'], js(r['text']), js(r['url'])) for r in refs],
        '];',
        '',
        'const Article = () => (',
        '  <>',
        *body,
        '  </>',
        ');',
        '',
        'export default Article;',
        '',
    ]
    text = '\n'.join(out)
    if args.out:
        open(args.out, 'w', encoding='utf8').write(text)
        print('寫入 %s：%d 章、%d 個表格、%d 筆參考資料' % (args.out, ch_n, table_n, len(refs)), file=sys.stderr)
    else:
        sys.stdout.write(text)


# ---------- verify ----------

def cmd_verify(args):
    page = open(args.html, encoding='utf8').read()
    page = re.sub(r'<script.*?</script>|<style.*?</style>|<title>.*?</title>|<desc[^>]*>.*?</desc>', '', page, flags=re.S)
    norm = lambda s: re.sub(r'\s+', '', s)
    rendered = norm(html.unescape(re.sub(r'<[^>]+>', '', page)))

    def found(u):
        candidates = [u, re.sub(r'^\[\d+\]', '', u), CHAPTER.sub(r'\2', u)]
        candidates.append(SECTION.sub(r'\2', candidates[-1]))
        candidates.append(candidates[-1].replace('到', '→到', 1))  # 第五章那種「從 A → 到 B」排版
        if any(c and c in rendered for c in candidates):
            return True
        # 「標題：甲；乙；丙」拆成清單排版
        if '：' in u:
            items = [x for x in u.split('：', 1)[1].rstrip('。').split('；') if x]
            return len(items) > 1 and all(x in rendered for x in items)
        return False

    checked, missing = 0, []
    for b in chapters_only(args.docx):
        units = [c for row in b[1] for c in row] if b[0] == 'table' else [plain(b[3])]
        for u in units:
            u = norm(u)
            if not u:
                continue
            checked += 1
            if not found(u):
                missing.append(u)
    print('核對 %d 段／儲存格，缺 %d' % (checked, len(missing)))
    for m in missing:
        print('  缺：' + m[:80])
    sys.exit(1 if missing else 0)


def cmd_comments(args):
    cs = comments(args.docx)
    if not cs:
        print('沒有註解')
    for c in cs:
        print('%s %s｜標在「%s」\n  %s' % (c['author'], c['date'], c['anchor'][:40], c['text']))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    p = sub.add_parser('jsx'); p.add_argument('docx'); p.add_argument('--out'); p.set_defaults(fn=cmd_jsx)
    p = sub.add_parser('verify'); p.add_argument('docx'); p.add_argument('html'); p.set_defaults(fn=cmd_verify)
    p = sub.add_parser('comments'); p.add_argument('docx'); p.set_defaults(fn=cmd_comments)
    args = ap.parse_args()
    args.fn(args)


if __name__ == '__main__':
    main()
