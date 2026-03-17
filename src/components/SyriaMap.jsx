import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

function FlyTo({ gov }) {
  const map = useMap();
  useEffect(() => {
    if (gov) {
      map.flyTo([gov.lat, gov.lon], 8, { duration: 1.2 });
    }
  }, [gov, map]);
  return null;
}

export default function SyriaMap({ governorates, selectedGov, onSelectGov }) {
  return (
    <MapContainer
      center={[34.8, 38.5]}
      zoom={6}
      style={{ height: '100%', width: '100%', borderRadius: '16px' }}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {selectedGov && <FlyTo gov={selectedGov} />}

      {governorates.map((gov) => {
        const isSelected = selectedGov?.id === gov.id;
        return (
          <CircleMarker
            key={gov.id}
            center={[gov.lat, gov.lon]}
            radius={isSelected ? 16 : 10}
            pathOptions={{
              color: isSelected ? '#ffffff' : gov.color,
              fillColor: isSelected ? gov.color : gov.color,
              fillOpacity: isSelected ? 1 : 0.75,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelectGov(gov) }}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={1}
              className="custom-tooltip"
            >
              <div style={{ fontFamily: 'Cairo, sans-serif', textAlign: 'center' }}>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>{gov.nameAr}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>{gov.name}</div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
