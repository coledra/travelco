import React, { useState } from 'react';
import {
  Map,
  Download,
  CheckCircle2,
  MapPin,
  Compass,
  Navigation,
  HardDrive,
  WifiOff,
  Wifi,
  Layers,
  Sparkles,
  Info,
  Clock,
  IndianRupee,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { TouristPlace, IndianOriginCity, UserTrip } from '../types/travel';
import { TOURIST_DESTINATIONS } from '../data/destinationsData';
import { AVAILABLE_MAP_PACKS, OfflineMapPack } from '../utils/offlineStorage';
import { calculateHaversineDistance } from '../utils/distance';

interface OfflineMapCenterProps {
  origin: IndianOriginCity;
  currentTrip: UserTrip;
  downloadedPacks: string[];
  onTogglePackDownload: (packId: string) => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  destinations?: TouristPlace[];
}

export const OfflineMapCenter: React.FC<OfflineMapCenterProps> = ({
  origin,
  currentTrip,
  downloadedPacks,
  onTogglePackDownload,
  isOfflineMode,
  toggleOfflineMode,
  destinations = TOURIST_DESTINATIONS,
}) => {
  const [selectedPlace, setSelectedPlace] = useState<TouristPlace | null>(destinations[0] || TOURIST_DESTINATIONS[0]);
  const [downloadingPackId, setDownloadingPackId] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>('All');

  // Convert Indian geo coordinates (lat 8° to 36°, lng 68° to 96°) to SVG canvas percentages
  const latMin = 8.0;
  const latMax = 36.0;
  const lngMin = 68.0;
  const lngMax = 96.0;

  const projectCoords = (lat: number, lng: number) => {
    // Invert lat for Y (top is north)
    const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
    const y = ((latMax - lat) / (latMax - latMin)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const handleDownload = (packId: string) => {
    setDownloadingPackId(packId);
    setTimeout(() => {
      onTogglePackDownload(packId);
      setDownloadingPackId(null);
    }, 900);
  };

  const originPos = projectCoords(origin.coordinates.lat, origin.coordinates.lng);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <span>Offline Navigation Center</span>
              <span aria-hidden="true">·</span>
              <span>Vector Cartography & Map Packs</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
              Interactive Offline Map of India
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Download city and regional map packs for 100% offline navigation during mountain treks, remote highways, and train journeys.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleOfflineMode}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${
                isOfflineMode
                  ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {isOfflineMode ? <WifiOff className="w-4 h-4 text-amber-500" /> : <Wifi className="w-4 h-4 text-emerald-500" />}
              <span>{isOfflineMode ? 'Device Offline (Serving Cached Maps)' : 'Simulate Offline Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport & Details Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive India Map Canvas (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 p-4 md:p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          
          {/* Top Controls Overlay */}
          <div className="flex flex-wrap items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-neutral-200">Map View:</span>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200 focus:outline-none"
              >
                <option value="All">All India (National Grid)</option>
                <option value="North">North India</option>
                <option value="South">South India</option>
                <option value="West">West India</option>
                <option value="East">East India</option>
                <option value="Himalayas">Himalayan Region</option>
              </select>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Origin ({origin.name})</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Tourist Attractions</span>
              </span>
            </div>
          </div>

          {/* Cartographic SVG Canvas */}
          <div className="relative w-full h-[400px] my-4 select-none">
            
            {/* Background Subtle Coordinate Grid Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Stylized India Coastline & Contour Representation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none text-neutral-800" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 28,12 Q 35,6 42,12 Q 52,18 58,16 Q 70,22 85,25 Q 92,35 88,42 Q 78,40 68,44 Q 60,52 64,65 Q 60,78 50,92 Q 44,95 40,88 Q 30,75 28,60 Q 22,50 20,40 Q 18,25 28,12 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                className="opacity-40"
              />
            </svg>

            {/* Trajectory line from origin to selected place */}
            {selectedPlace && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {(() => {
                  const targetPos = projectCoords(selectedPlace.coordinates.lat, selectedPlace.coordinates.lng);
                  return (
                    <line
                      x1={originPos.x}
                      y1={originPos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                      className="animate-pulse"
                    />
                  );
                })()}
              </svg>
            )}

            {/* Origin Pin */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              style={{ left: `${originPos.x}%`, top: `${originPos.y}%` }}
              title={`Starting Origin: ${origin.name}`}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-6 h-6 rounded-full bg-amber-500/30 animate-ping" />
                <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center shadow-lg">
                  <Navigation className="w-2.5 h-2.5 text-neutral-950" />
                </div>
              </div>
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono tracking-tight text-amber-400 bg-neutral-900/90 px-1 rounded whitespace-nowrap border border-amber-500/40">
                {origin.name} (Start)
              </span>
            </div>

            {/* Tourist Place Pins */}
            {destinations.filter((p) => filterRegion === 'All' || p.region === filterRegion).map((place) => {
              const pos = projectCoords(place.coordinates.lat, place.coordinates.lng);
              const isSelected = selectedPlace?.id === place.id;

              return (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className={`p-1 rounded-full transition-transform ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center shadow-md ${
                        isSelected ? 'bg-emerald-400 ring-2 ring-emerald-500' : 'bg-emerald-600 group-hover:bg-emerald-400'
                      }`}
                    />
                  </div>

                  <span
                    className={`absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-emerald-950 text-emerald-200 border border-emerald-500 font-bold z-30'
                        : 'bg-neutral-900/80 text-neutral-300 opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    {place.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Map Info Strip */}
          <div className="z-10 pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 flex flex-wrap items-center justify-between gap-2">
            <span>Projection: WGS84 Geographic · India Continental Scale</span>
            <span className="font-mono text-emerald-400">
              {downloadedPacks.length} Offline Map Packs Installed Locally
            </span>
          </div>

        </div>

        {/* Selected Place Details & Fast Action (1 col) */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4 shadow-xs flex flex-col justify-between">
          {selectedPlace ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span>{selectedPlace.region} India</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedPlace.category}</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {selectedPlace.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{selectedPlace.city}, {selectedPlace.state}</span>
                </div>
              </div>

              {/* Image thumbnail */}
              <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Distance & Trajectory Stats */}
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Distance from {origin.name}:</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {calculateHaversineDistance(origin.coordinates, selectedPlace.coordinates).toLocaleString('en-IN')} km
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Visiting Hours:</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">
                    {selectedPlace.timings.openTime} - {selectedPlace.timings.closeTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Recommended Slot:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    {selectedPlace.timings.recommendedSlot}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-500">Entry Fee:</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    ₹{selectedPlace.entryFee.indianCitizen} (INR)
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {selectedPlace.summary}
              </p>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-neutral-400">
              Click any place pin on the map to inspect details
            </div>
          )}

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="text-[11px] text-neutral-500 mb-2">
              Status: Available in offline storage cache
            </div>
          </div>
        </div>

      </div>

      {/* Downloadable Regional Map Packs Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Downloadable Regional Offline Packs
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Preload vector layers, monument entry points, and transit tracks to navigate without mobile network coverage.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Storage Used: {downloadedPacks.length * 16} MB approx
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AVAILABLE_MAP_PACKS.map((pack) => {
            const isDownloaded = downloadedPacks.includes(pack.id);
            const isDownloading = downloadingPackId === pack.id;

            return (
              <div
                key={pack.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{pack.state}</span>
                    <span className="font-mono tabular-nums">{pack.sizeMb} MB</span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                    {pack.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                    <span>{pack.placesCount} Points of Interest</span>
                    <span aria-hidden="true">·</span>
                    <span>Transit timetable included</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(pack.id)}
                  disabled={isDownloading}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                    isDownloaded
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <Download className="w-3.5 h-3.5 animate-bounce" />
                      <span>Downloading Pack...</span>
                    </>
                  ) : isDownloaded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Downloaded (Available Offline)</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Pack ({pack.sizeMb} MB)</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
