import { WeatherAlert, WeatherAPIResponse, WeatherData, WeatherForecast } from '@/types';
import axios from 'axios';

class WeatherService {
  async getCurrentWeather(): Promise<WeatherData> {
    // 使用 Open-Meteo API 取得香港天氣
    const latitude = 22.3193;
    const longitude = 114.1694;
    const timezone = 'Asia/Hong_Kong';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,rain&timezone=${timezone}&forecast_days=1`;
    const res = await axios.get(url);
    const data = res.data;
    // 取 current_weather
    const current = data.current_weather || {};
    return {
      location: '香港',
      temperature: Number(current.temperature),
      condition: 'N/A', // Open-Meteo 無 condition 字串
      humidity: data.hourly?.relative_humidity_2m?.[0] ?? 0,
      windSpeed: Number(current.windspeed) || 0,
      windDirection: String(current.winddirection) || '',
      uvIndex: 0, // Open-Meteo 免費版無 UV
      visibility: 0, // 無
      pressure: 0, // 無
      icon: '🌤️',
      lastUpdated: current.time || new Date().toISOString(),
    };
  }

  async getWeatherForecast(): Promise<WeatherForecast[]> {
    // 使用 Open-Meteo API 取得香港天氣預報
    const latitude = 22.3193;
    const longitude = 114.1694;
    const timezone = 'Asia/Hong_Kong';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,rain&timezone=${timezone}&forecast_days=3`;
    const res = await axios.get(url);
    const data = res.data;
    // 取出每天的最高/最低溫、濕度、降雨
    const days = [0, 24, 48]; // 取三天（每小時資料，假設 24 小時一日）
    return days.map((start) => {
      const temps = data.hourly.temperature_2m.slice(start, start + 24);
      const humidityArr = data.hourly.relative_humidity_2m.slice(start, start + 24);
      const rainArr = data.hourly.rain.slice(start, start + 24);
      return {
        date: data.hourly.time[start],
        high: Math.max(...temps),
        low: Math.min(...temps),
        condition: 'N/A',
        icon: '🌤️',
        precipitation: Math.round(rainArr.reduce((a: number, b: number) => a + b, 0)),
        humidity: Math.round(humidityArr.reduce((a: number, b: number) => a + b, 0) / humidityArr.length),
        windSpeed: 0,
      };
    });
  }

  async getWeatherAlerts(): Promise<WeatherAlert[]> {
    // Open-Meteo 無警報，回傳空陣列
    return [];
  }

  async getWeatherData(): Promise<WeatherAPIResponse> {
    const [current, forecast, alerts] = await Promise.all([
      this.getCurrentWeather(),
      this.getWeatherForecast(),
      this.getWeatherAlerts(),
    ]);
    return { current, forecast, alerts };
  }
}

export const weatherService = new WeatherService();
