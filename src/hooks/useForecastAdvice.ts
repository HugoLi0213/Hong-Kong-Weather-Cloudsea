import { AirQualityForecast, WeatherForecast } from '@/types';
import { useMemo } from 'react';

export function useForecastAdvice(weatherForecast: WeatherForecast[] = [], airQualityForecast: AirQualityForecast[] = [], location: string = 'Hong Kong') {
  return useMemo(() => {
    if (!weatherForecast.length && !airQualityForecast.length) return null;
    const nextRain = weatherForecast.find(day => day.precipitation > 60);
    if (nextRain) {
      return `Rain expected on ${new Date(nextRain.date).toLocaleDateString()} in ${location}. Plan outdoor activities accordingly.`;
    }
    const bestDay = weatherForecast.find(day => day.precipitation < 20 && (day as any).uvIndex && (day as any).uvIndex < 7);
    if (bestDay) {
      return `Best day for outdoor activities: ${new Date(bestDay.date).toLocaleDateString()} in ${location}.`;
    }
    const highAQHI = airQualityForecast.find(day => day.aqhi >= 7);
    if (highAQHI) {
      return `High AQHI (${highAQHI.aqhi}) expected on ${new Date(highAQHI.date).toLocaleDateString()} in ${location}. Consider reducing outdoor activities.`;
    }
    return null;
  }, [weatherForecast, airQualityForecast, location]);
}
