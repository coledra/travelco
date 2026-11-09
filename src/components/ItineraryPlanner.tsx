import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  MapPin,
  IndianRupee,
  Download,
  Share2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Printer,
  FileCheck,
  Building,
  Utensils,
  Train,
  TreePine,
  SunMedium,
} from 'lucide-react';
import { UserTrip, ItineraryDay, ActivityItem, DestinationCategory } from '../types/travel';
import { SAMPLE_ITINERARIES } from '../data/sampleItineraries';
import { TOURIST_DESTINATIONS } from '../data/destinationsData';

interface ItineraryPlannerProps {
  currentTrip: UserTrip;
  allTrips: UserTrip[];
  onSelectTrip: (trip: UserTrip) => void;
  onUpdateTrip: (trip: UserTrip) => void;
  onExplorePlaces: () => void;
}

export const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({
  currentTrip,
  allTrips,
  onSelectTrip,
  onUpdateTrip,
  onExplorePlaces,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [showAddActivityModal, setShowAddActivityModal] = useState<boolean>(false);
  const [showNewTripModal, setShowNewTripModal] = useState<boolean>(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string>('');

  // Form states for new activity
  const [newTitle, setNewTitle] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('09:00 AM');
  const [newDuration, setNewDuration] = useState('2.0 hrs');
  const [newLocation, setNewLocation] = useState('');
  const [newCategory, setNewCategory] = useState<DestinationCategory | 'Food & Dining' | 'Transit' | 'Leisure'>('Heritage');
  const [newCost, setNewCost] = useState('200');
  const [newNotes, setNewNotes] = useState('');

  // Form state for new trip
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripOrigin, setNewTripOrigin] = useState('New Delhi');
  const [newTripBudget, setNewTripBudget] = useState('30000');
  const [newTripDaysCount, setNewTripDaysCount] = useState(3);

  const activeDay: ItineraryDay | undefined = currentTrip.days[activeDayIndex] || currentTrip.days[0];

  // Calculate totals
  const totalTripCost = currentTrip.days.reduce((acc, day) => {
    return acc + day.activities.reduce((dAcc, act) => dAcc + (act.costEstimate || 0), 0);
  }, 0);

  const totalActivitiesCount = currentTrip.days.reduce((acc, day) => acc + day.activities.length, 0);

  const handleToggleComplete = (dayIndex: number, actId: string) => {
    const updatedDays = currentTrip.days.map((day, dIdx) => {
      if (dIdx !== dayIndex) return day;
      return {
        ...day,
        activities: day.activities.map((act) =>
          act.id === actId ? { ...act, isCompleted: !act.isCompleted } : act
        ),
      };
    });
    onUpdateTrip({ ...currentTrip, days: updatedDays });
  };

  const handleDeleteActivity = (dayIndex: number, actId: string) => {
    const updatedDays = currentTrip.days.map((day, dIdx) => {
      if (dIdx !== dayIndex) return day;
      return {
        ...day,
        activities: day.activities.filter((act) => act.id !== actId),
      };
    });
    onUpdateTrip({ ...currentTrip, days: updatedDays });
  };

  const handleMoveActivity = (dayIndex: number, actIndex: number, direction: 'up' | 'down') => {
    const day = currentTrip.days[dayIndex];
    if (!day) return;
    const targetIndex = direction === 'up' ? actIndex - 1 : actIndex + 1;
    if (targetIndex < 0 || targetIndex >= day.activities.length) return;

    const newActivities = [...day.activities];
    const [moved] = newActivities.splice(actIndex, 1);
    newActivities.splice(targetIndex, 0, moved);

    const updatedDays = currentTrip.days.map((d, idx) =>
      idx === dayIndex ? { ...d, activities: newActivities } : d
    );
    onUpdateTrip({ ...currentTrip, days: updatedDays });
  };

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      title: newTitle.trim(),
      timeSlot: newTimeSlot,
      estimatedDuration: newDuration,
      location: newLocation.trim() || currentTrip.days[activeDayIndex]?.city || 'India',
      category: newCategory,
      costEstimate: parseFloat(newCost) || 0,
      notes: newNotes.trim(),
      isCompleted: false,
    };

    const updatedDays = currentTrip.days.map((d, idx) => {
      if (idx !== activeDayIndex) return d;
      return {
        ...d,
        activities: [...d.activities, newAct],
      };
    });

    onUpdateTrip({ ...currentTrip, days: updatedDays });
    setShowAddActivityModal(false);
    setNewTitle('');
    setNewNotes('');
    setSavedSuccessMsg('Activity added to itinerary.');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  const handleAddNewDay = () => {
    const nextDayNum = currentTrip.days.length + 1;
    const newDay: ItineraryDay = {
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum} Exploration`,
      city: currentTrip.destinationCities[0] || 'Explore City',
      activities: [],
    };
    onUpdateTrip({ ...currentTrip, days: [...currentTrip.days, newDay] });
    setActiveDayIndex(currentTrip.days.length);
  };

  const handleCreateNewTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Math.max(1, Math.min(14, newTripDaysCount));
    const generatedDays: ItineraryDay[] = Array.from({ length: count }, (_, i) => ({
      dayNumber: i + 1,
      title: `Day ${i + 1} Itinerary`,
      city: newTripOrigin,
      activities: [],
    }));

    const freshTrip: UserTrip = {
      id: `trip-${Date.now()}`,
      title: newTripTitle.trim() || 'Custom India Odyssey',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + count * 86400000).toISOString().split('T')[0],
      originCity: newTripOrigin,
      destinationCities: [newTripOrigin],
      budget: {
        totalTarget: parseFloat(newTripBudget) || 25000,
        currency: 'INR',
      },
      days: generatedDays,
    };

    onSelectTrip(freshTrip);
    setShowNewTripModal(false);
    setActiveDayIndex(0);
    setSavedSuccessMsg('New trip created!');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveOffline = () => {
    setSavedSuccessMsg('Trip saved locally. Available offline anytime!');
    setTimeout(() => setSavedSuccessMsg(''), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Trip Header & Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <span>Active Itinerary</span>
            <span aria-hidden="true">·</span>
            <span>{currentTrip.days.length} Days</span>
            <span aria-hidden="true">·</span>
            <span>Origin: {currentTrip.originCity}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
            {currentTrip.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              {currentTrip.startDate} to {currentTrip.endDate}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {currentTrip.destinationCities.join(' → ')}
            </span>
          </div>
        </div>

        {/* Action Buttons & Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Trip Picker Dropdown */}
          <select
            value={currentTrip.id}
            onChange={(e) => {
              const selected = allTrips.find((t) => t.id === e.target.value);
              if (selected) {
                onSelectTrip(selected);
                setActiveDayIndex(0);
              }
            }}
            className="px-3 py-1.5 text-xs font-medium bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            {allTrips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowNewTripModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Trip</span>
          </button>

          <button
            onClick={handlePrint}
            title="Print or export as PDF"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handleSaveOffline}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-md transition-colors shadow-xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Offline</span>
          </button>
        </div>
      </div>

      {savedSuccessMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded-lg flex items-center gap-2">
          <FileCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* Financial & Time Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Estimated Budget</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              ₹{totalTripCost.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              / ₹{currentTrip.budget.totalTarget.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Total Activities</span>
          <div className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
            {totalActivitiesCount} Planned
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Itinerary Span</span>
          <div className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
            {currentTrip.days.length} Days
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Offline Status</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cached in Storage</span>
          </div>
        </div>
      </div>

      {/* Day Selector Segmented Bar */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {currentTrip.days.map((day, idx) => (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                activeDayIndex === idx
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Day {day.dayNumber}: {day.city}
            </button>
          ))}
          <button
            onClick={handleAddNewDay}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-dashed border-neutral-300 dark:border-neutral-700 rounded-md hover:border-neutral-400 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3 h-3" />
            <span>Add Day</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddActivityModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-md transition-colors shadow-xs whitespace-nowrap shrink-0 ml-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stop</span>
        </button>
      </div>

      {/* Active Day Activities List */}
      {activeDay && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Day {activeDay.dayNumber}: {activeDay.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                <span>{activeDay.city}</span>
                <span aria-hidden="true">·</span>
                <span>{activeDay.activities.length} activities scheduled</span>
                <span aria-hidden="true">·</span>
                <span>
                  Order: Sunrise/Morning → Midday → Sunset → Night
                </span>
              </div>
            </div>

            <button
              onClick={onExplorePlaces}
              className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Browse Places in India</span>
            </button>
          </div>

          {activeDay.activities.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
              <Calendar className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                No activities planned for Day {activeDay.dayNumber} yet
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-4">
                Add attractions, regional food stops, transit connections, or browse curated tourist spots across India.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setShowAddActivityModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors"
                >
                  Add Custom Activity
                </button>
                <button
                  onClick={onExplorePlaces}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-800 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                >
                  Explore Places
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeDay.activities.map((activity, actIdx) => {
                const getCategoryIcon = () => {
                  switch (activity.category) {
                    case 'Food & Dining':
                      return <Utensils className="w-4 h-4 text-orange-500" />;
                    case 'Transit':
                      return <Train className="w-4 h-4 text-blue-500" />;
                    case 'Nature & Wildlife':
                      return <TreePine className="w-4 h-4 text-emerald-500" />;
                    case 'Spiritual':
                      return <SunMedium className="w-4 h-4 text-amber-500" />;
                    default:
                      return <Building className="w-4 h-4 text-indigo-500" />;
                  }
                };

                return (
                  <div
                    key={activity.id}
                    className={`flex items-start justify-between gap-3 p-4 rounded-lg border transition-all ${
                      activity.isCompleted
                        ? 'bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800/60 opacity-70'
                        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs'
                    }`}
                  >
                    {/* Left: Completion Checkbox & Category Icon */}
                    <button
                      onClick={() => handleToggleComplete(activeDayIndex, activity.id)}
                      className="mt-1 text-neutral-400 hover:text-amber-500 transition-colors"
                      title={activity.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <CheckCircle2
                        className={`w-5 h-5 ${
                          activity.isCompleted
                            ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950'
                            : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                      />
                    </button>

                    {/* Middle: Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          {activity.timeSlot}
                        </span>
                        <span className="text-xs text-neutral-400">({activity.estimatedDuration})</span>
                        <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                        <span className="flex items-center gap-1 text-xs text-neutral-500">
                          {getCategoryIcon()}
                          {activity.category}
                        </span>
                      </div>

                      <h4
                        className={`text-sm font-bold mt-1 ${
                          activity.isCompleted
                            ? 'line-through text-neutral-400 dark:text-neutral-500'
                            : 'text-neutral-900 dark:text-neutral-100'
                        }`}
                      >
                        {activity.title}
                      </h4>

                      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate">{activity.location}</span>
                      </div>

                      {activity.notes && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 bg-neutral-50 dark:bg-neutral-800/50 p-2 rounded-md">
                          {activity.notes}
                        </p>
                      )}
                    </div>

                    {/* Right: Cost & Controls */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold tabular-nums text-neutral-800 dark:text-neutral-200">
                        ₹{activity.costEstimate.toLocaleString('en-IN')}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveActivity(activeDayIndex, actIdx, 'up')}
                          disabled={actIdx === 0}
                          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 disabled:opacity-20"
                          title="Move earlier"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveActivity(activeDayIndex, actIdx, 'down')}
                          disabled={actIdx === activeDay.activities.length - 1}
                          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 disabled:opacity-20"
                          title="Move later"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(activeDayIndex, activity.id)}
                          className="p-1 text-neutral-400 hover:text-red-500 transition-colors ml-1"
                          title="Delete activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Add Activity to Day {activeDay?.dayNumber}
            </h3>

            <form onSubmit={handleAddActivitySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Activity / Attraction Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sunrise view at Taj Mahal East Gate"
                  className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="e.g. 06:00 AM"
                    className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="e.g. 2.5 hrs"
                    className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="Heritage">Heritage</option>
                    <option value="Nature & Wildlife">Nature & Wildlife</option>
                    <option value="Spiritual">Spiritual</option>
                    <option value="Beach & Island">Beach & Island</option>
                    <option value="Palaces & Forts">Palaces & Forts</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Transit">Transit</option>
                    <option value="Leisure">Leisure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Cost Estimate (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Specific Location / Address
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Dharmapuri, Forest Colony, Tajganj"
                  className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Practical Notes & Timing Advice
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Closed on Fridays. Buy tickets online to skip counter lines."
                  className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md"
                >
                  Save to Itinerary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Trip Modal */}
      {showNewTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Create New India Journey
            </h3>

            <form onSubmit={handleCreateNewTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Trip Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTripTitle}
                  onChange={(e) => setNewTripTitle(e.target.value)}
                  placeholder="e.g. Rajasthan Royal Palace Tour"
                  className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Origin City
                  </label>
                  <input
                    type="text"
                    value={newTripOrigin}
                    onChange={(e) => setNewTripOrigin(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={newTripDaysCount}
                    onChange={(e) => setNewTripDaysCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Budget Target (₹ INR)
                </label>
                <input
                  type="number"
                  value={newTripBudget}
                  onChange={(e) => setNewTripBudget(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono tabular-nums"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTripModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md"
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
