import { Fragment, useState } from 'react';
import L from 'leaflet';
import { Marker, Circle, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';

// 滑過定位針的提示框與點開的明細：中文標題長，太窄會變成細長一條（Leaflet 預設 popup 最寬 300px）。
// 寬度用 max-content，短標題不會被撐大；手機上不超過畫面八成
const TOOLTIP_MAX_W = 'min(360px, 80vw)';
const POPUP_MAX_W = 380;
import { Box, Text, Badge, HStack, Wrap, WrapItem, Divider, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { EVENT_TYPES, EVENT_STATUSES, LOCATION_PRECISIONS, MAP_EVENT_COLOR as EVENT_COLOR } from '../lib/news-labels';


// 只定位到工業區時畫一個淡色範圍圈，提醒讀者這不是廠房位置。
// 半徑只是示意（工業區大小差很多，IMIP 約 4×6 公里），不代表實際範圍。
const PARK_HINT_RADIUS_M = 1500;

// 定位針的尖端對準座標：美國事件跟 EPA 廠區同一座標，針身在點的上方，下方的 EPA 圓點仍點得到
const pinIcon = (count, hollow) => {
  const fill = hollow ? '#ffffff' : EVENT_COLOR;
  const ink = hollow ? EVENT_COLOR : '#ffffff';
  const mark = count > 1
    ? `<text x="12" y="15.2" text-anchor="middle" font-size="${count > 9 ? 9 : 11}" font-weight="700" font-family="sans-serif" fill="${ink}">${count}</text>`
    : `<circle cx="12" cy="11.3" r="3.6" fill="${ink}"/>`;
  return L.divIcon({
    className: 'map-event-pin',
    html: `<svg width="24" height="32" viewBox="0 0 24 32" aria-hidden="true">`
      + `<path d="M12 1.2C6.2 1.2 1.6 5.7 1.6 11.4c0 7.6 10.4 19.4 10.4 19.4s10.4-11.8 10.4-19.4C22.4 5.7 17.8 1.2 12 1.2z" `
      + `fill="${fill}" stroke="${hollow ? EVENT_COLOR : '#ffffff'}" stroke-width="${hollow ? 2.2 : 1.5}"/>${mark}</svg>`,
    iconSize: [24, 32],
    iconAnchor: [12, 31],
    popupAnchor: [0, -28],
    tooltipAnchor: [0, -28]
  });
};

const isCoarse = (precision) => precision === 'city' || precision === 'region';

// 縮小時相距不到 CLUSTER_PX 像素的地點併成一個圓形群組標記（例：同奈省 7 個地點、首爾近郊的坡州與天安），
// 點選放大到能分開為止。只在縮放改變時重算，平移不影響像素距離。
const CLUSTER_PX = 40;

const clusterIcon = (eventCount) => L.divIcon({
  className: 'map-event-cluster',
  html: `<div style="width:30px;height:30px;border-radius:50%;background:${EVENT_COLOR};color:#fff;`
    + `border:2px solid #fff;box-shadow:0 0 0 4px rgba(44,82,130,0.25);display:flex;align-items:center;`
    + `justify-content:center;font:700 12px sans-serif;">${eventCount}</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  tooltipAnchor: [0, -16]
});

// 以群組目前的中心（各點像素座標的平均）判斷距離，群組標記就畫在這個中心，旁邊的定位針才不會壓在它上面
const clusterPoints = (map, points, zoom) => {
  const clusters = [];
  points.forEach((point) => {
    const px = map.project([point.lat, point.lng], zoom);
    const hit = clusters.find((cluster) => cluster.center.distanceTo(px) < CLUSTER_PX);
    if (hit) {
      hit.points.push(point);
      hit.sum = hit.sum.add(px);
      hit.center = hit.sum.divideBy(hit.points.length);
    } else {
      clusters.push({ sum: px, center: px, points: [point] });
    }
  });
  return clusters;
};

const ClusterMarker = ({ points }) => {
  const map = useMap();
  const events = points.reduce((sum, point) => sum + point.items.length, 0);
  const sites = [...new Set(points.flatMap((point) => point.items.map((item) => item.plantSite)))];
  const center = [
    points.reduce((sum, point) => sum + point.lat, 0) / points.length,
    points.reduce((sum, point) => sum + point.lng, 0) / points.length
  ];

  return (
    <Marker
      position={center}
      icon={clusterIcon(events)}
      eventHandlers={{
        click: () => map.flyToBounds(points.map((point) => [point.lat, point.lng]), { padding: [48, 48], maxZoom: 15, duration: 1 })
      }}
    >
      <Tooltip direction="top" opacity={0.95}>
        <Box fontSize="xs" w="max-content" maxW={TOOLTIP_MAX_W} whiteSpace="normal" lineHeight={1.5}>
          <Text as="div" fontWeight="bold">{points.length} 個地點、{events} 個污染事件</Text>
          <Text as="div">{sites.slice(0, 4).join('；')}{sites.length > 4 ? '……' : ''}</Text>
          <Text as="div" color="gray.500">點選放大</Text>
        </Box>
      </Tooltip>
    </Marker>
  );
};

const EventItem = ({ item }) => {
  const type = EVENT_TYPES[item.type] || { label: item.type, color: 'gray' };
  const status = EVENT_STATUSES[item.status] || { label: item.status, color: 'gray' };
  const primary = item.companies[0];

  return (
    <Box>
      {primary ? (
        <Link href={`/companies/tw-${primary.code}#${item.eventId}`} legacyBehavior passHref>
          <Text as="a" fontWeight="bold" fontSize="sm" color="blue.700" _hover={{ textDecoration: 'underline' }}>
            {item.title}
          </Text>
        </Link>
      ) : (
        <Text as="div" fontWeight="bold" fontSize="sm" color="gray.800">{item.title}</Text>
      )}
      <HStack spacing={1} mt={1} flexWrap="wrap">
        <Badge colorScheme={type.color} variant="subtle" fontSize="10px">{type.label}</Badge>
        <Badge colorScheme={status.color} variant="subtle" fontSize="10px">{status.label}</Badge>
        <Text as="div" fontSize="xs" color="gray.500">{item.period}</Text>
      </HStack>
      {item.companies.length > 0 && (
        <Wrap spacing={1} mt={1} fontSize="xs" color="gray.600">
          <WrapItem>掛在：</WrapItem>
          {item.companies.map((c) => (
            <WrapItem key={c.code}>
              <Link href={`/companies/tw-${c.code}#${item.eventId}`} legacyBehavior passHref>
                <Text as="a" color="green.600" _hover={{ textDecoration: 'underline' }}>{c.short} {c.code}</Text>
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </Box>
  );
};

const EventPopup = ({ point }) => {
  const sites = [...new Set(point.items.map((item) => item.plantSite))];
  const precision = LOCATION_PRECISIONS[point.precision];

  return (
    <Box minW="280px" maxW={`${POPUP_MAX_W}px`} fontFamily="body">
      <Text as="div" fontSize="xs" color="gray.500">{sites.join('；')}</Text>
      <Text as="div" fontSize="xs" color={point.precision === 'facility' ? 'gray.500' : 'orange.600'} mb={2}>
        {precision.label}{point.precision === 'facility' ? '' : `：${precision.note}`}
      </Text>
      {point.items.length > 1 && (
        <Text as="div" fontSize="xs" color="gray.600" mb={1}>這個地點有 {point.items.length} 個事件，依起始日新到舊：</Text>
      )}
      <Divider mb={2} />
      <VStack spacing={3} align="stretch" maxH="260px" overflowY="auto" pr={1}>
        {point.items.map((item) => (
          <EventItem key={`${item.eventId}-${item.plantSite}`} item={item} />
        ))}
      </VStack>
      {point.echoFacilities.length > 0 && (
        <>
          <Divider my={2} />
          <Text as="div" fontSize="xs" color="gray.600" mb={1}>同一地點的 EPA 廠區：</Text>
          <VStack spacing={0} align="flex-start">
            {point.echoFacilities.map((f) => (
              <Link key={f.facilityId} href={`/companies/${f.companyId}/facilities/${f.facilityId}`} legacyBehavior passHref>
                <Text as="a" fontSize="xs" color="green.600" _hover={{ textDecoration: 'underline' }}>{f.name}</Text>
              </Link>
            ))}
          </VStack>
        </>
      )}
    </Box>
  );
};

const PointMarker = ({ point }) => {
  const count = point.items.length;
  const tooltipTitle = count > 1 ? `${count} 個污染事件` : point.items[0].title;
  const sites = [...new Set(point.items.map((item) => item.plantSite))];

  return (
    <>
      {point.precision === 'industrial-park' && (
        <Circle
          center={[point.lat, point.lng]}
          radius={PARK_HINT_RADIUS_M}
          interactive={false}
          pathOptions={{ color: EVENT_COLOR, weight: 1, dashArray: '4 4', fillColor: EVENT_COLOR, fillOpacity: 0.08 }}
        />
      )}
      <Marker position={[point.lat, point.lng]} icon={pinIcon(count, isCoarse(point.precision))}>
        <Tooltip direction="top" opacity={0.95}>
          <Box fontSize="xs" w="max-content" maxW={TOOLTIP_MAX_W} whiteSpace="normal" lineHeight={1.5}>
            <Text as="div" fontWeight="bold">{tooltipTitle}</Text>
            <Text as="div">{sites.join('；')}</Text>
            {point.precision !== 'facility' && (
              <Text as="div" color="orange.600">{LOCATION_PRECISIONS[point.precision].label}</Text>
            )}
          </Box>
        </Tooltip>
        <Popup minWidth={280} maxWidth={POPUP_MAX_W}>
          <EventPopup point={point} />
        </Popup>
      </Marker>
    </>
  );
};

const MapEventLayer = ({ points = [] }) => {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  return (
    <>
      {clusterPoints(map, points, zoom).map((cluster) => (
        <Fragment key={cluster.points.map((point) => point.key).join('|')}>
          {cluster.points.length > 1
            ? <ClusterMarker points={cluster.points} />
            : <PointMarker point={cluster.points[0]} />}
        </Fragment>
      ))}
    </>
  );
};

export default MapEventLayer;
