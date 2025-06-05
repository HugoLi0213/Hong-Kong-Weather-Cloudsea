// 香港天文台 API 整合服務
export interface HKOWeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  dewPoint: number;
  visibility: number;
  updateTime: string;
}

export class HKOWeatherService {
  private readonly baseUrl = 'https://data.weather.gov.hk/weatherAPI/opendata';

  async getCurrentWeatherReport(): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/weather.php?dataType=rhrread&lang=tc`
    );
    if (!response.ok) throw new Error(`HKO API錯誤: ${response.status}`);
    return await response.json();
  }

  async getVisibilityData(): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/opendata.php?dataType=LTMV&lang=tc&rformat=json`
    );
    if (!response.ok) throw new Error(`HKO API錯誤: ${response.status}`);
    return await response.json();
  }

  async getWeatherWarnings(): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/weather.php?dataType=warnsum&lang=tc`
    );
    if (!response.ok) throw new Error(`HKO API錯誤: ${response.status}`);
    return await response.json();
  }

  async processWeatherDataForCloudSea(): Promise<any> {
    try {
      const [currentWeather, visibility, warnings] = await Promise.all([
        this.getCurrentWeatherReport(),
        this.getVisibilityData(),
        this.getWeatherWarnings(),
      ]);
      const tempDataArr = currentWeather.temperature?.data || [];
      if (!Array.isArray(tempDataArr) || tempDataArr.length === 0) {
        throw new Error('天文台溫度數據暫缺');
      }
      const visibilityValue = this.extractVisibility(visibility);
      const fogAlert = this.checkFogAlert(warnings);
      // 格式化 updateTime 為香港時間 yyyy-MM-dd HH:mm
      let updateTime = currentWeather.updateTime;
      if (updateTime) {
        const date = new Date(updateTime);
        const pad = (n: number) => n.toString().padStart(2, '0');
        updateTime = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
      }
      // 依據溫度數據的地點，遍歷所有地點
      const result: Record<string, any> = {};
      for (const temp of tempDataArr) {
        const location = temp.place;
        const locationData = this.extractLocationData(currentWeather, location);
        result[location] = {
          humidity: locationData.humidity,
          windSpeed: locationData.windSpeed,
          windDirection: locationData.windDirection,
          temperature: locationData.temperature,
          dewPoint: locationData.dewPoint,
          temperatureDewPointDiff: locationData.temperature - locationData.dewPoint,
          hasInversionLayer: this.detectInversionFromVisibility(visibilityValue),
          inversionLayerHeight: this.estimateInversionHeight(visibilityValue, locationData.humidity),
          observationHeight: this.getLocationHeight(location),
          updateTime, // 已格式化
          airportFogAlert: fogAlert,
          dataSource: locationData.dataSource,
        };
      }
      return result;
    } catch (error: any) {
      throw new Error(`處理天文台數據失敗: ${error}`);
    }
  }

  private extractLocationData(weatherData: any, location: string) {
    // 依據地點名稱提取數據
    const tempData = weatherData.temperature?.data?.find((d: any) =>
      d.place === location
    );
    const humidityData = weatherData.humidity?.data?.find((d: any) =>
      d.place === location
    );
    // 風速數據處理
    let windSpeed = 15;
    let windDirection = 'SE';
    let windData = null;
    if (weatherData.wind && Array.isArray(weatherData.wind.data)) {
      windData = weatherData.wind.data.find((d: any) => 
        d.place === location
      );
      if (windData) {
        windSpeed = Number(windData.value) || windSpeed;
        windDirection = windData.direction || windDirection;
      }
    }
    return {
      temperature: tempData?.value || 20,
      humidity: humidityData?.value || 80,
      windSpeed,
      windDirection,
      dewPoint: this.calculateDewPoint(tempData?.value || 20, humidityData?.value || 80),
      dataSource: {
        temperature: tempData ? `${location}實測` : '備用數據',
        humidity: humidityData ? `${location}實測` : '備用數據',
        wind: windData ? `${location}實測` : '預設值'
      }
    };
  }

  private extractVisibility(visibilityData: any): number {
    return visibilityData?.data?.[0]?.value || 10000;
  }

  private checkFogAlert(warnings: any): boolean {
    return warnings?.WFIRE?.some((warning: any) =>
      warning.name?.includes('濃霧') || warning.name?.includes('fog')
    ) || false;
  }

  private detectInversionFromVisibility(visibility: number): boolean {
    return visibility < 1000;
  }

  private estimateInversionHeight(visibility: number, humidity: number): number {
    if (visibility < 1000 && humidity > 95) return 300;
    if (visibility < 2000 && humidity > 90) return 600;
    return 1000;
  }

  private calculateDewPoint(temperature: number, humidity: number): number {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
    return (b * alpha) / (a - alpha);
  }


  private getLocationHeight(location: string): number {
    const heights: Record<string, number> = {
      '荃灣': 30,
      '大帽山': 957,
      '大老山': 577,
      '大東山': 869,
      '鳳凰山': 934,
      '山頂': 552,
    };
    return heights[location] || 30;
  }
}
