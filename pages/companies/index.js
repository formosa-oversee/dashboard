import { useMemo, useState } from 'react';
import { Box, Container, Heading, Text, Grid, GridItem, VStack, HStack, Badge, Card, CardBody, Stack, Divider, CardFooter, Button, Image, Input, InputGroup, InputLeftElement, Flex, Select } from '@chakra-ui/react';
import { FaSearch, FaIndustry, FaBuilding, FaChevronRight, FaExclamationTriangle, FaGavel } from 'react-icons/fa';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { formatUSD } from '../../lib/enforcement';


const CompanyCard = ({ company }) => {
  return (
    <Link href={`/companies/${company.id}`} legacyBehavior passHref>
      <Card as="a" boxShadow="md" borderRadius="lg" h="100%" cursor="pointer" _hover={{ boxShadow: "xl" }}>
        <CardBody>
          {company.logoUrl ? (
            <Image
              src={company.logoUrl}
              alt={company.name}
              borderRadius="lg"
              height="150px"
              width="100%"
              objectFit="contain"
              bg="white"
              p={4}
            />
          ) : (
            // 沒有 logo 時顯示公司名稱（原本的 via.placeholder.com 已停止服務，會變成破圖）
            <Flex height="150px" borderRadius="lg" bg="gray.50" align="center" justify="center" p={4}>
              <Text fontSize="xl" fontWeight="bold" color="gray.500" textAlign="center">{company.name}</Text>
            </Flex>
          )}
          <Stack mt="6" spacing="3">
            <Heading size="md">{company.name}</Heading>
            <Text color="gray.600" fontSize="sm">{company.englishName}</Text>
            <HStack>
              <FaIndustry />
              <Text color="gray.600">{company.industry}</Text>
            </HStack>
            {company.inEpaData ? (
              <>
                <Text color="gray.600">廠區數量: {company.facilities.length}</Text>
                <Text color="gray.600">違規記錄: {company.totalViolations}</Text>
              </>
            ) : (
              <Text color="gray.500">不在美國 EPA 資料範圍</Text>
            )}
            {company.newsCount > 0 && (
              <HStack>
                <FaExclamationTriangle color="#DD6B20" />
                <Text color="orange.600" fontWeight="semibold">污染事件: {company.newsCount}</Text>
              </HStack>
            )}
            {company.enforcementCount > 0 && (
              <HStack>
                <FaGavel color="#805AD5" />
                <Text color="purple.600" fontWeight="semibold">罰款紀錄: {company.enforcementCount}（{formatUSD(company.penaltyTotalUSD)}）</Text>
              </HStack>
            )}
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <Button colorScheme="green" w="100%" rightIcon={<FaChevronRight />}>
            查看詳情
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

// 排序：主鍵依選項（污染事件數或罰款紀錄數），同數時依序比另一項、罰款金額、EPA 違規數，最後依公司代號
const SORTS = {
  news: { label: '依污染事件', keys: ['newsCount', 'enforcementCount', 'penaltyTotalUSD', 'totalViolations'] },
  enforcement: { label: '依罰款紀錄', keys: ['enforcementCount', 'penaltyTotalUSD', 'newsCount', 'totalViolations'] },
};

const sortCompanies = (list, sortKey) => {
  const keys = SORTS[sortKey].keys;
  return [...list].sort((a, b) => {
    for (const k of keys) {
      const d = (b[k] || 0) - (a[k] || 0);
      if (d !== 0) return d;
    }
    return String(a.id).localeCompare(String(b.id));
  });
};

export default function Companies({ companiesData: initialCompaniesData = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('news');
  const [companiesData] = useState(initialCompaniesData);
  const [filteredCompanies, setFilteredCompanies] = useState(initialCompaniesData);
  const sortedCompanies = useMemo(() => sortCompanies(filteredCompanies, sortKey), [filteredCompanies, sortKey]);

  // Debug: Log data on mount
  if (typeof window !== 'undefined' && initialCompaniesData.length > 0) {
    console.log('Companies loaded:', initialCompaniesData.length);
  }

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredCompanies(companiesData);
    } else {
      const filtered = companiesData.filter(company =>
        company.name.toLowerCase().includes(term.toLowerCase()) ||
        (company.englishName || '').toLowerCase().includes(term.toLowerCase()) ||
        company.industry.toLowerCase().includes(term.toLowerCase()) ||
        company.facilities.some(facility =>
          facility.name?.toLowerCase().includes(term.toLowerCase()) ||
          facility.city?.toLowerCase().includes(term.toLowerCase()) ||
          facility.state?.toLowerCase().includes(term.toLowerCase()) ||
          facility.country?.toLowerCase().includes(term.toLowerCase())
        )
      );
      setFilteredCompanies(filtered);
    }
  };

  return (
    <Layout>
      <Box bg="green.50" py={6}>
        <Container maxW="container.xl">
          <Heading color="green.600">企業列表</Heading>
          <Text color="gray.600" mt={2}>
            台灣上市公司海外據點的污染事件、罰款紀錄與美國 EPA 違規紀錄
          </Text>
        </Container>
      </Box>

      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Flex mb={6} gap={4} direction={{ base: 'column', md: 'row' }}>
            <InputGroup flex="1">
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="搜尋企業名稱、行業或地區"
                value={searchTerm}
                onChange={handleSearch}
                borderRadius="md"
                bg="white"
              />
            </InputGroup>
            <Select
              aria-label="排序"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              bg="white"
              w={{ base: '100%', md: '200px' }}
            >
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>{s.label}</option>
              ))}
            </Select>
          </Flex>

          <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
            {sortedCompanies.map(company => (
              <GridItem key={company.id}>
                <CompanyCard company={company} />
              </GridItem>
            ))}
          </Grid>

          {filteredCompanies.length === 0 && (
            <Box textAlign="center" py={10} bg="white" rounded="md" shadow="sm" p={6}>
              <Text fontSize="lg">沒有找到符合的企業，請嘗試其他搜尋詞</Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Layout>
  );
}

// getStaticProps - 在 build 時載入資料
export async function getStaticProps() {
  // Import server-side only modules here
  const { getAllCompanies, getCompanyFacilities } = await import('../../lib/gcs-api-server');

  try {
    const allCompanies = getAllCompanies();

    // Transform GCS data to match UI structure
    const transformedData = allCompanies.map(company => {
      const facilities = getCompanyFacilities(company.id);

      return {
        id: company.id,
        name: company.name,
        englishName: company.englishName || '',
        industry: company.industry || 'N/A',
        logoUrl: company.logoUrl || null,
        facilities: facilities,
        totalViolations: company.violationCount,
        totalFacilities: company.facilityCount,
        newsCount: company.newsCount,
        enforcementCount: company.enforcementCount,
        penaltyTotalUSD: company.penaltyTotalUSD,
        inEpaData: company.inEpaData
      };
    });

    console.log(`[getStaticProps] Loaded ${transformedData.length} companies`);

    return {
      props: {
        companiesData: transformedData
      }
    };
  } catch (error) {
    console.error('[getStaticProps] Error:', error);
    return {
      props: {
        companiesData: []
      }
    };
  }
} 