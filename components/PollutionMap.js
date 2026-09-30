import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { Box, Text, Badge, HStack, Wrap, WrapItem, Divider, Button } from '@chakra-ui/react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import MapResizeHandler from './MapResizeHandler';
import { getPollutionLevel, getMarkerRadius } from '../lib/pollution-scale';
import { BASEMAP_URL, BASEMAP_ATTRIBUTION } from '../lib/basemap';

// 美國本土預設視角。阿拉斯加、夏威夷、美屬薩摩亞也有廠區，
// 但把它們一起 fitBounds 會把本土縮成一小塊，所以預設對準本土讓使用者自行平移。
const DEFAULT_CENTER = [39.5, -98.35];
const DEFAULT_ZOOM = 4;

// 環境監測面向的中文對照（對應 facility.programs）
const PROGRAM_LABELS = {
  air: '空氣',
  water: '水污染',
  waste: '廢棄物',
  toxics: '毒化物',
};

/**
 * 讓外部元件（熱點清單）能驅動地圖飛到指定廠區。
 * react-leaflet 的 map instance 只能在 MapContainer 內部透過 useMap 取得，
 * 所以包一層沒有畫面的 controller。
 */
const FlyToController = ({ target }) => {
  const map = useMap();

  useEffect(() => {
    if (!target) return;
    // 先收掉已開的 popup，否則飛走後舊 popup 會空著卡在畫面邊緣
    map.closePopup();
    map.flyTo([target.lat, target.lng], 9, { duration: 1.2 });
  }, [target, map]);

  return null;
};

const FacilityPopup = ({ facility }) => {
  const level = getPollutionLevel(facility.violationCount);
  const activePrograms = Object.entries(facility.programs || {})
    .filter(([, enabled]) => enabled)
    .map(([key]) => PROGRAM_LABELS[key] || key);

  return (
    <Box minW="240px" fontFamily="body">
      <Text fontWeight="bold" fontSize="sm" color="gray.800" mb={1}>
        {facility.name}
      </Text>
      <Text fontSize="xs" color="gray.600">
        {facility.companyName}
        {facility.companyCode ? `（${facility.companyCode}）` : ''}
      </Text>
      <Text fontSize="xs" color="gray.500" mt={1}>
        {[facility.city, facility.state].filter(Boolean).join(', ')}
      </Text>

      <Divider my={2} />

      <HStack spacing={2} mb={2}>
        <Badge style={{ backgroundColor: level.color }} color="white" px={2} borderRadius="sm">
          {facility.violationCount} 筆違規
        </Badge>
        {facility.latestViolationDate && (
          <Text fontSize="xs" color="gray.500">
            最近 {facility.latestViolationDate}
          </Text>
        )}
      </HStack>

      {facility.topViolationType && (
        <Text fontSize="xs" color="gray.600" mb={2}>
          主要類型：{facility.topViolationType}
        </Text>
      )}

      {activePrograms.length > 0 && (
        <Wrap spacing={1} mb={2}>
          {activePrograms.map((label) => (
            <WrapItem key={label}>
              <Badge colorScheme="green" variant="subtle" fontSize="10px">
                {label}
              </Badge>
            </WrapItem>
          ))}
        </Wrap>
      )}

      <Link
        href={`/companies/${facility.companyId}/facilities/${facility.facilityId}`}
        legacyBehavior
      >
        <Button as="a" size="xs" colorScheme="green" w="100%" mt={1}>
          查看廠區詳情
        </Button>
      </Link>
    </Box>
  );
};

const PollutionMap = ({ facilities = [], flyToTarget = null }) => {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={2}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url={BASEMAP_URL} attribution={BASEMAP_ATTRIBUTION} />

      <MapResizeHandler />
      <FlyToController target={flyToTarget} />

      {facilities.map((facility) => {
        const level = getPollutionLevel(facility.violationCount);

        return (
          <CircleMarker
            key={`${facility.companyId}-${facility.facilityId}`}
            center={[facility.lat, facility.lng]}
            radius={getMarkerRadius(facility.violationCount)}
            pathOptions={{
              color: '#ffffff',
              weight: 1,
              fillColor: level.color,
              fillOpacity: facility.violationCount > 0 ? 0.75 : 0.5,
            }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={0.95}>
              <Box fontSize="xs">
                <Text fontWeight="bold">{facility.name}</Text>
                <Text>{facility.violationCount} 筆違規</Text>
              </Box>
            </Tooltip>
            <Popup>
              <FacilityPopup facility={facility} />
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default PollutionMap;
