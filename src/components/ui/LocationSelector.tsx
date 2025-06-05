import { cn } from '@/lib/utils';
import { HKDistrict } from '@/types';
import { ChevronDown, MapPin } from 'lucide-react';
import React from 'react';

interface LocationSelectorProps {
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  districts: HKDistrict[];
  className?: string;
}

export function LocationSelector({
  selectedDistrict,
  onDistrictChange,
  districts,
  className
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedDistrictData = districts.find(d => d.id === selectedDistrict);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border',
          'bg-white dark:bg-gray-800',
          'border-gray-200 dark:border-gray-700',
          'text-gray-700 dark:text-gray-300',
          'hover:bg-gray-50 dark:hover:bg-gray-700',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-hk-red focus:ring-offset-2'
        )}
      >
        <MapPin className="h-4 w-4" />
        <span className="font-medium">
          {selectedDistrictData?.name || 'Select District'}
        </span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto custom-scrollbar">
            {Object.entries(
              districts.reduce((acc, district) => {
                if (!acc[district.region]) {
                  acc[district.region] = [];
                }
                acc[district.region].push(district);
                return acc;
              }, {} as Record<string, HKDistrict[]>)
            ).map(([region, regionDistricts]) => (
              <div key={region}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                  {region}
                </div>
                {regionDistricts.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => {
                      onDistrictChange(district.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                      selectedDistrict === district.id && 'bg-hk-red/10 text-hk-red font-medium'
                    )}
                  >
                    <div className="font-medium">{district.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {district.nameZh}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
