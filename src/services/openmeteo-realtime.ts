import { fetchWeatherApi } from 'openmeteo';

export async function fetchRealtimeWeatherWithTime(lat: number, lon: number) {
  const params = {
    latitude: lat,
    longitude: lon,
    current: [
      'time',
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'wind_speed_10m',
      'wind_direction_10m',
      'weather_code',
    ],
    hourly: [
      'time',
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
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const current = response.current?.();
  if (!current) return null;
  return {
    time: current.time ? new Date((Number(current.time()) + utcOffsetSeconds) * 1000) : null,
    humidity: current.variables(2)?.value(),
    windSpeed: current.variables(4)?.value(),
    windDirection: ['E','SE','NE','S','N','W','SW','NW'][Math.round((current.variables(5)?.value() ?? 0) / 45) % 8],
    temperature: current.variables(1)?.value(),
    dewPoint: current.variables(3)?.value(),
    temperatureDewPointDiff: Math.abs((current.variables(1)?.value() ?? 0) - (current.variables(3)?.value() ?? 0)),
  };
}
