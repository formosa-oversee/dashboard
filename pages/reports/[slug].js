import { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Container, Grid, GridItem, Heading, Text, SimpleGrid, Link as ChakraLink } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import ReportHero from '../../components/report/ReportHero';
import { ReportToc, MobileToc, useReadingState } from '../../components/report/ReportToc';
import { StatRow } from '../../components/report/Figures';
import { R, SERIF_FONT_URL } from '../../components/report/tokens';
import { ARTICLES } from '../../content/reports';
import { REPORTS, getReport, getSiblingReports, reportPath } from '../../lib/reports';
import { getReportRelations } from '../../lib/reports-server';

// 桌機三欄：左目次、中內文（約 40 字一行）、右邊留白給 wide 圖表外凸
const COLUMNS = { base: 'minmax(0, 1fr)', lg: '200px minmax(0, 680px) minmax(0, 1fr)' };

const KeyNumbers = ({ title, items }) => (
  <Box borderBottomWidth="1px" borderColor={R.rule}>
    <Container maxW="1200px" py={{ base: 8, md: 10 }}>
      <Text fontSize="12px" fontWeight={700} letterSpacing="0.2em" color={R.muted} mb={5}>{title}</Text>
      <StatRow items={items} columns={{ base: 2, md: 3, xl: 5 }}
        valueSize={{ base: '1.3rem', md: '1.6rem' }} />
    </Container>
  </Box>
);

const RelatedCard = ({ href, label, title, text }) => (
  <Link href={href} legacyBehavior>
    <ChakraLink display="block" bg="#ffffff" borderWidth="1px" borderColor={R.rule} p={5}
      _hover={{ borderColor: R.water, textDecoration: 'none' }}>
      <Text fontSize="12px" fontWeight={700} letterSpacing="0.1em" color={R.waterText}>{label}</Text>
      <Text fontFamily={R.serif} fontWeight={700} fontSize="1.05rem" lineHeight={1.6} color={R.ink} mt={2}>{title}</Text>
      {text && <Text fontSize="13.5px" color={R.inkSoft} mt={2} lineHeight={1.7}>{text}</Text>}
    </ChakraLink>
  </Link>
);

const ReportEnd = ({ report, relations, revisions }) => {
  const siblings = getSiblingReports(report);
  return (
    <Box bg={R.paperDeep} borderTopWidth="1px" borderColor={R.rule}>
      <Container maxW="1200px" py={{ base: 12, md: 16 }}>
        <Grid templateColumns={COLUMNS} columnGap={{ lg: 16 }}>
          <Box display={{ base: 'none', lg: 'block' }} />
          <Box>
            {(siblings.length > 0 || relations.companies.length > 0 || relations.events.length > 0) && (
              <>
                <Heading as="h2" fontFamily={R.serif} fontWeight={900} fontSize="1.5rem" color={R.ink} mb={6}>延伸閱讀</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={12}>
                  {siblings.map(r => (
                    <RelatedCard key={r.slug} href={reportPath(r)} label={`專題報導｜${r.kicker}`}
                      title={r.headline} text={`${r.title}・閱讀約 ${r.readingMinutes} 分鐘`} />
                  ))}
                  {relations.companies.map(c => (
                    <RelatedCard key={c.id} href={`/companies/${c.id}`} label="公司頁"
                      title={`${c.name}（${c.code}）`} text="美國 EPA 違規紀錄、境外污染事件與罰款紀錄" />
                  ))}
                  {relations.events.map(e => (
                    <RelatedCard key={e.id} href={`/companies/${e.companyId}#${e.id}`} label="污染事件" title={e.title} />
                  ))}
                </SimpleGrid>
              </>
            )}

            {revisions.length > 0 && (
              <>
                <Heading as="h2" fontFamily={R.serif} fontWeight={700} fontSize="1.15rem" color={R.ink} mb={4}>修訂紀錄</Heading>
                <Box as="ul" listStyleType="none" pl={0} m={0}>
                  {revisions.map(r => (
                    <Grid as="li" key={r.date} templateColumns={{ base: '1fr', sm: '7.5em 1fr' }} columnGap={4}
                      py={2.5} borderTopWidth="1px" borderColor={R.rule} fontSize="14px" lineHeight={1.75}>
                      <Text fontWeight={700} color={R.inkSoft}>{r.date}</Text>
                      <Text color={R.inkSoft}>{r.text}</Text>
                    </Grid>
                  ))}
                </Box>
              </>
            )}

            <Text fontSize="13px" color={R.muted} mt={8} lineHeight={1.8}>
              {report.credit || `執行單位：${report.org}。${report.note || ''}`}
            </Text>
            <Link href="/reports" legacyBehavior>
              <ChakraLink display="inline-block" mt={6} fontSize="14px" fontWeight={700} color={R.waterText}>
                ← 所有專題報導
              </ChakraLink>
            </Link>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default function ReportPage({ slug, toc, keyNumbers, revisions, relations }) {
  const report = getReport(slug);
  const Article = ARTICLES[slug];
  const articleRef = useRef(null);
  const reading = useReadingState(toc, articleRef);

  return (
    <Layout>
      <Head>
        <title>{`${report.headline}｜${report.title}｜Formosa Oversee`}</title>
        <meta name="description" content={report.deck} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${report.headline}｜${report.title}`} />
        <meta property="og:description" content={report.deck} />
        <link rel="stylesheet" href={SERIF_FONT_URL} />
      </Head>
      <Box bg={R.paper} color={R.ink} fontFamily={R.sans}>
        <ReportHero report={report} companies={relations.companies} />
        {keyNumbers && <KeyNumbers {...keyNumbers} />}
        <MobileToc items={toc} {...reading} />
        <Container maxW="1200px">
          <Grid templateColumns={COLUMNS} columnGap={{ lg: 16 }}>
            <GridItem display={{ base: 'none', lg: 'block' }}>
              <ReportToc items={toc} {...reading} />
            </GridItem>
            <GridItem as="article" ref={articleRef} minW={0} pb={{ base: 16, md: 24 }}>
              <Article />
            </GridItem>
          </Grid>
        </Container>
        <ReportEnd report={report} relations={relations} revisions={revisions} />
      </Box>
    </Layout>
  );
}

export async function getStaticPaths() {
  const missing = REPORTS.filter(r => !ARTICLES[r.slug]).map(r => r.slug);
  if (missing.length > 0) {
    throw new Error(`lib/reports.js 的專題沒有內文，請在 content/reports/index.js 的 ARTICLES 註冊：${missing.join(', ')}`);
  }
  return { paths: REPORTS.map(r => ({ params: { slug: r.slug } })), fallback: false };
}

// 目次、數字列、修訂紀錄是純資料，build 時從內文模組取出、只放進這一篇的頁面資料
export async function getStaticProps({ params }) {
  const report = getReport(params.slug);
  const { TOC, KEY_NUMBERS = null, REVISIONS = [] } = await import(`../../content/reports/${params.slug}`);
  return {
    props: {
      slug: report.slug,
      toc: TOC,
      keyNumbers: KEY_NUMBERS,
      revisions: REVISIONS,
      relations: getReportRelations(report),
    },
  };
}
