import { useNotificationHelpers } from '@/contexts/NotificationContext';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import React, { useEffect, useState } from 'react';
import { useAirQualityData, useWeatherData } from '../hooks/useWeatherData';
import { AirQualityCard } from './air-quality/AirQualityCard';
import { Header } from './layout/Header';
import { WeatherCard } from './weather/WeatherCard';

const TABS = [
  { id: 'overview', label: '總覽', icon: '🏠' },
  { id: 'air-quality', label: '空氣', icon: '🌫️' },
  { id: 'weather', label: '天氣', icon: '⛅' },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStation] = useState('Central');

  // Location state for weather
  const [location, setLocation] = useState<string>('Hong Kong');

  // Language and location hooks
  const { loading: locationLoading, getCurrentLocation, location: detectedLocation } = useCurrentLocation();

  // Notification helpers
  const { showError, showWarning, showInfo } = useNotificationHelpers();

  // Data hooks
  const { 
    data: weatherData, 
    isLoading: weatherLoading, 
    error: weatherError 
  } = useWeatherData(location);

  const { 
    data: airQualityData, 
    isLoading: airQualityLoading, 
    error: airQualityError 
  } = useAirQualityData();

  // Get last updated time
  const lastUpdated = weatherData?.current?.lastUpdated || 
                     airQualityData?.stations?.[0]?.lastUpdated;

  // Check if online
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Notification effects for errors and air quality warnings
  useEffect(() => {
    if (weatherError) {
      showError('Weather Data Error', 'Failed to load weather information');
    }
    if (airQualityError) {
      showError('Air Quality Data Error', 'Failed to load air quality information');
    }
  }, [weatherError, airQualityError, showError]);

  // Air quality warning notifications
  useEffect(() => {
    if (airQualityData?.stations) {
      const highAqhiStations = airQualityData.stations.filter(station => station.aqhi >= 7);
      if (highAqhiStations.length > 0) {
        showWarning(
          'High Air Pollution Detected',
          `${highAqhiStations.length} monitoring station(s) reporting AQHI ≥ 7. Consider reducing outdoor activities.`
        );
      }
    }
  }, [airQualityData, showWarning]);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showInfo('Back Online', 'Connection restored');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showWarning('Offline', 'You are currently offline. Data may not be current.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showInfo, showWarning]);

  // When detectedLocation changes, update location state
  useEffect(() => {
    if (detectedLocation?.district) {
      setLocation(detectedLocation.district);
    }
  }, [detectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col touch-manipulation">
      <Header
        title="香港天氣及空氣質素"
        isOnline={isOnline}
        lastUpdated={lastUpdated}
      />
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around py-2 md:hidden">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`flex flex-col items-center flex-1 px-2 py-2 min-h-[48px] ${activeTab === tab.id ? 'text-hk-red' : 'text-gray-500'}`}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            style={{ minWidth: 60 }}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className="text-xs font-semibold tracking-wide">{tab.label}</span>
          </button>
        ))}
      </nav>
      <main className="flex-1 max-w-full px-0 pt-2 pb-20 md:pb-6">
        {/* Swipeable Cards for Mobile */}
        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 px-2 md:hidden">
          {/* Weather Card */}
          <div className="min-w-[98vw] max-w-[98vw] snap-center">
            <WeatherCard
              weatherData={weatherData?.current}
              forecast={weatherData?.forecast || []}
              loading={weatherLoading}
              error={weatherError?.message}
              onUseCurrentLocation={getCurrentLocation}
              locationLoading={locationLoading}
            />
          </div>
          {/* Air Quality Card */}
          <div className="min-w-[98vw] max-w-[98vw] snap-center">
            <AirQualityCard
              airQualityData={airQualityData?.stations || []}
              selectedStation={selectedStation}
              loading={airQualityLoading}
              error={airQualityError?.message}
            />
          </div>
        </div>
        {/* Desktop Grid Layout (hidden on mobile) */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
          {/* Weather Card */}
          <div className="xl:col-span-1">
            <WeatherCard
              weatherData={weatherData?.current}
              forecast={weatherData?.forecast || []}
              loading={weatherLoading}
              error={weatherError?.message}
              onUseCurrentLocation={getCurrentLocation}
              locationLoading={locationLoading}
            />
          </div>

          {/* Air Quality Card */}
          <div className="xl:col-span-1">
            <AirQualityCard
              airQualityData={airQualityData?.stations || []}
              selectedStation={selectedStation}
              loading={airQualityLoading}
              error={airQualityError?.message}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
