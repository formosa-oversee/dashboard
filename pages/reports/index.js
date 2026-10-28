import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Container, SimpleGrid, Heading, Text, Flex, Button, Link as ChakraLink } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import { StrataArt, headlineLines } from '../../components/report/ReportHero';
import { R, SERIF_FONT_URL } from '../../components/report/tokens';
import { listReports, reportPath, formatMonth, publishedLabel } from '../../lib/reports';

const Meta = ({ report }) => (
  <Flex wrap="wrap" columnGap={4} rowGap={1} fontSize="13px" color={R.muted}>
    <Text>田野調查　{formatMonth(report.fieldworkAt)}</Text>
    <Text>發布　{publishedLabel(report)}</Text>
    <Text>閱讀約 {report.readingMinutes} 分鐘</Text>
  </Flex>
);

// 封面固定高度，並排的卡片下方文字才會對齊。主標跟單篇封面一樣在「：」「——」等處分行（寬螢幕）；
// 超過 24 字的長標題縮一級字、放寬到四行，才不會在手機上被截掉
const LONG_HEADLINE = 24;

const Cover = ({ report, h, headlineSize, longHeadlineSize, artH }) => {
  const long = report.headline.length > LONG_HEADLINE;
  return (
    <Flex direction="column" justify="space-between" bg={R.deep} color="#fff" h={h} flexShrink={0} position="relative" overflow="hidden">
      <Box p={{ base: 6, md: 8 }} position="relative">
        <Text fontSize="12px" fontWeight={700} letterSpacing="0.2em" color={R.onDeep}>{report.kicker}</Text>
        <Text className="cover-headline" fontFamily={R.serif} fontWeight={900} fontSize={long ? longHeadlineSize : headlineSize}
          lineHeight={1.35} mt={4} transition="transform .3s" noOfLines={long ? 4 : 3} sx={{ textWrap: 'balance' }}>
          {headlineLines(report.headline).map((part, i) => (
            <Box as="span" key={i} display={{ base: 'inline', md: 'block' }}>{part}</Box>
          ))}
        </Text>
      </Box>
      <Box h={artH}><StrataArt /></Box>
    </Flex>
  );
};

const cardHover = { textDecoration: 'none', borderColor: R.accent, '.cover-headline': { transform: 'translateY(-3px)' } };

// 專題卡：上封面、下文字。所有專題同尺寸並排，最新一篇加「最新」標籤
const ReportCard = ({ report, latest }) => (
  <Link href={reportPath(report)} legacyBehavior passHref>
    <ChakraLink display="flex" flexDirection="column" bg="#ffffff" borderWidth="1px" borderColor={R.rule} _hover={cardHover}>
      <Cover report={report} h={{ base: '250px', md: '300px' }}
        headlineSize={{ base: '1.5rem', md: '1.75rem' }} longHeadlineSize={{ base: '1.25rem', md: '1.45rem' }}
        artH={{ base: '100px', md: '120px' }} />
      <Flex direction="column" flex="1" p={{ base: 6, md: 8 }}>
        {latest && <Text fontSize="12px" fontWeight={700} letterSpacing="0.16em" color={R.accentText} mb={2}>最新專題</Text>}
        <Heading as="h2" fontFamily={R.serif} fontWeight={900} fontSize={{ base: '1.25rem', md: '1.4rem' }}
          color={R.ink} lineHeight={1.45}>
          {report.title}
        </Heading>
        <Text fontSize="15px" lineHeight={1.85} color={R.inkSoft} mt={3} flex="1" noOfLines={4}>{report.deck}</Text>
        <Box mt={5}><Meta report={report} /></Box>
        <Text mt={5} fontSize="14px" fontWeight={700} color={R.accentText}>閱讀專題 →</Text>
      </Flex>
    </ChakraLink>
  </Link>
);

export default function Reports() {
  const reports = listReports();
  const [company, setCompany] = useState('all');

  // 專題涉及兩家以上公司才出現篩選
  const companies = [...new Map(reports.flatMap(r => r.companies).map(c => [c.code, c])).values()];
  const shown = company === 'all' ? reports : reports.filter(r => r.companies.some(c => c.code === company));

  return (
    <Layout>
      <Head>
        <title>專題報導｜Formosa Oversee</title>
        <meta name="description" content="台灣企業海外據點的田野調查與深度報導：違規紀錄之外，在地社會承受的外部性。" />
        <link rel="stylesheet" href={SERIF_FONT_URL} />
      </Head>
      <Box bg={R.paper} pb={{ base: 16, md: 24 }}>
        <Box bg={R.deep} color="#fff" py={{ base: 14, md: 20 }}
          bgImage={`radial-gradient(ellipse at 85% 0%, ${R.glow}, transparent 55%)`}>
          <Container maxW="1200px">
            <Text fontSize="13px" fontWeight={700} letterSpacing="0.2em" color={R.onDeep}>FORMOSA OVERSEE</Text>
            <Heading as="h1" fontFamily={R.serif} fontWeight={900} fontSize={{ base: '2.4rem', md: '3.4rem' }} mt={4}>
              專題報導
            </Heading>
            <Text fontSize={{ base: '1rem', md: '1.15rem' }} lineHeight={1.9} color="rgba(255,255,255,0.8)" mt={5} maxW="36em">
              台灣企業海外據點的田野調查與深度報導：違規紀錄之外，在地社會承受的外部性。
            </Text>
          </Container>
        </Box>

        <Container maxW="1200px" mt={{ base: 10, md: 14 }}>
          {companies.length > 1 && (
            <Flex as="nav" aria-label="依公司篩選" wrap="wrap" gap={2} mb={8}>
              {[{ code: 'all', name: `全部（${reports.length}）` }, ...companies].map(c => (
                <Button key={c.code} size="sm" borderRadius="0" onClick={() => setCompany(c.code)}
                  variant={company === c.code ? 'solid' : 'outline'} aria-pressed={company === c.code}
                  bg={company === c.code ? R.ink : 'transparent'} color={company === c.code ? R.paper : R.ink}
                  borderColor={R.ink} _hover={{ bg: company === c.code ? R.ink : R.paperDeep }}>
                  {c.name}
                </Button>
              ))}
            </Flex>
          )}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }}>
            {shown.map(r => <ReportCard key={r.slug} report={r} latest={r.slug === reports[0].slug} />)}
          </SimpleGrid>
        </Container>
      </Box>
    </Layout>
  );
}
