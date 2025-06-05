// 繁體中文語言包
export const zh_TW = {
  // 通用
  loading: '載入中...',
  error: '錯誤',
  retry: '重試',
  close: '關閉',
  
  // 主導航
  overview: '總覽',
  airQuality: '空氣質素',
  weather: '天氣',
  health: '健康建議',
  
  // 天氣
  currentWeather: '當前天氣',
  temperature: '溫度',
  humidity: '濕度',
  windSpeed: '風速',
  windDirection: '風向',
  uvIndex: 'UV指數',
  visibility: '能見度',
  pressure: '氣壓',
  forecast: '天氣預報',
  today: '今日',
  
  // 空氣質素
  aqhi: '空氣質素健康指數',
  pollutantLevels: '污染物濃度 (μg/m³)',
  generalAirQuality: '整體空氣質素',
  monitoringStations: '監測站',
  lastUpdated: '最後更新',
  
  // 污染物
  no2: '二氧化氮',
  so2: '二氧化硫',
  o3: '臭氧',
  pm10: '可吸入懸浮粒子',
  pm25: '微細懸浮粒子',
  
  // AQHI 等級
  aqhiLevels: {
    low: '低',
    moderate: '中等',
    high: '高',
    veryHigh: '甚高',
    serious: '嚴重'
  },
  
  // 健康建議
  healthRecommendations: '健康建議',
  generalAdvice: '一般建議',
  sensitiveGroupAdvice: '敏感人士建議',
  outdoorActivities: '戶外活動',
  indoorActivities: '室內活動',
  
  // 天氣狀況
  weatherConditions: {
    sunny: '晴朗',
    partlyCloudy: '部分多雲',
    cloudy: '多雲',
    overcast: '陰天',
    lightRain: '小雨',
    moderateRain: '中雨',
    heavyRain: '大雨',
    thunderstorms: '雷暴'
  },
  
  // 錯誤訊息
  errors: {
    weatherDataError: '無法載入天氣資料',
    airQualityDataError: '無法載入空氣質素資料',
    locationError: '無法取得位置資訊',
    networkError: '網路連線錯誤'
  },
  
  // 通知
  notifications: {
    highPollution: '高污染警告',
    backOnline: '重新連線',
    offline: '離線模式',
    locationDetected: '已偵測到您的位置'
  },
  
  // 位置
  currentLocation: '當前位置',
  detectingLocation: '正在偵測位置...',
  locationPermissionDenied: '位置權限被拒絕',
  useCurrentLocation: '使用當前位置'
};

export const translations = {
  'zh-TW': zh_TW
};

export type TranslationKey = keyof typeof zh_TW;
export type NestedTranslationKey = 
  | keyof typeof zh_TW.aqhiLevels
  | keyof typeof zh_TW.weatherConditions
  | keyof typeof zh_TW.errors
  | keyof typeof zh_TW.notifications;
