// Types for Weather Data
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  uvIndex: number;
  visibility: number;
  pressure: number;
  icon: string;
  lastUpdated: string;
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export interface WeatherAlert {
  id: string;
  type: 'typhoon' | 'rainstorm' | 'thunderstorm' | 'hot' | 'cold';
  level: string;
  title: string;
  description: string;
  issuedAt: string;
  effectiveUntil: string;
  isActive: boolean;
}

// Types for Air Quality Data
export interface AirQualityData {
  station: string;
  district: string;
  aqhi: number;
  level: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Serious';
  healthRisk: string;
  dominantPollutant: string;
  pollutants: {
    no2: number;
    o3: number;
    so2: number;
    co: number;
    pm10: number;
    pm25: number;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  lastUpdated: string;
}

export interface PollutantData {
  no2: number;
  o3: number;
  so2: number;
  co: number;
  pm10: number;
  pm25: number;
}

export interface AirQualityForecast {
  date: string;
  aqhi: number;
  level: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Serious';
  generalCondition: string;
}

export interface HistoricalAQHI {
  timestamp: string;
  aqhi: number;
  station: string;
}

// Types for Health Recommendations
export interface HealthRecommendation {
  id: string;
  category: 'general' | 'outdoor' | 'exercise' | 'respiratory' | 'elderly' | 'children';
  title: string;
  description: string;
  icon: string;
  severity: 'info' | 'warning' | 'danger';
  conditions: {
    aqhi?: number[];
    weather?: string[];
    uv?: number[];
  };
}

// Types for Locations
export interface HKDistrict {
  id: string;
  name: string;
  nameZh: string;
  region: 'Hong Kong Island' | 'Kowloon' | 'New Territories';
  coordinates: {
    lat: number;
    lng: number;
  };
  popularPlaces: string[];
}

export interface MTRStation {
  id: string;
  name: string;
  nameZh: string;
  line: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// API Response Types
export interface WeatherAPIResponse {
  current: WeatherData;
  forecast: WeatherForecast[];
  alerts: WeatherAlert[];
}

export interface AirQualityAPIResponse {
  stations: AirQualityData[];
  forecast: AirQualityForecast[];
  historical: HistoricalAQHI[];
}

// Component Props Types
export interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
}

export interface LocationSelectorProps {
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  districts: HKDistrict[];
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ComponentType;
  }>;
}

// Chart Data Types
export interface ChartDataPoint {
  time: string;
  value: number;
  label?: string;
}

export interface AQHIChartData {
  timestamp: string;
  aqhi: number;
  station: string;
  level: string;
}

// Error Types
export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

// User Preferences
export interface UserPreferences {
  preferredLanguage: 'en' | 'zh';
  notifications: {
    weatherAlerts: boolean;
    airQualityAlerts: boolean;
    healthReminders: boolean;
  };
  defaultLocation: string;
  units: {
    temperature: 'celsius' | 'fahrenheit';
    windSpeed: 'kmh' | 'ms' | 'mph';
    visibility: 'km' | 'miles';
  };
}
