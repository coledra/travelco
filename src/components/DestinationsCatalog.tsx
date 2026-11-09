import React, { useState } from 'react';
import {
  Compass,
  Search,
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  CloudSun,
  Utensils,
  Plus,
  Info,
  Car,
  Train,
  Plane,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { TouristPlace, IndianOriginCity, IndianRegion, DestinationCategory, UserTrip } from '../types/travel';
import { TOURIST_DESTINATIONS } from '../data/destinationsData';
import { calculateHaversineDistance, estimateTravelDetails } from '../utils/distance';

interface DestinationsCatalogProps {
  origin: IndianOriginCity;
  currentTrip: UserTrip;
  onAddPlaceToTrip: (place: TouristPlace, dayNumber: number) => void;
  destinations?: TouristPlace[];
}

export const DestinationsCatalog: React.FC<DestinationsCatalogProps> = ({
  origin,
  currentTrip,
  onAddPlaceToTrip,
  destinations = TOURIST_DESTINATIONS,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'distance' | 'name' | 'fee'>('distance');
  const [activeModalPlace, setActiveModalPlace] = useState<TouristPlace | null>(null);
  const [targetDayNumber, setTargetDayNumber] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<string>('');
  const [originNotice, setOriginNotice] = useState<string>('');

  React.useEffect(() => {
    setOriginNotice(`All distances and driving hours re-indexed from ${origin.name}, ${origin.state}`);
    const t = setTimeout(() => setOriginNotice(''), 3500);
    return () => clearTimeout(t);
  }, [origin.id]);

  const regions: string[] = ['All', 'North', 'South', 'West', 'East', 'North-East', 'Central', 'Himalayas'];
  const categories: string[] = [
    'All',
    'Heritage',
    'Nature & Wildlife',
    'Spiritual',
    'Beach & Island',
    'Adventure & Hills',
    'Palaces & Forts',
  ];

  // Process places with distance calculation from origin
  const placesWithDistance = destinations.map((place) => {
    const straightDist = calculateHaversineDistance(origin.coordinates, place.coordinates);
    const transit = estimateTravelDetails(straightDist);
    return {
      ...place,
      straightDist,
      roadKm: transit.roadKm,
      drivingTimeString: transit.drivingTimeString,
      recommendedMode: transit.recommendedMode,
    };
  });

  // Filter & Sort
  const filteredPlaces = placesWithDistance
    .filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion = selectedRegion === 'All' || place.region === selectedRegion;
      const matchesCategory = selectedCategory === 'All' || place.category === selectedCategory;

      return matchesSearch && matchesRegion && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.straightDist - b.straightDist;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'fee') return a.entryFee.indianCitizen - b.entryFee.indianCitizen;
      return 0;
    });

  const handleAddSubmit = (place: TouristPlace) => {
    onAddPlaceToTrip(place, targetDayNumber);
    setAddedNotice(`Added "${place.name}" to Day ${targetDayNumber}!`);
    setTimeout(() => setAddedNotice(''), 3000);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Flight':
        return <Plane className="w-3.5 h-3.5 text-sky-500" />;
      case 'Express Train':
        return <Train className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Car className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {originNotice && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fadeIn">
          <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{originNotice}</span>
        </div>
      )}

      {/* Title & Origin Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <span>Tourist Places in India</span>
              <span aria-hidden="true">·</span>
              <span>Distance Calculator</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
              Explore Destinations across India
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Distances and transit estimates dynamically calculated from your location: <strong className="text-neutral-800 dark:text-neutral-200">{origin.name}, {origin.state}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-2.5 rounded-lg text-amber-800 dark:text-amber-300">
            <Compass className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              Showing {filteredPlaces.length} places with opening hours & entry fee in ₹ INR
            </span>
          </div>
        </div>
      </div>

      {addedNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by monument, city, state, or highlight (e.g. Taj Mahal, Hampi, Kerala, Beach)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
            >
              <option value="distance">Distance from {origin.name}</option>
              <option value="name">Destination Name</option>
              <option value="fee">Entry Fee (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Region Tabs (Interactive Filter Controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-medium text-neutral-400 mr-1 shrink-0">Region:</span>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedRegion === reg
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-medium text-neutral-400 mr-1 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="group flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs"
          >
            {/* Card Media Header */}
            <div className="relative aspect-16/9 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <img
                src={place.image}
                alt={place.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback container
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Region & Category text metadata */}
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[11px] text-white/90">
                <span className="font-semibold">{place.region} India</span>
                <span aria-hidden="true">·</span>
                <span>{place.category}</span>
              </div>

              {/* Bottom Media Bar with Distance */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5 text-xs font-semibold font-mono tabular-nums">
                  {getModeIcon(place.recommendedMode)}
                  <span>{place.straightDist.toLocaleString('en-IN')} km from {origin.name}</span>
                </div>
                <div className="text-[11px] font-medium text-white/80">
                  ~{place.drivingTimeString}
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{place.city}</span>
                  <span aria-hidden="true">·</span>
                  <span>{place.state}</span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {place.name}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 line-clamp-2">
                  {place.summary}
                </p>
              </div>

              {/* Timings & Entry Fee strip */}
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>Timings:</span>
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">
                    {place.timings.openTime} - {place.timings.closeTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Recommended:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    {place.timings.recommendedSlot.split(' ')[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-200/50 dark:border-neutral-700/50">
                  <span className="text-neutral-500 dark:text-neutral-400">Ticket (Indian / Foreign):</span>
                  <span className="font-mono tabular-nums font-bold text-neutral-900 dark:text-neutral-100">
                    ₹{place.entryFee.indianCitizen} / ₹{place.entryFee.foreignNational}
                  </span>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setActiveModalPlace(place)}
                  className="flex-1 py-1.5 px-3 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
                >
                  View Details
                </button>

                <button
                  onClick={() => handleAddSubmit(place)}
                  className="py-1.5 px-3 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-md transition-colors flex items-center gap-1 shrink-0"
                  title={`Add to Day ${targetDayNumber} of ${currentTrip.title}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Trip</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Place Detail Modal */}
      {activeModalPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                  <span>{activeModalPlace.region} India</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModalPlace.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums font-semibold">
                    {calculateHaversineDistance(origin.coordinates, activeModalPlace.coordinates)} km from {origin.name}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {activeModalPlace.name}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{activeModalPlace.city}, {activeModalPlace.state}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveModalPlace(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <img
                src={activeModalPlace.image}
                alt={activeModalPlace.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {activeModalPlace.description}
            </p>

            {/* Timings & Entry Ticket Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-1.5">
                <span className="font-bold text-neutral-900 dark:text-neutral-100">Timings & Visiting Slots</span>
                <div>
                  <span className="text-neutral-500">Hours: </span>
                  <span className="font-mono tabular-nums font-semibold">{activeModalPlace.timings.openTime} - {activeModalPlace.timings.closeTime}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Best Time: </span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">{activeModalPlace.timings.recommendedSlot}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Avg Duration: </span>
                  <span className="font-mono tabular-nums">{activeModalPlace.timings.avgDurationHours} hours</span>
                </div>
                {activeModalPlace.timings.closedDays.length > 0 && (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium pt-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{activeModalPlace.timings.closedDays.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-1.5">
                <span className="font-bold text-neutral-900 dark:text-neutral-100">Official Entry Fees</span>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Indian Citizen:</span>
                  <span className="font-mono tabular-nums font-bold">₹{activeModalPlace.entryFee.indianCitizen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Foreign National:</span>
                  <span className="font-mono tabular-nums font-bold">₹{activeModalPlace.entryFee.foreignNational}</span>
                </div>
                {activeModalPlace.entryFee.childFreeAgeLimit && (
                  <div className="text-[11px] text-neutral-500">
                    Children under {activeModalPlace.entryFee.childFreeAgeLimit} enter free
                  </div>
                )}
              </div>
            </div>

            {/* Travel Tips & Highlights */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                Practical Traveler Tips
              </h4>
              <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400 list-disc list-inside">
                {activeModalPlace.travelTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Regional Food to try nearby */}
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-xs">
              <span className="font-bold text-orange-900 dark:text-orange-200 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Regional Delicacies Around {activeModalPlace.city}:</span>
              </span>
              <div className="flex flex-wrap gap-2 mt-1.5 text-orange-800 dark:text-orange-300">
                {activeModalPlace.signatureDishes.map((dish, i) => (
                  <span key={i} className="font-medium">
                    {dish} {i < activeModalPlace.signatureDishes.length - 1 ? '·' : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Add to Specific Day */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-neutral-600 dark:text-neutral-400">Target Day:</span>
                <select
                  value={targetDayNumber}
                  onChange={(e) => setTargetDayNumber(parseInt(e.target.value) || 1)}
                  className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  {currentTrip.days.map((d) => (
                    <option key={d.dayNumber} value={d.dayNumber}>
                      Day {d.dayNumber} ({d.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalPlace(null)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddSubmit(activeModalPlace);
                    setActiveModalPlace(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Day {targetDayNumber}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
