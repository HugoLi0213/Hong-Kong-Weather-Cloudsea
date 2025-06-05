// Example: Real API Integration Guide
// This file shows how to replace mock services with real APIs

import axios from 'axios';
import { AirQualityData, WeatherData } from '../types';

// Real Hong Kong Observatory API integration example
export class RealWeatherService {
  private readonly baseUrl = 'https://data.weather.gov.hk/weatherAPI/opendata';

  async getCurrentWeather(): Promise<WeatherData> {
    try {
      // Current weather conditions
      const currentResponse = await axios.get(`${this.baseUrl}/weather.php`, {
        params: {
          dataType: 'rhrread',
          lang: 'en'
        }
      });

      // Weather forecast
      const forecastResponse = await axios.get(`${this.baseUrl}/weather.php`, {
        params: {
          dataType: 'fnd',
          lang: 'en'
        }
      });

      // Weather warnings
      const warningsResponse = await axios.get(`${this.baseUrl}/weather.php`, {
        params: {
          dataType: 'warningInfo',
          lang: 'en'
        }
      });

      return this.transformWeatherData(
        currentResponse.data,
        forecastResponse.data,
        warningsResponse.data
      );
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw new Error('Unable to fetch weather information');
    }
  }

  private transformWeatherData(current: any, forecast: any, warnings: any): WeatherData {
    // Transform HKO API response to our internal format
    return {
      current: {
        temperature: current.temperature?.data?.[0]?.value || 0,
        humidity: current.humidity?.data?.[0]?.value || 0,
        pressure: current.pressure?.data?.[0]?.value || 0,
        windSpeed: current.windSpeed?.data?.[0]?.value || 0,
        windDirection: current.windDirection?.data?.[0]?.value || 0,
        uvIndex: current.uvindex?.data?.[0]?.value || 0,
        visibility: current.visibility?.data?.[0]?.value || 0,
        condition: current.icon?.[0] || 'sunny',
        lastUpdated: current.updateTime || new Date().toISOString(),
      },
      forecast: this.transformForecastData(forecast),
      alerts: this.transformWarningsData(warnings),
    };
  }

  private transformForecastData(forecastData: any) {
    // Transform forecast data
    return forecastData.weatherForecast?.map((day: any) => ({
      date: day.forecastDate,
      tempHigh: day.forecastMaxtemp?.value || 0,
      tempLow: day.forecastMintemp?.value || 0,
      condition: day.forecastWeather,
      humidity: day.forecastMaxrh?.value || 0,
      windSpeed: day.forecastWind,
    })) || [];
  }

  private transformWarningsData(warningsData: any) {
    // Transform warning data
    return warningsData.details?.map((warning: any) => ({
      id: warning.warningStatementCode,
      title: warning.name,
      description: warning.contents,
      severity: warning.type,
      issuedAt: warning.updateTime,
      expiresAt: warning.validTime,
    })) || [];
  }
}

// Real Environmental Protection Department API integration example
export class RealAirQualityService {
  private readonly baseUrl = 'https://api.aqhi.gov.hk/epd';

  async getCurrentAirQuality(): Promise<AirQualityData> {
    try {
      // Current AQHI data
      const aqhiResponse = await axios.get(`${this.baseUrl}/aqhi/latest.json`);
      
      // Detailed pollutant data
      const pollutantResponse = await axios.get(`${this.baseUrl}/pollutants/hourly.json`);

      return this.transformAirQualityData(aqhiResponse.data, pollutantResponse.data);
    } catch (error) {
      console.error('Failed to fetch air quality data:', error);
      throw new Error('Unable to fetch air quality information');
    }
  }

  async getHistoricalAQHI(station: string, hours: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/aqhi/historical.json`, {
        params: {
          station,
          hours,
        }
      });

      return response.data.map((record: any) => ({
        timestamp: record.datetime,
        aqhi: record.aqhi,
        station: record.station,
      }));
    } catch (error) {
      console.error('Failed to fetch historical AQHI data:', error);
      throw new Error('Unable to fetch historical air quality data');
    }
  }

  private transformAirQualityData(aqhiData: any, pollutantData: any): AirQualityData {
    return {
      stations: aqhiData.stations?.map((station: any) => {
        const pollutants = pollutantData.stations?.find((p: any) => p.station === station.station);
        
        return {
          station: station.station,
          district: station.district,
          aqhi: station.aqhi,
          pm25: pollutants?.pm25 || 0,
          pm10: pollutants?.pm10 || 0,
          no2: pollutants?.no2 || 0,
          o3: pollutants?.o3 || 0,
          so2: pollutants?.so2 || 0,
          co: pollutants?.co || 0,
          lastUpdated: station.updateTime || new Date().toISOString(),
        };
      }) || [],
      generalAQHI: aqhiData.general?.aqhi || 0,
      lastUpdated: aqhiData.updateTime || new Date().toISOString(),
    };
  }
}

// Error handling utility for API failures
export class ApiErrorHandler {
  static handle(error: any): never {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else if (error.response?.status >= 500) {
        throw new Error('Government service temporarily unavailable.');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network connection error. Check your internet connection.');
      }
    }
    throw new Error('Unable to fetch data. Please try again.');
  }
}

// Usage example:
/*
// Replace the mock services in your React components:

// Before (using mock data):
import { getWeatherData } from '../services/weather';

// After (using real APIs):
import { RealWeatherService } from '../services/real-apis';

const weatherService = new RealWeatherService();

// In your component or hook:
const fetchWeatherData = async () => {
  try {
    const data = await weatherService.getCurrentWeather();
    return data;
  } catch (error) {
    ApiErrorHandler.handle(error);
  }
};
*/

export { ApiErrorHandler, RealAirQualityService, RealWeatherService };

