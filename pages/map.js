import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {
  Box, Container, Heading, Text, SimpleGrid, HStack, VStack, Wrap, WrapItem,
  Stat, StatLabel, StatNumber, StatHelpText, Select, Button, ButtonGroup,
  Badge, Center, Spinner, Divider, Icon, Grid, GridItem, Card, CardBody
} from '@chakra-ui/react';
import { FaMapMarkedAlt, FaIndustry, FaExclamationTriangle, FaFlag } from 'react-icons/fa';
import Layout from '../components/Layout';
import { getMapData } from '../lib/gcs-api-server';
import { POLLUTION_LEVELS, getPollutionLevel } from '../lib/pollution-scale';

// Leaflet 直接碰 window，靜態匯出時不能參與 SSR，只能在瀏覽器端載入
const PollutionMap = dynamic(() => import('../components/PollutionMap'), {
  ssr: false,
  loading: () => (
    <Center h="100%" bg="gray.50">
      <VStack spacing={3}>
        <Spinner size="lg" color="green.500" thickness="3px" />
        <Text color="gray.500" fontSize="sm">載入地圖中…</Text>
      </VStack>
    </Center>
  ),
});

const StatCard = ({ icon, label, value, helpText, color = 'green.500' }) => (
  <Card shadow="sm" borderWidth="1px" borderColor="gray.100">
    <CardBody>
      <Stat>
        <HStack spacing={2} mb={1}>
          <Icon as={icon} color={color} boxSize={4} />
          <StatLabel color="gray.600" fontSize="sm">{label}</StatLabel>
        </HStack>
        <StatNumber fontSize="2xl" color="gray.800">{value}</StatNumber>
        {helpText && <StatHelpText fontSize="xs" mb={0}>{helpText}</StatHelpText>}
      </Stat>
    </CardBody>
  </Card>
);

const Legend = () => (
  <Wrap spacing={4} align="center">
    <WrapItem>
      <Text fontSize="sm" fontWeight="bold" color="gray.700">違規筆數</Text>
    </WrapItem>
    {POLLUTION_LEVELS.map((level) => (
      <WrapItem key={level.key}>
        <HStack spacing={2}>
          <Box
            w={level.key === 'none' ? '8px' : '14px'}
            h={level.key === 'none' ? '8px' : '14px'}
            borderRadius="full"
            bg={level.color}
            borderWidth="1px"
            borderColor="white"
            boxShadow="0 0 0 1px rgba(0,0,0,0.15)"
          />
          <Text fontSize="xs" color="gray.600">{level.label}</Text>
        </HStack>
      </WrapItem>
    ))}
    <WrapItem>
      <Text fontSize="xs" color="gray.400">圓點大小亦隨違規筆數遞增</Text>
    </WrapItem>
  </Wrap>
);

