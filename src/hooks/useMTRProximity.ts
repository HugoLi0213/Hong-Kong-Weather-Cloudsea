import { useMemo } from 'react';

// Dummy data for MTR stations (replace with real data)
const MTR_STATIONS = [
  { id: 'central', name: 'Central', coordinates: { lat: 22.2819, lng: 114.1582 } },
  { id: 'tsimshatsui', name: 'Tsim Sha Tsui', coordinates: { lat: 22.2960, lng: 114.1722 } },
  // ...add all stations
];

export function useMTRProximity(userLat: number, userLng: number) {
  return useMemo(() => {
    if (!userLat || !userLng) return null;
    let nearest = MTR_STATIONS[0];
    let minDist = Math.sqrt(Math.pow(userLat - nearest.coordinates.lat, 2) + Math.pow(userLng - nearest.coordinates.lng, 2));
    for (const station of MTR_STATIONS) {
      const dist = Math.sqrt(Math.pow(userLat - station.coordinates.lat, 2) + Math.pow(userLng - station.coordinates.lng, 2));
      if (dist < minDist) {
        minDist = dist;
        nearest = station;
      }
    }
    return nearest;
  }, [userLat, userLng]);
}
