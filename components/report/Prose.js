import { Box, Flex, Heading, Text, Link as ChakraLink, VisuallyHidden } from '@chakra-ui/react';
import { R } from './tokens';

/**
 * 專題內文的排版元件。內文逐字取自報告定稿，這裡只決定長相：
 * 章（h2）／節（h3）／小標（h4）／段落／清單／粗體／出處上標／編按。
 */

// 第一個標題之前的開場段落（專題文章用），上方留白跟章一致
export const Intro = ({ children }) => (
  <Box pt={{ base: 14, md: 20 }}>{children}</Box>
);

export const Chapter = ({ id, num, title, children }) => (
  <Box as="section" id={id} data-chapter={id} scrollMarginTop={R.anchorOffset} pt={{ base: 14, md: 20 }}>
    <Box as="header" mb={{ base: 8, md: 10 }}>
      {num && (
        // 單獨放大的「一」「二」看起來像裝飾線，前後補上「第」「章」才讀得出是章號
        <Flex aria-hidden align="baseline" gap={1.5} mb={3} color={R.accentText}>
          <Text as="span" fontSize="14px" fontWeight={700} letterSpacing="0.1em">第</Text>
          <Text as="span" fontFamily={R.serif} fontWeight={900} fontSize={{ base: '2.6rem', md: '3.2rem' }}
            lineHeight={1} color={R.accentMid}>
            {num}
          </Text>
          <Text as="span" fontSize="14px" fontWeight={700} letterSpacing="0.1em">章</Text>
        </Flex>
      )}
      <Heading as="h2" fontFamily={R.serif} fontWeight={900} color={R.ink} sx={{ textWrap: 'balance' }}
        fontSize={{ base: '1.75rem', md: '2.25rem' }} lineHeight={1.35} letterSpacing="0.02em">
        {num && <VisuallyHidden>{num}、</VisuallyHidden>}
        {title}
      </Heading>
      <Box w="56px" h="3px" bg={R.accent} mt={5} />
    </Box>
    {children}
  </Box>
);

export const Section = ({ id, num, title }) => (
  <Heading as="h3" id={id} scrollMarginTop={R.anchorOffset} fontFamily={R.serif} fontWeight={700}
    color={R.ink} fontSize={{ base: '1.3rem', md: '1.5rem' }} lineHeight={1.45} sx={{ textWrap: 'balance' }}
    mt={{ base: 12, md: 14 }} mb={6}>
    <Text as="span" display="block" fontFamily={R.sans} fontSize="0.8rem" fontWeight={700}
      letterSpacing="0.12em" color={R.accentText} mb={1}>
      {num}
    </Text>
    {title}
  </Heading>
);

export const SubHead = ({ children }) => (
  <Heading as="h4" fontFamily={R.sans} fontWeight={700} fontSize="1.05rem" color={R.inkSoft}
    mt={10} mb={4} display="flex" alignItems="center" gap={3}>
    <Box as="span" w="18px" h="2px" bg={R.accent} flexShrink={0} />
    {children}
  </Heading>
);

const bodyText = {
  fontSize: { base: '17px', md: '18px' },
  lineHeight: 1.95,
  letterSpacing: '0.02em',
  color: R.ink,
};

export const P = ({ lead, children }) => (
  <Text as="p" {...bodyText} mb="1.4em"
    {...(lead && { fontSize: { base: '19px', md: '21px' }, lineHeight: 1.85, color: R.ink })}>
    {children}
  </Text>
);

// 段首粗體（「就業與薪資。」這類）只加粗；段中強調另外加螢光筆底線
export const RunIn = ({ children }) => (
  <Text as="strong" fontWeight={700} color={R.ink}>{children}</Text>
);

export const Mark = ({ children }) => (
  <Text as="strong" fontWeight={700} color={R.ink}
    bgImage={`linear-gradient(transparent 60%, ${R.accentTint} 60%)`}
    sx={{ boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
    {children}
  </Text>
);

export const Ul = ({ children }) => (
  <Box as="ul" listStyleType="none" pl={0} mb="1.6em">{children}</Box>
);

export const Li = ({ children }) => (
  <Box as="li" {...bodyText} position="relative" pl="1.4em" mb="0.9em"
    _before={{ content: '""', position: 'absolute', left: '0.15em', top: '0.8em',
      w: '7px', h: '7px', bg: R.accent }}>
    {children}
  </Box>
);

// 報告原文的 [19,20] 出處標記：每個數字連到附錄二，點了會展開參考資料
export const Cite = ({ ids }) => (
  <Text as="sup" fontSize="0.7em" lineHeight={0} color={R.accentText} ml="1px">
    [
    {ids.map((n, i) => (
      <span key={n}>
        {i > 0 && ','}
        <ChakraLink href={`#ref-${n}`} color={R.accentText} textDecoration="underline"
          onClick={() => { const d = document.getElementById('references-list'); if (d) d.open = true; }}>
          {n}
        </ChakraLink>
      </span>
    ))}
    ]
  </Text>
);

// 網頁版加註，跟報告原文分開標示
export const EditorNote = ({ children }) => (
  <Box mt={3} pl={3} borderLeftWidth="2px" borderColor={R.accent} fontSize="13px" lineHeight={1.75} color={R.inkSoft}>
    <Text as="span" fontWeight={700} color={R.accentText} mr={2}>編按</Text>
    {children}
  </Box>
);

// 結語：深色區塊、襯線大字。內文段落沿用 <P>，在這裡改顏色字型
export const Closing = ({ children }) => (
  <Box bg={R.deep} color="#fff" px={{ base: 6, md: 10 }} py={{ base: 8, md: 12 }} mt={2}
    bgImage={`radial-gradient(ellipse at 90% 0%, ${R.glow}, transparent 60%)`}
    sx={{
      '& p': { color: 'rgba(255,255,255,0.88)', fontFamily: R.serif, fontWeight: 600,
        fontSize: { base: '18px', md: '20px' }, lineHeight: 2 },
      '& p:last-of-type': { mb: 0 },
      '& strong': { color: '#fff', fontWeight: 900, bgImage: 'none',
        borderBottom: `2px solid ${R.onDeep}` },
    }}>
    {children}
  </Box>
);
