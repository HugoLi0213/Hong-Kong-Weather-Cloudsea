import { useLanguage } from '@/contexts/LanguageContext';
import { useAirQualityData, useWeatherData } from '@/hooks/useWeatherData';
import { useState } from 'react';

export function SimpleDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Test the data hooks
  const { data: weatherData, isLoading: weatherLoading } = useWeatherData();
  const { data: airQualityData, isLoading: airQualityLoading } = useAirQualityData();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white p-4">
        <h1 className="text-2xl font-bold">香港天氣及空氣質素儀表板</h1>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{t('overview')}</h2>
            <p className="text-gray-600">
              語言系統正常運作: {t('loading')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              天氣資料載入中: {weatherLoading ? '是' : '否'}
            </p>
            <p className="text-sm text-gray-500">
              空氣質素資料載入中: {airQualityLoading ? '是' : '否'}
            </p>
            {weatherData && (
              <p className="text-sm text-green-600 mt-2">
                當前溫度: {weatherData.current.temperature}°C
              </p>
            )}
            {airQualityData && airQualityData.stations[0] && (
              <p className="text-sm text-blue-600">
                AQHI: {airQualityData.stations[0].aqhi}
              </p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{t('weather')}</h2>
            <p className="text-gray-600">
              天氣資訊區域 - {t('currentWeather')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{t('airQuality')}</h2>
            <p className="text-gray-600">
              空氣質素資訊區域 - {t('aqhi')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
