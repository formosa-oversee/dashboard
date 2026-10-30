import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Box, Container, Flex, Heading, Text, HStack, IconButton } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { R } from './tokens';
import { reportPath } from '../../lib/reports';

/**
 * 首頁的專題輪播：一條深綠帶，一次一篇，可左右滑（手機用手指、桌機用箭頭或觸控板），下方圓點對應每一篇。
 * 用原生的水平捲動加 scroll-snap，不用輪播套件：手機滑動的手感就是瀏覽器本身的，圓點跟著捲動位置更新。
 */
const Slide = ({ report, index, total }) => (
  <Link href={reportPath(report)} legacyBehavior passHref>
    <Box as="a" display="block" flex="0 0 100%" scrollSnapAlign="start" color="white"
      aria-label={`第 ${index + 1} 篇，共 ${total} 篇：${report.headline}`}>
      <Container maxW="container.xl" py={{ base: 8, md: 10 }} px={{ base: 6, md: 16 }}>
        <Text fontSize="sm" fontWeight="bold" letterSpacing="0.16em" color={R.onDeep}>
          {index === 0 ? '最新專題' : '專題報導'}｜{report.kicker}
        </Text>
        <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} mt={2} lineHeight={1.4} noOfLines={{ base: 3, md: 2 }}>
          {report.headline}
        </Heading>
        <Text color="whiteAlpha.800" mt={1}>{report.title}・閱讀約 {report.readingMinutes} 分鐘 →</Text>
      </Container>
    </Box>
  </Link>
);

const ReportCarousel = ({ reports }) => {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  // 圓點跟著實際捲動位置走，手指滑到一半放開、被 snap 拉回時也對得上
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = () => setActive(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const target = (index + reports.length) % reports.length;
    track.scrollTo({ left: target * track.clientWidth, behavior: 'smooth' });
  };

  if (reports.length === 0) return null;

  return (
    <Box as="section" aria-label="專題報導" aria-roledescription="carousel" position="relative" bg={R.deep}
      bgImage={`radial-gradient(ellipse at 85% 0%, ${R.glow}, transparent 60%)`}>
      <Flex ref={trackRef} overflowX="auto" scrollSnapType="x mandatory" scrollBehavior="smooth"
        sx={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
        {reports.map((report, i) => <Slide key={report.slug} report={report} index={i} total={reports.length} />)}
      </Flex>

      {reports.length > 1 && (
        <>
          {/* 左右箭頭只在桌機顯示；手機直接滑 */}
          {[{ dir: -1, icon: FaChevronLeft, label: '上一篇', side: { left: 2 } },
            { dir: 1, icon: FaChevronRight, label: '下一篇', side: { right: 2 } }].map(({ dir, icon: ArrowIcon, label, side }) => (
            <IconButton key={label} aria-label={label} icon={<ArrowIcon />} onClick={() => goTo(active + dir)}
              display={{ base: 'none', md: 'inline-flex' }} position="absolute" top="50%" transform="translateY(-50%)" {...side}
              variant="ghost" color="whiteAlpha.800" _hover={{ bg: 'whiteAlpha.200', color: 'white' }} borderRadius="full" />
          ))}
          <HStack justify="center" spacing={2} pb={5} mt={-2}>
            {reports.map((report, i) => (
              <Box as="button" key={report.slug} type="button" onClick={() => goTo(i)}
                aria-label={`第 ${i + 1} 篇：${report.title}`} aria-current={i === active ? 'true' : undefined}
                w={i === active ? '22px' : '8px'} h="8px" borderRadius="full" transition="all .2s"
                bg={i === active ? R.onDeep : 'whiteAlpha.500'} _hover={{ bg: R.onDeep }} />
            ))}
          </HStack>
        </>
      )}
    </Box>
  );
};

export default ReportCarousel;
