import { useState } from 'react';
import Header from './components/Header';
import SyriaMap from './components/SyriaMap';
import WeatherPanel from './components/WeatherPanel';
import { governorates } from './data/governorates';
import { useWeather } from './hooks/useWeather';
import './App.css';

function GovernorateList({ governorates, selected, onSelect }) {
  return (
    <div className="gov-list">
      {governorates.map((gov) => (
        <button
          key={gov.id}
          className={`gov-list-item ${selected?.id === gov.id ? 'active' : ''}`}
          onClick={() => onSelect(gov)}
          style={{ '--gov-color': gov.color }}
        >
          <span className="gov-dot" style={{ background: gov.color }}></span>
          <span className="gov-list-name">{gov.nameAr}</span>
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [selectedGov, setSelectedGov] = useState(governorates[0]);
  const { weather, loading, error } = useWeather(selectedGov);

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        {/* Sidebar: governorate list */}
        <aside className="sidebar">
          <div className="sidebar-title">المحافظات</div>
          <GovernorateList
            governorates={governorates}
            selected={selectedGov}
            onSelect={setSelectedGov}
          />
        </aside>

        {/* Center: Map */}
        <main className="map-wrapper">
          <div className="map-label">🗺️ خريطة سوريا التفاعلية</div>
          <div className="map-container">
            <SyriaMap
              governorates={governorates}
              selectedGov={selectedGov}
              onSelectGov={setSelectedGov}
            />
          </div>
        </main>

        {/* Right: Weather Panel */}
        <aside className="weather-side">
          <WeatherPanel
            governorate={selectedGov}
            weather={weather}
            loading={loading}
            error={error}
          />
        </aside>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <span className="footer-text">
          تم الإنشاء بواسطة <span className="footer-name">المهندس خالد الخضر</span>
        </span>
      </footer>
    </div>
  );
}
