import { useMemo, useState } from 'react';
import { HKOWeatherService } from '../services/HKOWeatherService';

// 香港天文台 18區天氣頁元件
// HKO 18-district weather page component
export default function CloudSeaPredictionHKOPage() {
  const [loading, setLoading] = useState(false);
  const [weatherMap, setWeatherMap] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const service = useMemo(() => new HKOWeatherService(), []);

  // 取得天氣資料
  // Fetch weather data
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    setWeatherMap(null);
    try {
      const data = await service.processWeatherDataForCloudSea();
      setWeatherMap(data);
    } catch (e: any) {
      setError(e.message || '獲取天氣數據失敗');
    } finally {
      setLoading(false);
    }
  };

  // 表格渲染
  // Table rendering
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">18區天氣（香港天文台 API）</h1>
      <div className="mb-2 flex gap-2">
        <button onClick={handleRefresh} className="px-4 py-2 rounded bg-green-500 text-white">刷新天氣</button>
      </div>
      {loading && <div className="mb-2 text-blue-600">正在載入天氣...</div>}
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {weatherMap && (
        <div className="bg-white rounded-lg shadow p-4 w-full max-w-3xl mt-4 overflow-x-auto">
          <h2 className="text-lg font-bold mb-2">18區實測天氣</h2>
          <table className="w-full text-sm mb-2 border rounded">
            <thead>
              <tr>
                <th className="border px-2 py-1">地區</th>
                <th className="border px-2 py-1">氣溫</th>
                <th className="border px-2 py-1">濕度</th>
                <th className="border px-2 py-1">風速</th>
                <th className="border px-2 py-1">風向</th>
                <th className="border px-2 py-1">露點</th>
                <th className="border px-2 py-1">溫度露點差</th>
                <th className="border px-2 py-1">逆溫層高度</th>
                <th className="border px-2 py-1">數據時間</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(weatherMap).map(([location, data]) => (
                <tr key={location}>
                  <td className="border px-2 py-1 font-bold">{location}</td>
                  <td className="border px-2 py-1">{data.temperature !== undefined ? `${data.temperature}°C` : '-'}</td>
                  <td className="border px-2 py-1">{data.humidity !== undefined ? `${data.humidity}%` : '-'}</td>
                  <td className="border px-2 py-1">{data.windSpeed !== undefined ? `${data.windSpeed} km/h` : '-'}</td>
                  <td className="border px-2 py-1">{data.windDirection || '-'}</td>
                  <td className="border px-2 py-1">{data.dewPoint !== undefined ? `${data.dewPoint.toFixed(1)}°C` : '-'}</td>
                  <td className="border px-2 py-1">{data.temperatureDewPointDiff !== undefined ? `${data.temperatureDewPointDiff.toFixed(1)}°C` : '-'}</td>
                  <td className="border px-2 py-1">{data.inversionLayerHeight !== undefined ? `${data.inversionLayerHeight}m` : '-'}</td>
                  <td className="border px-2 py-1">{data.updateTime || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 text-xs text-gray-500">數據來源：香港天文台開放數據 API</div>
        </div>
      )}
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
    </div>
  );
}
