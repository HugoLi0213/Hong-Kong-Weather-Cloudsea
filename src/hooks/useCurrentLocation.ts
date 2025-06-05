import { useNotificationHelpers } from '@/contexts/NotificationContext';
import { useState } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  district?: string;
  nearestStation?: string;
}

export function useCurrentLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showInfo, showError } = useNotificationHelpers();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      const errorMsg = '瀏覽器不支援地理定位功能';
      setError(errorMsg);
      showError('錯誤', errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // 根據座標判斷最接近的香港地區
        const district = getNearestHKDistrict(latitude, longitude);
        const nearestStation = getNearestMonitoringStation(latitude, longitude);
        
        const locationData = {
          latitude,
          longitude,
          district,
          nearestStation
        };
        
        setLocation(locationData);
        setLoading(false);
        showInfo('位置偵測', `${district} - ${nearestStation}`);
      },
      (error) => {
        let errorMsg = '位置錯誤';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = '位置權限被拒絕';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = '位置資訊無法取得';
            break;
          case error.TIMEOUT:
            errorMsg = '定位請求超時';
            break;
        }
        
        setError(errorMsg);
        setLoading(false);
        showError('位置錯誤', errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5分鐘快取
      }
    );
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    clearLocation: () => setLocation(null)
  };
}

// 根據GPS座標找到最接近的香港地區
function getNearestHKDistrict(lat: number, lng: number): string {
  // 香港主要地區的大概座標
  const districts = [
    { name: '中西區', lat: 22.284, lng: 114.158 },
    { name: '灣仔', lat: 22.278, lng: 114.173 },
    { name: '東區', lat: 22.284, lng: 114.219 },
    { name: '南區', lat: 22.246, lng: 114.169 },
    { name: '油尖旺', lat: 22.304, lng: 114.171 },
    { name: '深水埗', lat: 22.331, lng: 114.162 },
    { name: '九龍城', lat: 22.315, lng: 114.191 },
    { name: '黃大仙', lat: 22.341, lng: 114.197 },
    { name: '觀塘', lat: 22.315, lng: 114.226 },
    { name: '葵青', lat: 22.357, lng: 114.128 },
    { name: '荃灣', lat: 22.369, lng: 114.117 },
    { name: '屯門', lat: 22.391, lng: 113.976 },
    { name: '元朗', lat: 22.445, lng: 114.034 },
    { name: '北區', lat: 22.502, lng: 114.148 },
    { name: '大埔', lat: 22.451, lng: 114.164 },
    { name: '沙田', lat: 22.382, lng: 114.188 },
    { name: '西貢', lat: 22.381, lng: 114.268 },
    { name: '離島', lat: 22.259, lng: 113.944 }
  ];

  let nearest = districts[0];
  let minDistance = getDistance(lat, lng, nearest.lat, nearest.lng);

  districts.forEach(district => {
    const distance = getDistance(lat, lng, district.lat, district.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = district;
    }
  });

  return nearest.name;
}

// 根據GPS座標找到最接近的空氣質素監測站
function getNearestMonitoringStation(lat: number, lng: number): string {
  const stations = [
    { name: '中環', lat: 22.284, lng: 114.158 },
    { name: '銅鑼灣', lat: 22.278, lng: 114.184 },
    { name: '旺角', lat: 22.318, lng: 114.169 },
    { name: '深水埗', lat: 22.331, lng: 114.162 },
    { name: '觀塘', lat: 22.315, lng: 114.226 },
    { name: '葵涌', lat: 22.357, lng: 114.128 },
    { name: '荃灣', lat: 22.369, lng: 114.117 },
    { name: '屯門', lat: 22.391, lng: 113.976 },
    { name: '元朗', lat: 22.445, lng: 114.034 },
    { name: '上水', lat: 22.502, lng: 114.148 },
    { name: '大埔', lat: 22.451, lng: 114.164 },
    { name: '沙田', lat: 22.382, lng: 114.188 },
    { name: '將軍澳', lat: 22.317, lng: 114.263 },
    { name: '東涌', lat: 22.288, lng: 113.944 },
    { name: '塔門', lat: 22.472, lng: 114.363 }
  ];

  let nearest = stations[0];
  let minDistance = getDistance(lat, lng, nearest.lat, nearest.lng);

  stations.forEach(station => {
    const distance = getDistance(lat, lng, station.lat, station.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = station;
    }
  });

  return nearest.name;
}

// 計算兩點間距離（公里）
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 地球半徑（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
