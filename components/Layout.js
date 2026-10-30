import { Box, Flex, Container, Heading, Text, HStack, Link as ChakraLink, Button, VStack, Icon } from '@chakra-ui/react';
import { FaLeaf, FaGithub, FaInstagram, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
import { SITE } from '../lib/site';

// 導航欄組件
const Navbar = () => {
  return (
    <Box as="nav" bg="green.50" py={4} boxShadow="sm">
      <Container maxW="container.xl">
        {/* 手機寬度放不下 logo + 四個按鈕，按鈕換到第二行並縮小 */}
        <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={2}>
          <Link href="/" legacyBehavior passHref>
            <Flex as="a" alignItems="center" cursor="pointer">
              <Icon as={FaLeaf} color="green.500" boxSize={6} mr={2} />
              <Heading as="h1" size="lg" color="green.600">Formosa Oversee</Heading>
            </Flex>
          </Link>
          <HStack spacing={{ base: 0, md: 6 }} w={{ base: '100%', md: 'auto' }} justifyContent={{ base: 'space-between', md: 'flex-end' }}>
            <Link href="/map" legacyBehavior passHref>
              <Button as="a" variant="ghost" colorScheme="green" size={{ base: 'sm', md: 'md' }}>污染地圖</Button>
            </Link>
            <Link href="/companies" legacyBehavior passHref>
              <Button as="a" variant="ghost" colorScheme="green" size={{ base: 'sm', md: 'md' }}>企業列表</Button>
            </Link>
            <Link href="/reports" legacyBehavior passHref>
              <Button as="a" variant="ghost" colorScheme="green" size={{ base: 'sm', md: 'md' }}>專題報導</Button>
            </Link>
            <Link href="/about" legacyBehavior passHref>
              <Button as="a" variant="ghost" colorScheme="green" size={{ base: 'sm', md: 'md' }}>關於我們</Button>
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

// 頁尾組件
const Footer = () => {
  return (
    <Box as="footer" bg="gray.50" pt={10} pb={6} mt="auto">
      <Container maxW="container.xl">
        <VStack spacing={6}>
          <Flex w="100%" justifyContent="space-between" flexDir={{ base: 'column', md: 'row' }} gap={4}>
            <Box>
              <Heading size="md" mb={4} color="green.600">{SITE.name}</Heading>
              <Text color="gray.600">{SITE.tagline}</Text>
              <Text color="gray.600" maxW="md" mt={2}>
                追蹤台灣上市公司在海外工廠的環境違規與污染事件，讓企業在海外的表現也被看見。
              </Text>
              <Link href="/about" legacyBehavior passHref>
                <ChakraLink color="green.600" fontSize="sm" mt={3} display="inline-block">關於我們 →</ChakraLink>
              </Link>
            </Box>
            <Box>
              <Heading size="sm" mb={4} color="green.600">聯絡我們</Heading>
              <VStack align="flex-start" spacing={2}>
                <ChakraLink href={SITE.instagramUrl} isExternal color="gray.600" display="flex" alignItems="center" gap={2}>
                  <Icon as={FaInstagram} boxSize={5} />@{SITE.instagramHandle}
                </ChakraLink>
                <ChakraLink href={`mailto:${SITE.email}`} color="gray.600" display="flex" alignItems="center" gap={2}>
                  <Icon as={FaEnvelope} boxSize={5} />{SITE.email}
                </ChakraLink>
                <ChakraLink href={SITE.githubUrl} isExternal color="gray.600" display="flex" alignItems="center" gap={2}>
                  <Icon as={FaGithub} boxSize={5} />原始碼與收錄規格
                </ChakraLink>
              </VStack>
            </Box>
          </Flex>
          <Box w="100%" borderTopWidth={1} borderColor="gray.200" pt={6}>
            <Text color="gray.500" fontSize="sm" textAlign="center">
              © {new Date().getFullYear()} Formosa Oversee. 版權所有。
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

// 佈局組件
const Layout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Box flex="1">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout; 