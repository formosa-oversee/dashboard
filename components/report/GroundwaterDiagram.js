import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { R } from './tokens';

/**
 * 熊本地下水系統示意圖（報告 3.3、4.4 節）。西在左、東在右。
 * 標籤放在 SVG 外面的圖例：手機上 SVG 會縮到一半寬，SVG 內的小字讀不到。
 * 地表曲線上的座標（水田、廠區、井）是照曲線算出來的，改曲線要一起改。
 */

const flow = keyframes`from { stroke-dashoffset: 48; } to { stroke-dashoffset: 0; }`;

const SURFACE = 'M0,190 C120,188 220,182 300,172 C390,160 470,138 540,108 C580,92 615,78 640,72';
const AQUIFER = 'M0,224 C120,222 220,216 300,206 C390,194 470,172 540,142 C580,126 615,112 640,106 '
  + 'L640,168 C615,174 580,188 540,204 C470,234 390,256 300,268 C220,278 120,284 0,286 Z';
const FLOW = 'M630,140 C600,150 575,159 540,173 C470,203 390,225 300,237 C230,246 140,252 34,254';

const PADDIES = [[436, 144.4, 454, 139.2], [458, 138.0, 476, 132.2], [480, 130.9, 498, 124.5], [502, 123.1, 520, 116.3]];
// [x, 寬, 底（略埋進地表）, 高]：寬窄不一、彼此相連，才讀得出是街廓而不是長條圖
const BUILDINGS = [[30, 16, 191.2, 24], [46, 14, 190.8, 38], [60, 20, 190.3, 30], [80, 14, 189.7, 52],
  [94, 18, 189.1, 40], [112, 12, 188.5, 60], [124, 20, 187.7, 34], [144, 16, 186.7, 46], [160, 18, 185.8, 28],
  [178, 14, 184.7, 36], [192, 18, 183.6, 22]];

const LEGEND = [
  { n: 1, title: '阿蘇火山地質', text: '熊本地下水系統的根基' },
  { n: 2, title: '白川中流域水田', text: '稻田如同天然蓄水池，農業灌溉長期替都市補注地下水' },
  { n: 3, title: '菊陽町 JASM 廠區', text: '公民團體指出，廠區位於居民聚落與水源的上游側' },
  { n: 4, title: '熊本都市圈', text: '約百萬人口的民生用水，幾乎 100% 來自地下水' },
];

const Marker = ({ x, y, n }) => (
  <g>
    <circle cx={x} cy={y} r="13" fill={R.ink} stroke={R.paper} strokeWidth="2" />
    <text x={x} y={y} dy="0.36em" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700"
      fontFamily="Noto Sans TC, sans-serif">{n}</text>
  </g>
);

