import { HKOWeatherService } from './HKOWeatherService';

export class CloudSeaPredictionSystem {
  private hkoService: HKOWeatherService;
  constructor() {
    this.hkoService = new HKOWeatherService();
  }

  async predictCloudSeaWithHKOData(location: string = '大帽山'): Promise<any> {
    try {
      // HKOWeatherService.processWeatherDataForCloudSea() 不接受參數，先取得所有地點資料
      const weatherMap = await this.hkoService.processWeatherDataForCloudSea();
      // 取指定地點的天氣資料
      const weatherData = weatherMap[location];
      if (!weatherData) throw new Error(`${location}數據暫缺`);
      const analysis = this.analyzeCloudSeaConditions(weatherData);
      analysis.recommendation += ` (數據來源: 香港天文台，更新時間: ${weatherData.updateTime})`;
      return analysis;
    } catch (error: any) {
      // 只要大帽山數據暫缺，直接丟出，不再 fallback 預設數據
      if (error && error.message === '大帽山數據暫缺') {
        throw new Error('大帽山數據暫缺');
      }
      throw new Error(`天文台API錯誤: ${error?.message || error}`);
    }
  }

  private analyzeCloudSeaConditions(data: any) {
    const conditions = {
      humidity: data.humidity >= 95,
      windSpeed: data.windSpeed <= 19,
      windDirection: ['E', 'SE', 'NE'].includes(data.windDirection),
      temperatureDewPoint: data.temperatureDewPointDiff <= 6,
      inversionLayer: data.hasInversionLayer,
      heightAdvantage: data.observationHeight > data.inversionLayerHeight,
    };
    const satisfied = Object.values(conditions).filter(Boolean).length;
    const total = Object.keys(conditions).length;
    let probability = (satisfied / total) * 100;
    if (conditions.humidity && conditions.inversionLayer) probability += 15;
    if (conditions.temperatureDewPoint && data.temperatureDewPointDiff <= 2) probability += 10;
    if (conditions.windSpeed && data.windSpeed <= 10) probability += 5;
    probability = Math.min(100, Math.max(0, probability));
    const hasCloudSea = probability >= 60;
    let recommendation = '';
    if (hasCloudSea) {
      recommendation = '雲海出現機率高，建議前往高地觀測點';
    } else if (probability >= 40) {
      recommendation = '雲海出現機率中等，可考慮碰運氣';
    } else {
      recommendation = '雲海出現機率低，建議等待更好的條件';
    }
    const missingConditions = [];
    if (!conditions.humidity) missingConditions.push('濕度不足95%');
    if (!conditions.windSpeed) missingConditions.push('風速過強');
    if (!conditions.windDirection) missingConditions.push('風向不利');
    if (!conditions.temperatureDewPoint) missingConditions.push('溫度露點差過大');
    if (!conditions.inversionLayer) missingConditions.push('缺乏逆溫層');
    if (!conditions.heightAdvantage) missingConditions.push('觀測點高度不足');
    if (missingConditions.length > 0) {
      recommendation += `。缺乏條件：${missingConditions.join('、')}`;
    }
    return {
      ...data,
      hasCloudSea,
      probability: Math.round(probability),
      conditions,
      recommendation,
      confidence: 'high',
    };
  }
}
