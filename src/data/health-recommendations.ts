import { HealthRecommendation } from '@/types';

export const HEALTH_RECOMMENDATIONS: HealthRecommendation[] = [
  // General recommendations
  {
    id: 'general-good-air',
    category: 'general',
    title: 'Enjoy outdoor activities',
    description: 'Air quality is good. Perfect time for outdoor activities and exercise.',
    icon: '🌱',
    severity: 'info',
    conditions: { aqhi: [1, 2, 3] }
  },
  {
    id: 'general-moderate-air',
    category: 'general',
    title: 'Moderate air quality',
    description: 'Air quality is acceptable for most people. Sensitive individuals should consider reducing prolonged outdoor exertion.',
    icon: '⚠️',
    severity: 'warning',
    conditions: { aqhi: [4, 5, 6] }
  },
  {
    id: 'general-poor-air',
    category: 'general',
    title: 'Limit outdoor exposure',
    description: 'Air quality is unhealthy. Reduce outdoor activities and keep windows closed.',
    icon: '🚫',
    severity: 'danger',
    conditions: { aqhi: [7, 8, 9, 10, 11] }
  },

  // Outdoor activity recommendations
  {
    id: 'outdoor-morning-exercise',
    category: 'outdoor',
    title: 'Morning exercise recommended',
    description: 'Early morning typically has better air quality. Best time for outdoor exercise is 6-8 AM.',
    icon: '🏃‍♂️',
    severity: 'info',
    conditions: { aqhi: [1, 2, 3, 4] }
  },
  {
    id: 'outdoor-avoid-peak-hours',
    category: 'outdoor',
    title: 'Avoid peak traffic hours',
    description: 'Air quality is worse during rush hours (7-9 AM, 6-8 PM). Plan outdoor activities accordingly.',
    icon: '🚗',
    severity: 'warning',
    conditions: { aqhi: [5, 6, 7] }
  },
  {
    id: 'outdoor-stay-indoors',
    category: 'outdoor',
    title: 'Stay indoors',
    description: 'Air quality is very poor. Avoid all outdoor activities and keep windows closed.',
    icon: '🏠',
    severity: 'danger',
    conditions: { aqhi: [8, 9, 10, 11] }
  },

  // Exercise recommendations
  {
    id: 'exercise-outdoor-ok',
    category: 'exercise',
    title: 'Outdoor exercise is safe',
    description: 'Air quality is good for outdoor exercise. Stay hydrated and enjoy your workout!',
    icon: '💪',
    severity: 'info',
    conditions: { aqhi: [1, 2, 3] }
  },
  {
    id: 'exercise-light-outdoor',
    category: 'exercise',
    title: 'Light outdoor exercise only',
    description: 'Consider light outdoor exercise or move intensive workouts indoors.',
    icon: '🚶‍♀️',
    severity: 'warning',
    conditions: { aqhi: [4, 5, 6] }
  },
  {
    id: 'exercise-indoor-only',
    category: 'exercise',
    title: 'Exercise indoors only',
    description: 'Air quality is too poor for outdoor exercise. Move your workout indoors or use a gym.',
    icon: '🏋️‍♂️',
    severity: 'danger',
    conditions: { aqhi: [7, 8, 9, 10, 11] }
  },

  // Respiratory health recommendations
  {
    id: 'respiratory-safe',
    category: 'respiratory',
    title: 'Good air for respiratory health',
    description: 'Air quality is good for people with respiratory conditions. Regular activities are safe.',
    icon: '🫁',
    severity: 'info',
    conditions: { aqhi: [1, 2, 3] }
  },
  {
    id: 'respiratory-caution',
    category: 'respiratory',
    title: 'Use caution if you have respiratory issues',
    description: 'People with asthma or other respiratory conditions should limit outdoor exposure.',
    icon: '⚕️',
    severity: 'warning',
    conditions: { aqhi: [4, 5, 6] }
  },
  {
    id: 'respiratory-high-risk',
    category: 'respiratory',
    title: 'High risk for respiratory conditions',
    description: 'People with respiratory conditions should avoid outdoor activities and consider wearing a mask if going outside.',
    icon: '😷',
    severity: 'danger',
    conditions: { aqhi: [7, 8, 9, 10, 11] }
  },

  // Elderly recommendations
  {
    id: 'elderly-safe',
    category: 'elderly',
    title: 'Safe for elderly outdoor activities',
    description: 'Air quality is good for elderly people. Enjoy outdoor walks and activities.',
    icon: '👴',
    severity: 'info',
    conditions: { aqhi: [1, 2, 3] }
  },
  {
    id: 'elderly-limit-exertion',
    category: 'elderly',
    title: 'Limit prolonged outdoor exertion',
    description: 'Elderly people should reduce prolonged or heavy outdoor exertion.',
    icon: '🧓',
    severity: 'warning',
    conditions: { aqhi: [4, 5, 6] }
  },
  {
    id: 'elderly-stay-indoors',
    category: 'elderly',
    title: 'Elderly should stay indoors',
    description: 'Elderly people should avoid outdoor activities and seek medical attention if experiencing symptoms.',
    icon: '🏠',
    severity: 'danger',
    conditions: { aqhi: [7, 8, 9, 10, 11] }
  },

  // Children recommendations
  {
    id: 'children-play-outside',
    category: 'children',
    title: 'Great for outdoor play',
    description: 'Air quality is excellent for children to play outside and engage in sports.',
    icon: '👶',
    severity: 'info',
    conditions: { aqhi: [1, 2, 3] }
  },
  {
    id: 'children-reduce-activity',
    category: 'children',
    title: 'Reduce outdoor activity time',
    description: 'Children should limit time spent outdoors, especially during vigorous activities.',
    icon: '⏰',
    severity: 'warning',
    conditions: { aqhi: [4, 5, 6] }
  },
  {
    id: 'children-indoor-activities',
    category: 'children',
    title: 'Keep children indoors',
    description: 'Children should avoid outdoor activities. Plan indoor games and activities instead.',
    icon: '🎮',
    severity: 'danger',
    conditions: { aqhi: [7, 8, 9, 10, 11] }
  },

  // Weather-based recommendations
  {
    id: 'sunny-day-protection',
    category: 'general',
    title: 'Sun protection needed',
    description: 'Bright sunny day. Use sunscreen, wear a hat, and stay hydrated.',
    icon: '☀️',
    severity: 'warning',
    conditions: { weather: ['sunny', 'clear'] }
  },
  {
    id: 'rainy-day-safety',
    category: 'general',
    title: 'Rainy weather precautions',
    description: 'Wet conditions. Be careful of slippery surfaces and carry an umbrella.',
    icon: '🌧️',
    severity: 'warning',
    conditions: { weather: ['rain', 'shower', 'drizzle'] }
  },
  {
    id: 'storm-warning',
    category: 'general',
    title: 'Storm warning',
    description: 'Severe weather conditions. Avoid outdoor activities and stay in safe locations.',
    icon: '⛈️',
    severity: 'danger',
    conditions: { weather: ['thunderstorm', 'storm'] }
  },

  // UV index recommendations
  {
    id: 'uv-low',
    category: 'general',
    title: 'Low UV exposure',
    description: 'UV index is low. Minimal sun protection needed for normal activities.',
    icon: '🌤️',
    severity: 'info',
    conditions: { uv: [0, 1, 2] }
  },
  {
    id: 'uv-moderate',
    category: 'general',
    title: 'Moderate UV protection needed',
    description: 'UV index is moderate. Use sunscreen and wear protective clothing.',
    icon: '🧴',
    severity: 'warning',
    conditions: { uv: [3, 4, 5] }
  },
  {
    id: 'uv-high',
    category: 'general',
    title: 'High UV protection essential',
    description: 'UV index is high. Seek shade, use sunscreen SPF 30+, and wear protective clothing.',
    icon: '🕶️',
    severity: 'danger',
    conditions: { uv: [6, 7, 8, 9, 10, 11] }
  }
];

export function getRecommendationsForConditions(
  aqhi: number,
  weather?: string,
  uvIndex?: number
): HealthRecommendation[] {
  return HEALTH_RECOMMENDATIONS.filter(rec => {
    // Check AQHI conditions
    if (rec.conditions.aqhi && !rec.conditions.aqhi.includes(aqhi)) {
      return false;
    }

    // Check weather conditions
    if (rec.conditions.weather && weather) {
      const weatherMatch = rec.conditions.weather.some(w => 
        weather.toLowerCase().includes(w.toLowerCase())
      );
      if (!weatherMatch) return false;
    }

    // Check UV conditions
    if (rec.conditions.uv && uvIndex !== undefined) {
      if (!rec.conditions.uv.includes(uvIndex)) {
        return false;
      }
    }

    return true;
  });
}
