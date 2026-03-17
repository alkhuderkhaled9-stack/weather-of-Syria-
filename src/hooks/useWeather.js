import { useState, useEffect, useCallback } from 'react';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const weatherCodeMap = {
  0: { label: 'صحو', labelEn: 'Clear Sky', icon: '☀️', bg: 'sunny' },
  1: { label: 'غائم جزئياً', labelEn: 'Mostly Clear', icon: '🌤️', bg: 'partly-cloudy' },
  2: { label: 'غائم جزئياً', labelEn: 'Partly Cloudy', icon: '⛅', bg: 'partly-cloudy' },
  3: { label: 'غائم', labelEn: 'Overcast', icon: '☁️', bg: 'cloudy' },
  45: { label: 'ضبابي', labelEn: 'Foggy', icon: '🌫️', bg: 'foggy' },
  48: { label: 'ضباب متجمد', labelEn: 'Icy Fog', icon: '🌫️', bg: 'foggy' },
  51: { label: 'رذاذ خفيف', labelEn: 'Light Drizzle', icon: '🌦️', bg: 'rainy' },
  53: { label: 'رذاذ متوسط', labelEn: 'Drizzle', icon: '🌦️', bg: 'rainy' },
  55: { label: 'رذاذ كثيف', labelEn: 'Heavy Drizzle', icon: '🌧️', bg: 'rainy' },
  61: { label: 'مطر خفيف', labelEn: 'Light Rain', icon: '🌧️', bg: 'rainy' },
  63: { label: 'مطر معتدل', labelEn: 'Moderate Rain', icon: '🌧️', bg: 'rainy' },
  65: { label: 'مطر غزير', labelEn: 'Heavy Rain', icon: '🌧️', bg: 'rainy' },
  71: { label: 'ثلج خفيف', labelEn: 'Light Snow', icon: '🌨️', bg: 'snowy' },
  73: { label: 'ثلج معتدل', labelEn: 'Snow', icon: '❄️', bg: 'snowy' },
  75: { label: 'ثلج كثيف', labelEn: 'Heavy Snow', icon: '❄️', bg: 'snowy' },
  80: { label: 'زخات مطر', labelEn: 'Rain Showers', icon: '🌦️', bg: 'rainy' },
  81: { label: 'زخات معتدلة', labelEn: 'Showers', icon: '🌧️', bg: 'rainy' },
  82: { label: 'زخات غزيرة', labelEn: 'Heavy Showers', icon: '⛈️', bg: 'stormy' },
  85: { label: 'زخات ثلجية', labelEn: 'Snow Showers', icon: '🌨️', bg: 'snowy' },
  86: { label: 'زخات ثلجية كثيفة', labelEn: 'Heavy Snow Showers', icon: '❄️', bg: 'snowy' },
  95: { label: 'عاصفة رعدية', labelEn: 'Thunderstorm', icon: '⛈️', bg: 'stormy' },
  96: { label: 'عاصفة مع برد', labelEn: 'Thunderstorm + Hail', icon: '⛈️', bg: 'stormy' },
  99: { label: 'عاصفة شديدة', labelEn: 'Severe Thunderstorm', icon: '🌩️', bg: 'stormy' },
};

export function getWeatherInfo(code) {
  return weatherCodeMap[code] || { label: 'غير معروف', labelEn: 'Unknown', icon: '🌡️', bg: 'cloudy' };
}

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function formatDayAr(dateStr) {
  const d = new Date(dateStr);
  return DAYS_AR[d.getDay()];
}

export function useWeather(governorate) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (gov) => {
    if (!gov) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        latitude: gov.lat,
        longitude: gov.lon,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'weather_code',
          'wind_speed_10m',
          'wind_direction_10m',
          'precipitation',
          'visibility',
          'uv_index',
        ].join(','),
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'weather_code',
          'precipitation_sum',
          'wind_speed_10m_max',
        ].join(','),
        wind_speed_unit: 'kmh',
        timezone: 'Asia/Damascus',
        forecast_days: 7,
      });
      const res = await fetch(`${BASE_URL}?${params}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError('تعذّر تحميل بيانات الطقس. يرجى المحاولة مجدداً.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(governorate);
  }, [governorate, fetchWeather]);

  return { weather, loading, error, refetch: () => fetchWeather(governorate) };
}
