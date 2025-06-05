import CloudSeaPredictionHKOPage from '@/components/CloudSeaPredictionHKOPage';
import CloudSeaPredictionPage from '@/components/CloudSeaPredictionPage';
import Dashboard from '@/components/Dashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 408, 429
        if (error?.status >= 400 && error?.status < 500 && ![408, 429].includes(error.status)) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    },
  },
});

// Open-Meteo 天氣共用 context
export const WeatherContext = React.createContext<any>(null);

function App() {
  React.useEffect(() => {
    // document.documentElement.classList.add('dark'); // 移除強制 dark mode
    document.documentElement.classList.remove('dark'); // 強制移除 dark mode，確保明亮底色
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <NotificationProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/weather" element={<WithHomeButton><Dashboard /></WithHomeButton>} />
                  <Route path="/cloud-sea" element={
                    <WeatherProvider>
                      <WithHomeButton><CloudSeaPredictionPage /></WithHomeButton>
                    </WeatherProvider>
                  } />
                  <Route path="/cloud-sea-hko" element={<WithHomeButton><CloudSeaPredictionHKOPage /></WithHomeButton>} />
                </Routes>
              </BrowserRouter>
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <h1 className="text-3xl font-bold mb-8">香港天氣和雲海</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link to="/cloud-sea-hko" className="w-full bg-yellow-500 text-gray-900 py-3 rounded text-center font-bold text-lg">18區天氣（香港天文台 API）</Link>
        <Link to="/weather" className="w-full bg-blue-500 text-white py-3 rounded text-center font-bold text-lg">天氣總覽（Open-Meteo API）</Link>
        <Link to="/cloud-sea" className="w-full bg-green-500 text-white py-3 rounded text-center font-bold text-lg">雲海預測（Open-Meteo API）</Link>
      </div>
    </div>
  );
}

// 包裝 Open-Meteo 兩頁面共用天氣資料
function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  // 提供 fetch 函數給子頁面調用
  const fetchWeather = async (location: 'HongKong' | 'TaiMoShan') => {
    setLastFetch(Date.now());
    // 設定經緯度
    const coords = location === 'HongKong'
      ? { lat: 22.3193, lon: 114.1694 }
      : { lat: 22.411811, lon: 114.123144 };
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,rain&timezone=Asia/Hong_Kong&forecast_days=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Open-Meteo API 錯誤');
    const data = await res.json();
    // 取 current_weather
    const current = data.current_weather || {};
    const windSpeed = typeof current.windspeed === 'number' ? current.windspeed : (Number(current.windspeed) || 0);
    const newWeather = {
      location: location === 'HongKong' ? '香港' : '大帽山',
      temperature: Number(current.temperature),
      humidity: data.hourly?.relative_humidity_2m?.[0] ?? 0,
      windSpeed,
      windDirection: String(current.winddirection) || '',
      temperatureDewPointDiff: 2, // 預設值，或可根據API擴充
      hasInversionLayer: true, // 預設值，或可根據API擴充
      inversionLayerHeight: 560, // 預設值，或可根據API擴充
      observationHeight: location === 'HongKong' ? 0 : 800, // 預設值
      lastUpdated: current.time || new Date().toISOString(),
    };
    // 判斷是否與預設值完全相同
    const isDefault =
      newWeather.humidity === 98 &&
      newWeather.windSpeed === 15 &&
      newWeather.windDirection === 'SE' &&
      newWeather.temperatureDewPointDiff === 2;
    if (isDefault) {
      throw new Error('刷新無效 請重試');
    }
    setWeatherData(newWeather);
    return newWeather; // <--- 新增這一行
  };
  return (
    <WeatherContext.Provider value={{ weatherData, setWeatherData, fetchWeather, lastFetch }}>
      {children}
    </WeatherContext.Provider>
  );
}

function WithHomeButton({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div>
      <button className="fixed top-4 left-4 bg-gray-200 text-blue-700 px-3 py-1 rounded shadow" onClick={() => navigate('/')}>🏠 返回首頁</button>
      {children}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(err => {
      console.error('Service worker registration failed:', err);
    });
  });
}
