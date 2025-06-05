import { cn } from '@/lib/utils';
import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="loading-skeleton h-4 w-full"
          style={{
            width: `${Math.random() * 40 + 60}%`,
          }}
        />
      ))}
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
  icon?: React.ReactNode;
}

export function DashboardCard({
  title,
  children,
  className,
  loading,
  error,
  icon,
}: DashboardCardProps) {
  return (
    <div className={cn('card weather-card w-full max-w-full sm:max-w-md mx-auto', className)}>
      <div className="card-header">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="card-title text-lg">{title}</h3>
        </div>
      </div>
      <div className="card-content">
        {loading ? (
          <LoadingSkeleton lines={3} />
        ) : error ? (
          <div className="text-red-500 text-sm">
            <p>⚠️ {error}</p>
            <p className="text-xs mt-1 text-gray-500">
              Please try refreshing the page
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '➡️';
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-red-500';
      case 'down':
        return 'text-green-500';
      case 'stable':
        return 'text-gray-500';
      default:
        return '';
    }
  };

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg p-4 border', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        </div>
        {trend && trendValue && (
          <div className={cn('flex items-center gap-1 text-xs', getTrendColor())}>
            <span>{getTrendIcon()}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold">
          {value}
          {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
        </span>
      </div>
    </div>
  );
}

interface AlertBannerProps {
  type: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  onDismiss?: () => void;
}

export function AlertBanner({ type, title, message, onDismiss }: AlertBannerProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'info':
        return '💡';
      case 'warning':
        return '⚠️';
      case 'danger':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={cn('rounded-lg border p-4 animate-slide-up', getTypeStyles())}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{getIcon()}</span>
        <div className="flex-1">
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm mt-1">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max,
  label,
  color = 'blue',
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getColorClass = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
      case 'purple':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getHeightClass = () => {
    switch (size) {
      case 'sm':
        return 'h-1';
      case 'lg':
        return 'h-4';
      default:
        return 'h-2';
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 dark:bg-gray-700 rounded-full', getHeightClass())}>
        <div
          className={cn('rounded-full transition-all duration-300', getColorClass(), getHeightClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
