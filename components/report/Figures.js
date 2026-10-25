import { useEffect, useState } from 'react';
import {
  Box, Flex, Grid, SimpleGrid, Heading, Text, Tooltip, VisuallyHidden, Image, Link as ChakraLink,
  Table, Thead, Tbody, Tr, Th, Td
} from '@chakra-ui/react';
import { R, toneColors } from './tokens';
import { EditorNote } from './Prose';

/**
 * 專題裡的圖表與區塊。所有數字都取自報告內文，這裡只負責呈現。
 * 圖表規則（dataviz）：長條從 0 起算、≤24px 粗、末端 4px 圓角；單一數列不放圖例；
 * 強調用「一個主題色 + 其餘灰」，主題色預設品牌綠，跟水有關的圖用 tone="water"；每張圖都有螢幕閱讀器看得到的表格版本。
 */

export const Figure = ({ label, title, source, wide, children }) => (
  <Box as="figure" my={{ base: 10, md: 12 }} mx={0} mr={wide ? { xl: '-200px' } : 0}>
    {(label || title) && (
      <Box as="figcaption" mb={5} lineHeight={1.6}>
        {label && (
          <Text as="span" fontSize="13px" fontWeight={700} color={R.accentText} letterSpacing="0.1em" mr={3}>
            {label}
          </Text>
        )}
        <Text as="span" fontSize="15px" fontWeight={700} color={R.ink}>{title}</Text>
      </Box>
    )}
    {children}
    {source && <Text fontSize="12.5px" color={R.muted} mt={4} lineHeight={1.7}>{source}</Text>}
  </Box>
);

// 一列標題數字（stat tile）：數字用黑體、比例數字，不用 tabular-nums
export const StatRow = ({ items, columns, valueSize }) => (
  <SimpleGrid columns={columns || { base: 1, sm: 2, md: Math.min(items.length, 3) }} spacingX={6} spacingY={5}>
    {items.map((s, i) => (
      <Box key={i} borderTopWidth="2px" borderColor={R.ink} pt={3}>
        <Text fontFamily={R.sans} fontWeight={700} fontSize={valueSize || { base: '1.7rem', md: '1.9rem' }} lineHeight={1.25} color={R.ink}>
          {s.value}
        </Text>
        <Text fontSize="14px" color={R.inkSoft} mt={1} lineHeight={1.6}>{s.label}</Text>
        {s.note && <Text fontSize="12.5px" color={R.muted} mt={1} lineHeight={1.6}>{s.note}</Text>}
      </Box>
    ))}
  </SimpleGrid>
);

// 橫條圖。emphasis：只有 highlight 那一條上色，其餘灰；threshold：畫一條基準線（例如暫定指針值）
const LABEL_ROOM = '6.5em'; // 長條右邊留給數值標籤的空間，最長的條也不會把標籤擠出去

