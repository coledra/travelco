import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  CloudSun,
  UtensilsCrossed,
  TrainFront,
  MapPin,
  Users,
  ShieldAlert,
  Shield,
  Moon,
  Sun,
  Map,
  Navigation,
  ChevronDown,
} from 'lucide-react';
import { POPULAR_ORIGIN_CITIES } from '../data/destinationsData';
import { IndianOriginCity } from '../types/travel';

export type ActiveTab = 'landing' | 'itinerary' | 'destinations' | 'weather' | 'food' | 'transit' | 'offline-map' | 'forum' | 'emergency' | 'admin';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  selectedOrigin: IndianOriginCity;
  onSelectOrigin: (city: IndianOriginCity) => void;
  onTriggerSOS: () => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleDarkMode,
  selectedOrigin,
  onSelectOrigin,
  onTriggerSOS,
  isOfflineMode,
  toggleOfflineMode,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onOpenAdminPanel,
}) => {
  const [showOriginMenu, setShowOriginMenu] = useState(false);

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ElementType }> = [
    { id: 'landing', label: 'Discover', icon: Compass },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'food', label: 'Regional Food', icon: UtensilsCrossed },
    { id: 'transit', label: 'Live Transit', icon: TrainFront },
    { id: 'offline-map', label: 'Offline Map', icon: Map },
    { id: 'forum', label: 'Community', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-sm font-bold text-sm">
                TC
              </div>
              <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
                TravelCo
              </span>
            </button>
            <span className="hidden sm:inline-block text-xs font-semibold text-amber-700 dark:text-amber-400/90 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 rounded px-2 py-0.5 whitespace-nowrap">
              India
            </span>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line controls) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Essential Utilities */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Origin City Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOriginMenu(!showOriginMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md hover:border-amber-400 dark:hover:border-amber-600 transition-colors whitespace-nowrap"
                title="Select origin city to calculate distance across India"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline text-neutral-400 dark:text-neutral-500 text-[11px]">From:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{selectedOrigin.name}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {showOriginMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowOriginMenu(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-64 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl z-40 py-2 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                      Select Your Starting Hub
                    </div>
                    {POPULAR_ORIGIN_CITIES.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          onSelectOrigin(city);
                          setShowOriginMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors ${
                          selectedOrigin.id === city.id
                            ? 'font-bold text-amber-600 dark:text-amber-400 bg-neutral-50 dark:bg-neutral-800/60'
                            : 'text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{city.name}</span>
                        </div>
                        <span className="text-[11px] text-neutral-400 font-normal">{city.state}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Offline Simulation Toggle */}
            <button
              onClick={toggleOfflineMode}
              title={isOfflineMode ? 'Device is in Offline Mode (Serving Cached Data)' : 'Device is Online'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap ${
                isOfflineMode
                  ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOfflineMode ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="hidden md:inline">{isOfflineMode ? 'Offline Mode' : 'Online'}</span>
            </button>

            {/* SOS Emergency Button */}
            <button
              onClick={onTriggerSOS}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-md shadow-xs transition-colors whitespace-nowrap"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SOS 112</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>

            {/* Admin Portal Trigger */}
            {isAdminLoggedIn ? (
              <button
                onClick={onOpenAdminPanel}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-md transition-colors whitespace-nowrap shadow-xs"
                title="Open TravelCo Admin Control Deck"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Deck</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 rounded-md transition-colors whitespace-nowrap"
                title="Admin Sign In"
              >
                <Shield className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-neutral-100 dark:border-neutral-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
