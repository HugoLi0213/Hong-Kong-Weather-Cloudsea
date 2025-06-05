import { cn } from '@/lib/utils';
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

export function TabNavigation({ activeTab, onTabChange, tabs }: TabNavigationProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-white dark:bg-gray-700 text-hk-red shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t(tab.label)}</span>
          </button>
        );
      })}
    </div>
  );
}
