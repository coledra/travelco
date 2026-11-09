import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { ItineraryPlanner } from './components/ItineraryPlanner';
import { DestinationsCatalog } from './components/DestinationsCatalog';
import { WeatherForecast } from './components/WeatherForecast';
import { RegionalFoodGuide } from './components/RegionalFoodGuide';
import { LiveTransitTracker } from './components/LiveTransitTracker';
import { OfflineMapCenter } from './components/OfflineMapCenter';
import { EmergencySupport } from './components/EmergencySupport';
import { CommunityForum } from './components/CommunityForum';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { POPULAR_ORIGIN_CITIES } from './data/destinationsData';
import {
  UserTrip,
  IndianOriginCity,
  MedicalEmergencyProfile,
  ForumPost,
  TouristPlace,
  ActivityItem,
  RegionalFood,
  TransitRoute,
  EmergencyContact,
} from './types/travel';
import { TravelAdvisory } from './data/transitData';
import { HospitalDirectoryEntry } from './data/emergencyData';
import {
  loadUserTrips,
  saveUserTrips,
  loadActiveTripId,
  saveActiveTripId,
  loadEmergencyProfile,
  saveEmergencyProfile,
  loadForumPosts,
  saveForumPosts,
  loadDownloadedPacks,
  saveDownloadedPacks,
  loadUserOriginCity,
  saveUserOriginCity,
  loadDestinationsData,
  saveDestinationsData,
  loadFoodData,
  saveFoodData,
  loadTransitData,
  saveTransitData,
  loadAdvisoriesData,
  saveAdvisoriesData,
  loadEmergencyContactsData,
  saveEmergencyContactsData,
  loadHospitalsData,
  saveHospitalsData,
  loadAdminAuth,
  saveAdminAuth,
  resetAllDataToDefaults,
} from './utils/offlineStorage';
import { WifiOff, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [locationToast, setLocationToast] = useState<string>('');

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => loadAdminAuth());
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);

  // Core application data states loaded from local storage for offline resilience & admin mutations
  const [allTrips, setAllTrips] = useState<UserTrip[]>(() => loadUserTrips());
  const [activeTripId, setActiveTripId] = useState<string>(() => loadActiveTripId());
  const [originCityId, setOriginCityId] = useState<string>(() => loadUserOriginCity());
  const [downloadedPacks, setDownloadedPacks] = useState<string[]>(() => loadDownloadedPacks());
  const [emergencyProfile, setEmergencyProfile] = useState<MedicalEmergencyProfile>(() => loadEmergencyProfile());
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => loadForumPosts());

  // Mutable datasets editable by Admin
  const [destinations, setDestinations] = useState<TouristPlace[]>(() => loadDestinationsData());
  const [foodItems, setFoodItems] = useState<RegionalFood[]>(() => loadFoodData());
  const [transitRoutes, setTransitRoutes] = useState<TransitRoute[]>(() => loadTransitData());
  const [travelAdvisories, setTravelAdvisories] = useState<TravelAdvisory[]>(() => loadAdvisoriesData());
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => loadEmergencyContactsData());
  const [hospitals, setHospitals] = useState<HospitalDirectoryEntry[]>(() => loadHospitalsData());

  // Derive active origin
  const selectedOrigin: IndianOriginCity =
    POPULAR_ORIGIN_CITIES.find((c) => c.id === originCityId) || POPULAR_ORIGIN_CITIES[0];

  // Derive active trip
  const currentTrip: UserTrip =
    allTrips.find((t) => t.id === activeTripId) || allTrips[0];

  // Sync theme to document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist state updates to offline localStorage
  useEffect(() => {
    saveUserTrips(allTrips);
  }, [allTrips]);

  useEffect(() => {
    saveActiveTripId(activeTripId);
  }, [activeTripId]);

  useEffect(() => {
    saveUserOriginCity(originCityId);
  }, [originCityId]);

  useEffect(() => {
    saveDownloadedPacks(downloadedPacks);
  }, [downloadedPacks]);

  useEffect(() => {
    saveEmergencyProfile(emergencyProfile);
  }, [emergencyProfile]);

  useEffect(() => {
    saveForumPosts(forumPosts);
  }, [forumPosts]);

  // Persist admin datasets
  useEffect(() => {
    saveDestinationsData(destinations);
  }, [destinations]);

  useEffect(() => {
    saveFoodData(foodItems);
  }, [foodItems]);

  useEffect(() => {
    saveTransitData(transitRoutes);
  }, [transitRoutes]);

  useEffect(() => {
    saveAdvisoriesData(travelAdvisories);
  }, [travelAdvisories]);

  useEffect(() => {
    saveEmergencyContactsData(emergencyContacts);
  }, [emergencyContacts]);

  useEffect(() => {
    saveHospitalsData(hospitals);
  }, [hospitals]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode((prev) => !prev);
  };

  const handleSelectTrip = (trip: UserTrip) => {
    setActiveTripId(trip.id);
    if (!allTrips.some((t) => t.id === trip.id)) {
      setAllTrips([...allTrips, trip]);
    }
  };

  const handleUpdateCurrentTrip = (updatedTrip: UserTrip) => {
    setAllTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  // As soon as location changes, reload every service based on the new location
  const handleSelectOrigin = (city: IndianOriginCity) => {
    setOriginCityId(city.id);
    setLocationToast(
      `TravelCo Engine re-centered on ${city.name}, ${city.state} · Distances, live transit, local gastronomy & weather refreshed.`
    );
    setTimeout(() => setLocationToast(''), 4500);
  };

  const handleTriggerSOS = () => {
    setActiveTab('emergency');
  };

  const handleTogglePackDownload = (packId: string) => {
    if (downloadedPacks.includes(packId)) {
      setDownloadedPacks(downloadedPacks.filter((id) => id !== packId));
    } else {
      setDownloadedPacks([...downloadedPacks, packId]);
    }
  };

  // Add place from catalog into current trip's day
  const handleAddPlaceToTrip = (place: TouristPlace, dayNumber: number) => {
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      placeId: place.id,
      title: place.name,
      timeSlot: place.timings.recommendedSlot.split(' ')[0] === 'Sunrise' ? '06:00 AM' : '09:30 AM',
      estimatedDuration: `${place.timings.avgDurationHours} hrs`,
      location: `${place.city}, ${place.state}`,
      category: place.category,
      costEstimate: place.entryFee.indianCitizen,
      notes: `Recommended slot: ${place.timings.recommendedSlot}. Peak crowd: ${place.timings.peakCrowdHours}. ${place.travelTips[0] || ''}`,
      isCompleted: false,
    };

    const updatedDays = currentTrip.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: [...day.activities, newActivity],
        };
      }
      return day;
    });

    handleUpdateCurrentTrip({ ...currentTrip, days: updatedDays });
  };

  // Forum actions
  const handleAddPost = (post: ForumPost) => {
    setForumPosts([post, ...forumPosts]);
  };

  const handleUpvotePost = (postId: string) => {
    setForumPosts(
      forumPosts.map((post) => {
        if (post.id !== postId) return post;
        const hasUpvoted = post.hasUserUpvoted;
        return {
          ...post,
          upvotes: hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
          hasUserUpvoted: !hasUpvoted,
        };
      })
    );
  };

  const handleAddComment = (postId: string, text: string, author: string) => {
    setForumPosts(
      forumPosts.map((post) => {
        if (post.id !== postId) return post;
        const newComment = {
          id: `c-${Date.now()}`,
          author,
          text,
          date: 'Just now',
        };
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...post.comments, newComment],
        };
      })
    );
  };

  // Admin authentication handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    saveAdminAuth(true);
    setShowAdminLoginModal(false);
    setActiveTab('admin');
    setLocationToast('Administrator session activated. Data Update Deck unlocked.');
    setTimeout(() => setLocationToast(''), 4000);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    saveAdminAuth(false);
    setActiveTab('landing');
    setLocationToast('Signed out of Admin Deck.');
    setTimeout(() => setLocationToast(''), 3000);
  };

  const handleResetFactoryDefaults = () => {
    resetAllDataToDefaults();
    setDestinations(loadDestinationsData());
    setFoodItems(loadFoodData());
    setTransitRoutes(loadTransitData());
    setTravelAdvisories(loadAdvisoriesData());
    setEmergencyContacts(loadEmergencyContactsData());
    setHospitals(loadHospitalsData());
    setForumPosts(loadForumPosts());
    setLocationToast('All system modules restored to factory baseline datasets.');
    setTimeout(() => setLocationToast(''), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        selectedOrigin={selectedOrigin}
        onSelectOrigin={handleSelectOrigin}
        onTriggerSOS={handleTriggerSOS}
        isOfflineMode={isOfflineMode}
        toggleOfflineMode={toggleOfflineMode}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        onOpenAdminPanel={() => setActiveTab('admin')}
      />

      {/* Global Location Reload Notification */}
      {locationToast && (
        <div className="sticky top-16 z-30 bg-amber-500 text-neutral-950 text-xs font-bold py-2 px-4 shadow-md flex items-center justify-center gap-2 transition-all">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{locationToast}</span>
        </div>
      )}

      {/* Offline Mode Alert Bar if active */}
      {isOfflineMode && (
        <div className="bg-amber-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>
            Offline Mode active: Serving cached maps, destination guides, offline emergency siren & local itineraries.
          </span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'landing' && (
          <LandingHero
            selectedOrigin={selectedOrigin}
            onSelectOrigin={handleSelectOrigin}
            onNavigateTab={setActiveTab}
            onLoadTrip={handleSelectTrip}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryPlanner
            currentTrip={currentTrip}
            allTrips={allTrips}
            onSelectTrip={handleSelectTrip}
            onUpdateTrip={handleUpdateCurrentTrip}
            onExplorePlaces={() => setActiveTab('destinations')}
          />
        )}

        {activeTab === 'destinations' && (
          <DestinationsCatalog
            origin={selectedOrigin}
            currentTrip={currentTrip}
            onAddPlaceToTrip={handleAddPlaceToTrip}
            destinations={destinations}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherForecast
            origin={selectedOrigin}
            destinations={destinations}
          />
        )}

        {activeTab === 'food' && (
          <RegionalFoodGuide
            origin={selectedOrigin}
            foodItems={foodItems}
          />
        )}

        {activeTab === 'transit' && (
          <LiveTransitTracker
            origin={selectedOrigin}
            transitRoutes={transitRoutes}
            travelAdvisories={travelAdvisories}
          />
        )}

        {activeTab === 'offline-map' && (
          <OfflineMapCenter
            origin={selectedOrigin}
            currentTrip={currentTrip}
            downloadedPacks={downloadedPacks}
            onTogglePackDownload={handleTogglePackDownload}
            isOfflineMode={isOfflineMode}
            toggleOfflineMode={toggleOfflineMode}
            destinations={destinations}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencySupport
            profile={emergencyProfile}
            onSaveProfile={setEmergencyProfile}
          />
        )}

        {activeTab === 'forum' && (
          <CommunityForum
            posts={forumPosts}
            onAddPost={handleAddPost}
            onUpvotePost={handleUpvotePost}
            onAddComment={handleAddComment}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            destinations={destinations}
            onUpdateDestinations={setDestinations}
            foodItems={foodItems}
            onUpdateFoodItems={setFoodItems}
            transitRoutes={transitRoutes}
            onUpdateTransitRoutes={setTransitRoutes}
            travelAdvisories={travelAdvisories}
            onUpdateAdvisories={setTravelAdvisories}
            emergencyContacts={emergencyContacts}
            onUpdateEmergencyContacts={setEmergencyContacts}
            hospitals={hospitals}
            onUpdateHospitals={setHospitals}
            forumPosts={forumPosts}
            onUpdateForumPosts={setForumPosts}
            onExitAdmin={() => setActiveTab('landing')}
            onLogoutAdmin={handleAdminLogout}
            onResetFactoryDefaults={handleResetFactoryDefaults}
          />
        )}
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Clean Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-xs text-neutral-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">TravelCo</span>
            <span aria-hidden="true">·</span>
            <span>Premier India Travel & Itinerary Platform</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">Hub: {selectedOrigin.name}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>National Emergency: 112</span>
            <span aria-hidden="true">·</span>
            <span>Tourist Helpline: 1363</span>
            <span aria-hidden="true">·</span>
            {isAdminLoggedIn ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Admin Control Deck
              </button>
            ) : (
              <button
                onClick={() => setShowAdminLoginModal(true)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                Admin Portal
              </button>
            )}
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              Production Build Ready
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
