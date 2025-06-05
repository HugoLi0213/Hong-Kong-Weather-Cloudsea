import { clsx, type ClassValue } from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  if (unit === 'fahrenheit') {
    return `${Math.round((temp * 9/5) + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number, unit: 'kmh' | 'ms' | 'mph' = 'kmh'): string {
  switch (unit) {
    case 'ms':
      return `${(speed / 3.6).toFixed(1)} m/s`;
    case 'mph':
      return `${(speed * 0.621371).toFixed(1)} mph`;
    default:
      return `${speed} km/h`;
  }
}

export function formatVisibility(visibility: number, unit: 'km' | 'miles' = 'km'): string {
  if (unit === 'miles') {
    return `${(visibility * 0.621371).toFixed(1)} miles`;
  }
  return `${visibility} km`;
}

export function getAQHILevel(aqhi: number): 'Low' | 'Moderate' | 'High' | 'Very High' | 'Serious' {
  if (aqhi <= 3) return 'Low';
  if (aqhi <= 6) return 'Moderate';
  if (aqhi <= 7) return 'High';
  if (aqhi <= 10) return 'Very High';
  return 'Serious';
}

export function getAQHIColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'low':
      return 'text-aqhi-low bg-aqhi-low/10 border-aqhi-low/20';
    case 'moderate':
      return 'text-aqhi-moderate bg-aqhi-moderate/10 border-aqhi-moderate/20';
    case 'high':
      return 'text-aqhi-high bg-aqhi-high/10 border-aqhi-high/20';
    case 'very high':
      return 'text-aqhi-very-high bg-aqhi-very-high/10 border-aqhi-very-high/20';
    case 'serious':
      return 'text-aqhi-serious bg-aqhi-serious/10 border-aqhi-serious/20';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
}

export function getHealthRisk(aqhi: number): string {
  if (aqhi <= 3) return 'Low health risk';
  if (aqhi <= 6) return 'Moderate health risk for sensitive individuals';
  if (aqhi <= 7) return 'High health risk for sensitive individuals, moderate for others';
  if (aqhi <= 10) return 'Very high health risk';
  return 'Serious health risk for everyone';
}

export function getWeatherIcon(condition: string): string {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
    return '☀️';
  }
  if (lowerCondition.includes('cloud')) {
    return '☁️';
  }
  if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
    return '🌧️';
  }
  if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
    return '⛈️';
  }
  if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) {
    return '🌫️';
  }
  if (lowerCondition.includes('wind')) {
    return '💨';
  }
  
  return '🌤️'; // Default partly cloudy
}

export function getUVIndexLevel(uvIndex: number): { level: string; color: string } {
  if (uvIndex <= 2) return { level: 'Low', color: 'text-green-600' };
  if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
  if (uvIndex <= 7) return { level: 'High', color: 'text-orange-600' };
  if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-600' };
  return { level: 'Extreme', color: 'text-purple-600' };
}

export function formatDateTime(dateTime: string | Date): string {
  const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  return format(date, 'MMM dd, yyyy HH:mm');
}

export function formatTimeAgo(dateTime: string | Date): string {
  const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatTime(dateTime: string | Date): string {
  const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  return format(date, 'HH:mm');
}

export function formatDate(dateTime: string | Date): string {
  const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  return format(date, 'MMM dd');
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function convertWindDegrees(direction: string): number {
  const directions: { [key: string]: number } = {
    'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
    'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
    'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
    'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
  };
  return directions[direction] || 0;
}

export function getComfortLevel(temperature: number, humidity: number): { level: string; color: string } {
  const heatIndex = temperature + (0.5 * (humidity - 10));
  
  if (heatIndex < 24) return { level: 'Cool', color: 'text-blue-600' };
  if (heatIndex < 27) return { level: 'Comfortable', color: 'text-green-600' };
  if (heatIndex < 32) return { level: 'Warm', color: 'text-yellow-600' };
  if (heatIndex < 38) return { level: 'Hot', color: 'text-orange-600' };
  return { level: 'Very Hot', color: 'text-red-600' };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
