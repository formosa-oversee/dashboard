import Head from 'next/head';
import Link from 'next/link';
import {
  Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Icon, Badge, Divider, Link as ChakraLink, ListItem, UnorderedList
} from '@chakra-ui/react';
import { FaInfoCircle, FaInstagram, FaEnvelope, FaGithub, FaSitemap, FaFileAlt, FaComments } from 'react-icons/fa';
import Layout from '../components/Layout';
import { getSiteStats } from '../lib/gcs-api-server';
import { SITE } from '../lib/site';

/**
 * 關於我們。內容取自 Young飛全球行動計畫的「行動方案 3.0」（主軸議題、行動規劃、團隊分工）
 * 與「行動方案 2.0 國際聯結行動成果」（訪談過的國際組織）；數字由 getSiteStats 在 build 時計算。
 */

const Section = ({ title, children }) => (
  <Box as="section" py={{ base: 8, md: 10 }}>
    <Heading as="h2" size="lg" color="green.600" mb={5}>{title}</Heading>
    {children}
  </Box>
);

const Para = (props) => <Text fontSize="lg" color="gray.700" lineHeight={1.9} mb={4} {...props} />;

const MethodCard = ({ icon, title, children }) => (
  <Box bg="white" p={6} rounded="lg" borderWidth="1px" borderColor="gray.100" shadow="sm">
    <HStack spacing={3} mb={3}>
      <Icon as={icon} color="green.500" boxSize={6} />
      <Heading as="h3" size="md" color="gray.800">{title}</Heading>
    </HStack>
    <Text color="gray.600" lineHeight={1.8}>{children}</Text>
  </Box>
);

// 2026 年 7–8 月線上訪談或書信交流過的組織（行動方案 2.0 國際聯結成果，只列與企業問責、環境、勞權相關者）
const ORGS = [
  { name: 'AEER（Aksi Ekologi dan Emansipasi Rakyat）', country: '印尼', topic: '印尼鎳礦產業的環境影響，以及台資子公司的查證方法' },
  { name: 'Clean Clothes Campaign（含東亞聯盟）', country: '荷蘭', topic: '成衣與鞋類供應鏈的勞動條件與資訊透明' },
  { name: 'World Benchmarking Alliance', country: '荷蘭／英國', topic: '企業評比方法論與企業回應機制' },
  { name: 'San Antonio Bay Waterkeeper', country: '美國', topic: '長期在地監測、公民科學與訴訟經驗' },
  { name: 'Justice for Formosa Victims', country: '越南／美國', topic: '2016 年越南中部海洋污染受害者的跨國倡議' },
  { name: 'International Monitor Formosa Alliance', country: '多國', topic: '監督台塑集團全球環境影響的國際聯盟' },
  { name: '熊本の環境を考える会', country: '日本', topic: '半導體產業進駐後的地下水與 PFAS 議題' },
  { name: 'Cambodian Alliance of Trade Unions', country: '柬埔寨', topic: '成衣與製鞋業工會，追查代工廠背後的母公司' },
];

// 行動方案 3.0 的成員分工
const TEAM = [
  { name: '黃凱昱', role: 'ESG 研究與評比方法論', work: '評比方法論設計、案件事證建檔與資料分析' },
  { name: '劉祖丞', role: '資料工程與平台開發', work: '資料串接、持股追溯、地圖與網站' },
  { name: '周衍儀', role: 'NGO 與國際聯結', work: '海外 NGO 與工會合作、企業意見徵詢與媒體聯繫' },
  { name: '徐梁育', role: '法規研析', work: '企業股權關聯查核與案件事證建檔' },
];

