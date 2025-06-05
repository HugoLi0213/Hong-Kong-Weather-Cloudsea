import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { getAQHIColor, getAQHILevel } from '../../lib/utils';
import { AirQualityData, Location } from '../../types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AirQualityMapProps {
  data: AirQualityData[];
  locations: Location[];
  selectedLocation?: string;
  onLocationSelect?: (locationId: string) => void;
}

// Custom marker component
const AirQualityMarker: React.FC<{
  location: Location;
  data?: AirQualityData;
  isSelected: boolean;
  onClick: () => void;
}> = ({ location, data, isSelected, onClick }) => {
  const aqhi = data?.current.aqhi || 0;
  const color = getAQHIColor(aqhi);
  
  const customIcon = L.divIcon({
    className: `custom-div-icon ${isSelected ? 'selected' : ''}`,
    html: `
      <div style="
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
        color: white;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ${isSelected ? 'transform: scale(1.2); border-color: #2563eb; box-shadow: 0 0 12px rgba(37, 99, 235, 0.6);' : ''}
      ">
        ${aqhi}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <Marker
      position={[location.coordinates.lat, location.coordinates.lng]}
      icon={customIcon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">{location.name}</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">AQHI: {aqhi}</span>
              <span className="text-xs text-gray-600">
                ({getAQHILevel(aqhi)})
              </span>
            </div>
            {data && (
              <>
                <div className="text-xs text-gray-600">
                  PM2.5: {data.current.pm25} μg/m³
                </div>
                <div className="text-xs text-gray-600">
                  PM10: {data.current.pm10} μg/m³
                </div>
                <div className="text-xs text-gray-600">
                  NO2: {data.current.no2} μg/m³
                </div>
                <div className="text-xs text-gray-600">
                  O3: {data.current.o3} μg/m³
                </div>
              </>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Component to handle map events
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [map, center]);
  
  return null;
};

export const AirQualityMap: React.FC<AirQualityMapProps> = ({
  data,
  locations,
  selectedLocation,
  onLocationSelect,
}) => {
  const mapRef = useRef<L.Map>(null);
  
  // Hong Kong center coordinates
  const hongKongCenter: [number, number] = [22.3193, 114.1694];
  
  // Find selected location coordinates
  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);
  const mapCenter = selectedLocationData 
    ? [selectedLocationData.coordinates.lat, selectedLocationData.coordinates.lng] as [number, number]
    : hongKongCenter;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={hongKongCenter}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={mapCenter} />
        
        {locations.map((location) => {
          const locationData = data.find(d => d.location === location.id);
          return (
            <AirQualityMarker
              key={location.id}
              location={location}
              data={locationData}
              isSelected={location.id === selectedLocation}
              onClick={() => onLocationSelect?.(location.id)}
            />
          );
        })}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border z-[1000]">
        <h4 className="font-semibold text-sm mb-2">AQHI Levels</h4>
        <div className="space-y-1">
          {[
            { range: '1-3', label: 'Low', color: '#00ff00' },
            { range: '4-6', label: 'Moderate', color: '#ffff00' },
            { range: '7', label: 'High', color: '#ff8000' },
            { range: '8-10', label: 'Very High', color: '#ff0000' },
            { range: '10+', label: 'Serious', color: '#800080' },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.range}</span>
              <span className="text-gray-600">({item.label})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AirQualityMap;
