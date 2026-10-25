import Link from 'next/link';
import { Box, Flex, Text, Link as ChakraLink } from '@chakra-ui/react';
import { getReportsForCompany, getReportsForEvent, reportPath } from '../../lib/reports';
import { R } from './tokens';

/**
 * 公司頁與專題的雙向連結（pages/companies/[id].js 用）
 * CompanyReports：分頁上方的專題區塊，lib/reports.js 的 companies 有列這家公司才顯示；多篇時一篇一列、新的在上。
 * EventReportLinks：污染事件卡裡的「相關專題」，relatedEventIds 有列這個事件才顯示。
 */

export const CompanyReports = ({ companyCode }) => {
  const reports = getReportsForCompany(companyCode);
  if (reports.length === 0) return null;
  return (
    <Box mb={6} bg={R.deep} color="#fff" borderRadius="md" overflow="hidden"
      bgImage={`radial-gradient(ellipse at 90% 0%, ${R.glow}, transparent 60%)`}>
      <Text px={6} pt={5} fontSize="12px" fontWeight={700} letterSpacing="0.16em" color={R.onDeep}>
        專題報導（{reports.length}）
      </Text>
      {reports.map((r, i) => (
        <Link key={r.slug} href={reportPath(r)} legacyBehavior>
          <ChakraLink display="flex" alignItems="center" justifyContent="space-between" gap={4} px={6} py={4}
            borderTopWidth={i > 0 ? '1px' : 0} borderColor="rgba(255,255,255,0.12)"
            _hover={{ textDecoration: 'none', bg: 'rgba(255,255,255,0.06)' }}>
            <Box>
              <Text fontWeight={700} fontSize={{ base: '1.05rem', md: '1.2rem' }} lineHeight={1.5}>{r.headline}</Text>
              <Text fontSize="14px" color="rgba(255,255,255,0.75)" mt={1}>
                {r.kicker}・{r.title}・閱讀約 {r.readingMinutes} 分鐘
              </Text>
            </Box>
            <Text as="span" aria-hidden fontSize="1.4rem" flexShrink={0}>→</Text>
          </ChakraLink>
        </Link>
      ))}
      <Flex h={2} />
    </Box>
  );
};

export const EventReportLinks = ({ eventId }) => {
  const reports = getReportsForEvent(eventId);
  if (reports.length === 0) return null;
  return (
    <Text fontSize="sm" color="gray.600">
      相關專題：
      {reports.map((r, i) => (
        <span key={r.slug}>
          {i > 0 && '、'}
          <Link href={reportPath(r)} legacyBehavior>
            <ChakraLink color="teal.600">{r.title}</ChakraLink>
          </Link>
        </span>
      ))}
    </Text>
  );
};
