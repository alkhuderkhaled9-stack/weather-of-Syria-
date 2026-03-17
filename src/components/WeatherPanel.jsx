import { getWeatherInfo, formatDayAr } from '../hooks/useWeather';

function WindDirection({ deg }) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const dir = dirs[Math.round(deg / 45) % 8];
  const arDirs = { N: 'شمال', NE: 'شمال شرق', E: 'شرق', SE: 'جنوب شرق', S: 'جنوب', SW: 'جنوب غرب', W: 'غرب', NW: 'شمال غرب' };
  return <span>{arDirs[dir] || dir}</span>;
}

function StatCard({ icon, label, value, unit }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}<span className="stat-unit">{unit}</span></div>
      </div>
    </div>
  );
}

function ForecastDay({ date, code, max, min }) {
  const info = getWeatherInfo(code);
  return (
    <div className="forecast-day">
      <div className="forecast-day-name">{formatDayAr(date)}</div>
      <div className="forecast-icon">{info.icon}</div>
      <div className="forecast-label">{info.label}</div>
      <div className="forecast-temps">
        <span className="temp-max">{Math.round(max)}°</span>
        <span className="temp-min">{Math.round(min)}°</span>
      </div>
    </div>
  );
}

export default function WeatherPanel({ governorate, weather, loading, error }) {
  if (loading) {
    return (
      <div className="weather-panel">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <div className="loading-text">جاري تحميل بيانات الطقس...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-panel">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <div className="error-text">{error}</div>
        </div>
      </div>
    );
  }

  if (!weather?.current) {
    return (
      <div className="weather-panel">
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <div className="empty-text">اختر محافظة من الخريطة</div>
        </div>
      </div>
    );
  }

  const c = weather.current;
  const d = weather.daily;
  const info = getWeatherInfo(c.weather_code);
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('ar-SY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={`weather-panel weather-bg-${info.bg}`}>
      {/* Header */}
      <div className="panel-header">
        <div className="gov-info">
          <h2 className="gov-name-ar">{governorate.nameAr}</h2>
          <p className="gov-name-en">{governorate.name}</p>
          <p className="gov-desc">{governorate.description}</p>
        </div>
        <div className="current-time">
          <div className="time-str">{timeStr}</div>
          <div className="date-str">{dateStr}</div>
        </div>
      </div>

      {/* Main temperature */}
      <div className="main-temp-section">
        <div className="weather-icon-large">{info.icon}</div>
        <div className="temp-display">
          <span className="temp-main">{Math.round(c.temperature_2m)}</span>
          <span className="temp-degree">°C</span>
        </div>
        <div className="weather-label-main">
          <div className="weather-desc-ar">{info.label}</div>
          <div className="weather-desc-en">{info.labelEn}</div>
          <div className="feels-like">يُشعر وكأنه {Math.round(c.apparent_temperature)}°C</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <StatCard icon="💧" label="الرطوبة" value={c.relative_humidity_2m} unit="%" />
        <StatCard icon="💨" label="الرياح" value={Math.round(c.wind_speed_10m)} unit=" كم/س" />
        <StatCard icon="🌧️" label="الهطول" value={c.precipitation ?? 0} unit=" مم" />
        <StatCard icon="👁️" label="الرؤية" value={c.visibility != null ? (c.visibility / 1000).toFixed(1) : '--'} unit=" كم" />
        <StatCard
          icon="🧭"
          label="اتجاه الريح"
          value={<WindDirection deg={c.wind_direction_10m} />}
          unit=""
        />
        <StatCard icon="☀️" label="مؤشر UV" value={c.uv_index ?? '--'} unit="" />
      </div>

      {/* 7-day forecast */}
      {d && (
        <div className="forecast-section">
          <h3 className="forecast-title">التوقعات لـ 7 أيام</h3>
          <div className="forecast-scroll">
            {d.time.map((date, i) => (
              <ForecastDay
                key={date}
                date={date}
                code={d.weather_code[i]}
                max={d.temperature_2m_max[i]}
                min={d.temperature_2m_min[i]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
