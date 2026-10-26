import { useState, useMemo, useEffect } from 'react';
import {
  Box, Container, Heading, Text, Tabs, TabList, TabPanels, Tab, TabPanel,
  Table, Thead, Tbody, Tr, Th, Td, Badge, HStack, VStack, Link as ChakraLink,
  SimpleGrid, Card, CardBody, Divider, Icon, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  Alert, AlertIcon, AlertTitle, AlertDescription,
  Menu, MenuButton, MenuList, MenuItem, Button, Flex, Stack, CardFooter, Image
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaCalendarAlt, FaNewspaper, FaBuilding, FaChevronRight, FaFilter, FaChevronDown, FaCheck, FaMapMarkerAlt, FaArchive } from 'react-icons/fa';
import { getCompanyData, getAllCompanyIds } from '../../lib/gcs-api-server';
import { OFFENSE_CATEGORIES, VT_SNAPSHOT_NOTE, offenseInfo, agencyLabel, formatUSD } from '../../lib/enforcement';
import { ECHO_PROGRAMS, ECHO_PROGRAMS_NOTE, RECORD_KINDS, programInfo } from '../../lib/echo-programs';
import Layout from '../../components/Layout';
import { CompanyReports, EventReportLinks } from '../../components/report/CompanyReports';
import Link from 'next/link';