const GroundwaterDiagram = () => (
  <Box>
    <Box bg="#ffffff" borderWidth="1px" borderColor={R.rule} px={{ base: 1, md: 3 }} pt={3}>
      <svg viewBox="0 0 640 300" width="100%" role="img" aria-labelledby="gw-title gw-desc" style={{ display: 'block' }}>
        <title id="gw-title">熊本地下水系統示意圖</title>
        <desc id="gw-desc">
          由東到西：阿蘇火山地質、白川中流域水田涵養地下水、菊陽町 JASM 廠區、熊本都市圈；地下水由東往西流向都市，都市居民以井取用地下水。
        </desc>
        <defs>
          <marker id="gw-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={R.water} />
          </marker>
          <marker id="gw-arrow-ink" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={R.inkSoft} />
          </marker>
          <linearGradient id="gw-aquifer" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#d2e6f0" />
            <stop offset="1" stopColor={R.waterTint} />
          </linearGradient>
        </defs>

        <text x="8" y="18" fontSize="12" fill={R.muted} fontFamily="Noto Sans TC, sans-serif">西</text>
        <text x="632" y="18" fontSize="12" fill={R.muted} textAnchor="end" fontFamily="Noto Sans TC, sans-serif">東</text>

        <path d={`${SURFACE} L640,300 L0,300 Z`} fill="#eee8da" />
        <path d={AQUIFER} fill="url(#gw-aquifer)" />
        <path d={SURFACE} fill="none" stroke={R.ink} strokeWidth="1.5" />

        <text x="205" y="271" fontSize="12" fill={R.waterText} fontFamily="Noto Sans TC, sans-serif">地下水層</text>
        <text x="262" y="232" fontSize="12" fill={R.waterText} textAnchor="middle" fontFamily="Noto Sans TC, sans-serif">地下水流向</text>
        <Box as="path" d={FLOW} fill="none" stroke={R.water} strokeWidth="2.5" strokeDasharray="16 8"
          strokeLinecap="round" markerEnd="url(#gw-arrow)"
          sx={{ animation: `${flow} 2.4s linear infinite`, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }} />

        {/* ① 阿蘇：雨 */}
        <g stroke={R.waterMid} strokeWidth="1.5" strokeLinecap="round">
          {[[556, 34], [570, 46], [584, 30], [596, 50], [566, 62], [588, 66]].map(([x, y]) => (
            <line key={`${x}-${y}`} x1={x} y1={y} x2={x - 4} y2={y + 11} />
          ))}
        </g>
        <Marker x={616} y={44} n={1} />

        {/* ② 水田湛水，往下補注 */}
        {PADDIES.map(([x0, y0, x1, y1]) => (
          <g key={x0}>
            <polygon points={`${x0},${y0 - 1} ${x1},${y1 - 1} ${x1},${y1 - 6} ${x0},${y0 - 6}`} fill={R.paddy} />
            <line x1={x0} y1={y0 - 6.5} x2={x1} y2={y1 - 6.5} stroke={R.waterMid} strokeWidth="1.5" />
          </g>
        ))}
        <path d="M452,149 L452,176" stroke={R.water} strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#gw-arrow)" />
        <path d="M492,134 L492,163" stroke={R.water} strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#gw-arrow)" />
        <Marker x={478} y={104} n={2} />

        {/* ③ JASM 廠區與取水井 */}
        <g fill={R.ink}>
          <polygon points="342,166.5 386,157.5 386,138 342,138" />
          <rect x="350" y="124" width="16" height="16" />
          <rect x="372" y="122" width="4" height="18" />
          <rect x="379" y="127" width="4" height="13" />
        </g>
        <rect x="346" y="145" width="36" height="3" fill={R.waterMid} />
        <path d="M364,225 L364,172" stroke={R.inkSoft} strokeWidth="1.5" markerEnd="url(#gw-arrow-ink)" />
        <Marker x={364} y={102} n={3} />

        {/* ④ 熊本都市圈與取水井 */}
        {BUILDINGS.map(([x, w, bottom, h], i) => (
          <rect key={x} x={x} y={bottom - h} width={w} height={h} fill={i % 2 ? '#56646e' : R.inkSoft} />
        ))}
        <line x1="118" y1={188.5 - 60} x2="118" y2={188.5 - 70} stroke={R.inkSoft} strokeWidth="1.5" />
        <path d="M60,251 L60,197" stroke={R.inkSoft} strokeWidth="1.5" markerEnd="url(#gw-arrow-ink)" />
        <path d="M150,248 L150,192" stroke={R.inkSoft} strokeWidth="1.5" markerEnd="url(#gw-arrow-ink)" />
        <Marker x={112} y={126} n={4} />
      </svg>
    </Box>
    <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={6} spacingY={3} mt={5}>
      {LEGEND.map(l => (
        <Flex key={l.n} gap={3} align="flex-start">
          <Flex flexShrink={0} w="22px" h="22px" borderRadius="full" bg={R.ink} color="#fff" fontSize="12px"
            fontWeight={700} align="center" justify="center" mt="1px">
            {l.n}
          </Flex>
          <Text fontSize="14px" lineHeight={1.7} color={R.inkSoft}>
            <Text as="span" fontWeight={700} color={R.ink}>{l.title}</Text>　{l.text}
          </Text>
        </Flex>
      ))}
    </SimpleGrid>
  </Box>
);

export default GroundwaterDiagram;
