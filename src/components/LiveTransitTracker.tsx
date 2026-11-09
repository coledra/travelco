import React, { useState } from 'react';
import {
  TrainFront,
  Search,
  Train,
  Plane,
  Bus,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Info,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { TRANSIT_ROUTES_DATABASE, CURRENT_TRAVEL_ADVISORIES } from '../data/transitData';
import { TransitRoute, IndianOriginCity } from '../types/travel';
import { TravelAdvisory } from '../data/transitData';

interface LiveTransitTrackerProps {
  origin?: IndianOriginCity;
  transitRoutes?: TransitRoute[];
  travelAdvisories?: TravelAdvisory[];
}

export const LiveTransitTracker: React.FC<LiveTransitTrackerProps> = ({
  origin,
  transitRoutes = TRANSIT_ROUTES_DATABASE,
  travelAdvisories = CURRENT_TRAVEL_ADVISORIES,
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pnrInput, setPnrInput] = useState('');
  const [pnrResult, setPnrResult] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transitNotice, setTransitNotice] = useState<string>('');

  const transitTypes = ['All', 'Train', 'Metro', 'Bus', 'Flight'];

  React.useEffect(() => {
    if (origin) {
      setTransitNotice(`Live rail, flight, and metro departures updated for ${origin.name}`);
      const t = setTimeout(() => setTransitNotice(''), 4000);
      return () => clearTimeout(t);
    }
  }, [origin?.id]);

  const filteredRoutes = transitRoutes.filter((route) => {
    const matchesSearch =
      route.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'All' || route.type === selectedType;

    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (origin) {
      const aMatches = a.origin.toLowerCase().includes(origin.name.toLowerCase()) || a.name.toLowerCase().includes(origin.name.toLowerCase());
      const bMatches = b.origin.toLowerCase().includes(origin.name.toLowerCase()) || b.name.toLowerCase().includes(origin.name.toLowerCase());
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
    }
    return 0;
  });

  const handleSimulatePnrCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;

    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setPnrResult({
        pnr: pnrInput.trim(),
        trainNumber: '22436 Vande Bharat Express',
        dateOfJourney: 'Tomorrow',
        boardingStation: 'New Delhi (NDLS)',
        destinationStation: 'Varanasi Jn (BSB)',
        coach: 'C4 (AC Chair Car)',
        seatBerth: 'Seat 38 (Window)',
        status: 'CNF (Confirmed)',
        currentLiveStatus: 'Train is currently at Kanpur Central · Running +12 mins late',
        expectedArrival: '02:12 PM',
      });
    }, 700);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Train':
        return <TrainFront className="w-4 h-4 text-emerald-500" />;
      case 'Metro':
        return <Train className="w-4 h-4 text-purple-500" />;
      case 'Flight':
        return <Plane className="w-4 h-4 text-sky-500" />;
      case 'Bus':
        return <Bus className="w-4 h-4 text-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusBadge = (status: string, delay: number) => {
    if (status === 'Delayed') {
      return (
        <span className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>+{delay}m Delay</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {transitNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fadeIn">
          <TrainFront className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{transitNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <span>National Transit Grid</span>
              <span aria-hidden="true">·</span>
              <span>Indian Railways, Metro & Intercity</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
              Real-Time Transit Updates Across India
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Live status for Vande Bharat, Rajdhani, Shatabdi express trains, major metro lines, intercity buses, and domestic flights.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsRefreshing(true);
                setTimeout(() => setIsRefreshing(false), 600);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* IRCTC PNR & Train Live Status Tracker Bar */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-neutral-50 to-amber-50/40 dark:from-neutral-900 dark:to-amber-950/20 shadow-xs">
        <div className="max-w-3xl">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <TrainFront className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Check PNR Status or Train Number</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Enter your 10-digit Indian Railways PNR or train identifier to verify confirmation, current station, and delays.
          </p>

          <form onSubmit={handleSimulatePnrCheck} className="flex flex-col sm:flex-row gap-2 mt-3">
            <input
              type="text"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              placeholder="e.g. 2849182741 or 22436 Vande Bharat..."
              className="flex-1 px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={isRefreshing}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors whitespace-nowrap shadow-xs"
            >
              Check Live Status
            </button>
          </form>

          {/* Simulated PNR Result Card */}
          {pnrResult && (
            <div className="mt-4 p-4 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-white dark:bg-neutral-900 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">PNR: {pnrResult.pnr}</span>
                  <span aria-hidden="true">·</span>
                  <span>{pnrResult.trainNumber}</span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {pnrResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-neutral-400 block">Boarding</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{pnrResult.boardingStation}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Destination</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{pnrResult.destinationStation}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Coach / Seat</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{pnrResult.coach} / {pnrResult.seatBerth}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Est. Arrival</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{pnrResult.expectedArrival}</span>
                </div>
              </div>

              <div className="pt-1 text-neutral-600 dark:text-neutral-400 font-medium">
                {pnrResult.currentLiveStatus}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Travel Advisories Strip */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Official Active Transit Advisories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {travelAdvisories.map((adv) => (
            <div
              key={adv.id}
              className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1.5 text-xs shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 truncate">{adv.region}</span>
                <span
                  className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    adv.severity === 'High'
                      ? 'text-red-600 bg-red-50 dark:bg-red-950/40'
                      : adv.severity === 'Moderate'
                      ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                  }`}
                >
                  {adv.severity}
                </span>
              </div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100">{adv.title}</h4>
              <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                {adv.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Transit Schedule Grid */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by train name, route, metro line, or destination..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {transitTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                  selectedType === t
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Routes List */}
        <div className="space-y-3 pt-2">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    {getTypeIcon(route.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {route.identifier}
                      </span>
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs text-neutral-500 font-medium">{route.name}</span>
                    </div>
                  </div>
                </div>

                {getStatusBadge(route.status, route.delayMinutes)}
              </div>

              {/* Route Trajectory & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Departure</span>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">{route.origin}</div>
                  <div className="font-mono tabular-nums text-neutral-600 dark:text-neutral-300">{route.departureTime}</div>
                </div>

                <div className="text-center flex flex-col justify-center">
                  <span className="text-[11px] font-mono tabular-nums text-neutral-500">{route.duration}</span>
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    <div className="h-px bg-amber-400 flex-1 max-w-[40px]" />
                    <ArrowRight className="w-3.5 h-3.5" />
                    <div className="h-px bg-amber-400 flex-1 max-w-[40px]" />
                  </div>
                  {route.platform && (
                    <span className="text-[11px] font-mono text-neutral-500">{route.platform}</span>
                  )}
                  {route.frequency && (
                    <span className="text-[11px] text-neutral-500">{route.frequency}</span>
                  )}
                </div>

                <div className="sm:text-right">
                  <span className="text-neutral-400 block text-[11px]">Arrival</span>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">{route.destination}</div>
                  <div className="font-mono tabular-nums text-neutral-600 dark:text-neutral-300">{route.arrivalTime}</div>
                </div>
              </div>

              {/* Booking & Insider Tip */}
              <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span><strong>Pro-Tip:</strong> {route.bookingTip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