export default function About({ stats }) {
  return (
    <Layout>
      <Head>
        <title>關於我們 - Formosa Oversee</title>
        <meta name="description" content={`${SITE.name}｜${SITE.tagline}：追蹤台灣上市公司在海外工廠的環境違規與污染事件。`} />
      </Head>

      <Box bg="green.50" py={10}>
        <Container maxW="container.lg">
          <HStack spacing={3}>
            <Icon as={FaInfoCircle} color="green.500" boxSize={7} />
            <Heading as="h1" size="xl" color="green.600">關於我們</Heading>
          </HStack>
          <Text fontSize="xl" color="green.700" mt={3}>{SITE.name}｜{SITE.tagline}</Text>
          <Text color="gray.600" mt={3} maxW="container.md" lineHeight={1.8}>
            建立台灣跨國企業海外環境與人權問責的資料基礎：釐清母子公司架構、串聯第一線的違規事證，讓台灣企業在海外的表現也被看見。
          </Text>
        </Container>
      </Box>

      <Container maxW="container.lg">
        <Section title="為什麼做這件事">
          <Para>
            台灣企業不只在台灣生產，也在東南亞、中國大陸、美國、歐洲等地設廠、投資與採購。各國的環境法規、勞動條件與資訊公開程度不一，企業在不同國家可能面臨污染、勞權、土地與社群衝突的風險。
          </Para>
          <Para>
            台灣的永續討論，多半依賴企業自己的永續報告、官網揭露、獎項與新聞稿。企業在海外造成的影響，相關資料卻散落在外文新聞、政府裁罰、NGO 報告、法院文件與居民聲明裡，台灣社會不容易取得。於是出現一種資訊不對稱：企業在台灣拿到永續獎項，海外工廠對當地環境與居民的影響卻沒有被納入評價。
          </Para>
          <Para mb={0}>
            Formosa Oversee 想用資料平台補上這一半的故事，讓投資人、媒體、研究者、公民團體與政策制定者都查得到。
          </Para>
        </Section>

        <Divider />

        <Section title="我們怎麼做">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <MethodCard icon={FaSitemap} title="追到台灣母公司">
              海外工廠常掛在多層境外控股公司底下。我們依公開資訊觀測站的子公司資料、財報與年報，把每一筆紀錄沿持股鏈歸屬到台灣上市公司，並確認事件發生時母公司已經控制這家公司。
            </MethodCard>
            <MethodCard icon={FaFileAlt} title="逐筆查證、附上原件">
              每個事件至少要有一份官方、法院或公司文件，或兩家互相獨立的媒體報導；每個來源都附原始網址與網頁封存。指控寫明是誰的說法，對公司有利的事實也一併寫出。
            </MethodCard>
            <MethodCard icon={FaComments} title="讓企業回應">
              參考國際企業評比的做法，評比報告發布前會正式發函給列名企業，附上具體事證，邀請說明，並公開回應情形。
            </MethodCard>
          </SimpleGrid>
          <Text color="gray.600" mt={6}>
            收錄門檻、持股歸屬與座標的完整規則見
            <ChakraLink href={SITE.newsSpecUrl} isExternal color="green.600" mx={1}>收錄規格</ChakraLink>
            ，所有資料與程式都公開在
            <ChakraLink href={SITE.githubUrl} isExternal color="green.600" ml={1}>GitHub</ChakraLink>。
          </Text>
        </Section>

        <Divider />

        <Section title="資料來源與目前規模">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
            {[
              [stats.eventCount, `個污染事件，分布在 ${stats.eventCountryCount} 個國家`],
              [stats.enforcementCount, `筆罰款紀錄，${stats.enforcementJurisdictionCount} 個司法管轄區`],
              [stats.epaViolationCount, `筆美國 EPA 違規紀錄，${stats.epaFacilityCount} 座廠區`],
              [stats.companyCount, '家台灣上市公司'],
            ].map(([value, label]) => (
              <Box key={label} bg="green.50" p={4} rounded="md" textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="green.700">{value.toLocaleString()}</Text>
                <Text fontSize="sm" color="gray.600">{label}</Text>
              </Box>
            ))}
          </SimpleGrid>
          <UnorderedList spacing={2} color="gray.700" fontSize="lg" lineHeight={1.8}>
            <ListItem><b>各國政府的裁罰與通報：</b>中國大陸各地生態環境部門的處罰決定、企業環境信息依法披露系統與生態環境部通報；越南省級處分決定；南韓環境資訊公開系統；印尼 PROPER 評等。</ListItem>
            <ListItem><b>美國 EPA ECHO：</b>水污染、空氣污染、有害廢棄物違規與聯邦執法案件。</ListItem>
            <ListItem><b>Violation Tracker（Good Jobs First）：</b>美國與歐盟、南韓、香港等地的執法與罰款紀錄，經書信同意非營利使用。</ListItem>
            <ListItem><b>法院判決、公司文件與媒體：</b>判決書、企業自己揭露的永續報告書與申報資料，以及互相獨立的媒體報導。</ListItem>
          </UnorderedList>
          <Text color="gray.500" fontSize="sm" mt={4}>
            「沒有紀錄」只代表我們查得到的來源裡沒有，不代表這家公司沒有違規。禁止自動存取的網站（例如信用中国、IPE 蔚蓝地图）我們不抓取。
          </Text>
        </Section>

        <Divider />

        <Section title="我們的定位">
          <Para mb={0}>
            國內已有綠色公民行動聯盟的「透明足跡」做台灣本土的即時監測，環境權保障基金會與台灣跨國企業監察（TTNC Watch）長期做海外個案的深度倡議。Formosa Oversee 與他們互補，專注在跨國資料的結構化整合與同業比較：把分散在各國、各種語言的紀錄整理成可以查詢、可以比較的資料。
          </Para>
        </Section>

        <Divider />

        <Section title="國際交流">
          <Text color="gray.600" mb={5}>
            2026 年 7 至 8 月，我們與以下組織進行線上訪談或書信交流，學習他們的查證、倡議與企業對話經驗。列在這裡不代表這些組織為本平台的內容背書。
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {ORGS.map((org) => (
              <Box key={org.name} p={4} rounded="md" borderWidth="1px" borderColor="gray.100" bg="white">
                <HStack spacing={2} align="baseline" flexWrap="wrap">
                  <Text fontWeight="bold" color="gray.800">{org.name}</Text>
                  <Badge colorScheme="green" variant="subtle">{org.country}</Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600" mt={1}>{org.topic}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Section>

        <Divider />

        <Section title="團隊">
          <Text color="gray.600" mb={5}>
            我們是教育部青年發展署「Young飛全球行動計畫」的團隊，成員分別來自 ESG 研究、資料工程、NGO 倡議與法規研析領域。
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
            {TEAM.map((m) => (
              <Box key={m.name} p={5} rounded="lg" bg="white" borderWidth="1px" borderColor="gray.100" shadow="sm">
                <Text fontSize="lg" fontWeight="bold" color="gray.800">{m.name}</Text>
                <Text fontSize="sm" color="green.700" fontWeight="semibold" mt={1}>{m.role}</Text>
                <Text fontSize="sm" color="gray.600" mt={2}>{m.work}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Section>

        <Divider />

        <Section title="接下來">
          <UnorderedList spacing={2} color="gray.700" fontSize="lg" lineHeight={1.8}>
            <ListItem>2026 年 11 月發布《台資企業海外永續表現評比報告》，並舉辦線上專題發表會。</ListItem>
            <ListItem>對評比報告列名的企業正式發函徵詢意見，並在平台公開回應情形。</ListItem>
            <ListItem>與海外 NGO 與工會建立資訊交換管道，持續補進第一線的事證。</ListItem>
          </UnorderedList>
        </Section>

        <Divider />

        <Section title="聯絡我們">
          <Text color="gray.600" mb={4}>
            發現資料有誤、想提供線索，或想合作，歡迎聯絡我們。企業對收錄內容有說明或更正，也請來信，我們會補進事件的來源。
          </Text>
          <VStack align="flex-start" spacing={3} pb={6}>
            <ChakraLink href={SITE.instagramUrl} isExternal color="green.700" fontSize="lg" display="flex" alignItems="center" gap={2}>
              <Icon as={FaInstagram} boxSize={5} />Instagram @{SITE.instagramHandle}
            </ChakraLink>
            <ChakraLink href={`mailto:${SITE.email}`} color="green.700" fontSize="lg" display="flex" alignItems="center" gap={2}>
              <Icon as={FaEnvelope} boxSize={5} />{SITE.email}
            </ChakraLink>
            <ChakraLink href={SITE.githubUrl} isExternal color="green.700" fontSize="lg" display="flex" alignItems="center" gap={2}>
              <Icon as={FaGithub} boxSize={5} />原始碼與收錄規格
            </ChakraLink>
          </VStack>
        </Section>
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  return { props: { stats: getSiteStats() } };
}
