import Head from 'next/head';
import Link from 'next/link';
import { Box, Container, Grid, Heading, Text, Flex, VStack, Link as ChakraLink } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import { StrataArt } from '../../components/report/ReportHero';
import { R, SERIF_FONT_URL } from '../../components/report/tokens';
import { REPORTS, reportPath } from '../../lib/reports';

const ReportCard = ({ report }) => (
  <Link href={reportPath(report)} legacyBehavior>
    <ChakraLink display="block" bg="#ffffff" borderWidth="1px" borderColor={R.rule}
      _hover={{ textDecoration: 'none', borderColor: R.water, '.cover-headline': { transform: 'translateY(-3px)' } }}>
      <Grid templateColumns={{ base: '1fr', md: '5fr 6fr' }}>
        <Flex direction="column" justify="space-between" bg={R.deep} color="#fff" minH={{ base: '260px', md: '340px' }}
          position="relative" overflow="hidden">
          <Box p={{ base: 6, md: 8 }} position="relative">
            <Text fontSize="12px" fontWeight={700} letterSpacing="0.2em" color={R.waterMid}>{report.kicker}</Text>
            <Text className="cover-headline" fontFamily={R.serif} fontWeight={900} fontSize={{ base: '1.6rem', md: '2rem' }}
              lineHeight={1.35} mt={4} transition="transform .3s">
              {report.headline}
            </Text>
          </Box>
          <Box h={{ base: '110px', md: '140px' }}><StrataArt /></Box>
        </Flex>
        <Flex direction="column" p={{ base: 6, md: 10 }} justify="center">
          <Heading as="h2" fontFamily={R.serif} fontWeight={900} fontSize={{ base: '1.4rem', md: '1.7rem' }}
            color={R.ink} lineHeight={1.4}>
            {report.title}
          </Heading>
          <Text fontSize="16px" lineHeight={1.9} color={R.inkSoft} mt={4}>{report.deck}</Text>
          <Flex wrap="wrap" columnGap={4} rowGap={1} mt={6} fontSize="13px" color={R.muted}>
            <Text>田野調查　{report.fieldwork}</Text>
            <Text>報告　{report.published}（{report.revised}修訂）</Text>
            <Text>閱讀約 {report.readingMinutes} 分鐘</Text>
          </Flex>
          <Text mt={6} fontSize="14px" fontWeight={700} color={R.waterText}>閱讀專題 →</Text>
        </Flex>
      </Grid>
    </ChakraLink>
  </Link>
);

export default function Reports() {
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
          <VStack align="stretch" spacing={8}>
            {REPORTS.map(r => <ReportCard key={r.slug} report={r} />)}
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}