export const BarChart = ({ data, unit, max, threshold, emphasis, tone, labelWidth = '10em' }) => {
  const c = toneColors(tone);
  const top = max || Math.max(...data.map(d => d.value), threshold?.value || 0);
  const at = (v) => `calc((100% - ${LABEL_ROOM}) * ${v / top})`;

  return (
    <Box>
      {threshold && (
        <Grid templateColumns={{ base: '1fr', sm: `${labelWidth} 1fr` }} columnGap={4} mb={1}>
          <Box display={{ base: 'none', sm: 'block' }} />
          <Box position="relative" h="22px">
            <Flex position="absolute" left={at(threshold.value)} bottom={0} align="center" gap={1.5}
              transform="translateX(-1px)" whiteSpace="nowrap">
              <Box w="10px" h="2px" bg={R.alert} />
              <Text fontSize="12.5px" color={R.inkSoft}>{threshold.label}</Text>
            </Flex>
          </Box>
        </Grid>
      )}
      <Box aria-hidden>
        {data.map((d) => (
          <Grid key={d.label} templateColumns={{ base: '1fr', sm: `${labelWidth} 1fr` }}
            columnGap={4} rowGap={1} alignItems="center" py={{ base: 1.5, sm: 2 }}>
            <Text fontSize="14px" color={R.inkSoft} lineHeight={1.45}>{d.label}</Text>
            <Tooltip label={`${d.label}：${d.display}${unit ? ` ${unit}` : ''}`} hasArrow placement="top" openDelay={80}>
              <Flex align="center" h="30px" position="relative" tabIndex={0} borderRadius="sm"
                _focusVisible={{ outline: `2px solid ${c.mark}`, outlineOffset: '2px' }}>
                <Box h="20px" w={at(d.value)} minW="3px" borderRadius="0 4px 4px 0"
                  bg={emphasis && !d.highlight ? R.bar : c.mark} />
                <Text ml={2} fontSize="14px" fontWeight={700} color={R.ink} whiteSpace="nowrap">{d.display}</Text>
                {threshold && (
                  <Box position="absolute" left={at(threshold.value)} top="-10px" bottom="-10px" w="2px" bg={R.alert} />
                )}
              </Flex>
            </Tooltip>
          </Grid>
        ))}
        <Grid templateColumns={{ base: '1fr', sm: `${labelWidth} 1fr` }} columnGap={4}>
          <Box display={{ base: 'none', sm: 'block' }} />
          <Box borderTopWidth="1px" borderColor={R.rule} w={`calc(100% - ${LABEL_ROOM})`} />
        </Grid>
      </Box>
      <VisuallyHidden>
        <Table>
          <Thead><Tr><Th>項目</Th><Th>數值{unit ? `（${unit}）` : ''}</Th></Tr></Thead>
          <Tbody>
            {data.map(d => <Tr key={d.label}><Td>{d.label}</Td><Td>{d.display}</Td></Tr>)}
            {threshold && <Tr><Td>{threshold.label}</Td><Td>{threshold.value}</Td></Tr>}
          </Tbody>
        </Table>
      </VisuallyHidden>
    </Box>
  );
};

// 比例條：超標的處數／調查處數。紅色只用在「超標」這個意思上，文字標籤同時寫明
export const Meter = ({ value, total, unit = '處', label, note }) => (
  <Box borderTopWidth="2px" borderColor={R.ink} pt={3}>
    <Text fontWeight={700} fontSize={{ base: '1.7rem', md: '1.9rem' }} lineHeight={1.25} color={R.ink}>
      {value}
      <Text as="span" fontSize="1rem" fontWeight={400} color={R.muted}> ／ {total} {unit}</Text>
    </Text>
    <Box h="8px" bg={R.alertTint} borderRadius="4px" mt={3} overflow="hidden"
      role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={total} aria-label={label}>
      <Box h="100%" w={`${(value / total) * 100}%`} bg={R.alert} borderRadius="4px" />
    </Box>
    <Text fontSize="14px" color={R.inkSoft} mt={3} lineHeight={1.6}>{label}</Text>
    {note && <Text fontSize="12.5px" color={R.muted} mt={1}>{note}</Text>}
  </Box>
);

// 表 3：企業說法與質疑左右對照。兩欄都標明是誰說的，延續污染事件「指控和事實分開」的原則
export const Compare = ({ headers, rows, tone }) => {
  const [itemHead, claimHead, critiqueHead] = headers;
  const c = toneColors(tone);
  const cell = (side, head, text) => (
    <Box bg={side === 'claim' ? c.tint : '#ffffff'} borderLeftWidth="3px"
      borderColor={side === 'claim' ? c.mark : R.ink} px={4} py={3} h="100%">
      <Text display={{ base: 'block', md: 'none' }} fontSize="12px" fontWeight={700}
        color={side === 'claim' ? c.text : R.inkSoft} letterSpacing="0.06em" mb={1}>
        {head}
      </Text>
      <Text fontSize="15px" lineHeight={1.8} color={R.ink}>{text}</Text>
    </Box>
  );

  return (
    <Box role="table" aria-label={`${claimHead}與${critiqueHead}`}>
      <Grid role="row" display={{ base: 'none', md: 'grid' }} templateColumns="4.5em 1fr 1fr" columnGap={3} mb={2}>
        <Text role="columnheader" fontSize="12.5px" fontWeight={700} color={R.muted}>{itemHead}</Text>
        <Text role="columnheader" fontSize="13px" fontWeight={700} color={c.text}>{claimHead}</Text>
        <Text role="columnheader" fontSize="13px" fontWeight={700} color={R.inkSoft}>{critiqueHead}</Text>
      </Grid>
      {rows.map(r => (
        <Grid role="row" key={r.item} templateColumns={{ base: '1fr', md: '4.5em 1fr 1fr' }}
          columnGap={3} rowGap={2} py={3} borderTopWidth="1px" borderColor={R.rule}>
          <Text role="rowheader" fontFamily={R.serif} fontWeight={700} fontSize="1.15rem" color={R.ink} pt={{ md: 2 }}>
            {r.item}
          </Text>
          <Box role="cell">{cell('claim', claimHead, r.claim)}</Box>
          <Box role="cell">{cell('critique', critiqueHead, r.critique)}</Box>
        </Grid>
      ))}
    </Box>
  );
};

