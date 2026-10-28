import { useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {
  Box, Container, Heading, Text, SimpleGrid, HStack, VStack, Wrap, WrapItem,
  Stat, StatLabel, StatNumber, StatHelpText, Select, Button, ButtonGroup,
  Badge, Center, Spinner, Divider, Icon, Grid, GridItem, Card, CardBody, Checkbox, Link as ChakraLink,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';
import { FaMapMarkedAlt, FaIndustry, FaExclamationTriangle, FaFlag, FaMapMarkerAlt, FaBuilding, FaGlobeAsia } from 'react-icons/fa';
import Layout from '../components/Layout';
import { getMapData, getMapEvents } from '../lib/gcs-api-server';
import { POLLUTION_LEVELS, getPollutionLevel } from '../lib/pollution-scale';
import { LOCATION_PRECISIONS, MAP_EVENT_COLOR } from '../lib/news-labels';

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

const NEWS_SPEC_URL = 'https://github.com/formosa-oversee/dashboard/blob/main/docs/pollution-news-spec.md';

// 視角按鈕。事件分布在美國、亞洲、歐洲，預設仍看美國本土（EPA 廠區都在這裡）
const VIEWS = [
  { key: 'us', label: '美國', target: { lat: 39.5, lng: -98.35, zoom: 4 } },
  { key: 'asia', label: '亞洲', target: { bounds: [[-6, 98], [40, 136]] } },
  { key: 'europe', label: '歐洲', target: { bounds: [[43, -2], [61, 18]] } },
  { key: 'world', label: '全部', target: { bounds: [[-10, -125], [62, 140]] } },
];

// 點選事件時的縮放：定位越粗，拉得越遠，免得把城鎮中心看成廠址
const PRECISION_ZOOM = { facility: 12, 'industrial-park': 12, city: 10, region: 7 };

// 圖例用的定位針，與地圖上的 MapEventLayer 同一個外形
const PinGlyph = ({ hollow = false, count = null, ring = false }) => (
  <Box position="relative" w="24px" h="24px" flexShrink={0}>
    {ring && (
      <Box position="absolute" left="0" top="2px" w="24px" h="24px" borderRadius="full"
        borderWidth="1px" borderStyle="dashed" borderColor={MAP_EVENT_COLOR} bg="rgba(44,82,130,0.08)" />
    )}
    <svg width="18" height="24" viewBox="0 0 24 32" style={{ position: 'absolute', left: 3, top: 0 }} aria-hidden="true">
      <path d="M12 1.2C6.2 1.2 1.6 5.7 1.6 11.4c0 7.6 10.4 19.4 10.4 19.4s10.4-11.8 10.4-19.4C22.4 5.7 17.8 1.2 12 1.2z"
        fill={hollow ? '#ffffff' : MAP_EVENT_COLOR} stroke={hollow ? MAP_EVENT_COLOR : '#ffffff'} strokeWidth={hollow ? 2.2 : 1.5} />
      {count ? (
        <text x="12" y="15.2" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="sans-serif" fill="#ffffff">{count}</text>
      ) : (
        <circle cx="12" cy="11.3" r="3.6" fill={hollow ? MAP_EVENT_COLOR : '#ffffff'} />
      )}
    </svg>
  </Box>
);

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

const EventLegend = () => (
  <Wrap spacing={4} align="center">
    <WrapItem>
      <Text fontSize="sm" fontWeight="bold" color="gray.700">污染事件</Text>
    </WrapItem>
    <WrapItem><HStack spacing={1}><PinGlyph /><Text fontSize="xs" color="gray.600">廠區位置</Text></HStack></WrapItem>
    <WrapItem><HStack spacing={1}><PinGlyph ring /><Text fontSize="xs" color="gray.600">只定位到工業區（虛線圈僅示意）</Text></HStack></WrapItem>
    <WrapItem><HStack spacing={1}><PinGlyph hollow /><Text fontSize="xs" color="gray.600">只定位到城鎮或地區</Text></HStack></WrapItem>
    <WrapItem><HStack spacing={1}><PinGlyph count={2} /><Text fontSize="xs" color="gray.600">同一地點的事件數</Text></HStack></WrapItem>
    <WrapItem>
      <HStack spacing={1}>
        <Center w="20px" h="20px" borderRadius="full" bg={MAP_EVENT_COLOR} color="white" fontSize="10px" fontWeight="bold"
          borderWidth="2px" borderColor="white" boxShadow="0 0 0 3px rgba(44,82,130,0.25)">7</Center>
        <Text fontSize="xs" color="gray.600">鄰近多個地點（點選放大）</Text>
      </HStack>
    </WrapItem>
  </Wrap>
);

const Legend = () => (
  <Wrap spacing={4} align="center">
    <WrapItem>
      <Text fontSize="sm" fontWeight="bold" color="gray.700">EPA 違規筆數</Text>
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

const EventListItem = ({ event, onFocus }) => (
  <Box
    as="button"
    onClick={() => onFocus(event)}
    textAlign="left"
    w="100%"
    px={3}
    py={2}
    borderRadius="md"
    borderWidth="1px"
    borderColor="gray.100"
    _hover={{ bg: 'blue.50', borderColor: 'blue.200' }}
    transition="all 0.2s"
  >
    <Text fontSize="sm" fontWeight="medium" color="gray.800" noOfLines={2}>
      {event.title}
    </Text>
    <Text fontSize="xs" color="gray.500" noOfLines={1}>
      {event.period} · {event.companies.map((c) => c.short).join('、') || '—'}
    </Text>
    <Text fontSize="xs" color="gray.400" noOfLines={2}>
      {event.locations.map((l) => l.plantSite).join('；')}
      {event.locations.some((l) => l.precision !== 'facility') && '（不是廠區位置）'}
    </Text>
  </Box>
);

export default function MapPage({ facilities, summary, eventPoints, eventSummary }) {
  const [scope, setScope] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [flyToTarget, setFlyToTarget] = useState(null);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const mapRef = useRef(null);

  // 手機版清單在地圖下方，點清單後要捲回地圖才看得到移動
  const flyTo = (target) => {
    setFlyToTarget({ ...target, nonce: Date.now() });
    const rect = mapRef.current?.getBoundingClientRect();
    if (rect && (rect.top < 0 || rect.bottom > window.innerHeight)) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 地圖上一個座標一個標記；清單要一個事件一列，所以從標記反推回事件，地點各自保留
  const eventList = useMemo(() => {
    const byId = new Map();
    eventPoints.forEach((point) => {
      point.items.forEach((item) => {
        if (!byId.has(item.eventId)) {
          byId.set(item.eventId, { id: item.eventId, title: item.title, period: item.period, dateStart: item.dateStart, companies: item.companies, locations: [] });
        }
        byId.get(item.eventId).locations.push({ lat: point.lat, lng: point.lng, precision: item.precision, plantSite: item.plantSite });
      });
    });
    return [...byId.values()].sort((a, b) => String(b.dateStart).localeCompare(String(a.dateStart)));
  }, [eventPoints]);

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
    setShowFacilities(true);
    flyTo({ lat: facility.lat, lng: facility.lng });
  };

  // 一個事件有多個地點（例：2009 EPA/DOJ 和解在 Point Comfort 與 Baton Rouge）時框住全部地點
  const focusEvent = (event) => {
    setShowEvents(true);
    if (event.locations.length > 1) {
      flyTo({ bounds: event.locations.map((l) => [l.lat, l.lng]) });
    } else {
      const [l] = event.locations;
      flyTo({ lat: l.lat, lng: l.lng, zoom: PRECISION_ZOOM[l.precision] ?? 9 });
    }
  };

  return (
    <Layout>
      <Head>
        <title>污染地圖 - Formosa Oversee</title>
        <meta
          name="description"
          content="以地圖呈現台灣上市公司在美國廠區的 EPA 環境違規分布，以及在各國的污染事件"
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
              圓點是台灣上市公司在美國的廠區，以及各廠區累計的 EPA ECHO 環境違規記錄，圓點越大越紅代表違規筆數越高。
              藍色定位針是台灣上市公司在各國的污染事件，來自官方文件、法院判決、公司文件與媒體報導。
              兩種資料性質不同，數字分開計算、不加總。點選圓點或定位針可查看明細。
            </Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>美國 EPA 廠區</Text>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
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

        <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>污染事件（全球）</Text>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
          <StatCard
            icon={FaMapMarkerAlt}
            label="污染事件"
            value={eventSummary.eventCount}
            helpText={`${eventSummary.mappedLocationCount} 個地點`}
            color="blue.600"
          />
          <StatCard
            icon={FaBuilding}
            label="涉及上市公司"
            value={eventSummary.companyCount}
            helpText="事件掛到的公司頁"
            color="blue.600"
          />
          <StatCard
            icon={FaGlobeAsia}
            label="國家"
            value={eventSummary.countryCount}
            helpText="事件發生地"
            color="blue.600"
          />
        </SimpleGrid>

        {/* 圖層與視角 */}
        <Wrap spacing={4} align="center" mb={3}>
          <WrapItem>
            <HStack spacing={4}>
              <Checkbox colorScheme="green" isChecked={showFacilities} onChange={(e) => setShowFacilities(e.target.checked)}>
                <Text fontSize="sm">美國 EPA 廠區</Text>
              </Checkbox>
              <Checkbox colorScheme="blue" isChecked={showEvents} onChange={(e) => setShowEvents(e.target.checked)}>
                <Text fontSize="sm">污染事件</Text>
              </Checkbox>
            </HStack>
          </WrapItem>
          <WrapItem>
            <ButtonGroup size="sm" isAttached variant="outline">
              {VIEWS.map((view) => (
                <Button key={view.key} onClick={() => setFlyToTarget({ ...view.target, nonce: Date.now() })}>
                  {view.label}
                </Button>
              ))}
            </ButtonGroup>
          </WrapItem>
        </Wrap>

        {/* EPA 廠區篩選（不影響污染事件） */}
        <Wrap spacing={4} align="center" mb={4} opacity={showFacilities ? 1 : 0.5}>
          <WrapItem>
            <Text fontSize="sm" color="gray.600">EPA 廠區：</Text>
          </WrapItem>
          <WrapItem>
            <ButtonGroup size="sm" isAttached variant="outline" isDisabled={!showFacilities}>
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
              isDisabled={!showFacilities}
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
              ref={mapRef}
              h={{ base: '420px', md: '600px' }}
              borderRadius="lg"
              overflow="hidden"
              borderWidth="1px"
              borderColor="gray.200"
              shadow="sm"
            >
              <PollutionMap
                facilities={visibleFacilities}
                eventPoints={eventPoints}
                showFacilities={showFacilities}
                showEvents={showEvents}
                flyToTarget={flyToTarget}
              />
            </Box>

            <VStack mt={4} p={4} bg="gray.50" borderRadius="md" spacing={3} align="stretch">
              <Legend />
              <EventLegend />
            </VStack>

            <Text fontSize="xs" color="gray.500" mt={3}>
              {summary.unmappedCount > 0 &&
                `註：${summary.facilityTotal} 座廠區中有 ${summary.unmappedCount} 座因原始資料缺少經緯度而未顯示於地圖。`}
              {summary.coarseCoordinateCount > 0 &&
                `已定位的 ${summary.mappedCount} 座中，有 ${summary.coarseCoordinateCount} 座的原始座標精度較粗（誤差 100 公尺以上），僅供區位參考；各廠區的實際精度標註於廠區詳情頁。`}
            </Text>
            <Text fontSize="xs" color="gray.500" mt={1}>
              污染事件的收錄門檻、持股歸屬與座標來源見
              <ChakraLink href={NEWS_SPEC_URL} isExternal color="green.600" mx={1}>收錄規格</ChakraLink>
              。美國事件的座標取自同址的 EPA 廠區，定位針的尖端對準該點。
              {LOCATION_PRECISIONS['industrial-park'].label}或城鎮的事件，標記不是廠房位置。
            </Text>
          </GridItem>

          <GridItem>
            <Card shadow="sm" borderWidth="1px" borderColor="gray.100" h="100%">
              <CardBody>
                <Tabs size="sm" variant="soft-rounded" colorScheme="green" isLazy>
                  <TabList mb={3}>
                    <Tab>污染事件（{eventList.length}）</Tab>
                    <Tab>EPA 違規熱點</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0}>
                      <Text fontSize="xs" color="gray.500" mb={3}>
                        依事件起始日新到舊。點選可將地圖移至事件地點
                      </Text>
                      <Divider mb={3} />
                      <VStack spacing={2} align="stretch" maxH={{ base: '480px', lg: '640px' }} overflowY="auto" pr={1}>
                        {eventList.map((event) => (
                          <EventListItem key={event.id} event={event} onFocus={focusEvent} />
                        ))}
                      </VStack>
                    </TabPanel>
                    <TabPanel p={0}>
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
                    </TabPanel>
                  </TabPanels>
                </Tabs>
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
  const { points: eventPoints, summary: eventSummary } = getMapEvents();

  return {
    props: { facilities, summary, eventPoints, eventSummary },
  };
}
