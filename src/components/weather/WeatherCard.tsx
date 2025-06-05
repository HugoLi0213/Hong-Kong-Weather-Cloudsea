import { DashboardCard, StatCard } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatTemperature, formatTimeAgo, formatWindSpeed, getUVIndexLevel } from '@/lib/utils';
import { WeatherData, WeatherForecast } from '@/types';
import {
    Droplets,
    Eye,
    Gauge,
    MapPin,
    Sun,
    Wind
} from 'lucide-react';

interface WeatherCardProps {
  weatherData?: WeatherData;
  forecast: WeatherForecast[];
  loading?: boolean;
  error?: string;
  onUseCurrentLocation?: () => void;
  locationLoading?: boolean;
}

export function WeatherCard({ weatherData, forecast, loading, error, onUseCurrentLocation, locationLoading }: WeatherCardProps) {
  const { t } = useLanguage();
  
  if (loading || !weatherData) {
    return (
      <DashboardCard
        title="Current Weather"
        loading={loading}
        error={error}
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="loading-skeleton h-12 w-32 mx-auto mb-2"></div>
            <div className="loading-skeleton h-6 w-24 mx-auto mb-1"></div>
            <div className="loading-skeleton h-4 w-48 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="loading-skeleton h-4 w-16 mb-2"></div>
                <div className="loading-skeleton h-6 w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    );
  }

  const uvLevel = getUVIndexLevel(weatherData.uvIndex);

  return (
    <DashboardCard
      title={t('currentWeather')}
      icon={<span className="text-2xl">{weatherData.icon}</span>}
      loading={loading}
      error={error}
    >
      <div className="space-y-6">
        {/* Location Button */}
        {onUseCurrentLocation && (
          <div className="flex justify-end">
            <button
              onClick={onUseCurrentLocation}
              disabled={locationLoading}
              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
            >
              <MapPin className="h-4 w-4" />
              {locationLoading ? t('detectingLocation') : t('useCurrentLocation')}
            </button>
          </div>
        )}
        
        {/* Current conditions */}
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {formatTemperature(weatherData.temperature)}
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400 mb-1">
            {weatherData.condition}
          </div>
          <div className="text-sm text-gray-500">
            {weatherData.location} • {t('lastUpdated')} {formatTimeAgo(weatherData.lastUpdated)}
          </div>
        </div>

        {/* Weather stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            label={t('humidity')}
            value={weatherData.humidity}
            unit="%"
            icon={<Droplets className="h-4 w-4 text-blue-500" />}
          />
          <StatCard
            label="風速"
            value={formatWindSpeed(weatherData.windSpeed)}
            icon={<Wind className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            label={t('uvIndex')}
            value={weatherData.uvIndex}
            icon={<Sun className={`h-4 w-4 ${uvLevel.color}`} />}
          />
          <StatCard
            label={t('visibility')}
            value={weatherData.visibility}
            unit="km"
            icon={<Eye className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            label={t('pressure')}
            value={weatherData.pressure}
            unit="hPa"
            icon={<Gauge className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            label="風向"
            value={weatherData.windDirection}
            icon={<Wind className="h-4 w-4 text-gray-500" />}
          />
        </div>

        {/* 5-day forecast */}
        <div>
          <h4 className="font-semibold mb-3">5-Day Forecast</h4>
          <div className="space-y-2">
            {forecast.slice(0, 5).map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{day.icon}</span>
                  <div>
                    <div className="font-medium">
                      {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {day.condition}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatTemperature(day.high)} / {formatTemperature(day.low)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {day.precipitation}% rain
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