const FacilityCard = ({ facility, companyId }) => {
  const getProgramBadges = () => {
    const programs = [];
    if (facility.programs?.air) programs.push({ name: '空氣', color: 'purple' });
    if (facility.programs?.water) programs.push({ name: '水', color: 'blue' });
    if (facility.programs?.waste) programs.push({ name: '廢棄物', color: 'orange' });
    if (facility.programs?.toxics) programs.push({ name: '有毒物質', color: 'red' });
    return programs.length > 0 ? programs : [{ name: '無監控', color: 'gray' }];
  };

  return (
    <Card boxShadow="md" borderRadius="lg" h="100%">
      <CardBody>
        <Stack spacing="3">
          <Heading size="sm">{facility.name}</Heading>
          <HStack>
            <Icon as={FaBuilding} />
            <Text color="gray.600" fontSize="sm">{facility.city}, {facility.state}, {facility.country}</Text>
          </HStack>
          <Text color="gray.600" fontSize="xs">設施 ID: {facility.facilityId}</Text>
          {facility.shareholding && (
            <Text color="gray.600" fontSize="xs">持股比例: {facility.shareholding}</Text>
          )}
          <HStack flexWrap="wrap" gap={2}>
            {getProgramBadges().map((program, idx) => (
              <Badge key={idx} colorScheme={program.color} px={2} py={1} borderRadius="full" fontSize="0.7em">
                {program.name}
              </Badge>
            ))}
          </HStack>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link href={`/companies/${companyId}/facilities/${facility.facilityId}`} legacyBehavior passHref>
          <Button as="a" colorScheme="green" w="100%" size="sm">
            查看詳情
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// 污染事件（data/news.json，規格見 docs/pollution-news-spec.md）
const NEWS_SPEC_URL = 'https://github.com/formosa-oversee/dashboard/blob/main/docs/pollution-news-spec.md';

const EVENT_TYPES = {
  'pollution-incident': { label: '污染事故', color: 'red' },
  'enforcement': { label: '環境執法', color: 'purple' },
  'litigation': { label: '訴訟', color: 'blue' },
  'eia-dispute': { label: '環評爭議', color: 'cyan' },
  'industrial-accident': { label: '化學品事故', color: 'orange' },
  'community-health': { label: '社區健康', color: 'pink' }
};

// 指控與已確定的事實要分得出來
const EVENT_STATUSES = {
  alleged: { label: '指控', color: 'yellow' },
  investigating: { label: '調查中', color: 'yellow' },
  concluded: { label: '官方調查已有結論', color: 'gray' },
  penalized: { label: '已裁罰', color: 'red' },
  settled: { label: '已和解', color: 'green' },
  ruled: { label: '已判決', color: 'red' },
  ongoing: { label: '持續中', color: 'orange' }
};
const OPEN_ENDED = new Set(['alleged', 'investigating', 'ongoing']);

const SOURCE_KINDS = { official: '官方文件', court: '法院', company: '公司文件' };
const MEDIA_REGIONS = { taiwan: '台灣媒體', local: '當地媒體', international: '國際媒體' };

const sourceLabel = (source) => {
  if (source.kind === 'media') return MEDIA_REGIONS[source.outletRegion] || '媒體';
  if (source.kind === 'ngo') return source.outletRegion === 'taiwan' ? '台灣 NGO' : 'NGO';
  return SOURCE_KINDS[source.kind] || source.kind;
};

const eventPeriod = (event) => {
  if (event.dateEnd && event.dateEnd !== event.dateStart) return `${event.dateStart} – ${event.dateEnd}`;
  if (!event.dateEnd && OPEN_ENDED.has(event.status)) return `${event.dateStart} 起`;
  return event.dateStart;
};

const EventCard = ({ event, companyData, events }) => {
  const type = EVENT_TYPES[event.type] || { label: event.type, color: 'gray' };
  const status = EVENT_STATUSES[event.status] || { label: event.status, color: 'gray' };
  const facilityById = new Map((companyData.facilities || []).map(f => [f.facilityId, f]));
  const relatedFacilities = (event.related?.echoFacilityIds || []).filter(id => facilityById.has(id));
  const relatedEvents = (event.related?.eventIds || []).map(id => events.find(e => e.id === id)).filter(Boolean);
  const otherCompanies = (event.attribution || []).filter(a => a.shown && a.companyCode !== companyData.companyCode)
    .filter((a, i, all) => all.findIndex(b => b.companyCode === a.companyCode) === i);

  return (
    <Card id={event.id} variant="outline" scrollMarginTop="80px">
      <CardBody>
        <Stack spacing={3}>
          <HStack spacing={2} flexWrap="wrap">
            <Badge colorScheme={type.color}>{type.label}</Badge>
            <Badge colorScheme={status.color} variant="outline">{status.label}</Badge>
          </HStack>
          <Heading size="sm">{event.title}</Heading>
          <HStack spacing={4} color="gray.600" fontSize="sm" flexWrap="wrap">
            <HStack spacing={1}><Icon as={FaCalendarAlt} /><Text>{eventPeriod(event)}</Text></HStack>
            <HStack spacing={1}><Icon as={FaMapMarkerAlt} /><Text>{(event.locations || []).map(l => l.plantSite).join('、')}</Text></HStack>
          </HStack>
          <Text>{event.summary}</Text>
          <EventReportLinks eventId={event.id} />

          <Box bg="gray.50" borderRadius="md" p={3} fontSize="sm">
            <Text fontWeight="bold" color="gray.700" mb={1}>持股關係</Text>
            {(event.holdings || []).map((h, i) => {
              const group = (event.groupControl || []).find(g => g.group === h.group);
              return (
                <Box key={i} mb={1}>
                  <Text color="gray.700">
                    {h.entity}：{h.companyShort || companyData.name} 有效持股 {h.effectivePct}%
                    {h.reason === 'group' && group && `（${group.group}合計 ${group.totalPct}%，依集團規則列入）`}
                  </Text>
                  {h.path?.length > 0 && <Text color="gray.500">{h.path.join(' → ')}</Text>}
                  {h.basis && <Text color="gray.500" fontSize="xs">依據：{h.basis}</Text>}
                </Box>
              );
            })}
            <Text color="gray.500" fontSize="xs">持股比例為最新財報的數字，不一定是事件當時的比例；只計該公司自身的持股鏈，不含集團內的交叉持股。</Text>
            {otherCompanies.length > 0 && (
              <Text color="gray.600" mt={1}>
                同一事件也列在：
                {otherCompanies.map((a, i) => (
                  <span key={a.companyCode}>
                    {i > 0 && '、'}
                    <Link href={`/companies/tw-${a.companyCode}#${event.id}`} legacyBehavior passHref>
                      <ChakraLink color="teal.600">{a.companyShort || a.companyName}（{a.effectivePct}%）</ChakraLink>
                    </Link>
                  </span>
                ))}
              </Text>
            )}
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="sm" color="gray.700" mb={1}>來源</Text>
            <VStack align="stretch" spacing={2}>
              {(event.sources || []).map((s, i) => (
                <Box key={i} fontSize="sm">
                  <HStack spacing={2} flexWrap="wrap">
                    <Badge variant="subtle" colorScheme={s.kind === 'media' ? 'blue' : s.kind === 'ngo' ? 'teal' : 'green'}>{sourceLabel(s)}</Badge>
                    <Text color="gray.600">{s.outlet}・{s.date}</Text>
                  </HStack>
                  <HStack spacing={3} flexWrap="wrap" mt={1}>
                    <ChakraLink href={s.url} isExternal color="teal.600">
                      {s.title} <Icon as={FaExternalLinkAlt} mx="2px" boxSize={3} />
                    </ChakraLink>
                    {s.archiveUrl && (
                      <ChakraLink href={s.archiveUrl} isExternal color="gray.500" fontSize="xs">
                        <Icon as={FaArchive} mr={1} />封存
                      </ChakraLink>
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>

          {(relatedFacilities.length > 0 || relatedEvents.length > 0) && (
            <Box fontSize="sm">
              {relatedFacilities.length > 0 && (
                <Text color="gray.600">
                  相關 EPA 設施：
                  {relatedFacilities.map((id, i) => (
                    <span key={id}>
                      {i > 0 && '、'}
                      <Link href={`/companies/${companyData.id}/facilities/${id}`} legacyBehavior passHref>
                        <ChakraLink color="teal.600">{facilityById.get(id).name}</ChakraLink>
                      </Link>
                    </span>
                  ))}
                </Text>
              )}
              {relatedEvents.length > 0 && (
                <Text color="gray.600">
                  相關事件：
                  {relatedEvents.map((e, i) => (
                    <span key={e.id}>
                      {i > 0 && '、'}
                      <ChakraLink href={`#${e.id}`} color="teal.600">{e.title}</ChakraLink>
                    </span>
                  ))}
                </Text>
              )}
            </Box>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

// 罰款紀錄（Violation Tracker，data/enforcement.json）
const holdingText = (h) => {
  if (!h) return null;
  const parts = [];
  if (h.path?.length > 1) parts.push(h.path.join(' → '));
  else if (h.effectivePct != null && h.effectivePct < 100) parts.push(`${h.path?.[0] || ''} 有效持股 ${h.effectivePct}%`);
  if (h.method === 'curated-associate') parts.push('關聯企業');
  if (h.confidence === 'medium') parts.push('歸屬信心中等');
  return parts.join('，') || null;
};

const EnforcementPanel = ({ records }) => {
  const [category, setCategory] = useState('all');
  if (records.length === 0) return <Text>目前沒有這家公司在美國的罰款紀錄。</Text>;

  const rows = records.map(r => ({ ...r, offense: offenseInfo(r.offenseType) }));
  const counts = rows.reduce((m, r) => ({ ...m, [r.offense.category]: (m[r.offense.category] || 0) + 1 }), {});
  const filtered = category === 'all' ? rows : rows.filter(r => r.offense.category === category);
  const total = filtered.filter(r => !r.isDuplicateFlagged).reduce((sum, r) => sum + r.penaltyAmountUSD, 0);
  const dupCount = filtered.filter(r => r.isDuplicateFlagged).length;
  const parents = [...new Map(records.map(r => [r.parentUrl, r.parentInSource])).entries()];
  const filters = [['all', `全部（${rows.length}）`],
    ...Object.entries(OFFENSE_CATEGORIES).filter(([k]) => counts[k]).map(([k, c]) => [k, `${c.label}（${counts[k]}）`])];

  return (
    <VStack align="stretch" spacing={4}>
      <Text fontSize="sm" color="gray.600">
        美國聯邦與州政府對這家公司，以及依持股歸屬到它的子公司、關聯企業的執法與罰款紀錄。
        資料來自 Good Jobs First 整理的 Violation Tracker（{records[0].snapshotDate} 快照），{VT_SNAPSHOT_NOTE}。
        只收錄有罰款或和解金額的案件，沒有紀錄不代表沒有違規；台灣母公司取得控制以前的罰款不列入。
      </Text>
      <Text fontSize="sm" color="gray.600">
        在 Violation Tracker 查看：
        {parents.map(([url, name], i) => (
          <span key={url}>
            {i > 0 && '、'}
            <ChakraLink href={url} isExternal color="teal.600">{name} <Icon as={FaExternalLinkAlt} mx="2px" boxSize={3} /></ChakraLink>
          </span>
        ))}
      </Text>
      <HStack spacing={2} flexWrap="wrap">
        {filters.map(([k, label]) => (
          <Button key={k} size="xs" colorScheme="purple" variant={category === k ? 'solid' : 'outline'} onClick={() => setCategory(k)}>
            {label}
          </Button>
        ))}
      </HStack>
      <Text fontWeight="semibold">
        {filtered.length} 筆，罰款合計 {formatUSD(total)}
        {dupCount > 0 && <Text as="span" fontWeight="normal" fontSize="sm" color="gray.600">（Violation Tracker 標為與其他紀錄重複計算的 {dupCount} 筆不計入）</Text>}
      </Text>
      <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg="gray.100">
            <Tr>
              <Th>年份</Th>
              <Th>受罰實體</Th>
              <Th>違規類型</Th>
              <Th>機關</Th>
              <Th isNumeric>罰款</Th>
              <Th>來源</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map(r => (
              <Tr key={r.caseId}>
                <Td>{r.year}</Td>
                <Td minW="220px">
                  <Text>{r.companyNameInSource}{r.facilityState && <Text as="span" color="gray.500">（{r.facilityState}）</Text>}</Text>
                  {holdingText(r.holding) && <Text fontSize="xs" color="gray.500">{holdingText(r.holding)}</Text>}
                </Td>
                <Td minW="140px">
                  <Badge colorScheme={r.offense.color} mr={1}>{r.offense.categoryLabel}</Badge>
                  <Text as="span" fontSize="sm">{r.offense.label}</Text>
                </Td>
                <Td minW="160px">{agencyLabel(r.agencyCode)}</Td>
                <Td isNumeric whiteSpace="nowrap">
                  US${r.penaltyAmountUSD.toLocaleString()}
                  {r.isDuplicateFlagged && <Text fontSize="xs" color="gray.500">重複計算</Text>}
                </Td>
                <Td whiteSpace="nowrap">
                  <ChakraLink href={r.sourceUrl || r.parentUrl} isExternal color="teal.600">
                    {r.sourceUrl ? '紀錄' : '母公司頁'} <Icon as={FaExternalLinkAlt} mx="2px" boxSize={3} />
                  </ChakraLink>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

// 分頁順序：污染事件、環境違規記錄、罰款紀錄。有 EPA 違規的開違規分頁，其次事件、罰款紀錄
const defaultTabIndex = (company) => {
  if ((company?.violations?.length || 0) > 0) return 1;
  if ((company?.news?.length || 0) > 0) return 0;
  if ((company?.enforcement?.length || 0) > 0) return 2;
  return 1;
};

const CompanyDetail = ({ companyData }) => {
  const [selectedViolationPlant, setSelectedViolationPlant] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedEventSite, setSelectedEventSite] = useState('all');
  const [tabIndex, setTabIndex] = useState(defaultTabIndex(companyData));

  // 「同一事件也列在」連到別家公司時網址帶 #事件 id：事件分頁不是預設分頁的話，要先切過去再捲動。
  // #enforcement 直接開罰款紀錄分頁。
  // 在公司頁之間切換時元件會沿用，所以每次換公司都重設篩選與分頁。
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const hasEvent = Boolean(id) && (companyData?.news || []).some(e => e.id === id);
    setSelectedViolationPlant('all');
    setSelectedProgram('all');
    setSelectedEventSite('all');
    setTabIndex(hasEvent ? 0 : id === 'enforcement' ? 2 : defaultTabIndex(companyData));
    if (hasEvent) {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [companyData]);

  if (!companyData) {
    return (
      <Layout>
        <Container maxW="container.xl" py={10}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>無法載入公司資訊！</AlertTitle>
            <AlertDescription>請確認公司ID是否正確。</AlertDescription>
          </Alert>
        </Container>
      </Layout>
    );
  }

  const companyInfo = {
    name: companyData.name,
    englishName: companyData.englishName,
    facilityId: companyData.id,
    facilityName: companyData.facilities?.[0]?.name || '總公司',
    address: companyData.address || companyData.facilities?.[0]?.address || 'N/A',
    industry: companyData.industry || 'N/A',
    reportUrl: companyData.website || 'N/A',
    logoUrl: companyData.logoUrl,
    foundedYear: companyData.foundedDate?.substring(0, 4) || 'N/A',
    foundedDate: companyData.foundedDate || 'N/A',
    listedDate: companyData.listedDate || 'N/A',
    companyType: companyData.companyType || 'N/A',
    companyCode: companyData.companyCode || 'N/A',
    chairman: companyData.chairman || 'N/A',
    capital: companyData.capital || 'N/A',
    totalFacilities: companyData.facilities?.length || 0,
    totalViolations: companyData.violations?.length || 0,
    totalEnforcements: companyData.enforcement?.length || 0
  };

  const violationData = companyData.violations?.map(v => ({
    caseNumber: v.violationId,
    date: v.date,
    endDate: v.endDate,
    type: v.violationTypeDesc || v.violationType || 'Environmental Violation',
    violationCode: v.violationCode,
    description: v.description,
    comment: v.comment,
    status: v.status,
    source: v.source,
    plantSite: v.plantSite,
    fine: v.fine || 'N/A',
    program: v.program || 'CWA',
    kind: v.kind,
    penaltyUSD: v.penaltyUSD,
    sourceUrl: v.sourceUrl,
    agencyType: v.agencyType,
    parameterCode: v.parameterCode,
    parameterDesc: v.parameterDesc,
    limitValue: v.limitValue,
    dmrValue: v.dmrValue,
    exceedencePct: v.exceedencePct,
    standardUnit: v.standardUnit,
    monitoringPeriodEndDate: v.monitoringPeriodEndDate,
    valueReceivedDate: v.valueReceivedDate,
    scheduleDate: v.scheduleDate,
    actualDate: v.actualDate
  })) || [];

  // 只有污染事件、不在 EPA 資料裡的公司：EPA 欄位不顯示 0，避免被讀成「沒有違規」
  const inEpaData = companyData.inEpaData !== false;
  const hasFacilities = (companyData.facilities || []).length > 0;
  const events = companyData.news || [];
  const enforcementRecords = companyData.enforcement || [];
  const eventSites = [...new Set(events.flatMap(e => (e.locations || []).map(l => l.plantSite)))].sort();
  const eventSiteOptions = [{ value: 'all', label: '所有廠區' }, ...eventSites.map(site => ({ value: site, label: site }))];
  const filteredEvents = selectedEventSite === 'all'
    ? events
    : events.filter(e => (e.locations || []).some(l => l.plantSite === selectedEventSite));

  // Extract plant site options from violations data to ensure exact match
  const violationPlantSites = [...new Set(
    violationData
      .map(v => v.plantSite)
      .filter(site => site && site !== 'N/A')
  )];
  const plantSiteOptions = [
    { value: 'all', label: '所有廠區' },
    ...violationPlantSites.sort().map(site => ({ value: site, label: site }))
  ];

  // 廠區與類別（水污染／空污／有害廢棄物／EPA 執法案件）兩個篩選疊加；類別按鈕的筆數跟著廠區篩選
  const plantViolations = selectedViolationPlant === 'all'
    ? violationData
    : violationData.filter(v => v.plantSite === selectedViolationPlant);
  const programCounts = plantViolations.reduce((m, v) => ({ ...m, [v.program]: (m[v.program] || 0) + 1 }), {});
  const programFilters = [['all', `全部（${plantViolations.length.toLocaleString()}）`],
    ...Object.entries(ECHO_PROGRAMS).filter(([k]) => programCounts[k]).map(([k, p]) => [k, `${p.label}（${programCounts[k].toLocaleString()}）`])];
  const filteredViolations = useMemo(() => (
    selectedProgram === 'all' ? plantViolations : plantViolations.filter(v => v.program === selectedProgram)
  ), [plantViolations, selectedProgram]);
  const epaPenaltyTotal = filteredViolations.reduce((sum, v) => sum + (v.penaltyUSD || 0), 0);

  // Helper to get the label for the selected plant value
  const getSelectedPlantLabel = (selectedValue) => {
    const selectedOption = plantSiteOptions.find(option => option.value === selectedValue);
    return selectedOption ? selectedOption.label : '選擇廠區';
  };

  // 違規類型的顏色配置
  const getViolationTypeColor = (type) => {
    if (!type) return 'gray';
    if (type.toLowerCase().includes('air')) return 'red';
    if (type.toLowerCase().includes('water')) return 'blue';
    if (type.toLowerCase().includes('waste') || type.toLowerCase().includes('rcra')) return 'orange';
    if (type.toLowerCase().includes('海洋')) return 'cyan';
    return 'gray';
  };

  // 違規狀態的顏色配置
  const getViolationStatusColor = (status) => {
    if (!status) return 'gray';
    switch (status.toLowerCase()) {
      case 'active': return 'red';
      case 'concluded': return 'green';
      case 'unknown': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <Layout>
      <Box bg="green.50" py={6}>
        <Container maxW="container.xl">
          <Breadcrumb spacing="8px" separator={<FaChevronRight color="gray.500" />}>
            <BreadcrumbItem>
              <Link href="/" legacyBehavior passHref>
                <BreadcrumbLink>首頁</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href="/companies" legacyBehavior passHref>
                <BreadcrumbLink>企業列表</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage={!hasFacilities}>
              <Link href="/companies" legacyBehavior passHref>
                <BreadcrumbLink>{companyInfo ? companyInfo.name.split(' (')[0] : '公司'}</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            {hasFacilities && (
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>{companyInfo ? companyInfo.facilityName : '詳細資料'}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </Breadcrumb>

          <Heading mt={4} color="green.600">{companyInfo ? companyInfo.name : '公司名稱載入中...'}</Heading>
          <Text fontSize="lg" color="gray.600">{companyInfo ? companyInfo.englishName : ''}</Text>
        </Container>
      </Box>

      <Container maxW="container.xl" py={10}>
        {/* Company Basic Info */}
        {companyInfo && (
          <VStack spacing={8} align="stretch" mb={10}>
            {companyInfo.logoUrl && (
              <Card variant="outline" borderWidth="1px" borderColor="gray.200" borderRadius="md">
                <CardBody display="flex" justifyContent="center" alignItems="center" bg="white" py={6}>
                  <Image
                    src={companyInfo.logoUrl}
                    alt={companyInfo.name}
                    maxH="120px"
                    maxW="400px"
                    objectFit="contain"
                  />
                </CardBody>
              </Card>
            )}
            <Heading size="lg" color="green.600">公司基本資訊</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card variant="outline" borderWidth="1px" borderColor="gray.200" borderRadius="md">
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Heading size="md" color="green.600" mb={2}><Icon as={FaBuilding} mr={2} />基本資訊</Heading>
                    <Divider />
                    {Object.entries({
                      "公司名稱": companyInfo.name,
                      "公司代號": companyInfo.companyCode,
                      "公司類型": companyInfo.companyType,
                      "董事長": companyInfo.chairman,
                      "地址": companyInfo.address,
                      "產業": companyInfo.industry,
                      "成立日期": companyInfo.foundedDate,
                      "上市日期": companyInfo.listedDate,
                      "資本額": companyInfo.capital !== 'N/A' ? `NT$ ${parseInt(companyInfo.capital).toLocaleString()}` : 'N/A',
                    }).map(([key, value]) => (
                      <HStack key={key} width="100%" justifyContent="space-between">
                        <Text fontWeight="bold" color="gray.600">{key}:</Text>
                        <Text color="gray.800" textAlign="right">{value || 'N/A'}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              <Card variant="outline" borderWidth="1px" borderColor="gray.200" borderRadius="md">
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Heading size="md" color="green.600" mb={2}><Icon as={FaNewspaper} mr={2} />統計資訊</Heading>
                    <Divider />
                     {Object.entries({
                      "總廠區數": inEpaData ? companyInfo.totalFacilities : '不在 EPA 資料範圍',
                      "總違規數": inEpaData ? companyInfo.totalViolations : '不在 EPA 資料範圍',
                      "污染事件數": events.length,
                      "罰款紀錄": enforcementRecords.length > 0
                        ? `${enforcementRecords.length} 筆（${formatUSD(companyData.enforcementSummary?.penaltyTotalUSD || 0)}）`
                        : 0,
                      "官方網站": companyInfo.reportUrl && companyInfo.reportUrl !== 'N/A' ? (
                        <ChakraLink href={companyInfo.reportUrl} isExternal color="teal.500">
                          查看網站 <Icon as={FaExternalLinkAlt} mx="2px" />
                        </ChakraLink>
                      ) : 'N/A',
                    }).map(([key, value]) => (
                      <HStack key={key} width="100%" justifyContent="space-between">
                        <Text fontWeight="bold" color="gray.600">{key}:</Text>
                        <Box textAlign="right">{typeof value === 'string' || typeof value === 'number' ? value : value || 'N/A'}</Box>
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        )}

        {/* Facilities List */}
        <VStack spacing={6} align="stretch" mb={10}>
          <Heading size="lg" color="green.600">廠區列表</Heading>
          {inEpaData ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {companyData.facilities?.map(facility => (
                <FacilityCard key={facility.facilityId} facility={facility} companyId={companyData.id} />
              ))}
            </SimpleGrid>
          ) : (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <AlertDescription>
                此公司在美國 EPA 資料中沒有對應設施。
                {events.length > 0 && '污染事件來自官方文件與新聞報導。'}
                {enforcementRecords.length > 0 && '罰款紀錄來自 Violation Tracker。'}
              </AlertDescription>
            </Alert>
          )}
        </VStack>

        <CompanyReports companyCode={companyData.companyCode} />

        {/* Tabs for News and Violations */}
        <Tabs variant="enclosed-colored" colorScheme="green" isFitted index={tabIndex} onChange={setTabIndex}>
          <TabList mb="1em">
            <Tab>污染事件（{events.length}）</Tab>
            <Tab>環境違規記錄（{inEpaData ? violationData.length.toLocaleString() : '—'}）</Tab>
            <Tab>罰款紀錄（{enforcementRecords.length}）</Tab>
          </TabList>

          <TabPanels>

            {/* 污染事件 Tab */}
            <TabPanel>
              <VStack align="stretch" spacing={4}>
                <Text fontSize="sm" color="gray.600">
                  收錄台灣上市公司境外據點的污染事件。每個事件至少有一份官方、法院或公司文件，或兩家互相獨立的媒體報導；
                  指控與已確定的事實以狀態標示區分。
                  <ChakraLink href={NEWS_SPEC_URL} isExternal color="teal.600" ml={1}>收錄原則</ChakraLink>
                </Text>
                {eventSites.length > 1 && (
                  <HStack>
                    <Icon as={FaFilter} />
                    <Text fontWeight="bold">篩選廠區:</Text>
                    <Menu>
                      <MenuButton
                        as={Button}
                        rightIcon={<FaChevronDown />}
                        variant="outline"
                        size="sm"
                        minWidth="200px"
                        textAlign="left"
                      >
                        <Flex justify="space-between" align="center" width="100%">
                          {eventSiteOptions.find(o => o.value === selectedEventSite)?.label || '選擇廠區'}
                        </Flex>
                      </MenuButton>
                      <MenuList zIndex={10}>
                        {eventSiteOptions.map(option => (
                          <MenuItem
                            key={option.value}
                            onClick={() => setSelectedEventSite(option.value)}
                            icon={selectedEventSite === option.value ? <FaCheck /> : undefined}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </HStack>
                )}
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} companyData={companyData} events={events} />
                  ))
                ) : (
                  <Text>目前沒有收錄這家公司的境外污染事件。</Text>
                )}
              </VStack>
            </TabPanel>

            {/* 環境違規記錄 Tab */}
            <TabPanel>
              <VStack align="stretch" spacing={4}>
                {inEpaData && <Text fontSize="sm" color="gray.600">{ECHO_PROGRAMS_NOTE}</Text>}
                <HStack>
                  <Icon as={FaFilter} />
                  <Text fontWeight="bold">篩選廠區:</Text>
                  <Menu>
                    <MenuButton 
                      as={Button} 
                      rightIcon={<FaChevronDown />} 
                      variant="outline" 
                      size="sm" 
                      minWidth="200px" 
                      textAlign="left"
                    >
                       <Flex justify="space-between" align="center" width="100%">
                        {getSelectedPlantLabel(selectedViolationPlant)}
                      </Flex>
                    </MenuButton>
                    <MenuList zIndex={10}> 
                      {plantSiteOptions.map(option => (
                        <MenuItem 
                          key={option.value} 
                          onClick={() => setSelectedViolationPlant(option.value)}
                          icon={selectedViolationPlant === option.value ? <FaCheck /> : undefined}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </HStack>
                {programFilters.length > 2 && (
                  <HStack spacing={2} flexWrap="wrap">
                    {programFilters.map(([k, label]) => (
                      <Button key={k} size="xs" colorScheme={k === 'all' ? 'green' : ECHO_PROGRAMS[k].color}
                        variant={selectedProgram === k ? 'solid' : 'outline'} onClick={() => setSelectedProgram(k)}>
                        {label}
                      </Button>
                    ))}
                  </HStack>
                )}
                {epaPenaltyTotal > 0 && (
                  <Text fontSize="sm" fontWeight="semibold">
                    EPA 紀錄中有罰款金額的處分合計 {formatUSD(epaPenaltyTotal)}
                    <Text as="span" fontWeight="normal" color="gray.600">（與「罰款紀錄」分頁可能是同一批案件）</Text>
                  </Text>
                )}
                {filteredViolations.length > 0 ? (
                  <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead bg="gray.100">
                        <Tr>
                          <Th>案件編號</Th>
                          <Th>發生日期</Th>
                          <Th>類別</Th>
                          <Th>監測期結束</Th>
                          <Th>接收日期</Th>
                          <Th>類型</Th>
                          <Th>違規代碼</Th>
                          <Th>描述</Th>
                          <Th>備註</Th>
                          <Th>狀態</Th>
                          <Th isNumeric>罰款</Th>
                          <Th>來源</Th>
                          <Th>廠區</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredViolations.map((violation, index) => (
                          <Tr key={index}>
                            <Td>
                              {violation.sourceUrl ? (
                                <ChakraLink href={violation.sourceUrl} isExternal color="teal.600">
                                  {violation.caseNumber} <Icon as={FaExternalLinkAlt} mx="2px" boxSize={3} />
                                </ChakraLink>
                              ) : violation.caseNumber || 'N/A'}
                            </Td>
                            <Td whiteSpace="nowrap">{violation.date || 'N/A'}</Td>
                            <Td minW="110px">
                              <Badge colorScheme={programInfo(violation.program).color} fontSize="0.8em">{programInfo(violation.program).label}</Badge>
                              {RECORD_KINDS[violation.kind] && <Text fontSize="xs" color="gray.500">{RECORD_KINDS[violation.kind]}</Text>}
                            </Td>
                            <Td whiteSpace="nowrap">{violation.monitoringPeriodEndDate || 'N/A'}</Td>
                            <Td whiteSpace="nowrap">{violation.valueReceivedDate || 'N/A'}</Td>
                            <Td>
                              <Badge colorScheme={getViolationTypeColor(violation.type)} fontSize="0.8em" whiteSpace="normal">
                                {violation.type || 'N/A'}
                              </Badge>
                            </Td>
                            <Td>{violation.violationCode || 'N/A'}</Td>
                            <Td maxW="300px">{violation.description || 'N/A'}</Td>
                            <Td maxW="200px">{violation.comment || 'N/A'}</Td>
                            <Td>
                              <Badge colorScheme={getViolationStatusColor(violation.status)} fontSize="0.8em">
                                {violation.status || 'N/A'}
                              </Badge>
                            </Td>
                            <Td isNumeric whiteSpace="nowrap">{violation.penaltyUSD ? `US$${violation.penaltyUSD.toLocaleString()}` : '—'}</Td>
                            <Td>{violation.source || 'N/A'}</Td>
                            <Td>{violation.plantSite || 'N/A'}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                ) : (
                  <Text>{inEpaData ? '此廠區無相關違規記錄。' : '此公司在美國 EPA 資料中沒有對應設施。'}</Text>
                )}
              </VStack>
            </TabPanel>

            {/* 罰款紀錄 Tab：換公司時重新掛載，篩選跟著重設 */}
            <TabPanel>
              <EnforcementPanel key={companyData.id} records={enforcementRecords} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
};

export default CompanyDetail;

// getStaticPaths - 生成所有公司頁面路徑
export async function getStaticPaths() {
  const companyIds = getAllCompanyIds();

  const paths = companyIds.map(id => ({
    params: { id }
  }));

  return {
    paths,
    fallback: false
  };
}

// getStaticProps - 載入特定公司資料
export async function getStaticProps({ params }) {
  const companyData = getCompanyData(params.id);

  return {
    props: {
      companyData
    }
  };
} 