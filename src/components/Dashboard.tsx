import 'chart.js/auto';
import { fetchWeatherApi } from 'openmeteo';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../chart-dashboard-fix.css';

// 香港天氣和雲海主頁元件
// Main dashboard component for Hong Kong Weather & Cloudsea
export default function Dashboard() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<'HongKong' | 'TaiMoShan'>('HongKong');

  // 取得天氣資料的函數
  // Function to fetch weather data
  const fetchData = async (loc = location) => {
    setLoading(true);
    const locations = {
      HongKong: { latitude: 22.4518, longitude: 114.024, label: '香港' },
      TaiMoShan: { latitude: 22.411811, longitude: 114.123144, label: '大帽山' },
    };
    const params = {
      latitude: locations[loc].latitude,
      longitude: locations[loc].longitude,
      daily: [
        'weather_code', 'temperature_2m_max', 'temperature_2m_min', 'apparent_temperature_max', 'apparent_temperature_min',
        'wind_speed_10m_max', 'wind_gusts_10m_max', 'shortwave_radiation_sum', 'wind_direction_10m_dominant',
        'et0_fao_evapotranspiration', 'uv_index_max', 'uv_index_clear_sky_max', 'daylight_duration', 'sunshine_duration',
        'sunset', 'sunrise', 'rain_sum', 'showers_sum', 'snowfall_sum', 'precipitation_sum', 'precipitation_hours', 'precipitation_probability_max'
      ],
      hourly: [
        'temperature_2m', 'relative_humidity_2m', 'dew_point_2m', 'apparent_temperature', 'precipitation_probability',
        'precipitation', 'rain', 'showers', 'snow_depth', 'snowfall', 'weather_code', 'pressure_msl', 'surface_pressure',
        'cloud_cover', 'cloud_cover_low', 'cloud_cover_mid', 'cloud_cover_high', 'visibility', 'evapotranspiration',
        'et0_fao_evapotranspiration', 'vapour_pressure_deficit', 'wind_speed_10m', 'wind_speed_80m', 'wind_speed_120m',
        'wind_speed_180m', 'wind_direction_80m', 'wind_direction_10m', 'wind_direction_120m', 'wind_direction_180m',
        'wind_gusts_10m', 'temperature_80m', 'temperature_120m', 'temperature_180m'
      ],
      current: [
        'temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'is_day', 'wind_speed_10m', 'wind_direction_10m',
        'wind_gusts_10m', 'precipitation', 'showers', 'rain', 'snowfall', 'weather_code', 'cloud_cover', 'pressure_msl', 'surface_pressure'
      ],
      forecast_days: 7,
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current?.();
    const hourly = response.hourly?.();
    const daily = response.daily?.();
    const sunrise = daily?.variables(15);
    const sunset = daily?.variables(14);
    const weatherData = {
      current: current
        ? {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature2m: current.variables(0)?.value(),
            relativeHumidity2m: current.variables(1)?.value(),
            apparentTemperature: current.variables(2)?.value(),
            isDay: current.variables(3)?.value(),
            windSpeed10m: current.variables(4)?.value(),
            windDirection10m: current.variables(5)?.value(),
            windGusts10m: current.variables(6)?.value(),
            precipitation: current.variables(7)?.value(),
            showers: current.variables(8)?.value(),
            rain: current.variables(9)?.value(),
            snowfall: current.variables(10)?.value(),
            weatherCode: current.variables(11)?.value(),
            cloudCover: current.variables(12)?.value(),
            pressureMsl: current.variables(13)?.value(),
            surfacePressure: current.variables(14)?.value(),
          }
        : null,
      hourly: hourly
        ? {
            time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
              (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature2m: Array.from(hourly.variables(0)?.valuesArray() ?? []),
            relativeHumidity2m: Array.from(hourly.variables(1)?.valuesArray() ?? []),
            dewPoint2m: Array.from(hourly.variables(2)?.valuesArray() ?? []),
            apparentTemperature: Array.from(hourly.variables(3)?.valuesArray() ?? []),
            precipitationProbability: Array.from(hourly.variables(4)?.valuesArray() ?? []),
            precipitation: Array.from(hourly.variables(5)?.valuesArray() ?? []),
            rain: Array.from(hourly.variables(6)?.valuesArray() ?? []),
            showers: Array.from(hourly.variables(7)?.valuesArray() ?? []),
            snowDepth: Array.from(hourly.variables(8)?.valuesArray() ?? []),
            snowfall: Array.from(hourly.variables(9)?.valuesArray() ?? []),
            weatherCode: Array.from(hourly.variables(10)?.valuesArray() ?? []),
            pressureMsl: Array.from(hourly.variables(11)?.valuesArray() ?? []),
            surfacePressure: Array.from(hourly.variables(12)?.valuesArray() ?? []),
            cloudCover: Array.from(hourly.variables(13)?.valuesArray() ?? []),
            cloudCoverLow: Array.from(hourly.variables(14)?.valuesArray() ?? []),
            cloudCoverMid: Array.from(hourly.variables(15)?.valuesArray() ?? []),
            cloudCoverHigh: Array.from(hourly.variables(16)?.valuesArray() ?? []),
            visibility: Array.from(hourly.variables(17)?.valuesArray() ?? []),
            evapotranspiration: Array.from(hourly.variables(18)?.valuesArray() ?? []),
            et0FaoEvapotranspiration: Array.from(hourly.variables(19)?.valuesArray() ?? []),
            vapourPressureDeficit: Array.from(hourly.variables(20)?.valuesArray() ?? []),
            windSpeed10m: Array.from(hourly.variables(21)?.valuesArray() ?? []),
            windSpeed80m: Array.from(hourly.variables(22)?.valuesArray() ?? []),
            windSpeed120m: Array.from(hourly.variables(23)?.valuesArray() ?? []),
            windSpeed180m: Array.from(hourly.variables(24)?.valuesArray() ?? []),
            windDirection80m: Array.from(hourly.variables(25)?.valuesArray() ?? []),
            windDirection10m: Array.from(hourly.variables(26)?.valuesArray() ?? []),
            windDirection120m: Array.from(hourly.variables(27)?.valuesArray() ?? []),
            windDirection180m: Array.from(hourly.variables(28)?.valuesArray() ?? []),
            windGusts10m: Array.from(hourly.variables(29)?.valuesArray() ?? []),
            temperature80m: Array.from(hourly.variables(30)?.valuesArray() ?? []),
            temperature120m: Array.from(hourly.variables(31)?.valuesArray() ?? []),
            temperature180m: Array.from(hourly.variables(32)?.valuesArray() ?? []),
          }
        : {},
      daily: daily
        ? {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
              (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            weatherCode: Array.from(daily.variables(0)?.valuesArray() ?? []),
            temperature2mMax: Array.from(daily.variables(1)?.valuesArray() ?? []),
            temperature2mMin: Array.from(daily.variables(2)?.valuesArray() ?? []),
            apparentTemperatureMax: Array.from(daily.variables(3)?.valuesArray() ?? []),
            apparentTemperatureMin: Array.from(daily.variables(4)?.valuesArray() ?? []),
            windSpeed10mMax: Array.from(daily.variables(5)?.valuesArray() ?? []),
            windGusts10mMax: Array.from(daily.variables(6)?.valuesArray() ?? []),
            shortwaveRadiationSum: Array.from(daily.variables(7)?.valuesArray() ?? []),
            windDirection10mDominant: Array.from(daily.variables(8)?.valuesArray() ?? []),
            et0FaoEvapotranspiration: Array.from(daily.variables(9)?.valuesArray() ?? []),
            uvIndexMax: Array.from(daily.variables(10)?.valuesArray() ?? []),
            uvIndexClearSkyMax: Array.from(daily.variables(11)?.valuesArray() ?? []),
            daylightDuration: Array.from(daily.variables(12)?.valuesArray() ?? []),
            sunshineDuration: Array.from(daily.variables(13)?.valuesArray() ?? []),
            sunset: sunset ? [...Array(sunset.valuesInt64Length())].map((_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)) : [],
            sunrise: sunrise ? [...Array(sunrise.valuesInt64Length())].map((_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)) : [],
            rainSum: Array.from(daily.variables(16)?.valuesArray() ?? []),
            showersSum: Array.from(daily.variables(17)?.valuesArray() ?? []),
            snowfallSum: Array.from(daily.variables(18)?.valuesArray() ?? []),
            precipitationSum: Array.from(daily.variables(19)?.valuesArray() ?? []),
            precipitationHours: Array.from(daily.variables(20)?.valuesArray() ?? []),
            precipitationProbabilityMax: Array.from(daily.variables(21)?.valuesArray() ?? []),
          }
        : {},
    };
    setWeatherData(weatherData);
    setLoading(false);
  };

  // 天氣代碼對照表
  // Weather code mapping
  const weatherCodeMap: Record<number, string> = {
    0: '晴朗',
    1: '大致天晴',
    2: '多雲',
    3: '陰天',
    45: '有霧',
    48: '霧凇',
    51: '細雨',
    53: '細雨',
    55: '細雨',
    56: '凍雨',
    57: '凍雨',
    61: '小雨',
    63: '中雨',
    65: '大雨',
    66: '凍雨',
    67: '凍雨',
    71: '小雪',
    73: '中雪',
    75: '大雪',
    77: '雪粒',
    80: '陣雨',
    81: '中陣雨',
    82: '大陣雨',
    85: '小陣雪',
    86: '大陣雪',
    95: '雷暴',
    96: '雷暴伴有小冰雹',
    99: '雷暴伴有大冰雹',
  };

  // 切換地點時只改 state，不 fetch
  // Change location state without fetching data
  const handleLocationChange = (loc: 'HongKong' | 'TaiMoShan') => {
    setLocation(loc);
    // 不自動 fetch
  };

  // 頁面渲染
  // Page rendering
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <button
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-blue-500 text-blue-700 shadow-lg text-base font-bold backdrop-blur hover:bg-blue-50 active:bg-blue-100 transition-all duration-150"
        style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
        onClick={() => window.location.href = '/'}
        aria-label="返回主頁"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l7-7m0 0l7 7m-7-7v18" />
        </svg>
        返回主頁
      </button>
      <h1 className="text-2xl font-bold text-center my-4">{location === 'HongKong' ? '香港' : '大帽山'} 天氣 (Open-Meteo)</h1>
      <div className="mb-4 flex gap-2">
        <button className={`px-4 py-2 rounded ${location === 'HongKong' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`} onClick={() => handleLocationChange('HongKong')}>香港</button>
        <button className={`px-4 py-2 rounded ${location === 'TaiMoShan' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`} onClick={() => handleLocationChange('TaiMoShan')}>大帽山</button>
        <button className="px-4 py-2 rounded bg-green-500 text-white ml-2" onClick={() => fetchData(location)}>刷新天氣</button>
      </div>
      {loading && <div>Loading...</div>}
      {weatherData && weatherData.current && (
        <div className="mb-4 p-4 rounded-lg shadow bg-gray-100 text-gray-900 w-full max-w-md">
          <div className="flex flex-col gap-2">
            <div>時間：{weatherData.current.time.toLocaleString()}</div>
            <div>溫度：{weatherData.current.temperature2m}°C</div>
            <div>體感溫度：{weatherData.current.apparentTemperature}°C</div>
            <div>濕度：{weatherData.current.relativeHumidity2m}%</div>
            <div>天氣：{weatherCodeMap[weatherData.current.weatherCode] ?? weatherData.current.weatherCode}</div>
            <div>雲量：{weatherData.current.cloudCover}%</div>
            <div>氣壓：{weatherData.current.pressureMsl} hPa</div>
            <div>降水量：{weatherData.current.precipitation} mm</div>
            <div>風速：{weatherData.current.windSpeed10m} m/s</div>
            <div>風向：{weatherData.current.windDirection10m}°</div>
            <div>陣風：{weatherData.current.windGusts10m} m/s</div>
          </div>
        </div>
      )}
      {weatherData && weatherData.hourly && (
        <div className="w-full max-w-md mb-8">
          <Line
            data={{
              labels: weatherData.hourly.time.map((d: Date) => d.getHours() + ':00'),
              datasets: [
                {
                  label: 'Temperature (°C)',
                  data: weatherData.hourly.temperature2m,
                  borderColor: 'rgba(255, 0, 0, 1)',
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  tension: 0.4,
                },
                {
                  label: 'Relative Humidity (%)',
                  data: weatherData.hourly.relativeHumidity2m,
                  borderColor: 'rgba(0, 0, 255, 1)',
                  backgroundColor: 'rgba(0, 0, 255, 0.1)',
                  tension: 0.4,
                  yAxisID: 'y2',
                },
                {
                  label: 'Precipitation Probability (%)',
                  data: weatherData.hourly.precipitationProbability,
                  borderColor: 'rgba(0, 200, 255, 1)',
                  backgroundColor: 'rgba(0, 200, 255, 0.1)',
                  tension: 0.4,
                  yAxisID: 'y2',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: true } },
              scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, title: { display: true, text: 'Temperature (°C)' } },
                y2: {
                  beginAtZero: true,
                  position: 'right',
                  grid: { drawOnChartArea: false },
                  title: { display: true, text: 'Humidity / Precip. Prob. (%)' },
                },
              },
            }}
            height={220}
          />
        </div>
      )}
      {weatherData && weatherData.daily && (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-2">未來 7 天預報</h2>
          <table className="w-full text-sm bg-white text-gray-900 border rounded shadow">
            <thead>
              <tr>
                <th className="border px-2 py-1">日期</th>
                <th className="border px-2 py-1">天氣</th>
                <th className="border px-2 py-1">最高溫</th>
                <th className="border px-2 py-1">最低溫</th>
                <th className="border px-2 py-1">降水量</th>
                <th className="border px-2 py-1">日出</th>
                <th className="border px-2 py-1">日落</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.daily.time.map((d: Date, i: number) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{d.toLocaleDateString()}</td>
                  <td className="border px-2 py-1">{weatherCodeMap[weatherData.daily.weatherCode[i]] ?? weatherData.daily.weatherCode[i]}</td>
                  <td className="border px-2 py-1">{weatherData.daily.temperature2mMax[i]}°C</td>
                  <td className="border px-2 py-1">{weatherData.daily.temperature2mMin[i]}°C</td>
                  <td className="border px-2 py-1">{weatherData.daily.precipitationSum[i]} mm</td>
                  <td className="border px-2 py-1">{weatherData.daily.sunrise[i]?.toLocaleTimeString()}</td>
                  <td className="border px-2 py-1">{weatherData.daily.sunset[i]?.toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
