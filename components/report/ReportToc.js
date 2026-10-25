import { useEffect, useState } from 'react';
import {
  Box, Flex, Text, Button, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
  DrawerCloseButton, useDisclosure
} from '@chakra-ui/react';
import { R } from './tokens';

/**
 * 專題目次。桌機是左側黏著的「水位計」：讀到哪，水位就漲到哪；手機是頂端一條章節列。
 * 兩者共用 useReadingState：目前章節取「頂端已經捲過畫面上緣 120px 的最後一章」，
 * 進度是 <article> 捲過的比例。
 */

const ACTIVE_LINE = 120;

export const useReadingState = (items, articleRef) => {
  const [state, setState] = useState({ activeId: items[0]?.id, progress: 0 });

  useEffect(() => {
    let frame = null;
    const measure = () => {
      frame = null;
      let activeId = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= ACTIVE_LINE) activeId = item.id;
      }
      const article = articleRef.current;
      let progress = 0;
      if (article) {
        const rect = article.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 1;
      }
      setState(prev => (prev.activeId === activeId && Math.abs(prev.progress - progress) < 0.002
        ? prev : { activeId, progress }));
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

  return state;
};

// delay：從手機目次抽屜點過來時，要等抽屜關掉、解除捲動鎖定後再捲
const jumpTo = (id, delay = 0) => (e) => {
  e.preventDefault();
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  }, delay);
};

export const ReportToc = ({ items, activeId, progress }) => (
  <Box as="nav" aria-label="目次" position="sticky" top="40px" pt={{ base: 0, lg: 20 }}>
    <Text fontSize="12px" fontWeight={700} letterSpacing="0.2em" color={R.muted} mb={4}>目次</Text>
    <Box position="relative" pl={5}>
      {/* 水位計：灰色管子 + 讀到哪裡就填到哪裡的藍 */}
      <Box position="absolute" left="3px" top="6px" bottom="6px" w="3px" bg={R.rule} borderRadius="full" overflow="hidden">
        <Box position="absolute" left={0} right={0} top={0} h={`${progress * 100}%`} bg={R.water}
          transition="height .15s linear" />
      </Box>
      <Box as="ol" listStyleType="none" m={0} p={0}>
        {items.map(item => {
          const active = item.id === activeId;
          return (
            <Box as="li" key={item.id} mb={1}>
              <Box as="a" href={`#${item.id}`} onClick={jumpTo(item.id)} display="flex" gap={2.5} py={1.5}
                fontSize="14px" lineHeight={1.5} color={active ? R.ink : R.muted} fontWeight={active ? 700 : 400}
                aria-current={active ? 'location' : undefined} _hover={{ color: R.ink }} transition="color .2s">
                <Text as="span" fontFamily={R.serif} fontWeight={700} color={active ? R.water : R.waterMid} minW="1.2em">
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
      已讀 {Math.round(progress * 100)}%
    </Text>
  </Box>
);

export const MobileToc = ({ items, activeId, progress }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const active = items.find(i => i.id === activeId) || items[0];

  return (
    <Box display={{ base: 'block', lg: 'none' }} position="sticky" top={0} zIndex={20}
      bg="rgba(251,250,246,0.94)" backdropFilter="saturate(1.4) blur(8px)" borderBottomWidth="1px" borderColor={R.rule}>
      <Flex align="center" justify="space-between" px={4} h="48px" gap={3}>
        <Text fontSize="14px" color={R.ink} noOfLines={1}>
          <Text as="span" fontFamily={R.serif} fontWeight={700} color={R.water} mr={2}>{active.num}</Text>
          {active.label}
        </Text>
        <Button size="sm" variant="outline" borderColor={R.ink} color={R.ink} borderRadius="0" fontWeight={700}
          flexShrink={0} onClick={onOpen}>
          目次
        </Button>
      </Flex>
      <Box h="2px" bg={R.water} w={`${progress * 100}%`} transition="width .15s linear" />

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
                    <Text as="span" fontFamily={R.serif} fontWeight={700} color={R.water} minW="1.4em">{item.num}</Text>
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
