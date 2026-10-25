import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Container, Grid, SimpleGrid, Heading, Text, Flex, Button, Link as ChakraLink } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import { StrataArt } from '../../components/report/ReportHero';
import { R, SERIF_FONT_URL } from '../../components/report/tokens';
import { listReports, reportPath, formatMonth, publishedLabel } from '../../lib/reports';

const Meta = ({ report }) => (
  <Flex wrap="wrap" columnGap={4} rowGap={1} fontSize="13px" color={R.muted}>
    <Text>田野調查　{formatMonth(report.fieldworkAt)}</Text>
    <Text>報告　{publishedLabel(report)}</Text>
    <Text>閱讀約 {report.readingMinutes} 分鐘</Text>
  </Flex>
);

const Cover = ({ report, minH, headlineSize, artH }) => (
  <Flex direction="column" justify="space-between" bg={R.deep} color="#fff" minH={minH} position="relative" overflow="hidden">
    <Box p={{ base: 6, md: 8 }} position="relative">
      <Text fontSize="12px" fontWeight={700} letterSpacing="0.2em" color={R.waterMid}>{report.kicker}</Text>
      <Text className="cover-headline" fontFamily={R.serif} fontWeight={900} fontSize={headlineSize}
        lineHeight={1.35} mt={4} transition="transform .3s">
        {report.headline}
      </Text>
    </Box>
    <Box h={artH}><StrataArt /></Box>
  </Flex>
);

const cardHover = { textDecoration: 'none', borderColor: R.water, '.cover-headline': { transform: 'translateY(-3px)' } };

// 最新一篇：左封面、右文字的大卡
const FeaturedCard = ({ report }) => (
  <Link href={reportPath(report)} legacyBehavior>
    <ChakraLink display="block" bg="#ffffff" borderWidth="1px" borderColor={R.rule} _hover={cardHover}>
      <Grid templateColumns={{ base: '1fr', md: '5fr 6fr' }}>
        <Cover report={report} minH={{ base: '260px', md: '340px' }}
          headlineSize={{ base: '1.6rem', md: '2rem' }} artH={{ base: '110px', md: '140px' }} />
        <Flex direction="column" p={{ base: 6, md: 10 }} justify="center">
          <Text fontSize="12px" fontWeight={700} letterSpacing="0.16em" color={R.waterText} mb={3}>最新專題</Text>
          <Heading as="h2" fontFamily={R.serif} fontWeight={900} fontSize={{ base: '1.4rem', md: '1.7rem' }}
            color={R.ink} lineHeight={1.4}>
            {report.title}
          </Heading>
          <Text fontSize="16px" lineHeight={1.9} color={R.inkSoft} mt={4}>{report.deck}</Text>
          <Box mt={6}><Meta report={report} /></Box>
          <Text mt={6} fontSize="14px" fontWeight={700} color={R.waterText}>閱讀專題 →</Text>
        </Flex>
      </Grid>
    </ChakraLink>
  </Link>
);

// 其餘各篇：上封面、下文字的網格卡
const ReportCard = ({ report }) => (
  <Link href={reportPath(report)} legacyBehavior>
    <ChakraLink display="flex" flexDirection="column" bg="#ffffff" borderWidth="1px" borderColor={R.rule} _hover={cardHover}>
      <Cover report={report} minH="220px" headlineSize="1.35rem" artH="90px" />
      <Flex direction="column" flex="1" p={6}>
        <Heading as="h2" fontFamily={R.serif} fontWeight={900} fontSize="1.2rem" color={R.ink} lineHeight={1.45}>
          {report.title}
        </Heading>
        <Text fontSize="14.5px" lineHeight={1.85} color={R.inkSoft} mt={3} flex="1" noOfLines={3}>{report.deck}</Text>
        <Box mt={5}><Meta report={report} /></Box>
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
  const [featured, ...rest] = shown;

  return (
    <Layout>
      <Head>
        <title>專題報導｜Formosa Oversee</title>
        <meta name="description" content="台灣企業海外據點的田野調查與深度報導：違規紀錄之外，在地社會承受的外部性。" />
        <link rel="stylesheet" href={SERIF_FONT_URL} />
      </Head>
      <Box bg={R.paper} pb={{ base: 16, md: 24 }}>
        <Box bg={R.deep} color="#fff" py={{ base: 14, md: 20 }}
          bgImage="radial-gradient(ellipse at 85% 0%, rgba(127,180,209,0.22), transparent 55%)">
          <Container maxW="1200px">
            <Text fontSize="13px" fontWeight={700} letterSpacing="0.2em" color={R.waterMid}>FORMOSA OVERSEE</Text>
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
          {featured && <FeaturedCard report={featured} />}
          {rest.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={8}>
              {rest.map(r => <ReportCard key={r.slug} report={r} />)}
            </SimpleGrid>
          )}
        </Container>
      </Box>
    </Layout>
  );
}
