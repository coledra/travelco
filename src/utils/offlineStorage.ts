import {
  UserTrip,
  MedicalEmergencyProfile,
  ForumPost,
  TouristPlace,
  RegionalFood,
  TransitRoute,
  EmergencyContact,
} from '../types/travel';
import { SAMPLE_ITINERARIES } from '../data/sampleItineraries';
import { INITIAL_COMMUNITY_POSTS } from '../data/forumData';
import { TOURIST_DESTINATIONS } from '../data/destinationsData';
import { REGIONAL_FOOD_DATABASE } from '../data/foodData';
import { TRANSIT_ROUTES_DATABASE, CURRENT_TRAVEL_ADVISORIES, TravelAdvisory } from '../data/transitData';
import {
  EMERGENCY_CONTACTS,
  TOURIST_HOSPITALS_DIRECTORY,
  HospitalDirectoryEntry,
} from '../data/emergencyData';

const TRIPS_KEY = 'travelco_user_trips_v1';
const CURRENT_TRIP_ID_KEY = 'travelco_active_trip_id_v1';
const EMERGENCY_PROFILE_KEY = 'travelco_emergency_profile_v1';
const FORUM_POSTS_KEY = 'travelco_forum_posts_v1';
const OFFLINE_PACKS_KEY = 'travelco_downloaded_map_packs_v1';
const ORIGIN_CITY_KEY = 'travelco_user_origin_city_v1';

// Admin update keys
const DESTINATIONS_DATA_KEY = 'travelco_admin_destinations_v1';
const FOOD_DATA_KEY = 'travelco_admin_food_v1';
const TRANSIT_DATA_KEY = 'travelco_admin_transit_v1';
const ADVISORIES_DATA_KEY = 'travelco_admin_advisories_v1';
const EMERGENCY_CONTACTS_KEY = 'travelco_admin_emergency_v1';
const HOSPITALS_DATA_KEY = 'travelco_admin_hospitals_v1';
const ADMIN_AUTH_KEY = 'travelco_admin_session_v1';

export interface OfflineMapPack {
  id: string;
  name: string;
  state: string;
  sizeMb: number;
  downloadedAt: string;
  placesCount: number;
  transitOfflineCached: boolean;
}

export const AVAILABLE_MAP_PACKS: OfflineMapPack[] = [
  {
    id: 'pack-golden-triangle',
    name: 'Golden Triangle (Delhi, Agra & Jaipur)',
    state: 'North / West Hub',
    sizeMb: 18.4,
    downloadedAt: '',
    placesCount: 6,
    transitOfflineCached: true,
  },
  {
    id: 'pack-kerala',
    name: 'Kerala Backwaters & Coastal Belt (Kochi, Alleppey, Munnar)',
    state: 'Kerala',
    sizeMb: 14.8,
    downloadedAt: '',
    placesCount: 4,
    transitOfflineCached: true,
  },
  {
    id: 'pack-ladakh',
    name: 'Ladakh High Passes & Lakes (Leh, Pangong, Nubra)',
    state: 'Ladakh',
    sizeMb: 22.1,
    downloadedAt: '',
    placesCount: 3,
    transitOfflineCached: true,
  },
  {
    id: 'pack-varanasi-ganges',
    name: 'Varanasi Sacred Ghats & Eastern Circuit',
    state: 'Uttar Pradesh',
    sizeMb: 11.6,
    downloadedAt: '',
    placesCount: 3,
    transitOfflineCached: true,
  },
  {
    id: 'pack-goa-shores',
    name: 'Goa Coastal Shores & Konkan Belt',
    state: 'Goa',
    sizeMb: 12.3,
    downloadedAt: '',
    placesCount: 4,
    transitOfflineCached: true,
  },
];

export function loadUserTrips(): UserTrip[] {
  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load trips from storage', err);
  }
  // Initialize with sample itineraries
  saveUserTrips(SAMPLE_ITINERARIES);
  return SAMPLE_ITINERARIES;
}

export function saveUserTrips(trips: UserTrip[]): void {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error('Failed to save trips to storage', err);
  }
}

export function loadActiveTripId(): string {
  try {
    const id = localStorage.getItem(CURRENT_TRIP_ID_KEY);
    if (id) return id;
  } catch (e) {
    // fallback
  }
  return SAMPLE_ITINERARIES[0].id;
}

export function saveActiveTripId(id: string): void {
  try {
    localStorage.setItem(CURRENT_TRIP_ID_KEY, id);
  } catch (e) {
    // ignore
  }
}