// 照片：圖說放在圖下方，逐字取自定稿（含「資料來源：…」）。wide 時在寬螢幕往右外凸
export const Photo = ({ src, alt, caption, width, height, wide }) => (
  <Box as="figure" my={{ base: 10, md: 12 }} mx={0} mr={wide ? { xl: '-200px' } : 0}>
    <Image src={src} alt={alt || caption} width={width} height={height} loading="lazy"
      w="100%" h="auto" display="block" bg={R.paperDeep} />
    {caption && (
      <Text as="figcaption" fontSize="13.5px" lineHeight={1.7} color={R.muted} mt={3} pl={3}
        borderLeftWidth="2px" borderColor={R.rule}>
        {caption}
      </Text>
    )}
  </Box>
);

// 通用表格：第一列是表頭。report-docx.py 產生的草稿預設用它，之後可換成下面更貼內容的元件。
// 窄螢幕在表格內橫向捲動，不會撐寬整頁
export const DataTable = ({ rows }) => {
  const [head, ...body] = rows;
  return (
    <Box overflowX="auto" borderTopWidth="2px" borderColor={R.ink}>
      <Box as="table" w="100%" fontSize="14.5px" lineHeight={1.75} sx={{ borderCollapse: 'collapse' }}>
        <Box as="thead">
          <Box as="tr">
            {head.map((h, i) => (
              <Box as="th" key={i} textAlign="left" fontSize="13px" fontWeight={700} color={R.inkSoft}
                px={3} py={2.5} borderBottomWidth="1px" borderColor={R.ink} minW="6em">
                {h}
              </Box>
            ))}
          </Box>
        </Box>
        <Box as="tbody">
          {body.map((row, i) => (
            <Box as="tr" key={i}>
              {row.map((cell, j) => (
                <Box as="td" key={j} px={3} py={3} verticalAlign="top" color={R.ink}
                  borderBottomWidth="1px" borderColor={R.rule} fontWeight={j === 0 ? 700 : 400}>
                  {cell}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// 表 2：小檔案（項目／內容）
export const FactSheet = ({ rows }) => (
  <Box as="dl" borderTopWidth="2px" borderColor={R.ink}>
    {rows.map(r => (
      <Grid key={r.label} templateColumns={{ base: '1fr', sm: '6em 1fr' }} columnGap={5} rowGap={1}
        py={4} borderBottomWidth="1px" borderColor={R.rule}>
        <Text as="dt" fontSize="14px" fontWeight={700} color={R.inkSoft} pt="2px">{r.label}</Text>
        <Box as="dd" m={0} fontSize="15.5px" lineHeight={1.85} color={R.ink}>
          {r.value}
          {r.note && <EditorNote>{r.note}</EditorNote>}
        </Box>
      </Grid>
    ))}
  </Box>
);

// 表 1：受訪對象
export const Interviewees = ({ headers, people }) => {
  const [groupHead, nameHead, topicHead] = headers;
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {people.map(p => (
        <Box key={p.name} bg="#ffffff" borderWidth="1px" borderColor={R.rule} borderTopWidth="3px"
          borderTopColor={R.accent} p={5}>
          <Text fontSize="12px" fontWeight={700} color={R.accentText} letterSpacing="0.08em">
            <VisuallyHidden>{groupHead}：</VisuallyHidden>{p.group}
          </Text>
          <Text fontFamily={R.serif} fontWeight={700} fontSize="1.05rem" lineHeight={1.6} color={R.ink} mt={2}>
            <VisuallyHidden>{nameHead}：</VisuallyHidden>{p.name}
          </Text>
          <Text fontSize="14px" lineHeight={1.75} color={R.inkSoft} mt={3}>
            <Text as="span" fontWeight={700} color={R.muted} mr={2}>{topicHead}</Text>
            {p.topics}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export const Timeline = ({ items }) => (
  <Box as="ol" listStyleType="none" pl={0} m={0}>
    {items.map((it, i) => (
      <Grid as="li" key={i} templateColumns={{ base: '5.6em 14px 1fr', md: '6.4em 14px 1fr' }} columnGap={3}
        position="relative">
        <Text fontSize="13.5px" fontWeight={700} color={R.accentText} pt="3px"
          sx={{ fontVariantNumeric: 'tabular-nums' }} whiteSpace="nowrap">
          {it.date}
        </Text>
        <Box position="relative">
          <Box position="absolute" left="6px" top={i === 0 ? '12px' : 0} bottom={i === items.length - 1 ? 'calc(100% - 12px)' : 0}
            w="2px" bg={R.rule} />
          <Box position="absolute" left={it.highlight ? '1px' : '3px'} top={it.highlight ? '6px' : '8px'}
            w={it.highlight ? '12px' : '8px'} h={it.highlight ? '12px' : '8px'} borderRadius="full"
            bg={it.highlight ? R.accent : R.paper} borderWidth="2px" borderColor={R.accent} />
        </Box>
        <Text fontSize="15px" lineHeight={1.75} color={R.ink} pb={4} fontWeight={it.highlight ? 700 : 400}>
          {it.text}
        </Text>
      </Grid>
    ))}
  </Box>
);

export const PullQuote = ({ cite, children }) => (
  <Box as="figure" my={{ base: 12, md: 14 }} mx={0} position="relative" pl={{ base: 0, md: 2 }}>
    <Text aria-hidden fontFamily={R.serif} fontWeight={900} fontSize="4.5rem" lineHeight={0.5}
      color={R.accentMid} position="relative" top="12px" left="-0.15em">
      「
    </Text>
    <Box as="blockquote" m={0} mt={4} fontFamily={R.serif} fontWeight={700} sx={{ textWrap: 'balance' }}
      fontSize={{ base: '1.45rem', md: '1.8rem' }} lineHeight={1.6} color={R.ink} letterSpacing="0.02em">
      {children}
    </Box>
    {cite && <Text as="figcaption" mt={4} fontSize="14px" color={R.muted}>── {cite}</Text>}
  </Box>
);

// 摘要的三個核心發現，點了跳到第五章對應的段落
export const Findings = ({ items }) => (
  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} my={10}>
    {items.map(f => (
      <ChakraLink key={f.target} href={`#${f.target}`} _hover={{ textDecoration: 'none', borderColor: R.accent }}
        display="flex" flexDirection="column" bg="#ffffff" borderWidth="1px" borderColor={R.rule}
        borderTopWidth="3px" borderTopColor={R.accent} p={5} transition="border-color .2s">
        <Text fontSize="12.5px" fontWeight={700} color={R.accentText} letterSpacing="0.1em">{f.label}</Text>
        <Text fontFamily={R.serif} fontWeight={700} fontSize="1.08rem" lineHeight={1.6} color={R.ink} mt={2} flex="1"
          sx={{ textWrap: 'balance' }}>
          {f.title}
        </Text>
        <Text fontSize="13px" color={R.muted} mt={4}>{f.more} →</Text>
      </ChakraLink>
    ))}
  </SimpleGrid>
);

// 第四章開頭：七類利害關係人的子導覽
export const StakeholderNav = ({ items }) => (
  <Box as="nav" aria-label="七類利害關係人" mb={4}>
    <Text fontSize="13px" fontWeight={700} color={R.muted} mb={3} letterSpacing="0.06em">七類利害關係人</Text>
    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
      {items.map(s => (
        <ChakraLink key={s.target} href={`#${s.target}`} display="block" px={3} py={2.5} bg="#ffffff"
          borderWidth="1px" borderColor={R.rule} _hover={{ borderColor: R.accent, textDecoration: 'none' }}>
          <Text as="span" display="block" fontSize="11.5px" fontWeight={700} color={R.accentText}>{s.num}</Text>
          <Text as="span" display="block" fontSize="14px" color={R.ink} lineHeight={1.5}>{s.label}</Text>
        </ChakraLink>
      ))}
    </SimpleGrid>
  </Box>
);

// 第五章的節標題本來就是「從 A 到 B」句型，拆成兩段排出轉變
export const Shift = ({ id, num, domain, from, to }) => (
  <Heading as="h3" id={id} scrollMarginTop={R.anchorOffset} fontFamily={R.serif} color={R.ink}
    mt={{ base: 12, md: 16 }} mb={6} lineHeight={1.4}>
    <Text as="span" display="block" fontFamily={R.sans} fontSize="0.8rem" fontWeight={700}
      letterSpacing="0.12em" color={R.accentText} mb={2}>
      {num}
    </Text>
    <Text as="span" display="block" fontSize="1.05rem" fontWeight={700} color={R.inkSoft} mb={2}>{domain}：</Text>
    <Flex as="span" wrap="wrap" align="baseline" columnGap={3} rowGap={1}>
      <Text as="span" fontWeight={600} color={R.muted} fontSize={{ base: '1.35rem', md: '1.65rem' }}>從「{from}」</Text>
      <Text as="span" aria-hidden color={R.accent} fontSize={{ base: '1.2rem', md: '1.5rem' }}>→</Text>
      <Text as="span" fontWeight={900} color={R.ink} fontSize={{ base: '1.6rem', md: '2rem' }}>到「{to}」</Text>
    </Flex>
  </Heading>
);

export const Watchlist = ({ title, items }) => (
  <Box bg={R.paperDeep} borderTopWidth="3px" borderColor={R.ink} px={{ base: 5, md: 7 }} py={6} my={10}>
    <Text fontFamily={R.serif} fontWeight={700} fontSize="1.15rem" color={R.ink} mb={4}>{title}</Text>
    <Box as="ul" listStyleType="none" pl={0} m={0}>
      {items.map(it => (
        <Flex as="li" key={it} gap={3} align="flex-start" py={2} fontSize="15.5px" lineHeight={1.7} color={R.ink}>
          <Box w="12px" h="12px" mt="7px" flexShrink={0} borderWidth="2px" borderColor={R.accent} />
          {it}
        </Flex>
      ))}
    </Box>
  </Box>
);

// 參考資料：預設收合（短清單可用 defaultOpen 直接展開）；從內文 [19] 之類的上標或 #ref-n 網址進來時自動展開
export const References = ({ items, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const openForHash = () => {
      if (!window.location.hash.startsWith('#ref-')) return;
      const details = document.getElementById('references-list');
      if (details) details.open = true;
      setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView(), 50);
    };
    openForHash();
    window.addEventListener('hashchange', openForHash);
    return () => window.removeEventListener('hashchange', openForHash);
  }, []);

  return (
    <Box as="details" id="references-list" open={defaultOpen || undefined} onToggle={e => setOpen(e.currentTarget.open)}
      sx={{ '& > summary::-webkit-details-marker': { display: 'none' } }}>
      <Box as="summary" listStyleType="none" cursor="pointer" display="inline-flex" alignItems="center" gap={2}
        px={4} py={2} borderWidth="1px" borderColor={R.ink} fontSize="14px" fontWeight={700} color={R.ink}
        _hover={{ bg: R.ink, color: R.paper }}>
        {open ? '收合參考資料' : `展開全部 ${items.length} 筆參考資料`}
        <Box as="span" aria-hidden transform={open ? 'rotate(45deg)' : 'none'} transition="transform .2s">＋</Box>
      </Box>
      <Box as="ol" listStyleType="none" pl={0} mt={5}>
        {items.map(r => (
          <Grid as="li" key={r.n} id={`ref-${r.n}`} scrollMarginTop={R.anchorOffset} templateColumns="3em 1fr"
            columnGap={2} py={2.5} borderBottomWidth="1px" borderColor={R.rule} fontSize="14px" lineHeight={1.75}>
            <Text color={R.muted} sx={{ fontVariantNumeric: 'tabular-nums' }}>[{r.n}]</Text>
            <Box color={R.inkSoft}>
              {r.text}
              {r.url && (
                <>
                  {' '}
                  <ChakraLink href={r.url} isExternal color={R.accentText} wordBreak="break-all">{r.url}</ChakraLink>
                </>
              )}
            </Box>
          </Grid>
        ))}
      </Box>
    </Box>
  );
};
