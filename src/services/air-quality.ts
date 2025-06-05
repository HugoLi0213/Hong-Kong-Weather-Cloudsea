import { AIR_QUALITY_STATIONS } from '@/data/locations';
import { getAQHILevel } from '@/lib/utils';
import { AirQualityAPIResponse, AirQualityData, AirQualityForecast, HistoricalAQHI } from '@/types';

// Mock data for development - replace with actual EPD API calls
const generateMockAQHI = (): number => {
  // Generate realistic AQHI values (1-11+)
  const weights = [0.3, 0.3, 0.2, 0.1, 0.05, 0.03, 0.02]; // Weighted toward lower values
  let random = Math.random();
  let aqhi = 1;
  
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      aqhi = i + 1;
      break;
    }
    random -= weights[i];
  }
  
  return Math.min(aqhi + Math.floor(Math.random() * 3), 11);
};

const generateMockPollutants = () => ({
  no2: Math.floor(Math.random() * 200) + 20,    // 20-220 µg/m³
  o3: Math.floor(Math.random() * 150) + 50,     // 50-200 µg/m³
  so2: Math.floor(Math.random() * 100) + 10,    // 10-110 µg/m³
  co: Math.floor(Math.random() * 10) + 1,       // 1-11 mg/m³
  pm10: Math.floor(Math.random() * 100) + 20,   // 20-120 µg/m³
  pm25: Math.floor(Math.random() * 75) + 15     // 15-90 µg/m³
});

class AirQualityService {
  private baseURL = 'https://api.data.gov.hk/v1/historical-archive/get-file';
  private epdURL = 'https://www.aqhi.gov.hk/api/aqhi'; // EPD AQHI API
  
  async getCurrentAirQuality(): Promise<AirQualityData[]> {
    try {
      // In a real implementation, you would call the EPD API
      // const response = await axios.get(`${this.epdURL}/forecast-aqhi/en`);
      
      // Generate mock data for all stations
      const stations = AIR_QUALITY_STATIONS.map(station => {
        const aqhi = generateMockAQHI();
        const level = getAQHILevel(aqhi);
        const pollutants = generateMockPollutants();
        
        // Determine dominant pollutant
        const pollutantValues = [
          { name: 'PM2.5', value: pollutants.pm25, threshold: 75 },
          { name: 'PM10', value: pollutants.pm10, threshold: 100 },
          { name: 'NO2', value: pollutants.no2, threshold: 200 },
          { name: 'O3', value: pollutants.o3, threshold: 160 },
          { name: 'SO2', value: pollutants.so2, threshold: 80 },
          { name: 'CO', value: pollutants.co, threshold: 8 }
        ];
        
        const dominantPollutant = pollutantValues
          .sort((a, b) => (b.value / b.threshold) - (a.value / a.threshold))[0].name;

        return {
          station: station.name,
          district: station.district,
          aqhi,
          level,
          healthRisk: this.getHealthRisk(aqhi),
          dominantPollutant,
          pollutants,
          coordinates: station.coordinates,
          lastUpdated: new Date().toISOString()
        };
      });

      return stations;
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      throw new Error('Failed to fetch air quality data');
    }
  }

  async getAirQualityForecast(): Promise<AirQualityForecast[]> {
    try {
      // In a real implementation, you would call the EPD forecast API
      const forecast = [];
      
      for (let i = 0; i < 5; i++) {
        const date = new Date(Date.now() + i * 86400000);
        const aqhi = generateMockAQHI();
        const level = getAQHILevel(aqhi);
        
        forecast.push({
          date: date.toISOString(),
          aqhi,
          level,
          generalCondition: this.getGeneralCondition(level)
        });
      }

      return forecast;
    } catch (error) {
      console.error('Error fetching air quality forecast:', error);
      throw new Error('Failed to fetch air quality forecast');
    }
  }

  async getHistoricalAQHI(station: string = 'Central', hours: number = 24): Promise<HistoricalAQHI[]> {
    try {
      // In a real implementation, you would call the EPD historical API
      const historical = [];
      
      for (let i = hours; i >= 0; i--) {
        const timestamp = new Date(Date.now() - i * 3600000); // hourly data
        historical.push({
          timestamp: timestamp.toISOString(),
          aqhi: generateMockAQHI(),
          station
        });
      }

      return historical;
    } catch (error) {
      console.error('Error fetching historical AQHI data:', error);
      throw new Error('Failed to fetch historical AQHI data');
    }
  }

  async getCompleteAirQualityData(): Promise<AirQualityAPIResponse> {
    try {
      const [stations, forecast, historical] = await Promise.all([
        this.getCurrentAirQuality(),
        this.getAirQualityForecast(),
        this.getHistoricalAQHI('Central', 24)
      ]);

      return {
        stations,
        forecast,
        historical
      };
    } catch (error) {
      console.error('Error fetching complete air quality data:', error);
      throw new Error('Failed to fetch air quality data');
    }
  }

  async getAirQualityByDistrict(district: string): Promise<AirQualityData | null> {
    try {
      const allStations = await this.getCurrentAirQuality();
      return allStations.find(station => 
        station.district.toLowerCase() === district.toLowerCase()
      ) || null;
    } catch (error) {
      console.error('Error fetching air quality by district:', error);
      throw new Error('Failed to fetch air quality data for district');
    }
  }

  private getHealthRisk(aqhi: number): string {
    if (aqhi <= 3) return 'Low health risk';
    if (aqhi <= 6) return 'Moderate health risk for sensitive individuals';
    if (aqhi <= 7) return 'High health risk for sensitive individuals, moderate for others';
    if (aqhi <= 10) return 'Very high health risk';
    return 'Serious health risk for everyone';
  }

  private getGeneralCondition(level: string): string {
    switch (level.toLowerCase()) {
      case 'low':
        return 'Good air quality expected';
      case 'moderate':
        return 'Moderate air quality, acceptable for most people';
      case 'high':
        return 'Unhealthy for sensitive groups';
      case 'very high':
        return 'Unhealthy air quality';
      case 'serious':
        return 'Very unhealthy air quality';
      default:
        return 'Air quality information unavailable';
    }
  }

  // Method to get real-time updates
  async getRealtimeUpdates(): Promise<{ timestamp: string; stations: AirQualityData[] }> {
    const stations = await this.getCurrentAirQuality();
    return {
      timestamp: new Date().toISOString(),
      stations
    };
  }

  // Method to get air quality trends
  async getAirQualityTrends(station: string, days: number = 7) {
    try {
      const trends = [];
      for (let i = days; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86400000);
        trends.push({
          date: date.toISOString(),
          aqhi: generateMockAQHI(),
          station
        });
      }
      return trends;
    } catch (error) {
      console.error('Error fetching air quality trends:', error);
      throw new Error('Failed to fetch air quality trends');
    }
  }
}

export const airQualityService = new AirQualityService();
