import { useCallback, useEffect, useState } from 'react';
import { HK_DISTRICTS } from '../data/locations';
import { Location } from '../types';

interface GeolocationState {
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  nearestLocation: Location | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoDetect?: boolean;
}

export const useEnhancedGeolocation = (options: UseGeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
    autoDetect = false,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: false,
    nearestLocation: null,
  });

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = useCallback((
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Find nearest location based on coordinates
  const findNearestLocation = useCallback((latitude: number, longitude: number): Location | null => {
    if (!HK_DISTRICTS.length) return null;

    let nearestLocation = HK_DISTRICTS[0];
    let minDistance = calculateDistance(
      latitude,
      longitude,
      HK_DISTRICTS[0].coordinates.lat,
      HK_DISTRICTS[0].coordinates.lng
    );

    HK_DISTRICTS.forEach(location => {
      const distance = calculateDistance(
        latitude,
        longitude,
        location.coordinates.lat,
        location.coordinates.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestLocation = location;
      }
    });

    // Only return if within reasonable range (50km)
    return minDistance <= 50 ? nearestLocation : null;
  }, [calculateDistance]);

  // Get current position
  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: {
          code: 2,
          message: 'Geolocation is not supported by this browser.',
        } as GeolocationPositionError,
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearestLocation = findNearestLocation(
          position.coords.latitude,
          position.coords.longitude
        );

        setState({
          position,
          error: null,
          loading: false,
          nearestLocation,
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error,
          loading: false,
          nearestLocation: null,
        }));
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge, findNearestLocation]);

  // Auto-detect location on mount if enabled
  useEffect(() => {
    if (autoDetect) {
      getCurrentPosition();
    }
  }, [autoDetect, getCurrentPosition]);

  // Watch position changes (optional)
  const [watchId, setWatchId] = useState<number | null>(null);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation || watchId !== null) return;

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const nearestLocation = findNearestLocation(
          position.coords.latitude,
          position.coords.longitude
        );

        setState(prev => ({
          ...prev,
          position,
          nearestLocation,
          error: null,
        }));
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error,
        }));
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );

    setWatchId(id);
  }, [watchId, enableHighAccuracy, timeout, maximumAge, findNearestLocation]);

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    ...state,
    getCurrentPosition,
    startWatching,
    stopWatching,
    isWatching: watchId !== null,
  };
};

// Hook for checking if user is in Hong Kong
export const useHongKongDetection = () => {
  const [isInHongKong, setIsInHongKong] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const checkLocation = useCallback(async () => {
    setLoading(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Hong Kong approximate boundaries
      const hkBounds = {
        north: 22.5615,
        south: 22.1435,
        east: 114.4457,
        west: 113.8259,
      };

      const inHK = 
        latitude >= hkBounds.south &&
        latitude <= hkBounds.north &&
        longitude >= hkBounds.west &&
        longitude <= hkBounds.east;

      setIsInHongKong(inHK);
    } catch (error) {
      console.error('Failed to detect location:', error);
      setIsInHongKong(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isInHongKong,
    loading,
    checkLocation,
  };
};

export default useEnhancedGeolocation;
