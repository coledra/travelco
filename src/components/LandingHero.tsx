import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CloudSun,
  Train,
  UtensilsCrossed,
  Map,
  ShieldAlert,
  ChevronRight,
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
} from 'lucide-react';
import { IndianOriginCity, UserTrip } from '../types/travel';
import { POPULAR_ORIGIN_CITIES, TOURIST_DESTINATIONS } from '../data/destinationsData';
import { SAMPLE_ITINERARIES } from '../data/sampleItineraries';
import { ActiveTab } from './Header';

interface LandingHeroProps {
  selectedOrigin: IndianOriginCity;
  onSelectOrigin: (city: IndianOriginCity) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onLoadTrip: (trip: UserTrip) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  selectedOrigin,
  onSelectOrigin,
  onNavigateTab,
  onLoadTrip,
}) => {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [searchTargetRegion, setSearchTargetRegion] = useState('All');
  const [searchCategory, setSearchCategory] = useState('All');

  const heroSlides = [
    {
      title: 'The Eternal Symmetry of Agra',
      subtitle: 'Ivory marble reflecting the first golden light of dawn across the Yamuna River.',
      image: '/src/assets/images/india_monument_agra_1794221853157.jpg',
      region: 'North India',
      placeId: 'taj-mahal',
      timing: 'Sunrise 06:00 AM · Friday Closed',
    },
    {
      title: 'Serene Emerald Canals of Alleppey',
      subtitle: 'Thatched Kettuvallam houseboats gliding through palm-fringed backwater lagoons.',
      image: '/src/assets/images/india_kerala_backwaters_1794221853354.jpg',
      region: 'South India',
      placeId: 'kerala-backwaters',
      timing: 'Morning 08:30 AM · Banana Leaf Sadya',
    },
    {
      title: 'Varanasi Twilight Ghats & River Aarti',
      subtitle: 'Ancient stone steps, brass lamps, and conch chimes echoing over the sacred Ganges.',
      image: '/src/assets/images/india_varanasi_ghats_1794221854744.jpg',
      region: 'East & Ganges',
      placeId: 'varanasi-ghats',
      timing: 'Sunset 06:30 PM · Dashashwamedh Aarti',
    },
    {
      title: 'Pangong Lake & The High Himalayas',
      subtitle: 'Glacial turquoise waters at 4,225m altitude cradled by rugged mountain peaks.',
      image: '/src/assets/images/india_ladakh_himalayas_1794221853734.jpg',
      region: 'Himalayas',
      placeId: 'pangong-ladakh',
      timing: '10:00 AM · Inner Line Permit Required',
    },
  ];

  // Auto-advance hero slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const currentSlide = heroSlides[activeHeroSlide];

  return (
    <div className="space-y-12 pb-8">
      
      {/* Immersive Editorial Hero Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 text-white min-h-[540px] flex flex-col justify-between shadow-2xl">
        
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover transition-opacity duration-1000 transform scale-102"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/40 to-transparent" />
        </div>

        {/* Top Floating Strip: Real-time Location Synced Badge */}
        <div className="relative z-10 p-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-amber-400 uppercase tracking-widest font-semibold">
              TravelCo Architecture
            </span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span className="text-white/80">Real-Time Subcontinent Travel Engine</span>
          </div>

          <div className="flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs text-white">
            <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-white/60">Active Hub:</span>
            <strong className="text-amber-300">{selectedOrigin.name}, {selectedOrigin.state}</strong>
            <span className="text-[10px] text-white/50 ml-1">· All Services Centered</span>
          </div>
        </div>

        {/* Hero Headline & Value Proposition */}
        <div className="relative z-10 p-6 md:p-12 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/50 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentSlide.region} · {currentSlide.timing}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white text-balance">
            {currentSlide.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
            {currentSlide.subtitle} Plan seamless multi-day itineraries, track real-time Indian Railways & metro connections, and explore verified regional cuisines with 100% offline emergency safety.
          </p>

          {/* Quick Action CTA Strip */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigateTab('destinations')}
              className="flex items-center gap-2 px-5 py-3 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-lg hover:shadow-amber-400/20 whitespace-nowrap"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Tourist Places</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('itinerary')}
              className="flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg backdrop-blur-md transition-all whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>Open Itinerary Builder</span>
            </button>

            <button
              onClick={() => onNavigateTab('offline-map')}
              className="flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg backdrop-blur-md transition-all whitespace-nowrap"
            >
              <Map className="w-4 h-4" />
              <span>Offline India Map</span>
            </button>
          </div>
        </div>

        {/* Hero Slide Thumbnails Navigation */}
        <div className="relative z-10 p-6 border-t border-white/10 bg-neutral-950/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono">Curated Horizons:</span>
            <div className="flex items-center gap-2">
              {heroSlides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHeroSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeHeroSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-300">
            <span>AQI & Weather Monitored</span>
            <span aria-hidden="true" className="text-white/20">/</span>
            <span>IRCTC Live Rail Grid</span>
            <span aria-hidden="true" className="text-white/20">/</span>
            <span className="text-emerald-400">100% Offline Cache</span>
          </div>
        </div>

      </div>

      {/* Location-Centric Fast Search & Route Configurator */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Dynamic Trip Origin Engine
            </span>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Where will your journey begin?
            </h2>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Selecting a starting location instantly recalculates distances, transit timetables, regional food, and local weather.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Origin Picker */}
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Your Current Location / Hub
            </label>
            <div className="relative">
              <select
                value={selectedOrigin.id}
                onChange={(e) => {
                  const city = POPULAR_ORIGIN_CITIES.find((c) => c.id === e.target.value);
                  if (city) onSelectOrigin(city);
                }}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {POPULAR_ORIGIN_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Region */}
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Destination Region
            </label>
            <select
              value={searchTargetRegion}
              onChange={(e) => setSearchTargetRegion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium focus:outline-none"
            >
              <option value="All">All Regions of India</option>
              <option value="North">North (Delhi, Agra, Amritsar)</option>
              <option value="South">South (Kerala, Hampi, Madurai)</option>
              <option value="West">West (Rajasthan, Goa, Ajanta)</option>
              <option value="East">East (Varanasi, Sundarbans)</option>
              <option value="Himalayas">Himalayas (Ladakh, Kashmir)</option>
              <option value="North-East">North-East (Meghalaya, Assam)</option>
            </select>
          </div>

          {/* Travel Category */}
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Travel Focus
            </label>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Heritage">UNESCO Heritage & Monuments</option>
              <option value="Nature & Wildlife">Nature & Backwaters</option>
              <option value="Spiritual">Spiritual Temples & Ghats</option>
              <option value="Palaces & Forts">Royal Palaces & Fortresses</option>
              <option value="Beach & Island">Tropical Beaches & Islands</option>
              <option value="Adventure & Hills">High Altitude Himalayan Passes</option>
            </select>
          </div>

          {/* Action Trigger */}
          <div className="flex items-end">
            <button
              onClick={() => onNavigateTab('destinations')}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>View Ranked Places</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Status Ticker */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Currently calculating route vectors and driving times from <strong>{selectedOrigin.name}</strong></span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>12 Origin Hubs Supported</span>
            <span aria-hidden="true">·</span>
            <span>30+ Curated Attractions</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-600 dark:text-amber-400">Offline Fallback Ready</span>
          </div>
        </div>
      </div>

      {/* Signature Curated Travel Circuits */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Signature TravelCo Circuits
            </span>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
              Iconic Pre-Configured Expeditions
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('itinerary')}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Custom Itinerary Builder</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_ITINERARIES.map((trip) => (
            <div
              key={trip.id}
              className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    {trip.days.length} Days · {trip.originCity} Origin
                  </span>
                  <span className="font-mono tabular-nums font-bold text-neutral-900 dark:text-neutral-100">
                    Est. ₹{trip.budget.totalTarget.toLocaleString('en-IN')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {trip.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Route: {trip.destinationCities.join(' → ')}</span>
                </div>

                <div className="mt-3 space-y-1.5 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  {trip.days.slice(0, 3).map((day) => (
                    <div key={day.dayNumber} className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        Day {day.dayNumber}: {day.title}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {day.activities.length} stops
                      </span>
                    </div>
                  ))}
                  {trip.days.length > 3 && (
                    <div className="text-[11px] text-neutral-400 italic">
                      + {trip.days.length - 3} more days planned in itinerary
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    onLoadTrip(trip);
                    onNavigateTab('itinerary');
                  }}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Open Circuit in Planner</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Six Pillars of TravelCo Grid */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Enterprise Architecture
          </span>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            Why Discerning Travelers Choose TravelCo
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Engineered specifically to solve the unique logistical challenges of travel across the Indian subcontinent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Location Reactive Grid</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Instantly re-ranks distance vectors, regional transit departures, and local weather forecasts the moment you choose a new origin hub.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Train className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Live Indian Transit</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Track Vande Bharat Express, Rajdhani, Shatabdi, Delhi & Mumbai Metro lines with PNR status checks and winter fog advisories.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <CloudSun className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">AQI & Microclimate</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Comprehensive Air Quality Index monitoring and sightseer health guidance to avoid North Indian winter fog or peak desert heat.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Regional Gastronomy & Hygiene</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Authentic local specialties categorized by Pure Veg, Jain, and Non-Veg preferences, paired with certified traveler hygiene advice.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Map className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">100% Offline Vector Maps</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Preload regional map packs for the Golden Triangle, Ladakh, and Kerala to navigate in remote Himalayan valleys without network coverage.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">SOS 112 & Audio Siren</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Direct access to Tourist Police (1363), Women Helpline (1091), an in-browser acoustic siren beacon, and offline Hindi phrase cards.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
