import Link from 'next/link';
import { Box, Text, Link as ChakraLink } from '@chakra-ui/react';
import { getReportsForCompany, getReportsForEvent, reportPath } from '../../lib/reports';
import { R } from './tokens';

/**
 * 公司頁與專題的雙向連結（pages/companies/[id].js 用）
 * CompanyReports：分頁上方的專題卡，lib/reports.js 的 companies 有列這家公司才顯示。
 * EventReportLinks：污染事件卡裡的「相關專題」，relatedEventIds 有列這個事件才顯示。
 */

export const CompanyReports = ({ companyCode }) => getReportsForCompany(companyCode).map(r => (
  <Link key={r.slug} href={reportPath(r)} legacyBehavior>
    <ChakraLink display="flex" alignItems="center" justifyContent="space-between" gap={4} mb={6} px={6} py={5}
      bg={R.deep} color="#fff" borderRadius="md" _hover={{ textDecoration: 'none', bg: R.deep2 }}
      bgImage="radial-gradient(ellipse at 90% 0%, rgba(127,180,209,0.22), transparent 60%)">
      <Box>
        <Text fontSize="12px" fontWeight={700} letterSpacing="0.16em" color={R.waterMid}>專題報導｜{r.kicker}</Text>
        <Text fontWeight={700} fontSize={{ base: '1.1rem', md: '1.3rem' }} lineHeight={1.5} mt={1}>{r.headline}</Text>
        <Text fontSize="14px" color="rgba(255,255,255,0.75)" mt={1}>{r.title}・閱讀約 {r.readingMinutes} 分鐘</Text>
      </Box>
      <Text as="span" aria-hidden fontSize="1.5rem" flexShrink={0}>→</Text>
    </ChakraLink>
  </Link>
));

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
