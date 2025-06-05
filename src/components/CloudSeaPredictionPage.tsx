import React, { useContext, useState } from 'react';
import { WeatherContext } from '../main';

interface WeatherData {
  humidity: number; // 濕度百分比 (0-100)
  windSpeed: number; // 風速 (km/h)
  windDirection: string; // 風向 ('E', 'SE', 'NE', 'S', 'N', 'W', 'SW', 'NW')
  temperatureDewPointDiff: number; // 溫度露點差 (°C)
  hasInversionLayer: boolean; // 是否有逆溫層
  inversionLayerHeight: number; // 逆溫層高度 (米)
  observationHeight: number; // 觀測點高度 (米)
}

interface CloudSeaPrediction {
  hasCloudSea: boolean;
  probability: number; // 0-100
  conditions: {
    humidity: boolean;
    windSpeed: boolean;
    windDirection: boolean;
    temperatureDewPoint: boolean;
    inversionLayer: boolean;
    heightAdvantage: boolean;
  };
  recommendation: string;
}

function predictCloudSea(data: WeatherData): CloudSeaPrediction {
  const conditions = {
    humidity: data.humidity >= 95,
    windSpeed: data.windSpeed <= 19,
    windDirection: ['E', 'SE', 'NE'].includes(data.windDirection),
    temperatureDewPoint: data.temperatureDewPointDiff <= 6,
    inversionLayer: data.hasInversionLayer,
    heightAdvantage: data.observationHeight > data.inversionLayerHeight,
  };
  const satisfiedConditions = Object.values(conditions).filter(Boolean).length;
  const totalConditions = Object.keys(conditions).length;
  let probability = (satisfiedConditions / totalConditions) * 100;
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
    hasCloudSea,
    probability: Math.round(probability),
    conditions,
    recommendation,
  };
}

