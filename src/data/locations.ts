import { HKDistrict, MTRStation } from '@/types';

export const HK_DISTRICTS: HKDistrict[] = [
  // Hong Kong Island
  {
    id: 'central-western',
    name: 'Central and Western',
    nameZh: '中西區',
    region: 'Hong Kong Island',
    coordinates: { lat: 22.2849, lng: 114.1577 },
    popularPlaces: ['Central', 'Admiralty', 'Sheung Wan', 'Mid-Levels']
  },
  {
    id: 'wan-chai',
    name: 'Wan Chai',
    nameZh: '灣仔區',
    region: 'Hong Kong Island',
    coordinates: { lat: 22.2783, lng: 114.1747 },
    popularPlaces: ['Wan Chai', 'Causeway Bay', 'Happy Valley', 'Tai Hang']
  },
  {
    id: 'eastern',
    name: 'Eastern',
    nameZh: '東區',
    region: 'Hong Kong Island',
    coordinates: { lat: 22.2815, lng: 114.2186 },
    popularPlaces: ['North Point', 'Quarry Bay', 'Tai Koo', 'Chai Wan']
  },
  {
    id: 'southern',
    name: 'Southern',
    nameZh: '南區',
    region: 'Hong Kong Island',
    coordinates: { lat: 22.2461, lng: 114.1628 },
    popularPlaces: ['Aberdeen', 'Stanley', 'Repulse Bay', 'Ocean Park']
  },

  // Kowloon
  {
    id: 'yau-tsim-mong',
    name: 'Yau Tsim Mong',
    nameZh: '油尖旺區',
    region: 'Kowloon',
    coordinates: { lat: 22.3080, lng: 114.1714 },
    popularPlaces: ['Tsim Sha Tsui', 'Yau Ma Tei', 'Mong Kok', 'Jordan']
  },
  {
    id: 'sham-shui-po',
    name: 'Sham Shui Po',
    nameZh: '深水埗區',
    region: 'Kowloon',
    coordinates: { lat: 22.3301, lng: 114.1588 },
    popularPlaces: ['Sham Shui Po', 'Cheung Sha Wan', 'Lai Chi Kok', 'Nam Cheong']
  },
  {
    id: 'kowloon-city',
    name: 'Kowloon City',
    nameZh: '九龍城區',
    region: 'Kowloon',
    coordinates: { lat: 22.3193, lng: 114.1869 },
    popularPlaces: ['Hung Hom', 'To Kwa Wan', 'Ma Tau Kok', 'Kowloon Tong']
  },
  {
    id: 'wong-tai-sin',
    name: 'Wong Tai Sin',
    nameZh: '黃大仙區',
    region: 'Kowloon',
    coordinates: { lat: 22.3426, lng: 114.1941 },
    popularPlaces: ['Wong Tai Sin', 'Diamond Hill', 'San Po Kong', 'Lok Fu']
  },
  {
    id: 'kwun-tong',
    name: 'Kwun Tong',
    nameZh: '觀塘區',
    region: 'Kowloon',
    coordinates: { lat: 22.3120, lng: 114.2264 },
    popularPlaces: ['Kwun Tong', 'Lam Tin', 'Yau Tong', 'Kowloon Bay']
  },

  // New Territories
  {
    id: 'tsuen-wan',
    name: 'Tsuen Wan',
    nameZh: '荃灣區',
    region: 'New Territories',
    coordinates: { lat: 22.3707, lng: 114.1130 },
    popularPlaces: ['Tsuen Wan', 'Kwai Chung', 'Tsing Yi', 'Ma Wan']
  },
  {
    id: 'tuen-mun',
    name: 'Tuen Mun',
    nameZh: '屯門區',
    region: 'New Territories',
    coordinates: { lat: 22.3910, lng: 113.9758 },
    popularPlaces: ['Tuen Mun', 'Lam Tei', 'Siu Hong', 'Gold Coast']
  },
  {
    id: 'yuen-long',
    name: 'Yuen Long',
    nameZh: '元朗區',
    region: 'New Territories',
    coordinates: { lat: 22.4453, lng: 114.0342 },
    popularPlaces: ['Yuen Long', 'Tin Shui Wai', 'Hung Shui Kiu', 'Pat Heung']
  },
  {
    id: 'north',
    name: 'North',
    nameZh: '北區',
    region: 'New Territories',
    coordinates: { lat: 22.4953, lng: 114.1289 },
    popularPlaces: ['Sheung Shui', 'Fanling', 'Ta Kwu Ling', 'Lok Ma Chau']
  },
  {
    id: 'tai-po',
    name: 'Tai Po',
    nameZh: '大埔區',
    region: 'New Territories',
    coordinates: { lat: 22.4507, lng: 114.1714 },
    popularPlaces: ['Tai Po', 'Tai Po Market', 'Science Park', 'Plover Cove']
  },
  {
    id: 'sha-tin',
    name: 'Sha Tin',
    nameZh: '沙田區',
    region: 'New Territories',
    coordinates: { lat: 22.3821, lng: 114.1887 },
    popularPlaces: ['Sha Tin', 'Fo Tan', 'Ma On Shan', 'Tai Wai']
  },
  {
    id: 'sai-kung',
    name: 'Sai Kung',
    nameZh: '西貢區',
    region: 'New Territories',
    coordinates: { lat: 22.3817, lng: 114.2740 },
    popularPlaces: ['Sai Kung', 'Clear Water Bay', 'Tseung Kwan O', 'Hang Hau']
  },
  {
    id: 'islands',
    name: 'Islands',
    nameZh: '離島區',
    region: 'New Territories',
    coordinates: { lat: 22.2587, lng: 113.9430 },
    popularPlaces: ['Lantau Island', 'Cheung Chau', 'Lamma Island', 'Peng Chau']
  }
];

