import React, { useState } from 'react';
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Gauge,
  Sparkles,
  Calendar,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { TOURIST_DESTINATIONS } from '../data/destinationsData';
import { TouristPlace, IndianOriginCity } from '../types/travel';
import { calculateHaversineDistance } from '../utils/distance';

interface WeatherForecastProps {
  origin?: IndianOriginCity;
  destinations?: TouristPlace[];
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({
  origin,
  destinations = TOURIST_DESTINATIONS,
}) => {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(() => {
    if (!origin) return destinations[0]?.id || TOURIST_DESTINATIONS[0].id;
    // Find closest destination or direct match
    const closest = [...destinations].sort((a, b) => {
      const distA = calculateHaversineDistance(origin.coordinates, a.coordinates);
      const distB = calculateHaversineDistance(origin.coordinates, b.coordinates);
      return distA - distB;
    })[0];
    return closest ? closest.id : destinations[0]?.id || TOURIST_DESTINATIONS[0].id;
  });

  const [locationReloadNotice, setLocationReloadNotice] = useState<string>('');

  // Automatically reload weather service when origin location changes
  React.useEffect(() => {
    if (origin) {
      const closest = [...destinations].sort((a, b) => {
        const distA = calculateHaversineDistance(origin.coordinates, a.coordinates);
        const distB = calculateHaversineDistance(origin.coordinates, b.coordinates);
        return distA - distB;
      })[0];

      if (closest) {
        setSelectedPlaceId(closest.id);
        setLocationReloadNotice(`Weather & Air Quality re-centered for ${origin.name} (${closest.name})`);
        const timer = setTimeout(() => setLocationReloadNotice(''), 3500);
        return () => clearTimeout(timer);
      }
    }
  }, [origin?.id, destinations]);

  const selectedPlace = destinations.find((p) => p.id === selectedPlaceId) || destinations[0] || TOURIST_DESTINATIONS[0];

  const getAqiBadge = (aqi: number) => {
    if (aqi <= 50) {
      return {
        label: 'Good (Clean Air)',
        color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        advice: 'Air quality is ideal for open outdoor monuments, cycling, and walking tours.',
      };
    } else if (aqi <= 100) {
      return {
        label: 'Moderate',
        color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        advice: 'Acceptable air quality for general sightseeing and sightseeing photography.',
      };
    } else if (aqi <= 200) {
      return {
        label: 'Unhealthy for Sensitive Groups',
        color: 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
        advice: 'Carry a light N95 mask if sensitive or during early morning winter fog walks.',
      };
    } else {
      return {
        label: 'Poor / Severe Fog Alert',
        color: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
        advice: 'Plan indoor museum visits between 11:00 AM and 04:00 PM; use protective mask.',
      };
    }
  };

  const aqiInfo = getAqiBadge(selectedPlace.weather.aqi);

  // Generate realistic 5-day forecast
  const fiveDayForecast = [
    { day: 'Today', tempHigh: selectedPlace.weather.currentTemp + 2, tempLow: selectedPlace.weather.currentTemp - 6, condition: selectedPlace.weather.condition, rain: selectedPlace.weather.rainChance },
    { day: 'Tomorrow', tempHigh: selectedPlace.weather.currentTemp + 1, tempLow: selectedPlace.weather.currentTemp - 5, condition: selectedPlace.weather.condition, rain: Math.max(0, selectedPlace.weather.rainChance - 5) },
    { day: 'Wednesday', tempHigh: selectedPlace.weather.currentTemp + 3, tempLow: selectedPlace.weather.currentTemp - 7, condition: 'Clear Skies', rain: 0 },
    { day: 'Thursday', tempHigh: selectedPlace.weather.currentTemp, tempLow: selectedPlace.weather.currentTemp - 6, condition: selectedPlace.weather.condition, rain: selectedPlace.weather.rainChance },
    { day: 'Friday', tempHigh: selectedPlace.weather.currentTemp - 1, tempLow: selectedPlace.weather.currentTemp - 8, condition: 'Pleasant Breeze', rain: 5 },
  ];

  return (
    <div className="space-y-6">
      
      {locationReloadNotice && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{locationReloadNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <span>Meteorological Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>AQI & Travel Forecast</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
              Weather & Air Quality Across Indian Destinations
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Real-time temperature, humidity, monsoon precipitation probabilities, and air quality advisories.
            </p>
          </div>

          {/* Quick Destination Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-500">Destination:</span>
            <select
              value={selectedPlaceId}
              onChange={(e) => setSelectedPlaceId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            >
              {destinations.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name} ({place.city}, {place.state})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Weather Hero Card */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Location & Current Temp */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{selectedPlace.city}, {selectedPlace.state}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedPlace.region} India</span>
              </div>

              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
                {selectedPlace.name}
              </h2>

              <div className="flex items-baseline gap-4 mt-3">
                <span className="text-5xl font-black font-mono tabular-nums text-neutral-900 dark:text-white">
                  {selectedPlace.weather.currentTemp}°C
                </span>
                <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">{selectedPlace.weather.condition}</div>
                  <div className="text-xs text-neutral-400">Feels like {selectedPlace.weather.currentTemp + 1}°C</div>
                </div>
              </div>
            </div>

            {/* Right: Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  <span>Humidity</span>
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
                  {selectedPlace.weather.humidity}%
                </div>
              </div>

              <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                  <span>Rain Chance</span>
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
                  {selectedPlace.weather.rainChance}%
                </div>
              </div>

              <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>UV Index</span>
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
                  {selectedPlace.weather.uvIndex} / 10
                </div>
              </div>

              <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Gauge className="w-3.5 h-3.5 text-purple-500" />
                  <span>Air Quality</span>
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
                  AQI {selectedPlace.weather.aqi}
                </div>
              </div>
            </div>

          </div>

          {/* AQI & Health Advisory Banner */}
          <div className={`mt-6 p-4 rounded-xl border text-xs ${aqiInfo.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold">Air Quality Index {selectedPlace.weather.aqi}: {aqiInfo.label}</span>
                <p className="mt-0.5 text-neutral-700 dark:text-neutral-300">{aqiInfo.advice}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              <span>Best Season: {selectedPlace.weather.bestMonths}</span>
            </div>
          </div>

        </div>

        {/* 5-Day Extended Forecast */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40 p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
            5-Day Sightseeing Forecast for {selectedPlace.city}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {fiveDayForecast.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center space-y-1"
              >
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">{item.day}</span>
                <div className="text-xs text-neutral-500 py-1">{item.condition}</div>
                <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold tabular-nums">
                  <span className="text-neutral-900 dark:text-white">{item.tempHigh}°</span>
                  <span className="text-neutral-400 dark:text-neutral-500">{item.tempLow}°</span>
                </div>
                <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                  {item.rain}% rain
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seasonal Climate Travel Insights for India */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
          <h4 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Winter (Oct – March)</span>
          </h4>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            The golden travel window for Rajasthan, the Golden Triangle, Varanasi, Central India, and South India. Expect crisp mornings and pleasant afternoons. Note: Dense fog in North India in Dec-Jan can impact morning train schedules.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
          <h4 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 text-sky-500" />
            <span>Summer (April – June)</span>
          </h4>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            High mountain passes in Ladakh (Pangong, Khardung La), Himachal, Kashmir, and Sikkim open for summer trekking and alpine touring. Plains (Delhi, Rajasthan) experience high daytime temperatures—sightsee early mornings (06:00 - 09:00).
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
          <h4 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <span>Monsoon (July – Sept)</span>
          </h4>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Spectacular emerald landscapes in Kerala, Western Ghats, and Meghalaya. Ayurvedic wellness retreats peak in Kerala. Check road transit advisories for potential hilly landslides in Himachal and Uttarakhand.
          </p>
        </div>
      </div>

    </div>
  );
};
