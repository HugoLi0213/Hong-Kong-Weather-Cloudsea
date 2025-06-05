import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useMTRProximity } from '@/hooks/useMTRProximity';

export function CommutePlanner() {
  const { location } = useCurrentLocation();
  const lat = typeof location?.latitude === 'number' ? location.latitude : 0;
  const lng = typeof location?.longitude === 'number' ? location.longitude : 0;
  const nearestMTR = useMTRProximity(lat, lng);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 flex flex-col items-center">
      <h3 className="font-semibold mb-2">Smart Commute Planner</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        Get optimal travel time, MTR vs walking, and route suggestions based on real-time air quality and weather.
      </p>
      {nearestMTR && (
        <div className="mb-2 text-blue-700 dark:text-blue-300 text-sm">
          Nearest MTR: <span className="font-bold">{nearestMTR.name}</span>
        </div>
      )}
      <button className="mt-2 px-4 py-2 rounded bg-hk-red text-white font-medium text-base shadow hover:bg-red-700 transition">
        Plan My Commute
      </button>
      {/* TODO: Implement dynamic recommendations and route optimization */}
    </div>
  );
}