// 雲海預測頁元件
// Cloudsea prediction page component
export default function CloudSeaPredictionPage() {
  // 預設天氣資料
  // Default weather data
  const defaultData: WeatherData = {
    humidity: 98,
    windSpeed: 15,
    windDirection: 'SE',
    temperatureDewPointDiff: 2,
    hasInversionLayer: false, // 預設為沒有逆溫層
    inversionLayerHeight: 560,
    observationHeight: 800,
  };

  const windOptions = ['E', 'SE', 'NE', 'S', 'N', 'W', 'SW', 'NW'];
  const locations = {
    HongKong: { label: '香港', latitude: 22.3193, longitude: 114.1694 },
    TaiMoShan: { label: '大帽山', latitude: 22.411811, longitude: 114.123144 },
  };

  const [form, setForm] = useState<WeatherData>(defaultData);
  const [result, setResult] = useState<CloudSeaPrediction | null>(predictCloudSea(defaultData));
  const [loading, setLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<'HongKong' | 'TaiMoShan'>('TaiMoShan');
  const [showInversionInfo, setShowInversionInfo] = useState(false);
  const weatherCtx = useContext(WeatherContext) as {
    weatherData: any;
    setWeatherData: (data: any) => void;
    fetchWeather: (location: 'HongKong' | 'TaiMoShan') => Promise<WeatherData>;
    lastFetch: number;
  };

  const fetchWeather = async () => {
    setLoading(true);
    if (weatherCtx && weatherCtx.fetchWeather) {
      try {
        const data = await weatherCtx.fetchWeather(selectedLocation);
        if (data) {
          setForm((prev) => ({
            ...prev,
            humidity: data.humidity,
            windSpeed: data.windSpeed,
            windDirection: data.windDirection,
            temperatureDewPointDiff: data.temperatureDewPointDiff,
          }));
          setLastUpdate(new Date());
          setAutoFilled(true);
        }
      } catch (e) {
        // 可加錯誤提示
      }
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox' && 'checked' in e.target) {
      checked = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(predictCloudSea(form));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* 逆溫層說明彈窗 */}
      {/* Inversion layer info modal */}
      <button
        className="mb-4 px-4 py-2 rounded-full bg-blue-100 border border-blue-400 text-blue-700 font-semibold shadow hover:bg-blue-200 transition-all"
        onClick={() => setShowInversionInfo(true)}
      >
        逆溫層資料
      </button>
      {showInversionInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-5 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 text-xl font-bold"
              onClick={() => setShowInversionInfo(false)}
              aria-label="關閉"
            >
              ×
            </button>
            <h2 className="font-bold mb-2 text-base">如何查詢逆溫層？</h2>
            <ul className="list-disc pl-5 mb-2 text-sm">
              <li>最直接方法：查閱 <a href="https://www.hko.gov.hk/tc/out_photo/upper-air-weather.htm" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">香港天文台高空氣象觀測</a> 的溫度垂直剖面圖與溫熵圖。</li>
              <li>逆溫層常見於晴朗微風的冬天晚上，通常在黎明前出現，日出後消散。</li>
              <li>逆溫層出現時，該層以下空氣較穩定，有利產生雲、霧或煙霞。</li>
            </ul>
            <div className="mb-1 text-sm">相關連結：</div>
            <ul className="list-disc pl-5 text-sm">
              <li><a href="https://www.hko.gov.hk/tc/out_photo/upper-air-weather.htm" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">天文台高空氣象觀測</a></li>
              <li><a href="https://www.hko.gov.hk/tc/education/meteorological-instruments/automatic-weather-stations/00521-inversion-layer-impose-its-own-bounds.html" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">逆溫層原理與天氣解說</a></li>
              <li><a href="https://www.hko.gov.hk/tc/wxinfo/currwx/fnd.htm" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">本港地區航空天氣預報</a></li>
            </ul>
            <div className="mt-2 text-sm">如需協助，可致電天氣查詢熱線 <span className="font-bold">1878 200</span>。</div>
          </div>
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
      <h1 className="text-2xl font-bold mb-4 text-center">雲海預測（Open-Meteo API）</h1>
      <div className="mb-2 flex gap-2">
        <button onClick={() => setSelectedLocation('HongKong')} className={`px-4 py-2 rounded ${selectedLocation === 'HongKong' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>香港</button>
        <button onClick={() => setSelectedLocation('TaiMoShan')} className={`px-4 py-2 rounded ${selectedLocation === 'TaiMoShan' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>大帽山</button>
        <button onClick={fetchWeather} className="px-4 py-2 rounded bg-green-500 text-white ml-2">刷新天氣</button>
      </div>
      {loading && <div className="mb-2 text-blue-600">正在自動載入{locations[selectedLocation].label}即時天氣...</div>}
      {autoFilled && (
        <div className="mb-2 text-green-600">
          已自動填入{locations[selectedLocation].label}最新天氣（{lastUpdate ? lastUpdate.toLocaleString() : '無時間資料'}），可直接預測或手動微調
        </div>
      )}
      {/* 表單與結果渲染 */}
      {/* Form and result rendering */}
      <form onSubmit={handleSubmit} className="bg-gray-100 rounded-lg shadow p-4 w-full max-w-md mb-4">
        <div className="mb-2">
          <label className="block mb-1">濕度 (%)</label>
          <input type="number" name="humidity" min={0} max={100} value={form.humidity} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block mb-1">風速 (km/h)</label>
          <input type="number" name="windSpeed" min={0} step="any" value={form.windSpeed} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block mb-1">風向</label>
          <select name="windDirection" value={form.windDirection} onChange={handleChange} className="w-full border rounded px-2 py-1">
            {windOptions.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">溫度露點差 (°C)</label>
          <input type="number" name="temperatureDewPointDiff" min={-10} max={30} value={form.temperatureDewPointDiff} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="hasInversionLayer" className="font-semibold">有逆溫層</label>
          <input
            id="hasInversionLayer"
            type="checkbox"
            checked={form.hasInversionLayer}
            onChange={e => setForm({ ...form, hasInversionLayer: e.target.checked })}
            className="w-5 h-5 accent-blue-500"
          />
          <span className="text-xs text-blue-700 ml-2">（建議直接查閱 <a href="https://www.hko.gov.hk/tc/out_photo/upper-air-weather.htm" target="_blank" rel="noopener noreferrer" className="underline">天文台高空氣象觀測</a>）</span>
        </div>
        <div className="mb-2">
          <label className="block mb-1">逆溫層高度 (米)</label>
          <input type="number" name="inversionLayerHeight" min={0} max={2000} value={form.inversionLayerHeight} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="block mb-1">觀測點高度 (米)</label>
          <input type="number" name="observationHeight" min={0} max={2000} value={form.observationHeight} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-2 font-bold">預測雲海機率</button>
      </form>
      {result && (
        <div className="bg-white rounded-lg shadow p-4 w-full max-w-md">
          <h2 className="text-lg font-bold mb-2">預測結果</h2>
          <div className="mb-2">雲海機率：<span className="font-bold text-blue-600">{result.probability}%</span></div>
          <div className="mb-2">{result.hasCloudSea ? '有機會出現雲海' : '雲海機率較低'}</div>
          <div className="mb-2">建議：{result.recommendation}</div>
          <table className="w-full text-sm mt-2 border rounded">
            <thead>
              <tr>
                <th className="border px-2 py-1">條件</th>
                <th className="border px-2 py-1">判斷</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border px-2 py-1">濕度 ≥ 95%</td><td className="border px-2 py-1">{result.conditions.humidity ? '✔️' : '❌'}</td></tr>
              <tr><td className="border px-2 py-1">風速 ≤ 19 km/h</td><td className="border px-2 py-1">{result.conditions.windSpeed ? '✔️' : '❌'}</td></tr>
              <tr><td className="border px-2 py-1">東/東南/東北風</td><td className="border px-2 py-1">{result.conditions.windDirection ? '✔️' : '❌'}</td></tr>
              <tr><td className="border px-2 py-1">溫度露點差 ≤ 6°C</td><td className="border px-2 py-1">{result.conditions.temperatureDewPoint ? '✔️' : '❌'}</td></tr>
              <tr><td className="border px-2 py-1">有逆溫層</td><td className="border px-2 py-1">{result.conditions.inversionLayer ? '✔️' : '❌'}</td></tr>
              <tr><td className="border px-2 py-1">觀測點高於逆溫層</td><td className="border px-2 py-1">{result.conditions.heightAdvantage ? '✔️' : '❌'}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
