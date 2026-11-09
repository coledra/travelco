import React, { useState } from 'react';
import {
  Shield,
  Compass,
  UtensilsCrossed,
  TrainFront,
  ShieldAlert,
  Users,
  Database,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Upload,
  ArrowLeft,
  Clock,
  IndianRupee,
  MapPin,
  Flame,
} from 'lucide-react';
import {
  TouristPlace,
  RegionalFood,
  TransitRoute,
  EmergencyContact,
  ForumPost,
  IndianRegion,
  DestinationCategory,
} from '../types/travel';
import { TravelAdvisory } from '../data/transitData';
import { HospitalDirectoryEntry } from '../data/emergencyData';

interface AdminPanelProps {
  destinations: TouristPlace[];
  onUpdateDestinations: (data: TouristPlace[]) => void;
  foodItems: RegionalFood[];
  onUpdateFoodItems: (data: RegionalFood[]) => void;
  transitRoutes: TransitRoute[];
  onUpdateTransitRoutes: (data: TransitRoute[]) => void;
  travelAdvisories: TravelAdvisory[];
  onUpdateAdvisories: (data: TravelAdvisory[]) => void;
  emergencyContacts: EmergencyContact[];
  onUpdateEmergencyContacts: (data: EmergencyContact[]) => void;
  hospitals: HospitalDirectoryEntry[];
  onUpdateHospitals: (data: HospitalDirectoryEntry[]) => void;
  forumPosts: ForumPost[];
  onUpdateForumPosts: (data: ForumPost[]) => void;
  onExitAdmin: () => void;
  onLogoutAdmin: () => void;
  onResetFactoryDefaults: () => void;
}

