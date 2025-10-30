import { useState, useEffect } from 'react';

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  date: string;
}

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  description: string;
}

export const WeatherWidget = ({ lat, lng, date }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if event date is within forecast range (7 days for Open-Meteo)
        const eventDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        
        const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        // Open-Meteo provides 7-day forecast
        if (daysUntilEvent > 7) {
          setError('Weather data not available for this date');
          setLoading(false);
          return;
        }
        
        if (daysUntilEvent < 0) {
          setError('Weather data not available for past dates');
          setLoading(false);
          return;
        }

        // Use Open-Meteo API (completely free, no API key required)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,windspeed_10m_max,relative_humidity_2m_max&timezone=auto`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        
        // Find the forecast for the event date
        const eventDateStr = eventDate.toISOString().split('T')[0];
        const dateIndex = data.daily.time.indexOf(eventDateStr);
        
        if (dateIndex === -1) {
          setError('Weather data not available for this date');
          setLoading(false);
          return;
        }

        const weatherCode = data.daily.weathercode[dateIndex];
        const tempMax = data.daily.temperature_2m_max[dateIndex];
        const tempMin = data.daily.temperature_2m_min[dateIndex];
        const avgTemp = (tempMax + tempMin) / 2;
        const humidity = data.daily.relative_humidity_2m_max[dateIndex];
        const windSpeed = data.daily.windspeed_10m_max[dateIndex];

        setWeather({
          temp: Math.round(avgTemp),
          condition: getWeatherCondition(weatherCode),
          description: getWeatherDescription(weatherCode),
          icon: getWeatherIcon(weatherCode),
          humidity: humidity,
          windSpeed: Math.round(windSpeed)
        });
        
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Unable to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng, date]);

  const getWeatherCondition = (code: number): string => {
    // Open-Meteo WMO Weather interpretation codes
    if (code === 0) return 'Clear';
    if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
    if (code === 45 || code === 48) return 'Foggy';
    if (code === 51 || code === 53 || code === 55) return 'Drizzle';
    if (code === 56 || code === 57) return 'Freezing Drizzle';
    if (code === 61 || code === 63 || code === 65) return 'Rain';
    if (code === 66 || code === 67) return 'Freezing Rain';
    if (code === 71 || code === 73 || code === 75) return 'Snow';
    if (code === 77) return 'Snow Grains';
    if (code === 80 || code === 81 || code === 82) return 'Rain Showers';
    if (code === 85 || code === 86) return 'Snow Showers';
    if (code === 95) return 'Thunderstorm';
    if (code === 96 || code === 99) return 'Thunderstorm with Hail';
    return 'Unknown';
  };

  const getWeatherDescription = (code: number): string => {
    // Open-Meteo WMO Weather interpretation codes with descriptions
    if (code === 0) return 'clear sky';
    if (code === 1) return 'mainly clear';
    if (code === 2) return 'partly cloudy';
    if (code === 3) return 'overcast';
    if (code === 45) return 'fog';
    if (code === 48) return 'depositing rime fog';
    if (code === 51) return 'light drizzle';
    if (code === 53) return 'moderate drizzle';
    if (code === 55) return 'dense drizzle';
    if (code === 56) return 'light freezing drizzle';
    if (code === 57) return 'dense freezing drizzle';
    if (code === 61) return 'slight rain';
    if (code === 63) return 'moderate rain';
    if (code === 65) return 'heavy rain';
    if (code === 66) return 'light freezing rain';
    if (code === 67) return 'heavy freezing rain';
    if (code === 71) return 'slight snow fall';
    if (code === 73) return 'moderate snow fall';
    if (code === 75) return 'heavy snow fall';
    if (code === 77) return 'snow grains';
    if (code === 80) return 'slight rain showers';
    if (code === 81) return 'moderate rain showers';
    if (code === 82) return 'violent rain showers';
    if (code === 85) return 'slight snow showers';
    if (code === 86) return 'heavy snow showers';
    if (code === 95) return 'thunderstorm';
    if (code === 96) return 'thunderstorm with slight hail';
    if (code === 99) return 'thunderstorm with heavy hail';
    return 'unknown';
  };

  const getWeatherIcon = (code: number): string => {
    // Open-Meteo WMO Weather interpretation codes
    if (code === 0) return '☀️'; // Clear sky
    if (code === 1) return '🌤️'; // Mainly clear
    if (code === 2) return '⛅'; // Partly cloudy
    if (code === 3) return '☁️'; // Overcast
    if (code === 45 || code === 48) return '🌫️'; // Fog
    if (code === 51 || code === 53 || code === 55) return '🌦️'; // Drizzle
    if (code === 56 || code === 57) return '🌧️'; // Freezing Drizzle
    if (code === 61 || code === 63 || code === 65) return '🌧️'; // Rain
    if (code === 66 || code === 67) return '🌧️'; // Freezing Rain
    if (code === 71 || code === 73 || code === 75 || code === 77) return '❄️'; // Snow
    if (code === 80 || code === 81 || code === 82) return '🌧️'; // Rain showers
    if (code === 85 || code === 86) return '🌨️'; // Snow showers
    if (code === 95) return '⛈️'; // Thunderstorm
    if (code === 96 || code === 99) return '⛈️'; // Thunderstorm with hail
    return '🌤️';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-6 animate-pulse">
        <div className="h-24 bg-zinc-800/50 rounded-lg"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-gradient-to-br from-gray-600/20 to-gray-700/20 border border-gray-500/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gray-500/20 p-3 rounded-xl">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-1">
              Weather Forecast
            </h3>
            <p className="text-sm text-gray-300">
              {error || 'Weather data not available for this date'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Forecast available for events within 7 days
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
            Expected Weather
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-5xl">{weather.icon}</span>
            <div>
              <p className="text-3xl font-bold text-white">{weather.temp}°C</p>
              <p className="text-sm text-gray-300 capitalize">{weather.description}</p>
            </div>
          </div>
        </div>
        <div className="text-right text-sm text-gray-400">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{weather.humidity}% humidity</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span>{weather.windSpeed} km/h wind</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-blue-500/20">
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Real-time weather forecast powered by Open-Meteo
        </p>
      </div>
    </div>
  );
};
