import { Box, Container, Flex, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import Link from 'next/link';
import { R } from './tokens';
import { formatMonth, publishedLabel } from '../../lib/reports';

/**
 * 專題封面。沒有照片，主視覺是一張地層剖面：西（熊本市）在左、東（阿蘇）在右，
 * 中間那層亮一點的藍是地下水層，虛線往西流。純裝飾（aria-hidden），說明用的示意圖在 3.3 節。
 */

const rise = keyframes`from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; }`;
const drift = (period) => keyframes`from { stroke-dashoffset: 0; } to { stroke-dashoffset: ${period}; }`;

const SURFACE = 'M0,250 C320,248 560,236 760,214 C980,190 1160,150 1300,118 C1360,104 1410,96 1440,94';
const STRATA = [
  { d: 'M0,290 C320,288 560,276 760,254 C980,230 1160,190 1300,158 C1360,144 1410,136 1440,134', fill: '#0f3247' },
  { d: 'M0,340 C320,338 560,326 760,304 C980,280 1160,240 1300,208 C1360,194 1410,186 1440,184', fill: '#14496b' },
  { d: 'M0,400 C320,398 560,386 760,364 C980,340 1160,300 1300,268 C1360,254 1410,246 1440,244', fill: '#0b283a' },
  { d: 'M0,470 C320,468 560,456 760,434 C980,410 1160,370 1300,338 C1360,324 1410,316 1440,314', fill: '#081d2b' },
];
const FLOWS = [
  { d: 'M0,355 C320,353 560,341 760,319 C980,295 1160,255 1300,223 C1360,209 1410,201 1440,199', dash: '40 26', period: 66, dur: '5s', opacity: 0.6 },
  { d: 'M0,370 C320,368 560,356 760,334 C980,310 1160,270 1300,238 C1360,224 1410,216 1440,214', dash: '22 34', period: 56, dur: '7s', opacity: 0.4 },
  { d: 'M0,385 C320,383 560,371 760,349 C980,325 1160,285 1300,253 C1360,239 1410,231 1440,229', dash: '64 40', period: 104, dur: '9s', opacity: 0.25 },
];
// [x, 寬, 底（略埋進地表）, 高]：相連的街廓，避免看起來像長條圖
const SKYLINE = [[110, 22, 252.7, 30], [132, 18, 252.4, 52], [150, 28, 252.0, 40], [178, 16, 251.5, 78],
  [194, 24, 251.1, 56], [218, 14, 250.6, 92], [232, 26, 250.1, 48], [258, 20, 249.5, 64], [278, 30, 248.8, 36],
  [308, 18, 248.0, 58], [326, 24, 247.2, 44], [350, 16, 246.4, 30], [366, 28, 245.6, 50], [394, 20, 244.5, 26]];
const PADDIES = [[1000, 179.8], [1040, 172.8], [1080, 165.2], [1120, 157.1], [1160, 149.1], [1200, 140.5]];

const reduceMotion = { '@media (prefers-reduced-motion: reduce)': { animation: 'none' } };

export const StrataArt = () => (
  <svg viewBox="0 0 1440 440" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" aria-hidden
    style={{ display: 'block' }}>
    <path d={`${SURFACE} L1440,440 L0,440 Z`} fill="#123a50" />
    {STRATA.map(s => <path key={s.fill} d={`${s.d} L1440,440 L0,440 Z`} fill={s.fill} />)}
    {STRATA.map(s => <path key={`l-${s.fill}`} d={s.d} fill="none" stroke="rgba(127,180,209,0.16)" strokeWidth="1" />)}
    <path d={SURFACE} fill="none" stroke="rgba(226,239,246,0.55)" strokeWidth="1.5" />
    {FLOWS.map(f => (
      <Box as="path" key={f.period} d={f.d} fill="none" stroke={R.waterMid} strokeWidth="2" strokeLinecap="round"
        strokeDasharray={f.dash} opacity={f.opacity}
        sx={{ animation: `${drift(f.period)} ${f.dur} linear infinite`, ...reduceMotion }} />
    ))}
    {SKYLINE.map(([x, w, bottom, h], i) => (
      <rect key={x} x={x} y={bottom - h} width={w} height={h} fill={i % 2 ? '#1b5272' : '#174a66'} />
    ))}
    <line x1="225" y1={250.6 - 92} x2="225" y2={250.6 - 108} stroke="#1b5272" strokeWidth="2" />
    <g fill="#174a66">
      <polygon points="760,215 860,203 860,172 760,172" />
      <rect x="774" y="150" width="34" height="24" />
      <rect x="828" y="140" width="6" height="34" />
      <rect x="842" y="147" width="6" height="27" />
    </g>
    <rect x="766" y="182" width="88" height="3" fill={R.waterMid} opacity="0.6" />
    {PADDIES.map(([x, y]) => (
      <line key={x} x1={x} y1={y - 5} x2={x + 30} y2={y - 5 - (x >= 1120 ? 8 : 7)} stroke={R.waterMid}
        strokeWidth="3" opacity="0.55" />
    ))}
    <g stroke="rgba(127,180,209,0.35)" strokeWidth="1.5" strokeLinecap="round">
      {[[1250, 30], [1282, 52], [1310, 22], [1338, 60], [1366, 34], [1396, 56], [1420, 26], [1296, 84], [1356, 92]].map(([x, y]) => (
        <line key={`${x}-${y}`} x1={x} y1={y} x2={x - 6} y2={y + 16} />
      ))}
    </g>
  </svg>
);

const Reveal = ({ delay, children, ...rest }) => (
  <Box opacity={0} sx={{ animation: `${rise} .9s cubic-bezier(.2,.7,.2,1) ${delay}s forwards`,
    '@media (prefers-reduced-motion: reduce)': { animation: 'none', opacity: 1 } }} {...rest}>
    {children}
  </Box>
);

// 主標在「，」或「：」後換行（不用 lookbehind，舊版 Safari 不支援）；最長一行超過 10 字就縮一級字
const headlineLines = (headline) => headline.replace(/([，：])/g, '$1\n').split('\n');
const HEADLINE_SIZE = { base: '2.4rem', sm: '3rem', md: '4.2rem', xl: '4.8rem' };
const LONG_HEADLINE_SIZE = { base: '2rem', sm: '2.5rem', md: '3.2rem', xl: '3.6rem' };

const ReportHero = ({ report, companies }) => {
  const lines = headlineLines(report.headline);
  const longest = Math.max(...lines.map(l => l.length));
  return (
    <Box as="header" position="relative" overflow="hidden" bg={R.deep} color="#fff"
      bgImage="radial-gradient(ellipse at 78% 8%, rgba(127,180,209,0.22), transparent 55%)">
      <Container maxW="1200px" position="relative" pt={{ base: 14, md: 24 }} pb={{ base: 4, md: 2 }}>
        <Box maxW="860px">
          <Reveal delay={0.05}>
            <Flex align="center" gap={3} fontSize="13px" fontWeight={700} letterSpacing="0.2em" color={R.waterMid}>
              <Box w="28px" h="1px" bg={R.waterMid} />
              專題報導｜{report.kicker}
            </Flex>
          </Reveal>
          <Reveal delay={0.15}>
            <Text fontFamily={R.serif} fontWeight={700} fontSize={{ base: '1.1rem', md: '1.35rem' }}
              color="rgba(255,255,255,0.85)" mt={6} letterSpacing="0.04em">
              {report.title}
            </Text>
          </Reveal>
          <Reveal delay={0.25}>
            <Heading as="h1" fontFamily={R.serif} fontWeight={900} lineHeight={1.28} letterSpacing="0.02em"
              fontSize={longest > 10 ? LONG_HEADLINE_SIZE : HEADLINE_SIZE} mt={3}>
              {lines.map((part, i) => (
                <Box as="span" key={i} display={{ base: 'inline', md: 'block' }}>{part}</Box>
              ))}
            </Heading>
          </Reveal>
          <Reveal delay={0.4}>
            <Text fontSize={{ base: '1.05rem', md: '1.2rem' }} lineHeight={1.9} color="rgba(255,255,255,0.82)"
              mt={7} maxW="34em">
              {report.deck}
            </Text>
          </Reveal>
          <Reveal delay={0.5}>
            <Flex wrap="wrap" columnGap={5} rowGap={1} mt={8} fontSize="13.5px" color="rgba(255,255,255,0.7)">
              <Text>田野調查　{formatMonth(report.fieldworkAt)}</Text>
              <Text>發布　{publishedLabel(report)}</Text>
              <Text>閱讀約 {report.readingMinutes} 分鐘</Text>
            </Flex>
            <Text fontSize="13px" color="rgba(255,255,255,0.6)" mt={2}>執行單位：{report.org}</Text>
            {companies.length > 0 && (
              <Flex wrap="wrap" gap={2} mt={6}>
                {companies.map(c => (
                  <Link key={c.id} href={`/companies/${c.id}`} legacyBehavior>
                    <ChakraLink display="inline-flex" alignItems="center" gap={2} px={4} py={2}
                      borderWidth="1px" borderColor="rgba(255,255,255,0.35)" fontSize="14px"
                      _hover={{ bg: 'rgba(255,255,255,0.1)', textDecoration: 'none' }}>
                      相關企業　{c.name}（{c.code}）<span aria-hidden>→</span>
                    </ChakraLink>
                  </Link>
                ))}
              </Flex>
            )}
          </Reveal>
        </Box>
      </Container>
      <Box h={{ base: '170px', md: '260px', xl: '300px' }} mt={2}>
        <StrataArt />
      </Box>
    </Box>
  );
};

export default ReportHero;
