import { MapContainer, TileLayer, CircleMarker, Circle, Tooltip } from 'react-leaflet';
import { Box, Text } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import MapResizeHandler from './MapResizeHandler';
import { getPollutionLevel } from '../lib/pollution-scale';
import { getCoordinateAccuracy } from '../lib/coordinate-precision';

/**
 * 單一廠區地圖：只畫這座廠區，供廠區詳情頁使用。
 * 顏色沿用全站地圖的違規分級，讓兩張地圖的語意一致；
 * 半徑固定，因為單點頁面沒有互相比較的對象。
 *
 * 縮放與誤差圈都跟著該廠區的座標精度走：精確的座標可以拉到街道層級，
 * 只到小數兩位的座標就退開一點並畫出誤差圈。
 */
const FacilityMap = ({ lat, lng, name, violationCount = 0, city, state }) => {
  const level = getPollutionLevel(violationCount);
  const locationLabel = [city, state].filter(Boolean).join(', ');
  const accuracy = getCoordinateAccuracy(lat, lng);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={accuracy.showCircle ? 12 : 14}
      minZoom={3}
      // 頁面下半部是很長的違規表格，開滾輪縮放會綁架頁面捲動，改用 +/- 按鈕
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      <MapResizeHandler />

      {accuracy.showCircle && (
        <Circle
          center={[lat, lng]}
          radius={accuracy.meters}
          pathOptions={{
            color: level.color,
            weight: 1,
            dashArray: '4 4',
            fillColor: level.color,
            fillOpacity: 0.08,
          }}
        />
      )}

      <CircleMarker
        center={[lat, lng]}
        radius={11}
        pathOptions={{
          color: '#ffffff',
          weight: 2,
          fillColor: level.color,
          fillOpacity: 0.85,
        }}
      >
        <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
          <Box fontSize="xs">
            <Text fontWeight="bold">{name}</Text>
            {locationLabel && <Text color="gray.600">{locationLabel}</Text>}
            <Text>{violationCount} 筆違規</Text>
          </Box>
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  );
};

export default FacilityMap;
