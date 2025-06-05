import { DashboardCard, StatCard } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatTemperature, formatTimeAgo, formatWindSpeed, getUVIndexLevel } from '@/lib/utils';
import { AirQualityData, WeatherData, WeatherForecast } from '@/types';
import {
    Droplets,
    Eye,
    Gauge,
    Sun,
    Wind
} from 'lucide-react';

interface WeatherCardProps {
  weatherData?: WeatherData;
  forecast: WeatherForecast[];
  loading?: boolean;
  error?: string;
}

export function WeatherCard({ weatherData, forecast, loading, error, airQualityData }: WeatherCardProps & { airQualityData?: AirQualityData[] }) {
  const { t } = useLanguage();
  // 取出 Central 站 AQHI
  const aqhi = airQualityData?.find(station => station.station === 'Central');
  const uvLevel = getUVIndexLevel(weatherData?.uvIndex ?? 0);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-0">
      {/* Apple Weather: Large temperature, icon, city, condition */}
      <div className="flex flex-col items-center justify-center mt-8 mb-4">
        <span className="text-7xl font-thin drop-shadow-lg" style={{letterSpacing: '-0.05em'}}>{formatTemperature(weatherData.temperature)}</span>
        <span className="text-3xl mt-2 mb-1">{weatherData.icon}</span>
        <span className="text-lg font-medium mb-1">{weatherData.location}</span>
        <span className="text-base opacity-80 mb-2">{weatherData.condition}</span>
        <span className="text-xs opacity-60 mb-2">{t('lastUpdated')} {formatTimeAgo(weatherData.lastUpdated)}</span>
        {/* AQHI 混合顯示 */}
        {aqhi && (
          <div className="flex flex-col items-center mt-2 mb-2">
            <span className="text-lg font-bold">空氣質素指數 AQHI</span>
            <span className="text-3xl font-bold" style={{color: aqhi.level === 'Low' ? '#22c55e' : aqhi.level === 'Moderate' ? '#eab308' : aqhi.level === 'High' ? '#f97316' : aqhi.level === 'Very High' ? '#ef4444' : '#7c2d12'}}>{aqhi.aqhi}</span>
            <span className="text-xs opacity-80">{aqhi.level} Risk · {aqhi.dominantPollutant}</span>
          </div>
        )}
      </div>
      {/* Apple Weather: Horizontal scrollable stats */}
      <div className="flex gap-3 overflow-x-auto w-full px-4 pb-2 snap-x snap-mandatory">
        <div className="flex flex-row gap-3 min-w-full justify-center">
          <StatCard label={t('humidity')} value={weatherData.humidity} unit="%" icon={<Droplets className="h-5 w-5 text-blue-200" />} />
          <StatCard label="風速" value={formatWindSpeed(weatherData.windSpeed)} icon={<Wind className="h-5 w-5 text-white/80" />} />
          <StatCard label={t('uvIndex')} value={weatherData.uvIndex} icon={<Sun className={`h-5 w-5 ${uvLevel.color}`} />} />
          <StatCard label={t('visibility')} value={weatherData.visibility} unit="km" icon={<Eye className="h-5 w-5 text-white/80" />} />
          <StatCard label={t('pressure')} value={weatherData.pressure} unit="hPa" icon={<Gauge className="h-5 w-5 text-white/80" />} />
          <StatCard label="風向" value={weatherData.windDirection} icon={<Wind className="h-5 w-5 text-white/80" />} />
        </div>
      </div>
      {/* Apple Weather: 5-day forecast, glassy card */}
      <div className="w-full max-w-md mx-auto mt-6 rounded-3xl bg-white/10 backdrop-blur-md p-4 shadow-xl">
        <h4 className="font-semibold mb-2 text-white/90 text-center">5日天氣預報</h4>
        <div className="divide-y divide-white/20">
          {forecast.slice(0, 5).map((day, index) => (
            <div key={index} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{day.icon}</span>
                <div>
                  <div className="font-medium text-white/90">{index === 0 ? '今日' : new Date(day.date).toLocaleDateString('zh-Hant', { weekday: 'short' })}</div>
                  <div className="text-xs text-white/70">{day.condition}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-white/90">{formatTemperature(day.high)} / {formatTemperature(day.low)}</div>
                <div className="text-xs text-white/70">{day.precipitation}% 雨</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
