import { WeatherAlert, WeatherAPIResponse, WeatherData, WeatherForecast } from '@/types';

// Mock data for development - replace with actual API calls
const mockWeatherData: WeatherData = {
  location: 'Hong Kong',
  temperature: 28,
  condition: 'Partly Cloudy',
  humidity: 75,
  windSpeed: 15,
  windDirection: 'E',
  uvIndex: 6,
  visibility: 10,
  pressure: 1013,
  icon: '🌤️',
  lastUpdated: new Date().toISOString()
};

const mockForecast: WeatherForecast[] = [
  {
    date: new Date().toISOString(),
    high: 30,
    low: 25,
    condition: 'Partly Cloudy',
    icon: '🌤️',
    precipitation: 20,
    humidity: 75,
    windSpeed: 15
  },
  {
    date: new Date(Date.now() + 86400000).toISOString(),
    high: 32,
    low: 27,
    condition: 'Sunny',
    icon: '☀️',
    precipitation: 0,
    humidity: 65,
    windSpeed: 12
  },
  {
    date: new Date(Date.now() + 172800000).toISOString(),
    high: 29,
    low: 24,
    condition: 'Thunderstorms',
    icon: '⛈️',
    precipitation: 80,
    humidity: 85,
    windSpeed: 20
  },
  {
    date: new Date(Date.now() + 259200000).toISOString(),
    high: 26,
    low: 22,
    condition: 'Rainy',
    icon: '🌧️',
    precipitation: 90,
    humidity: 90,
    windSpeed: 18
  },
  {
    date: new Date(Date.now() + 345600000).toISOString(),
    high: 28,
    low: 23,
    condition: 'Cloudy',
    icon: '☁️',
    precipitation: 30,
    humidity: 80,
    windSpeed: 14
  }
];

const mockAlerts: WeatherAlert[] = [];

class WeatherService {
  private baseURL = 'https://api.hko.gov.hk/v1'; // Hong Kong Observatory API
  
  async getCurrentWeather(location: string = 'Hong Kong'): Promise<WeatherData> {
    try {
      // In a real implementation, you would call the HKO API
      // const response = await axios.get(`${this.baseURL}/weather/rhrread`);
      
      // For now, return mock data with some variation
      const variation = Math.random() * 5 - 2.5; // ±2.5 degrees
      return {
        ...mockWeatherData,
        temperature: Math.round(mockWeatherData.temperature + variation),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherForecast(location: string = 'Hong Kong'): Promise<WeatherForecast[]> {
    try {
      // In a real implementation, you would call the HKO API
      // const response = await axios.get(`${this.baseURL}/weather/fnd`);
      
      return mockForecast;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  async getWeatherAlerts(): Promise<WeatherAlert[]> {
    try {
      // In a real implementation, you would call the HKO API
      // const response = await axios.get(`${this.baseURL}/weather/warnsum`);
      
      return mockAlerts;
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      throw new Error('Failed to fetch weather alerts');
    }
  }

  async getWeatherData(location: string = 'Hong Kong'): Promise<WeatherAPIResponse> {
    try {
      const [current, forecast, alerts] = await Promise.all([
        this.getCurrentWeather(location),
        this.getWeatherForecast(location),
        this.getWeatherAlerts()
      ]);

      return {
        current,
        forecast,
        alerts
      };
    } catch (error) {
      console.error('Error fetching complete weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  // Helper method to get typhoon tracking data
  async getTyphoonData() {
    try {
      // In a real implementation, you would call the HKO typhoon API
      // const response = await axios.get(`${this.baseURL}/weather/tropical-cyclone`);
      
      return {
        activeTyphoons: [],
        trackingData: []
      };
    } catch (error) {
      console.error('Error fetching typhoon data:', error);
      throw new Error('Failed to fetch typhoon data');
    }
  }

  // Method to get historical weather data
  async getHistoricalWeather(days: number = 7) {
    try {
      // Mock historical data
      const historicalData = [];
      for (let i = days; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86400000);
        historicalData.push({
          date: date.toISOString(),
          temperature: Math.round(25 + Math.random() * 10),
          humidity: Math.round(60 + Math.random() * 30),
          windSpeed: Math.round(10 + Math.random() * 15)
        });
      }
      return historicalData;
    } catch (error) {
      console.error('Error fetching historical weather data:', error);
      throw new Error('Failed to fetch historical weather data');
    }
  }
}

export const weatherService = new WeatherService();