const HotspotItem = ({ facility, rank, onFocus }) => {
  const level = getPollutionLevel(facility.violationCount);

  return (
    <Box
      as="button"
      onClick={() => onFocus(facility)}
      textAlign="left"
      w="100%"
      px={3}
      py={2}
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.100"
      _hover={{ bg: 'green.50', borderColor: 'green.200' }}
      transition="all 0.2s"
    >
      <HStack spacing={3} align="flex-start">
        <Text fontSize="xs" color="gray.400" fontWeight="bold" minW="18px" pt="2px">
          {rank}
        </Text>
        <Box flex="1" minW={0}>
          <Text fontSize="sm" fontWeight="medium" color="gray.800" noOfLines={1}>
            {facility.name}
          </Text>
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {facility.companyName}
          </Text>
        </Box>
        <VStack spacing={0} align="flex-end">
          <Badge style={{ backgroundColor: level.color }} color="white" fontSize="10px">
            {facility.violationCount}
          </Badge>
          <Text fontSize="10px" color="gray.400">{facility.state}</Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default function MapPage({ facilities, summary }) {
  const [scope, setScope] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [flyToTarget, setFlyToTarget] = useState(null);

  // 州別選單：附上各州廠區數，方便判斷哪些州值得看
  const stateOptions = useMemo(() => {
    const counts = {};
    facilities.forEach((f) => {
      const key = f.state || '未知';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [facilities]);

  const visibleFacilities = useMemo(() => {
    return facilities.filter((f) => {
      if (scope === 'violations' && f.violationCount === 0) return false;
      if (stateFilter !== 'all' && (f.state || '未知') !== stateFilter) return false;
      return true;
    });
  }, [facilities, scope, stateFilter]);

  const visibleViolationCount = useMemo(
    () => visibleFacilities.reduce((sum, f) => sum + f.violationCount, 0),
    [visibleFacilities]
  );

  const hotspots = useMemo(
    () => visibleFacilities.filter((f) => f.violationCount > 0).slice(0, 10),
    [visibleFacilities]
  );

  // 帶 nonce 才能在重複點選同一個廠區時再次觸發 flyTo
  const focusFacility = (facility) => {
    setFlyToTarget({ lat: facility.lat, lng: facility.lng, nonce: Date.now() });
  };

  return (
    <Layout>
      <Head>
        <title>污染地圖 - Formosa Oversee</title>
        <meta
          name="description"
          content="以地圖呈現台灣上市公司在美國廠區的 EPA 環境違規分布"
        />
      </Head>

      <Box bg="green.50" py={10}>
        <Container maxW="container.xl">
          <VStack spacing={3} align="flex-start">
            <HStack spacing={3}>
              <Icon as={FaMapMarkedAlt} color="green.500" boxSize={7} />
              <Heading as="h1" size="xl" color="green.600">污染地圖</Heading>
            </HStack>
            <Text color="gray.600" maxW="container.md">
              台灣上市公司在美國設立的廠區，以及各廠區累計的 EPA ECHO 環境違規記錄。
              圓點越大越紅代表違規筆數越高，點選圓點可查看該廠區明細。
            </Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
          <StatCard
            icon={FaIndustry}
            label="已定位廠區"
            value={summary.mappedCount}
            helpText={`共 ${summary.facilityTotal} 座廠區`}
          />
          <StatCard
            icon={FaExclamationTriangle}
            label="違規記錄"
            value={summary.mappedViolationCount.toLocaleString()}
            helpText={`可歸屬至地圖廠區，總計 ${summary.violationTotal.toLocaleString()} 筆`}
            color="red.500"
          />
          <StatCard
            icon={FaExclamationTriangle}
            label="有違規的廠區"
            value={summary.withViolationCount}
            helpText={`占已定位廠區 ${Math.round((summary.withViolationCount / summary.mappedCount) * 100)}%`}
            color="orange.500"
          />
          <StatCard
            icon={FaFlag}
            label="涵蓋州數"
            value={summary.stateCount}
            helpText={`${summary.companyCount} 家上市公司`}
          />
        </SimpleGrid>

        {/* 篩選工具列 */}
        <Wrap spacing={4} align="center" mb={4}>
          <WrapItem>
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                colorScheme="green"
                variant={scope === 'all' ? 'solid' : 'outline'}
                onClick={() => setScope('all')}
              >
                全部廠區
              </Button>
              <Button
                colorScheme="green"
                variant={scope === 'violations' ? 'solid' : 'outline'}
                onClick={() => setScope('violations')}
              >
                僅有違規
              </Button>
            </ButtonGroup>
          </WrapItem>
          <WrapItem>
            <Select
              size="sm"
              maxW="220px"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              borderColor="gray.200"
            >
              <option value="all">全部州別（{stateOptions.length}）</option>
              {stateOptions.map(([state, count]) => (
                <option key={state} value={state}>
                  {state}（{count} 座）
                </option>
              ))}
            </Select>
          </WrapItem>
          <WrapItem>
            <Text fontSize="sm" color="gray.500">
              顯示 {visibleFacilities.length} 座廠區 · {visibleViolationCount.toLocaleString()} 筆違規
            </Text>
          </WrapItem>
        </Wrap>

        <Grid templateColumns={{ base: '1fr', lg: '2.4fr 1fr' }} gap={6}>
          <GridItem>
            <Box
              h={{ base: '420px', md: '600px' }}
              borderRadius="lg"
              overflow="hidden"
              borderWidth="1px"
              borderColor="gray.200"
              shadow="sm"
            >
              <PollutionMap facilities={visibleFacilities} flyToTarget={flyToTarget} />
            </Box>

            <Box mt={4} p={4} bg="gray.50" borderRadius="md">
              <Legend />
            </Box>

            <Text fontSize="xs" color="gray.500" mt={3}>
              {summary.unmappedCount > 0 &&
                `註：${summary.facilityTotal} 座廠區中有 ${summary.unmappedCount} 座因原始資料缺少經緯度而未顯示於地圖。`}
              {summary.coarseCoordinateCount > 0 &&
                `已定位的 ${summary.mappedCount} 座中，有 ${summary.coarseCoordinateCount} 座的原始座標精度較粗（誤差 100 公尺以上），僅供區位參考；各廠區的實際精度標註於廠區詳情頁。`}
            </Text>
          </GridItem>

          <GridItem>
            <Card shadow="sm" borderWidth="1px" borderColor="gray.100" h="100%">
              <CardBody>
                <Heading as="h2" size="sm" color="green.600" mb={1}>
                  違規熱點
                </Heading>
                <Text fontSize="xs" color="gray.500" mb={3}>
                  點選可將地圖移至該廠區
                </Text>
                <Divider mb={3} />
                {hotspots.length > 0 ? (
                  <VStack spacing={2} align="stretch">
                    {hotspots.map((facility, index) => (
                      <HotspotItem
                        key={`${facility.companyId}-${facility.facilityId}`}
                        facility={facility}
                        rank={index + 1}
                        onFocus={focusFacility}
                      />
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    目前篩選條件下沒有帶違規記錄的廠區。
                  </Text>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const { facilities, summary } = getMapData();

  return {
    props: { facilities, summary },
  };
}