export const POPULAR_MTR_STATIONS: MTRStation[] = [
  {
    id: 'central',
    name: 'Central',
    nameZh: '中環',
    line: 'Island Line / Tsuen Wan Line',
    coordinates: { lat: 22.2813, lng: 114.1578 }
  },
  {
    id: 'admiralty',
    name: 'Admiralty',
    nameZh: '金鐘',
    line: 'Island Line / Tsuen Wan Line / South Island Line',
    coordinates: { lat: 22.2788, lng: 114.1655 }
  },
  {
    id: 'tsim-sha-tsui',
    name: 'Tsim Sha Tsui',
    nameZh: '尖沙咀',
    line: 'Tsuen Wan Line',
    coordinates: { lat: 22.2974, lng: 114.1722 }
  },
  {
    id: 'causeway-bay',
    name: 'Causeway Bay',
    nameZh: '銅鑼灣',
    line: 'Island Line',
    coordinates: { lat: 22.2798, lng: 114.1851 }
  },
  {
    id: 'mong-kok',
    name: 'Mong Kok',
    nameZh: '旺角',
    line: 'Tsuen Wan Line',
    coordinates: { lat: 22.3189, lng: 114.1693 }
  },
  {
    id: 'kowloon-tong',
    name: 'Kowloon Tong',
    nameZh: '九龍塘',
    line: 'Kwun Tong Line / East Rail Line',
    coordinates: { lat: 22.3370, lng: 114.1766 }
  },
  {
    id: 'sha-tin',
    name: 'Sha Tin',
    nameZh: '沙田',
    line: 'East Rail Line',
    coordinates: { lat: 22.3825, lng: 114.1880 }
  },
  {
    id: 'tuen-mun',
    name: 'Tuen Mun',
    nameZh: '屯門',
    line: 'Tuen Ma Line',
    coordinates: { lat: 22.3958, lng: 113.9731 }
  }
];

export const AIR_QUALITY_STATIONS = [
  {
    id: 'central',
    name: 'Central',
    nameZh: '中環',
    district: 'Central and Western',
    coordinates: { lat: 22.2813, lng: 114.1578 },
    type: 'roadside'
  },
  {
    id: 'causeway-bay',
    name: 'Causeway Bay',
    nameZh: '銅鑼灣',
    district: 'Wan Chai',
    coordinates: { lat: 22.2798, lng: 114.1851 },
    type: 'roadside'
  },
  {
    id: 'mong-kok',
    name: 'Mong Kok',
    nameZh: '旺角',
    district: 'Yau Tsim Mong',
    coordinates: { lat: 22.3189, lng: 114.1693 },
    type: 'roadside'
  },
  {
    id: 'sham-shui-po',
    name: 'Sham Shui Po',
    nameZh: '深水埗',
    district: 'Sham Shui Po',
    coordinates: { lat: 22.3301, lng: 114.1588 },
    type: 'roadside'
  },
  {
    id: 'kwun-tong',
    name: 'Kwun Tong',
    nameZh: '觀塘',
    district: 'Kwun Tong',
    coordinates: { lat: 22.3120, lng: 114.2264 },
    type: 'roadside'
  },
  {
    id: 'tsuen-wan',
    name: 'Tsuen Wan',
    nameZh: '荃灣',
    district: 'Tsuen Wan',
    coordinates: { lat: 22.3707, lng: 114.1130 },
    type: 'roadside'
  },
  {
    id: 'tuen-mun',
    name: 'Tuen Mun',
    nameZh: '屯門',
    district: 'Tuen Mun',
    coordinates: { lat: 22.3910, lng: 113.9758 },
    type: 'roadside'
  },
  {
    id: 'yuen-long',
    name: 'Yuen Long',
    nameZh: '元朗',
    district: 'Yuen Long',
    coordinates: { lat: 22.4453, lng: 114.0342 },
    type: 'roadside'
  },
  {
    id: 'tai-po',
    name: 'Tai Po',
    nameZh: '大埔',
    district: 'Tai Po',
    coordinates: { lat: 22.4507, lng: 114.1714 },
    type: 'roadside'
  },
  {
    id: 'sha-tin',
    name: 'Sha Tin',
    nameZh: '沙田',
    district: 'Sha Tin',
    coordinates: { lat: 22.3821, lng: 114.1887 },
    type: 'roadside'
  },
  {
    id: 'eastern',
    name: 'Eastern',
    nameZh: '東區',
    district: 'Eastern',
    coordinates: { lat: 22.2815, lng: 114.2186 },
    type: 'general'
  },
  {
    id: 'kwai-chung',
    name: 'Kwai Chung',
    nameZh: '葵涌',
    district: 'Tsuen Wan',
    coordinates: { lat: 22.3588, lng: 114.1272 },
    type: 'general'
  },
  {
    id: 'tung-chung',
    name: 'Tung Chung',
    nameZh: '東涌',
    district: 'Islands',
    coordinates: { lat: 22.2889, lng: 113.9441 },
    type: 'general'
  }
];

export const DEFAULT_MAP_CENTER = { lat: 22.3193, lng: 114.1694 }; // Hong Kong center
export const DEFAULT_MAP_ZOOM = 11;