export function loadEmergencyProfile(): MedicalEmergencyProfile {
  const defaultProfile: MedicalEmergencyProfile = {
    fullName: 'Alex Morgan',
    bloodGroup: 'O+',
    emergencyPhone1: '+91-98765-43210',
    emergencyPhone2: '+1-555-0199',
    allergies: 'Penicillin, Shellfish (Mild)',
    medicalConditions: 'Mild Asthma (Carries Inhaler)',
    insurancePolicyNo: 'TRAV-IND-2026-98124',
    embassyCountry: 'United States',
  };

  try {
    const raw = localStorage.getItem(EMERGENCY_PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return defaultProfile;
}

export function saveEmergencyProfile(profile: MedicalEmergencyProfile): void {
  try {
    localStorage.setItem(EMERGENCY_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    // ignore
  }
}

export function loadForumPosts(): ForumPost[] {
  try {
    const raw = localStorage.getItem(FORUM_POSTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return INITIAL_COMMUNITY_POSTS;
}

export function saveForumPosts(posts: ForumPost[]): void {
  try {
    localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    // ignore
  }
}

export function loadDownloadedPacks(): string[] {
  try {
    const raw = localStorage.getItem(OFFLINE_PACKS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  // Default: Golden Triangle downloaded for instant offline capability
  return ['pack-golden-triangle'];
}

export function saveDownloadedPacks(packIds: string[]): void {
  try {
    localStorage.setItem(OFFLINE_PACKS_KEY, JSON.stringify(packIds));
  } catch (e) {
    // ignore
  }
}

export function loadUserOriginCity(): string {
  try {
    const city = localStorage.getItem(ORIGIN_CITY_KEY);
    if (city) return city;
  } catch (e) {
    // ignore
  }
  return 'delhi';
}

export function saveUserOriginCity(cityId: string): void {
  try {
    localStorage.setItem(ORIGIN_CITY_KEY, cityId);
  } catch (e) {
    // ignore
  }
}

// ==================== ADMIN DATA MANAGEMENT HELPERS ====================

export function loadDestinationsData(): TouristPlace[] {
  try {
    const raw = localStorage.getItem(DESTINATIONS_DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return TOURIST_DESTINATIONS;
}

export function saveDestinationsData(data: TouristPlace[]): void {
  try {
    localStorage.setItem(DESTINATIONS_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export function loadFoodData(): RegionalFood[] {
  try {
    const raw = localStorage.getItem(FOOD_DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return REGIONAL_FOOD_DATABASE;
}

export function saveFoodData(data: RegionalFood[]): void {
  try {
    localStorage.setItem(FOOD_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export function loadTransitData(): TransitRoute[] {
  try {
    const raw = localStorage.getItem(TRANSIT_DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return TRANSIT_ROUTES_DATABASE;
}

export function saveTransitData(data: TransitRoute[]): void {
  try {
    localStorage.setItem(TRANSIT_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export function loadAdvisoriesData(): TravelAdvisory[] {
  try {
    const raw = localStorage.getItem(ADVISORIES_DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return CURRENT_TRAVEL_ADVISORIES;
}

export function saveAdvisoriesData(data: TravelAdvisory[]): void {
  try {
    localStorage.setItem(ADVISORIES_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export function loadEmergencyContactsData(): EmergencyContact[] {
  try {
    const raw = localStorage.getItem(EMERGENCY_CONTACTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return EMERGENCY_CONTACTS;
}

export function saveEmergencyContactsData(data: EmergencyContact[]): void {
  try {
    localStorage.setItem(EMERGENCY_CONTACTS_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export function loadHospitalsData(): HospitalDirectoryEntry[] {
  try {
    const raw = localStorage.getItem(HOSPITALS_DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return TOURIST_HOSPITALS_DIRECTORY;
}

export function saveHospitalsData(data: HospitalDirectoryEntry[]): void {
  try {
    localStorage.setItem(HOSPITALS_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export function loadAdminAuth(): boolean {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function saveAdminAuth(isAuth: boolean): void {
  try {
    if (isAuth) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  } catch (e) {
    // ignore
  }
}

export function resetAllDataToDefaults(): void {
  try {
    localStorage.removeItem(DESTINATIONS_DATA_KEY);
    localStorage.removeItem(FOOD_DATA_KEY);
    localStorage.removeItem(TRANSIT_DATA_KEY);
    localStorage.removeItem(ADVISORIES_DATA_KEY);
    localStorage.removeItem(EMERGENCY_CONTACTS_KEY);
    localStorage.removeItem(HOSPITALS_DATA_KEY);
    localStorage.removeItem(FORUM_POSTS_KEY);
  } catch (e) {
    // ignore
  }
}
