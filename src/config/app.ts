// Production optimizations for Hong Kong Weather Dashboard
export default {
  // Environment variables for different deployment stages
  development: {
    API_BASE_URL: 'http://localhost:3000/api',
    ENABLE_MOCK_DATA: false, // 改為 false 關閉 mock
    DEBUG_MODE: false, // 改為 false 關閉 debug
  },
  production: {
    API_BASE_URL: 'https://api.hkweather.gov.hk',
    ENABLE_MOCK_DATA: false,
    DEBUG_MODE: false,
  },
  // Feature flags
  features: {
    MAP_ENABLED: true,
    NOTIFICATIONS_ENABLED: true,
    PWA_ENABLED: true,
    GEOLOCATION_ENABLED: true,
    DARK_MODE_ENABLED: true,
  },
  // App configuration
  app: {
    NAME: 'HK Weather & Air Quality Dashboard',
    SHORT_NAME: 'HK Weather',
    DESCRIPTION: 'Comprehensive Hong Kong weather and air quality monitoring dashboard',
    THEME_COLOR: '#dc2626',
    BACKGROUND_COLOR: '#ffffff',
  },
};
