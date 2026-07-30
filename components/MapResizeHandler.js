import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/**
 * Leaflet 只在初始化時量一次容器尺寸。地圖 chunk 載入得比外層容器的 layout 早時，
 * 它會拿到錯誤的高度，整個視野就偏掉（例如預設該對準美國本土卻落到墨西哥灣）。
 * 掛載後補量一次，並跟著視窗縮放重新量。
 *
 * 全站地圖（PollutionMap）與單一廠區地圖（FacilityMap）共用。
 */
const MapResizeHandler = () => {
  const map = useMap();

  useEffect(() => {
    const refresh = () => map.invalidateSize();
    // 等這一輪 layout 結束再量，才拿得到最終高度
    const raf = requestAnimationFrame(refresh);
    window.addEventListener('resize', refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', refresh);
    };
  }, [map]);

  return null;
};

export default MapResizeHandler;
