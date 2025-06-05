import { airQualityService } from '@/services/air-quality';
import { weatherService } from '@/services/weather';
import { useQuery } from '@tanstack/react-query';

export function useWeatherData(location: string = 'Hong Kong') {
  return useQuery({
    queryKey: ['weather', location],
    queryFn: () => weatherService.getWeatherData(location),
    refetchInterval: 60 * 1000, // Refetch every 1 minute
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
  });
}

export function useAirQualityData() {
  return useQuery({
    queryKey: ['air-quality'],
    queryFn: () => airQualityService.getCompleteAirQualityData(),
    refetchInterval: 60 * 1000, // Refetch every 1 minute
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
  });
}

export function useHistoricalAQHI(station: string = 'Central', hours: number = 24) {
  return useQuery({
    queryKey: ['historical-aqhi', station, hours],
    queryFn: () => airQualityService.getHistoricalAQHI(station, hours),
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    staleTime: 15 * 60 * 1000, // Consider data stale after 15 minutes
  });
}

export function useAirQualityByDistrict(district: string) {
  return useQuery({
    queryKey: ['air-quality-district', district],
    queryFn: () => airQualityService.getAirQualityByDistrict(district),
    enabled: !!district,
    refetchInterval: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
}

