# Hong Kong Weather & Air Quality Dashboard

A comprehensive, modern web application providing real-time weather information and air quality monitoring for Hong Kong. Built with React, TypeScript, and Tailwind CSS.

## Features

🌤️ **Weather Information**
- Real-time weather conditions from Hong Kong Observatory (HKO)
- 7-day weather forecast
- UV index monitoring
- Weather alerts and typhoon warnings

🌬️ **Air Quality Monitoring** 
- Real-time Air Quality Health Index (AQHI) data
- PM2.5, PM10, NO2, and O3 measurements
- Historical AQHI trends and charts
- Interactive map showing air quality across Hong Kong

🏥 **Health Recommendations**
- Personalized advice based on current air quality and weather
- Activity recommendations for different health conditions
- AQHI-based health guidelines

🗺️ **Interactive Features**
- Interactive map with real-time air quality markers
- Location-based data filtering
- Responsive design for all devices
- Dark/light theme support

⚡ **Progressive Web App**
- Offline support with service worker
- App-like experience on mobile devices
- Push notifications for air quality alerts

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Data Fetching**: React Query
- **Charts**: Recharts
- **Maps**: Leaflet + React Leaflet
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download the project files
2. Navigate to the project directory:
   ```bash
   cd react-weather-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── air-quality/    # Air quality related components
│   ├── health/         # Health recommendation components
│   ├── layout/         # Layout components (Header, etc.)
│   ├── map/           # Interactive map components
│   ├── ui/            # Reusable UI components
│   └── weather/       # Weather related components
├── contexts/           # React contexts (Theme, Notifications)
├── data/              # Static data and configuration
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── services/          # API services and mock data
└── types/             # TypeScript type definitions
```

## Features Overview

### Dashboard Tabs

1. **Overview** - Combined weather and air quality summary
2. **Air Quality** - Detailed AQHI monitoring and charts
3. **Weather** - Comprehensive weather information and forecasts
4. **Health** - Personalized health recommendations
5. **Map** - Interactive air quality map of Hong Kong

### Data Sources

The application uses mock data that simulates:
- Hong Kong Observatory (HKO) weather data
- Environmental Protection Department (EPD) air quality data
- Real-time AQHI calculations for all monitoring stations

### Air Quality Health Index (AQHI)

The AQHI is calculated based on:
- PM2.5 (Fine particulate matter)
- PM10 (Coarse particulate matter) 
- NO2 (Nitrogen dioxide)
- O3 (Ozone)

AQHI levels:
- **1-3**: Low health risk
- **4-6**: Moderate health risk  
- **7**: High health risk
- **8-10**: Very high health risk
- **10+**: Serious health risk

## Customization

### Adding Real API Integration

To integrate with real APIs, update the service files:
- `src/services/weather.ts` - Replace mock weather service
- `src/services/air-quality.ts` - Replace mock air quality service

### Styling

The app uses Tailwind CSS with a custom Hong Kong-themed color palette:
- Primary red: `#dc2626` (Hong Kong flag red)
- AQHI-specific colors for different pollution levels
- Dark mode support throughout

### Adding New Features

The modular architecture makes it easy to add new features:
1. Create new components in the appropriate directory
2. Add new routes/tabs in the main Dashboard component
3. Extend the TypeScript types as needed
4. Update the mock services or add real API integrations

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Code splitting and lazy loading
- Optimized re-renders with React Query
- Efficient chart rendering with Recharts
- Responsive images and assets

## Contributing

This is a demonstration project. For real-world deployment:

1. Replace mock APIs with actual HKO and EPD API endpoints
2. Add proper error handling for API failures
3. Implement user authentication if needed
4. Add more comprehensive testing
5. Set up CI/CD pipeline for deployment

## License

This project is for demonstration purposes. Please ensure proper licensing when using real weather and air quality data sources.

## Acknowledgments

- Hong Kong Observatory (HKO) for weather data standards
- Environmental Protection Department (EPD) for AQHI methodology
- Open source libraries and contributors
