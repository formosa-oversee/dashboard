import Head from 'next/head';
import Link from 'next/link';
import { Box, Container, Heading, Text, Button, HStack } from '@chakra-ui/react';
import Layout from '../components/Layout';

/**
 * GitHub Pages 找不到檔案時回的頁面（靜態匯出成 out/404.html）。
 *
 * 靜態匯出的頁面是 reports.html、companies/tw-2330.html 這種形式，網址結尾多一個斜線
 * （/reports/）就會找不到。這種情況在 <head> 裡就轉到不帶斜線的網址，保留查詢字串與 #錨點，
 * 畫面不會先閃出「找不到頁面」。不帶斜線也找不到的網址才顯示下面的內容，不會無限轉址。
 */
const TRAILING_SLASH_REDIRECT = `(function () {
  var l = window.location;
  if (l.pathname.length > 1 && /\\/$/.test(l.pathname)) {
    l.replace(l.pathname.replace(/\\/+$/, '') + l.search + l.hash);
  }
})();`;

export default function NotFound() {
  return (
    <Layout>
      <Head>
        <title>找不到頁面｜Formosa Oversee</title>
        <script dangerouslySetInnerHTML={{ __html: TRAILING_SLASH_REDIRECT }} />
      </Head>
      <Container maxW="container.md" py={{ base: 16, md: 24 }} textAlign="center">
        <Text fontSize="sm" fontWeight="bold" letterSpacing="0.2em" color="gray.500">404</Text>
        <Heading as="h2" size="xl" color="green.600" mt={3}>找不到這個頁面</Heading>
        <Text color="gray.600" mt={4}>網址可能打錯了，或這個頁面已經移除。</Text>
        <HStack spacing={3} justify="center" mt={8} flexWrap="wrap">
          <Link href="/" legacyBehavior passHref><Button as="a" colorScheme="green">回首頁</Button></Link>
          <Link href="/companies" legacyBehavior passHref><Button as="a" variant="outline" colorScheme="green">企業列表</Button></Link>
          <Link href="/reports" legacyBehavior passHref><Button as="a" variant="outline" colorScheme="green">專題報導</Button></Link>
        </HStack>
        <Box h={{ base: 8, md: 16 }} />
      </Container>
    </Layout>
  );
}