type AdminModule = 'destinations' | 'food' | 'transit' | 'emergency' | 'forum' | 'system';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  destinations,
  onUpdateDestinations,
  foodItems,
  onUpdateFoodItems,
  transitRoutes,
  onUpdateTransitRoutes,
  travelAdvisories,
  onUpdateAdvisories,
  emergencyContacts,
  onUpdateEmergencyContacts,
  hospitals,
  onUpdateHospitals,
  forumPosts,
  onUpdateForumPosts,
  onExitAdmin,
  onLogoutAdmin,
  onResetFactoryDefaults,
}) => {
  const [activeModule, setActiveModule] = useState<AdminModule>('destinations');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackToast, setFeedbackToast] = useState('');

  // Destination edit/create modal state
  const [editingDestination, setEditingDestination] = useState<TouristPlace | null>(null);
  const [isCreatingDestination, setIsCreatingDestination] = useState(false);

  // Food edit/create modal state
  const [editingFood, setEditingFood] = useState<RegionalFood | null>(null);
  const [isCreatingFood, setIsCreatingFood] = useState(false);

  // Transit edit/create modal state
  const [editingTransit, setEditingTransit] = useState<TransitRoute | null>(null);
  const [isCreatingTransit, setIsCreatingTransit] = useState(false);

  // Advisory edit/create modal state
  const [editingAdvisory, setEditingAdvisory] = useState<TravelAdvisory | null>(null);
  const [isCreatingAdvisory, setIsCreatingAdvisory] = useState(false);

  // Helpline edit/create state
  const [editingHelpline, setEditingHelpline] = useState<EmergencyContact | null>(null);
  const [isCreatingHelpline, setIsCreatingHelpline] = useState(false);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(''), 3500);
  };

  // ==================== DESTINATIONS HANDLERS ====================
  const handleSaveDestination = (dest: TouristPlace) => {
    if (isCreatingDestination) {
      onUpdateDestinations([dest, ...destinations]);
      showToast(`Created new attraction "${dest.name}"`);
    } else {
      onUpdateDestinations(destinations.map((d) => (d.id === dest.id ? dest : d)));
      showToast(`Updated destination "${dest.name}"`);
    }
    setEditingDestination(null);
    setIsCreatingDestination(false);
  };

  const handleDeleteDestination = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete destination "${name}"?`)) {
      onUpdateDestinations(destinations.filter((d) => d.id !== id));
      showToast(`Deleted destination "${name}"`);
    }
  };

  // ==================== FOOD HANDLERS ====================
  const handleSaveFood = (food: RegionalFood) => {
    if (isCreatingFood) {
      onUpdateFoodItems([food, ...foodItems]);
      showToast(`Created culinary dish "${food.name}"`);
    } else {
      onUpdateFoodItems(foodItems.map((f) => (f.id === food.id ? food : f)));
      showToast(`Updated culinary dish "${food.name}"`);
    }
    setEditingFood(null);
    setIsCreatingFood(false);
  };

  const handleDeleteFood = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete dish "${name}"?`)) {
      onUpdateFoodItems(foodItems.filter((f) => f.id !== id));
      showToast(`Deleted dish "${name}"`);
    }
  };

  // ==================== TRANSIT HANDLERS ====================
  const handleSaveTransit = (route: TransitRoute) => {
    if (isCreatingTransit) {
      onUpdateTransitRoutes([route, ...transitRoutes]);
      showToast(`Added route "${route.identifier}"`);
    } else {
      onUpdateTransitRoutes(transitRoutes.map((r) => (r.id === route.id ? route : r)));
      showToast(`Updated route "${route.identifier}"`);
    }
    setEditingTransit(null);
    setIsCreatingTransit(false);
  };

  const handleDeleteTransit = (id: string, identifier: string) => {
    if (window.confirm(`Delete transit route "${identifier}"?`)) {
      onUpdateTransitRoutes(transitRoutes.filter((r) => r.id !== id));
      showToast(`Deleted route "${identifier}"`);
    }
  };

  const handleToggleRouteDelay = (id: string) => {
    onUpdateTransitRoutes(
      transitRoutes.map((r) => {
        if (r.id !== id) return r;
        const newStatus = r.status === 'Delayed' ? 'On Time' : 'Delayed';
        return {
          ...r,
          status: newStatus,
          delayMinutes: newStatus === 'Delayed' ? 25 : 0,
        };
      })
    );
    showToast('Transit live delay status toggled');
  };

  // ==================== ADVISORY HANDLERS ====================
  const handleSaveAdvisory = (adv: TravelAdvisory) => {
    if (isCreatingAdvisory) {
      onUpdateAdvisories([adv, ...travelAdvisories]);
      showToast(`Published advisory "${adv.title}"`);
    } else {
      onUpdateAdvisories(travelAdvisories.map((a) => (a.id === adv.id ? adv : a)));
      showToast(`Updated advisory "${adv.title}"`);
    }
    setEditingAdvisory(null);
    setIsCreatingAdvisory(false);
  };

  const handleDeleteAdvisory = (id: string) => {
    onUpdateAdvisories(travelAdvisories.filter((a) => a.id !== id));
    showToast('Deleted travel advisory');
  };

  // ==================== HELPLINE HANDLERS ====================
  const handleSaveHelpline = (help: EmergencyContact) => {
    if (isCreatingHelpline) {
      onUpdateEmergencyContacts([...emergencyContacts, help]);
      showToast(`Added helpline "${help.service}"`);
    } else {
      onUpdateEmergencyContacts(emergencyContacts.map((h) => (h.id === help.id ? help : h)));
      showToast(`Updated helpline "${help.service}"`);
    }
    setEditingHelpline(null);
    setIsCreatingHelpline(false);
  };

  const handleDeleteHelpline = (id: string) => {
    onUpdateEmergencyContacts(emergencyContacts.filter((h) => h.id !== id));
    showToast('Deleted emergency helpline');
  };

  // ==================== FORUM MODERATION ====================
  const handleDeletePost = (id: string, title: string) => {
    if (window.confirm(`Delete forum post "${title}"?`)) {
      onUpdateForumPosts(forumPosts.filter((p) => p.id !== id));
      showToast(`Deleted post "${title}"`);
    }
  };

  // ==================== BACKUP & EXPORT ====================
  const handleExportJSON = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      destinations,
      foodItems,
      transitRoutes,
      travelAdvisories,
      emergencyContacts,
      hospitals,
      forumPosts,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travelco-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Exported platform data backup as JSON');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.destinations) onUpdateDestinations(parsed.destinations);
        if (parsed.foodItems) onUpdateFoodItems(parsed.foodItems);
        if (parsed.transitRoutes) onUpdateTransitRoutes(parsed.transitRoutes);
        if (parsed.travelAdvisories) onUpdateAdvisories(parsed.travelAdvisories);
        if (parsed.emergencyContacts) onUpdateEmergencyContacts(parsed.emergencyContacts);
        if (parsed.hospitals) onUpdateHospitals(parsed.hospitals);
        showToast('Successfully imported and applied platform data backup!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Top Command Bar */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <span>TravelCo Control Deck</span>
                <span aria-hidden="true">·</span>
                <span>Administrator Active</span>
              </div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Data Update & Systems Management
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Traveler View</span>
            </button>

            <button
              onClick={onLogoutAdmin}
              className="px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 hover:bg-red-100 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Global Feedback Toast */}
      {feedbackToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Module Selector Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
        {[
          { id: 'destinations', label: `Destinations (${destinations.length})`, icon: Compass },
          { id: 'food', label: `Regional Food (${foodItems.length})`, icon: UtensilsCrossed },
          { id: 'transit', label: `Transit & Advisories (${transitRoutes.length})`, icon: TrainFront },
          { id: 'emergency', label: `Emergency & Hospitals (${emergencyContacts.length})`, icon: ShieldAlert },
          { id: 'forum', label: `Forum Moderation (${forumPosts.length})`, icon: Users },
          { id: 'system', label: 'Backup & Restore', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveModule(tab.id as AdminModule);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: DESTINATIONS DATA UPDATE PANEL                                 */}
      {/* ========================================================================= */}
      {activeModule === 'destinations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations by name, city, state, or region..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                setIsCreatingDestination(true);
                setEditingDestination({
                  id: `dest-${Date.now()}`,
                  name: '',
                  city: '',
                  state: '',
                  region: 'North',
                  category: 'Heritage',
                  coordinates: { lat: 28.6139, lng: 77.209 },
                  image: '/src/assets/images/india_monument_agra_1794221853157.jpg',
                  summary: '',
                  description: '',
                  timings: {
                    openTime: '06:00 AM',
                    closeTime: '06:00 PM',
                    closedDays: [],
                    recommendedSlot: 'Morning (08:30 - 12:00)',
                    avgDurationHours: 2.5,
                    peakCrowdHours: '11:00 AM - 03:00 PM',
                  },
                  entryFee: {
                    indianCitizen: 50,
                    foreignNational: 600,
                  },
                  highlights: ['Architecture', 'Photography'],
                  travelTips: ['Book tickets early'],
                  weather: {
                    currentTemp: 25,
                    condition: 'Pleasant & Clear',
                    aqi: 55,
                    humidity: 50,
                    bestMonths: 'October to March',
                    rainChance: 5,
                    uvIndex: 6,
                  },
                  signatureDishes: ['Local Delicacy'],
                });
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg whitespace-nowrap shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Destination</span>
            </button>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Destination & Location</th>
                    <th className="px-4 py-3">Region & Category</th>
                    <th className="px-4 py-3">Timings</th>
                    <th className="px-4 py-3">Tickets (IND / FOR)</th>
                    <th className="px-4 py-3">Weather / AQI</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {destinations
                    .filter(
                      (d) =>
                        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        d.state.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((dest) => (
                      <tr key={dest.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                        <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                          <div>{dest.name}</div>
                          <div className="text-[11px] font-normal text-neutral-500">
                            {dest.city}, {dest.state}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                            {dest.region} India
                          </span>
                          <span className="block text-[11px] text-neutral-400">{dest.category}</span>
                        </td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
                          <div>{dest.timings.openTime} - {dest.timings.closeTime}</div>
                          <div className="text-amber-600 dark:text-amber-400 font-medium">
                            {dest.timings.recommendedSlot.split(' ')[0]}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums font-bold text-neutral-800 dark:text-neutral-200">
                          ₹{dest.entryFee.indianCitizen} / ₹{dest.entryFee.foreignNational}
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                          {dest.weather.currentTemp}°C · AQI {dest.weather.aqi}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setIsCreatingDestination(false);
                                setEditingDestination({ ...dest });
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                              title="Edit destination"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDestination(dest.id, dest.name)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded"
                              title="Delete destination"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: REGIONAL FOOD DATA UPDATE PANEL                                 */}
      {/* ========================================================================= */}
      {activeModule === 'food' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food by name, state, or dietary type..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                setIsCreatingFood(true);
                setEditingFood({
                  id: `food-${Date.now()}`,
                  name: '',
                  region: 'North',
                  state: '',
                  dietary: 'Pure Veg',
                  spiceLevel: 'Medium',
                  mealType: 'Main Course',
                  description: '',
                  keyIngredients: ['Ingredient 1', 'Ingredient 2'],
                  famousSpots: ['Famous Eatery'],
                  hygieneTip: 'Freshly prepared hot service recommended.',
                });
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg whitespace-nowrap shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Regional Dish</span>
            </button>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Dish & State</th>
                    <th className="px-4 py-3">Dietary & Spice</th>
                    <th className="px-4 py-3">Meal Type</th>
                    <th className="px-4 py-3">Famous Spots</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {foodItems
                    .filter(
                      (f) =>
                        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        f.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        f.dietary.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((food) => (
                      <tr key={food.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                        <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                          <div>{food.name}</div>
                          <div className="text-[11px] font-normal text-neutral-500">{food.state} ({food.region} India)</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {food.dietary}
                          </span>
                          <span className="block text-[11px] text-neutral-400">{food.spiceLevel}</span>
                        </td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                          {food.mealType}
                        </td>
                        <td className="px-4 py-3 text-neutral-500 text-[11px] max-w-xs truncate">
                          {food.famousSpots.join(', ')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setIsCreatingFood(false);
                                setEditingFood({ ...food });
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFood(food.id, food.name)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: TRANSIT GRID & ADVISORIES UPDATE PANEL                          */}
      {/* ========================================================================= */}
      {activeModule === 'transit' && (
        <div className="space-y-6">
          {/* Transit Routes Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Transit Routes & Train Timetables ({transitRoutes.length})
              </h3>
              <button
                onClick={() => {
                  setIsCreatingTransit(true);
                  setEditingTransit({
                    id: `tr-${Date.now()}`,
                    type: 'Train',
                    identifier: '22436 Vande Bharat Express',
                    name: 'Delhi to Varanasi Express',
                    origin: 'New Delhi (NDLS)',
                    destination: 'Varanasi (BSB)',
                    departureTime: '06:00 AM',
                    arrivalTime: '02:00 PM',
                    duration: '8h 00m',
                    status: 'On Time',
                    delayMinutes: 0,
                    platform: 'Platform 1',
                    bookingTip: 'Book 15 days in advance.',
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg whitespace-nowrap shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Transit Route</span>
              </button>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Route Identifier</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Origin $\rightarrow$ Destination</th>
                      <th className="px-4 py-3">Departure / Arrival</th>
                      <th className="px-4 py-3">Live Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {transitRoutes.map((route) => (
                      <tr key={route.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                        <td className="px-4 py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                          {route.identifier}
                          <span className="block text-[11px] font-sans font-normal text-neutral-500">{route.name}</span>
                        </td>
                        <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300 font-medium">
                          {route.type}
                        </td>
                        <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
                          {route.origin} $\rightarrow$ {route.destination}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px]">
                          {route.departureTime} - {route.arrivalTime}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleRouteDelay(route.id)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              route.status === 'Delayed'
                                ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:border-red-800'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                            }`}
                            title="Click to toggle status (On Time / Delayed)"
                          >
                            {route.status} {route.delayMinutes > 0 ? `(+${route.delayMinutes}m)` : ''}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setIsCreatingTransit(false);
                                setEditingTransit({ ...route });
                              }}
                              className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransit(route.id, route.identifier)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Travel Advisories Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Official Travel Advisories ({travelAdvisories.length})
              </h3>
              <button
                onClick={() => {
                  setIsCreatingAdvisory(true);
                  setEditingAdvisory({
                    id: `adv-${Date.now()}`,
                    region: 'Northern Plains',
                    severity: 'Moderate',
                    title: 'New Weather / Transit Alert',
                    message: 'Advisory notice description for travelers.',
                    validUntil: 'Current Season',
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg whitespace-nowrap shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Travel Advisory</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {travelAdvisories.map((adv) => (
                <div
                  key={adv.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2 text-xs relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">{adv.region}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700">
                      {adv.severity}
                    </span>
                  </div>
                  <h4 className="font-bold text-neutral-900 dark:text-neutral-100">{adv.title}</h4>
                  <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                    {adv.message}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-[10px] text-neutral-400">Valid: {adv.validUntil}</span>
                    <button
                      onClick={() => handleDeleteAdvisory(adv.id)}
                      className="text-red-500 hover:text-red-700 text-[11px] font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: EMERGENCY HELPLINES & HOSPITALS UPDATE PANEL                    */}
      {/* ========================================================================= */}
      {activeModule === 'emergency' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                National Helplines ({emergencyContacts.length})
              </h3>
              <button
                onClick={() => {
                  setIsCreatingHelpline(true);
                  setEditingHelpline({
                    id: `sos-${Date.now()}`,
                    service: 'New Emergency Service',
                    number: '112',
                    availableHours: '24x7',
                    description: 'Emergency response service description',
                    tollFree: true,
                    priority: 'Helpline',
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Helpline</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-black text-neutral-900 dark:text-neutral-100">
                      {contact.number}
                    </span>
                    <button
                      onClick={() => handleDeleteHelpline(contact.id)}
                      className="text-red-500 hover:text-red-700 text-[11px]"
                    >
                      Delete
                    </button>
                  </div>
                  <h4 className="font-bold text-neutral-900 dark:text-neutral-100">{contact.service}</h4>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">{contact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: COMMUNITY FORUM MODERATION PANEL                                */}
      {/* ========================================================================= */}
      {activeModule === 'forum' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Community Posts & Reviews Moderation ({forumPosts.length})
            </h3>
            <span className="text-xs text-neutral-400">
              Delete inappropriate reviews or scam reports
            </span>
          </div>

          <div className="space-y-3">
            {forumPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">{post.author}</span>
                    <span>·</span>
                    <span>{post.state}</span>
                    <span>·</span>
                    <span className="text-amber-600 dark:text-amber-400">{post.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{post.title}</h4>
                  <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">{post.content}</p>
                </div>

                <button
                  onClick={() => handleDeletePost(post.id, post.title)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg hover:bg-red-100 shrink-0"
                >
                  Delete Post
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 6: SYSTEM BACKUP & RESTORE PANEL                                   */}
      {/* ========================================================================= */}
      {activeModule === 'system' && (
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Platform Data Synchronization & Backup
            </h3>
            <p className="text-neutral-500 mt-1">
              Export your modified destinations, culinary catalogs, and transit schedules as a JSON archive, or restore the baseline state.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-3">
              <Download className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100">Export Snapshot</h4>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Download a JSON file containing all active destinations, food items, and timetables.
                </p>
              </div>
              <button
                onClick={handleExportJSON}
                className="w-full py-2 px-3 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
              >
                Download JSON Backup
              </button>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-3">
              <Upload className="w-5 h-5 text-sky-500" />
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100">Import Data</h4>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Load an external JSON backup file to instantly update all platform catalogs.
                </p>
              </div>
              <label className="block w-full py-2 px-3 font-bold text-center text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 rounded-lg cursor-pointer">
                Select JSON File
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>

            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 space-y-3">
              <RotateCcw className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-300">Reset Factory Defaults</h4>
                <p className="text-red-800/70 dark:text-red-400/80 text-[11px] mt-0.5">
                  Clear all customized admin modifications and reload original Indian data presets.
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Reset all catalogs to factory defaults? All custom additions will be cleared.')) {
                    onResetFactoryDefaults();
                    showToast('Platform reset to factory baseline defaults.');
                  }
                }}
                className="w-full py-2 px-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DESTINATION EDIT / CREATE MODAL                                          */}
      {/* ========================================================================= */}
      {editingDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {isCreatingDestination ? 'Create New Destination' : `Edit "${editingDestination.name}"`}
              </h3>
              <button onClick={() => setEditingDestination(null)} className="p-1 text-neutral-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveDestination(editingDestination);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Destination Name *</label>
                  <input
                    type="text"
                    required
                    value={editingDestination.name}
                    onChange={(e) => setEditingDestination({ ...editingDestination, name: e.target.value })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={editingDestination.city}
                    onChange={(e) => setEditingDestination({ ...editingDestination, city: e.target.value })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={editingDestination.state}
                    onChange={(e) => setEditingDestination({ ...editingDestination, state: e.target.value })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Region *</label>
                  <select
                    value={editingDestination.region}
                    onChange={(e) => setEditingDestination({ ...editingDestination, region: e.target.value as IndianRegion })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="West">West</option>
                    <option value="East">East</option>
                    <option value="North-East">North-East</option>
                    <option value="Central">Central</option>
                    <option value="Himalayas">Himalayas</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={editingDestination.category}
                    onChange={(e) => setEditingDestination({ ...editingDestination, category: e.target.value as DestinationCategory })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="Heritage">Heritage</option>
                    <option value="Nature & Wildlife">Nature & Wildlife</option>
                    <option value="Spiritual">Spiritual</option>
                    <option value="Beach & Island">Beach & Island</option>
                    <option value="Adventure & Hills">Adventure & Hills</option>
                    <option value="Palaces & Forts">Palaces & Forts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editingDestination.coordinates.lat}
                    onChange={(e) =>
                      setEditingDestination({
                        ...editingDestination,
                        coordinates: { ...editingDestination.coordinates, lat: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={editingDestination.coordinates.lng}
                    onChange={(e) =>
                      setEditingDestination({
                        ...editingDestination,
                        coordinates: { ...editingDestination.coordinates, lng: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingDestination.image}
                  onChange={(e) => setEditingDestination({ ...editingDestination, image: e.target.value })}
                  className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  value={editingDestination.summary}
                  onChange={(e) => setEditingDestination({ ...editingDestination, summary: e.target.value })}
                  className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Indian Citizen Fee (₹ INR)</label>
                  <input
                    type="number"
                    value={editingDestination.entryFee.indianCitizen}
                    onChange={(e) =>
                      setEditingDestination({
                        ...editingDestination,
                        entryFee: { ...editingDestination.entryFee, indianCitizen: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Foreign Tourist Fee (₹ INR)</label>
                  <input
                    type="number"
                    value={editingDestination.entryFee.foreignNational}
                    onChange={(e) =>
                      setEditingDestination({
                        ...editingDestination,
                        entryFee: { ...editingDestination.entryFee, foreignNational: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingDestination(null)}
                  className="px-4 py-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded">
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FOOD EDIT / CREATE MODAL                                                 */}
      {/* ========================================================================= */}
      {editingFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {isCreatingFood ? 'Add Regional Culinary Dish' : `Edit "${editingFood.name}"`}
              </h3>
              <button onClick={() => setEditingFood(null)} className="p-1 text-neutral-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveFood(editingFood);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editingFood.name}
                  onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
                  className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={editingFood.state}
                    onChange={(e) => setEditingFood({ ...editingFood, state: e.target.value })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Dietary Category</label>
                  <select
                    value={editingFood.dietary}
                    onChange={(e) => setEditingFood({ ...editingFood, dietary: e.target.value as any })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Jain Friendly">Jain Friendly</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingFood.description}
                  onChange={(e) => setEditingFood({ ...editingFood, description: e.target.value })}
                  className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Famous Spots (Comma Separated)</label>
                <input
                  type="text"
                  value={editingFood.famousSpots.join(', ')}
                  onChange={(e) =>
                    setEditingFood({
                      ...editingFood,
                      famousSpots: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingFood(null)}
                  className="px-4 py-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded">
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TRANSIT EDIT / CREATE MODAL                                              */}
      {/* ========================================================================= */}
      {editingTransit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {isCreatingTransit ? 'Create Transit Route' : `Edit Route "${editingTransit.identifier}"`}
              </h3>
              <button onClick={() => setEditingTransit(null)} className="p-1 text-neutral-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveTransit(editingTransit);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Transit Type</label>
                  <select
                    value={editingTransit.type}
                    onChange={(e) => setEditingTransit({ ...editingTransit, type: e.target.value as any })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="Train">Train (IRCTC)</option>
                    <option value="Metro">Metro</option>
                    <option value="Bus">Bus</option>
                    <option value="Flight">Flight</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Identifier (Number / Line) *</label>
                  <input
                    type="text"
                    required
                    value={editingTransit.identifier}
                    onChange={(e) => setEditingTransit({ ...editingTransit, identifier: e.target.value })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Route Name *</label>
                <input
                  type="text"
                  required
                  value={editingTransit.name}
                  onChange={(e) => setEditingTransit({ ...editingTransit, name: e.target.value })}
                  className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Origin Station *</label>
                  <input
                    type="text"
                    required
                    value={editingTransit.origin}
                    onChange={(e) => setEditingTransit({ ...editingTransit, origin: e.target.value })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Destination Station *</label>
                  <input
                    type="text"
                    required
                    value={editingTransit.destination}
                    onChange={(e) => setEditingTransit({ ...editingTransit, destination: e.target.value })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Departure</label>
                  <input
                    type="text"
                    value={editingTransit.departureTime}
                    onChange={(e) => setEditingTransit({ ...editingTransit, departureTime: e.target.value })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Arrival</label>
                  <input
                    type="text"
                    value={editingTransit.arrivalTime}
                    onChange={(e) => setEditingTransit({ ...editingTransit, arrivalTime: e.target.value })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={editingTransit.status}
                    onChange={(e) => setEditingTransit({ ...editingTransit, status: e.target.value as any })}
                    className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  >
                    <option value="On Time">On Time</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Departed">Departed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingTransit(null)}
                  className="px-4 py-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded">
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
