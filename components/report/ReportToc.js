import { useEffect, useRef, useState } from 'react';
import {
  Box, Flex, Text, Button, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
  DrawerCloseButton, useDisclosure
} from '@chakra-ui/react';
import { R } from './tokens';

/**
 * 專題目次。桌機是左側黏著的進度條：讀到哪，綠色就填到哪；手機是頂端一條章節列。
 * 兩者各自用 useReading 追蹤：目前章節取「頂端已經捲過畫面上緣 120px 的最後一章」，
 * 進度是 <article> 捲過的比例。
 *
 * 捲動時每一格都會量一次，所以不能讓整頁跟著重新 render：長篇整頁 render 加重排一次要上百毫秒，
 * 手機上捲起來會一頓一頓，還會讓封面的換行來回跳。目前章節整篇只變十幾次，放在目次自己的 state；
 * 進度直接由 onProgress 寫進進度條的 transform，不經過 React，也不產生新的 CSS class。
 */

const ACTIVE_LINE = 120;

const useReading = (items, articleRef, onProgress) => {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    let frame = null;
    const measure = () => {
      frame = null;
      let id = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= ACTIVE_LINE) id = item.id;
      }
      setActiveId(id);
      const article = articleRef.current;
      if (article) {
        const rect = article.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        onProgressRef.current(scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 1);
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items, articleRef]);

  return activeId;
};

// delay：從手機目次抽屜點過來時，要等抽屜關掉、解除捲動鎖定後再捲
const jumpTo = (id, delay = 0) => (e) => {
  e.preventDefault();
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  }, delay);
};

export const ReportToc = ({ items, articleRef }) => {
  const barRef = useRef(null);
  const percentRef = useRef(null);
  const activeId = useReading(items, articleRef, (progress) => {
    barRef.current.style.transform = `scaleY(${progress})`;
    percentRef.current.textContent = Math.round(progress * 100);
  });

  return (
    <Box as="nav" aria-label="目次" position="sticky" top="40px" pt={{ base: 0, lg: 20 }}>
      <Text fontSize="12px" fontWeight={700} letterSpacing="0.2em" color={R.muted} mb={4}>目次</Text>
      <Box position="relative" pl={5}>
        {/* 進度條：灰色管子 + 讀到哪裡就填到哪裡的綠 */}
        <Box position="absolute" left="3px" top="6px" bottom="6px" w="3px" bg={R.rule} borderRadius="full" overflow="hidden">
          <Box ref={barRef} position="absolute" inset={0} bg={R.accent} transformOrigin="top" transform="scaleY(0)" />
        </Box>
        <Box as="ol" listStyleType="none" m={0} p={0}>
          {items.map(item => {
            const active = item.id === activeId;
            return (
              <Box as="li" key={item.id} mb={1}>
                <Box as="a" href={`#${item.id}`} onClick={jumpTo(item.id)} display="flex" gap={2.5} py={1.5}
                  fontSize="14px" lineHeight={1.5} color={active ? R.ink : R.muted} fontWeight={active ? 700 : 400}
                  aria-current={active ? 'location' : undefined} _hover={{ color: R.ink }} transition="color .2s">
                  <Text as="span" fontFamily={R.serif} fontWeight={700} color={active ? R.accent : R.accentMid} minW="1.2em">
                    {item.num}
                  </Text>
                  {item.label}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Text fontSize="12px" color={R.muted} mt={5} sx={{ fontVariantNumeric: 'tabular-nums' }}>
        已讀 <span ref={percentRef}>0</span>%
      </Text>
    </Box>
  );
};

export const MobileToc = ({ items, articleRef }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const barRef = useRef(null);
  const activeId = useReading(items, articleRef, (progress) => {
    barRef.current.style.transform = `scaleX(${progress})`;
  });
  const active = items.find(i => i.id === activeId) || items[0];

  return (
    <Box display={{ base: 'block', lg: 'none' }} position="sticky" top={0} zIndex={20}
      bg="rgba(251,250,246,0.94)" backdropFilter="saturate(1.4) blur(8px)" borderBottomWidth="1px" borderColor={R.rule}>
      <Flex align="center" justify="space-between" px={4} h="48px" gap={3}>
        <Text fontSize="14px" color={R.ink} noOfLines={1}>
          <Text as="span" fontFamily={R.serif} fontWeight={700} color={R.accent} mr={2}>{active.num}</Text>
          {active.label}
        </Text>
        <Button size="sm" variant="outline" borderColor={R.ink} color={R.ink} borderRadius="0" fontWeight={700}
          flexShrink={0} onClick={onOpen}>
          目次
        </Button>
      </Flex>
      <Box ref={barRef} h="2px" bg={R.accent} transformOrigin="left" transform="scaleX(0)" />

      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={R.paper} borderTopRadius="lg" maxH="80vh">
          <DrawerCloseButton />
          <DrawerHeader fontFamily={R.serif} fontWeight={900} color={R.ink}>目次</DrawerHeader>
          <DrawerBody pb={8}>
            <Box as="ol" listStyleType="none" m={0} p={0}>
              {items.map(item => (
                <Box as="li" key={item.id} borderTopWidth="1px" borderColor={R.rule}>
                  <Box as="a" href={`#${item.id}`} display="flex" gap={3} py={3} fontSize="16px"
                    color={item.id === activeId ? R.ink : R.inkSoft} fontWeight={item.id === activeId ? 700 : 400}
                    onClick={(e) => { onClose(); jumpTo(item.id, 250)(e); }}>
                    <Text as="span" fontFamily={R.serif} fontWeight={700} color={R.accent} minW="1.4em">{item.num}</Text>
                    {item.label}
                  </Box>
                </Box>
              ))}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
