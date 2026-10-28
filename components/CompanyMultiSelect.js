import { useMemo, useRef, useState } from 'react';
import {
  Box, Button, Checkbox, HStack, Input, InputGroup, InputLeftElement, Popover, PopoverBody, PopoverContent,
  PopoverFooter, PopoverTrigger, Tag, TagCloseButton, TagLabel, Text, VStack, Wrap, WrapItem
} from '@chakra-ui/react';
import { FaChevronDown, FaSearch } from 'react-icons/fa';

/**
 * 公司複選：可用代號、簡稱或全名搜尋。沒選任何公司等於全部顯示。
 * options: [{ code, label, name, hint }]，label 是畫面上的名稱，name 只拿來搜尋，hint 是灰字說明。
 */
const CompanyMultiSelect = ({ options, value, onChange }) => {
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const selected = useMemo(() => new Set(value), [value]);
  const byCode = useMemo(() => new Map(options.map((o) => [o.code, o])), [options]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => [o.code, o.label, o.name].some((s) => s && s.toLowerCase().includes(q)));
  }, [options, query]);

  // 依選項順序回傳，標籤列與勾選順序無關，比較好找
  const toggle = (code) => {
    const next = new Set(selected);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    onChange(options.map((o) => o.code).filter((c) => next.has(c)));
  };

  return (
    <Wrap spacing={2} align="center">
      <WrapItem>
        {/* 打開就把游標放在搜尋框；Popover 預設會把焦點給內容區塊本身 */}
        <Popover placement="bottom-start" isLazy initialFocusRef={searchRef} onClose={() => setQuery('')}>
          <PopoverTrigger>
            <Button size="sm" variant="outline" rightIcon={<FaChevronDown />} fontWeight="normal">
              {value.length === 0 ? `全部公司（${options.length}）` : `已選 ${value.length} 家公司`}
            </Button>
          </PopoverTrigger>
          <PopoverContent w="min(340px, calc(100vw - 32px))">
            <PopoverBody p={3}>
              <InputGroup size="sm" mb={2}>
                <InputLeftElement pointerEvents="none" color="gray.400"><FaSearch /></InputLeftElement>
                <Input
                  ref={searchRef}
                  placeholder="搜尋代號或公司名稱"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
              <VStack spacing={1} align="stretch" maxH="300px" overflowY="auto" pr={1}>
                {matches.map((o) => (
                  <Checkbox
                    key={o.code}
                    colorScheme="green"
                    isChecked={selected.has(o.code)}
                    onChange={() => toggle(o.code)}
                    py={1}
                  >
                    <Box>
                      <Text as="div" fontSize="sm" color="gray.800">{o.code} {o.label}</Text>
                      {o.hint && <Text as="div" fontSize="xs" color="gray.500">{o.hint}</Text>}
                    </Box>
                  </Checkbox>
                ))}
                {matches.length === 0 && (
                  <Text fontSize="sm" color="gray.500" py={2}>沒有符合「{query}」的公司</Text>
                )}
              </VStack>
            </PopoverBody>
            <PopoverFooter py={2}>
              <HStack justify="space-between">
                <Text fontSize="xs" color="gray.500">不選等於全部顯示</Text>
                <Button size="xs" variant="ghost" onClick={() => onChange([])} isDisabled={value.length === 0}>
                  清除
                </Button>
              </HStack>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </WrapItem>
      {value.map((code) => (
        <WrapItem key={code}>
          <Tag size="md" colorScheme="green" variant="subtle" borderRadius="full">
            <TagLabel>{code} {byCode.get(code)?.label}</TagLabel>
            <TagCloseButton aria-label={`移除 ${byCode.get(code)?.label || code}`} onClick={() => toggle(code)} />
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default CompanyMultiSelect;
