import { Box, Container, Heading, Text, Button, Stack, Flex, SimpleGrid, Icon, HStack, VStack, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import Layout from '../components/Layout';
import ReportCarousel from '../components/report/ReportCarousel';
import { FaGlobeAsia, FaSitemap, FaFileAlt } from 'react-icons/fa';
import { listReports } from '../lib/reports';
import { getSiteStats } from '../lib/gcs-api-server';
import { SITE } from '../lib/site';

// 特色功能卡片組件
const FeatureCard = ({ icon, title, description }) => {
  return (
    <Box bg="white" p={6} rounded="lg" shadow="md" borderWidth="1px"
         borderColor="gray.100" transition="all 0.3s"
         _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}>
      <Flex direction="column" align="center" textAlign="center">
        <Icon as={icon} boxSize={12} color="green.500" mb={4} />
        <Heading as="h3" size="md" mb={2} color="green.600">
          {title}
        </Heading>
        <Text color="gray.600">{description}</Text>
      </Flex>
    </Box>
  );
};

const StatItem = ({ value, label }) => (
  <VStack spacing={0}>
    <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="green.700">{value.toLocaleString()}</Text>
    <Text fontSize="sm" color="gray.600" textAlign="center">{label}</Text>
  </VStack>
);

// 資料來源：美國只是其中一塊，各國政府的裁罰公告、法院、公司文件與媒體一起列
const SOURCES = [
  { title: '美國 EPA ECHO', body: '台灣上市公司美國廠區的水污染、空氣污染、有害廢棄物違規與聯邦執法案件。' },
  { title: '各國政府的裁罰公告', body: '中國大陸各地生態環境部門的處罰決定、企業環境信息依法披露系統與生態環境部通報；越南省級處分決定；南韓環境資訊公開系統；印尼 PROPER 評等。' },
  { title: 'Violation Tracker', body: 'Good Jobs First 整理的美國與歐盟、南韓、香港等地的執法與罰款紀錄，經書信同意非營利使用。' },
  { title: '法院、公司文件與媒體', body: '判決書、企業自己揭露的永續報告書與申報資料，以及至少兩家互相獨立的媒體報導。' },
];

export default function Home({ stats }) {
  return (
    <Layout>
      {/* 主要橫幅 */}
      <Box bg="green.50" py={20}>
        <Container maxW="container.xl">
          <Stack spacing={8} textAlign="center">
            <Heading as="h1" size="2xl" color="green.600">
              Formosa Oversee
            </Heading>
            <Text fontSize="xl" color="green.700">
              {SITE.tagline}
            </Text>
            <Text fontSize="lg" maxW="container.md" mx="auto" color="gray.600">
              台灣企業在海外設廠，污染與裁罰紀錄卻散落在各國的政府公告、法院文件與外文新聞裡。我們把這些紀錄逐筆查證、附上原始文件，再沿著持股鏈歸屬到台灣的上市母公司。
            </Text>
            <HStack justify="center" spacing={4} flexWrap="wrap">
              <Link href="/companies" legacyBehavior passHref>
                <Button as="a" colorScheme="green" size="lg" px={8}>
                  查看企業列表
                </Button>
              </Link>
              <Link href="/map" legacyBehavior passHref>
                <Button as="a" colorScheme="green" variant="outline" size="lg" px={8}>
                  污染地圖
                </Button>
              </Link>
            </HStack>
          </Stack>
        </Container>
      </Box>

      {/* 專題報導（可左右滑） */}
      <ReportCarousel reports={listReports()} />

      {/* 收錄規模 */}
      <Box py={10} borderBottomWidth="1px" borderColor="gray.100">
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <StatItem value={stats.eventCount} label={`污染事件，分布在 ${stats.eventCountryCount} 個國家`} />
            <StatItem value={stats.enforcementCount} label={`罰款紀錄，來自 ${stats.enforcementJurisdictionCount} 個司法管轄區`} />
            <StatItem value={stats.epaViolationCount} label={`美國 EPA 違規紀錄，${stats.epaFacilityCount} 座廠區`} />
            <StatItem value={stats.companyCount} label="家台灣上市公司" />
          </SimpleGrid>
        </Container>
      </Box>

      {/* 特色功能區塊 */}
      <Box py={16}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={10} textAlign="center" color="green.600">
            我們怎麼做
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <FeatureCard
              icon={FaGlobeAsia}
              title="跨國資料整合"
              description="不只美國：從各國政府的裁罰公告、法院判決、公司文件與媒體報導，收錄台灣上市公司海外工廠的環境違規與污染事件。"
            />
            <FeatureCard
              icon={FaSitemap}
              title="追到台灣母公司"
              description="海外工廠常掛在多層境外控股公司底下。我們依財報與年報的持股資料，把每一筆紀錄歸屬到負責的台灣上市公司，並標出持股比例。"
            />
            <FeatureCard
              icon={FaFileAlt}
              title="逐筆附上原件"
              description="每個事件都要有官方、法院或公司文件，或兩家互相獨立的媒體；附原始網址與網頁封存，對公司有利的事實也一併寫出。"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* 資料來源與關於我們 */}
      <Box bg="gray.50" py={16}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Box>
              <Heading as="h2" size="xl" mb={4} color="green.600">
                關於我們
              </Heading>
              <Text fontSize="lg" color="gray.600" mb={4}>
                台灣的永續討論多半依賴企業自己的永續報告與獎項，企業在海外工廠造成的影響，卻很少被放進評價裡。Formosa Oversee 想補上這一半的故事，讓投資人、媒體、研究者與公民團體都查得到。
              </Text>
              <Link href="/about" legacyBehavior passHref>
                <ChakraLink color="green.600" fontWeight="bold">認識團隊與方法 →</ChakraLink>
              </Link>
            </Box>
            <Box>
              <Heading as="h3" size="md" mb={4} color="green.700">資料來源</Heading>
              <VStack align="stretch" spacing={4}>
                {SOURCES.map((s) => (
                  <Box key={s.title} bg="white" p={4} rounded="md" borderWidth="1px" borderColor="gray.100">
                    <Text fontWeight="bold" color="gray.800">{s.title}</Text>
                    <Text fontSize="sm" color="gray.600" mt={1}>{s.body}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </Layout>
  );
}

export async function getStaticProps() {
  return { props: { stats: getSiteStats() } };
}
