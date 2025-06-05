import { fetchWeatherApi } from 'openmeteo';

export async function fetchTaiMoShanRealtimeWeather() {
  // 大帽山經緯度
  const latitude = 22.411811;
  const longitude = 114.123144;
  const params = {
    latitude,
    longitude,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'wind_speed_10m',
      'wind_direction_10m',
      'weather_code',
    ],
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'wind_speed_10m',
      'wind_direction_10m',
    ],
    forecast_days: 1,
  };
  const url = 'https://api.open-meteo.com/v1/forecast';
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];
  // @ts-expect-error - utcOffsetSeconds is declared but not used in current implementation
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const current = response.current?.();
  if (!current) return null;
  // 取出需要的欄位
  return {
    humidity: current.variables(1)?.value(),
    windSpeed: current.variables(3)?.value(),
    windDirection: ['E','SE','NE','S','N','W','SW','NW'][Math.round((current.variables(4)?.value() ?? 0) / 45) % 8],
    temperature: current.variables(0)?.value(),
    dewPoint: current.variables(2)?.value(),
    temperatureDewPointDiff: Math.abs((current.variables(0)?.value() ?? 0) - (current.variables(2)?.value() ?? 0)),
  };
}
