import { useLanguage } from '@/contexts/LanguageContext';
import { PollutantData } from '@/types';
import { X } from 'lucide-react';

interface PollutantModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollutants: PollutantData;
  station: string;
}

export function PollutantModal({ isOpen, onClose, pollutants, station }: PollutantModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const pollutantData = [
    { key: 'no2', name: t('no2'), value: pollutants.no2, unit: 'μg/m³', color: 'text-orange-600' },
    { key: 'so2', name: t('so2'), value: pollutants.so2, unit: 'μg/m³', color: 'text-red-600' },
    { key: 'o3', name: t('o3'), value: pollutants.o3, unit: 'μg/m³', color: 'text-blue-600' },
    { key: 'pm10', name: t('pm10'), value: pollutants.pm10, unit: 'μg/m³', color: 'text-purple-600' },
    { key: 'pm25', name: t('pm25'), value: pollutants.pm25, unit: 'μg/m³', color: 'text-red-700' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('pollutantLevels')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Station Info */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('monitoringStations')}: <span className="font-medium">{station}</span>
          </p>
        </div>

        {/* Pollutant List */}
        <div className="space-y-3">
          {pollutantData.map((pollutant) => (
            <div key={pollutant.key} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {pollutant.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {pollutant.unit}
                </p>
              </div>
              <div className={`text-xl font-bold ${pollutant.color}`}>
                {pollutant.value}
              </div>
            </div>
          ))}
        </div>

        {/* Health Impact Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            健康影響參考
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <p>• PM2.5 &gt; 35: 對敏感人士有害</p>
            <p>• NO2 &gt; 200: 可能引起呼吸道刺激</p>
            <p>• O3 &gt; 160: 建議減少戶外活動</p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
