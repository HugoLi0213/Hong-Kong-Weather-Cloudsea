import { DashboardCard, StatCard } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn, formatTimeAgo, getAQHIColor } from '@/lib/utils';
import { AirQualityData } from '@/types';
import { Info, Wind } from 'lucide-react';
import { useState } from 'react';
import { PollutantModal } from './PollutantModal';

interface AirQualityCardProps {
  airQualityData: AirQualityData[];
  selectedStation?: string;
  loading?: boolean;
  error?: string;
}

export function AirQualityCard({ 
  airQualityData, 
  selectedStation = 'Central',
  loading, 
  error 
}: AirQualityCardProps) {
  const { t } = useLanguage();
  const [showPollutantModal, setShowPollutantModal] = useState(false);
  
  const stationData = airQualityData.find(station => 
    station.station.toLowerCase() === selectedStation.toLowerCase()
  ) || airQualityData[0];

  if (!stationData && !loading) {
    return (
      <DashboardCard
        title="Air Quality (AQHI)"
        icon={<Wind className="h-5 w-5" />}
        error="No air quality data available"
      >
        <div></div>
      </DashboardCard>
    );
  }

  const getAQHIIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return '🟢';
      case 'moderate':
        return '🟡';
      case 'high':
        return '🟠';
      case 'very high':
        return '🔴';
      case 'serious':
        return '🟣';
      default:
        return '⚪';
    }
  };

  return (
    <DashboardCard
      title="Air Quality (AQHI)"
      icon={<Wind className="h-5 w-5" />}
      loading={loading}
      error={error}
    >
      {stationData && (
        <div className="space-y-6">
          {/* Current AQHI */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">{getAQHIIcon(stationData.level)}</span>
              <div className="text-4xl font-bold">{stationData.aqhi}</div>
            </div>
            <div className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border',
              getAQHIColor(stationData.level)
            )}>
              {stationData.level} Risk
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {stationData.station} • Updated {formatTimeAgo(stationData.lastUpdated)}
            </div>
          </div>

          {/* Pollutant levels */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">{t('pollutantLevels')}</h4>
              <button
                onClick={() => setShowPollutantModal(true)}
                className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <Info className="h-4 w-4" />
                詳細資料
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="PM2.5"
                value={stationData.pollutants.pm25}
                className={stationData.pollutants.pm25 > 75 ? 'border-red-200' : ''}
              />
              <StatCard
                label="PM10"
                value={stationData.pollutants.pm10}
                className={stationData.pollutants.pm10 > 100 ? 'border-red-200' : ''}
              />
              <StatCard
                label="NO2"
                value={stationData.pollutants.no2}
                className={stationData.pollutants.no2 > 200 ? 'border-red-200' : ''}
              />
              <StatCard
                label="O3"
                value={stationData.pollutants.o3}
                className={stationData.pollutants.o3 > 160 ? 'border-red-200' : ''}
              />
              <StatCard
                label="SO2"
                value={stationData.pollutants.so2}
                className={stationData.pollutants.so2 > 80 ? 'border-red-200' : ''}
              />
              <StatCard
                label="CO"
                value={stationData.pollutants.co}
                unit="mg/m³"
                className={stationData.pollutants.co > 8 ? 'border-red-200' : ''}
              />
            </div>
          </div>

          {/* Dominant pollutant */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="font-medium text-sm">Dominant Pollutant</div>
            </div>
            <div className="text-blue-700 dark:text-blue-300 font-semibold mt-1">
              {stationData.dominantPollutant}
            </div>
          </div>

          {/* All stations quick view */}
          <div>
            <h4 className="font-semibold mb-3">Other Monitoring Stations</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {airQualityData
                .filter(station => station.station !== stationData.station)
                .slice(0, 5)
                .map((station) => (
                  <div
                    key={station.station}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="text-sm">{station.station}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getAQHIIcon(station.level)}</span>
                      <span className="font-medium">{station.aqhi}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Pollutant Details Modal */}
      {stationData && (
        <PollutantModal
          isOpen={showPollutantModal}
          onClose={() => setShowPollutantModal(false)}
          pollutants={stationData.pollutants}
          station={stationData.station}
        />
      )}
    </DashboardCard>
  );
}
