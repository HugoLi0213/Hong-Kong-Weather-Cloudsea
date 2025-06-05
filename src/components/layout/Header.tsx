import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Clock, Wifi, WifiOff } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  title: string;
  isOnline?: boolean;
  lastUpdated?: string;
}

export function Header({ title, isOnline = true, lastUpdated }: HeaderProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇭🇰</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h1>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  香港實時數據
                </div>
              </div>
            </div>
          </div>

          {/* Status and controls */}
          <div className="flex items-center gap-4">
            {/* Connection status */}
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className={cn(
                'text-xs font-medium',
                isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {isOnline ? '線上' : '離線'}
              </span>
            </div>

            {/* Current time */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <div className="text-right">
                <div className="font-mono">
                  {format(currentTime, 'HH:mm:ss')}
                </div>
                <div className="text-xs">
                  {format(currentTime, 'MMM dd, yyyy')}
                </div>
              </div>
            </div>

            {/* Last updated */}
            {lastUpdated && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <div>最後更新：</div>
                <div className="font-mono">
                  {format(new Date(lastUpdated), 'HH:mm')}
                </div>
              </div>
            )}

            {/* Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
