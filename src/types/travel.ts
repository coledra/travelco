export type IndianRegion = 'North' | 'South' | 'West' | 'East' | 'North-East' | 'Central' | 'Himalayas';

export type DestinationCategory = 'Heritage' | 'Nature & Wildlife' | 'Spiritual' | 'Beach & Island' | 'Adventure & Hills' | 'Palaces & Forts' | 'Culture & City';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TouristPlace {
  id: string;
  name: string;
  city: string;
  state: string;
  region: IndianRegion;
  category: DestinationCategory;
  coordinates: Coordinates;
  image: string;
  summary: string;
  description: string;
  timings: {
    openTime: string;
    closeTime: string;
    closedDays: string[];
    recommendedSlot: 'Sunrise (06:00 - 08:30)' | 'Morning (08:30 - 12:00)' | 'Afternoon (12:00 - 15:30)' | 'Sunset / Evening (15:30 - 19:00)' | 'Night Illuminations (19:00 - 22:00)';
    avgDurationHours: number;
    peakCrowdHours: string;
  };
  entryFee: {
    indianCitizen: number; // in INR
    foreignNational: number; // in INR
    childFreeAgeLimit?: number;
    cameraFee?: number;
  };
  highlights: string[];
  travelTips: string[];
  weather: {
    currentTemp: number; // Celsius
    condition: string;
    aqi: number; // Air Quality Index
    humidity: number; // %
    bestMonths: string;
    rainChance: number; // %
    uvIndex: number;
  };
  signatureDishes: string[];
}

export interface ActivityItem {
  id: string;
  placeId?: string;
  title: string;
  timeSlot: string; // e.g., '07:30 AM'
  estimatedDuration: string; // e.g. '2 hrs'
  location: string;
  category: DestinationCategory | 'Food & Dining' | 'Transit' | 'Leisure';
  costEstimate: number; // in INR
  notes: string;
  isCompleted?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  date?: string;
  title: string;
  city: string;
  activities: ActivityItem[];
}

export interface UserTrip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  originCity: string;
  destinationCities: string[];
  days: ItineraryDay[];
  budget: {
    totalTarget: number;
    currency: string;
  };
}

export interface RegionalFood {
  id: string;
  name: string;
  region: IndianRegion;
  state: string;
  dietary: 'Pure Veg' | 'Jain Friendly' | 'Non-Veg' | 'Seafood' | 'Vegan';
  spiceLevel: 'Mild' | 'Medium' | 'Fiery Spicy';
  mealType: 'Breakfast' | 'Street Food' | 'Main Course' | 'Dessert & Beverage';
  description: string;
  keyIngredients: string[];
  famousSpots: string[];
  hygieneTip: string;
}

export interface TransitRoute {
  id: string;
  type: 'Train' | 'Metro' | 'Bus' | 'Flight';
  identifier: string; // e.g. "20901 Vande Bharat", "Yellow Line Metro"
  name: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  status: 'On Time' | 'Delayed' | 'Departed' | 'Scheduled' | 'Arrived';
  delayMinutes: number;
  platform?: string;
  frequency?: string;
  bookingTip: string;
}

export interface EmergencyContact {
  id: string;
  service: string;
  number: string;
  availableHours: string;
  description: string;
  tollFree: boolean;
  priority: 'Immediate SOS' | 'Helpline' | 'Transport & Police';
}

export interface MedicalEmergencyProfile {
  fullName: string;
  bloodGroup: string;
  emergencyPhone1: string;
  emergencyPhone2: string;
  allergies: string;
  medicalConditions: string;
  insurancePolicyNo?: string;
  embassyCountry?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  avatarSeed: string;
  date: string;
  state: string;
  category: 'Hidden Gems' | 'Solo Travel Tips' | 'Scam Alerts & Safety' | 'Foodie Trails' | 'Itinerary Review';
  content: string;
  upvotes: number;
  hasUserUpvoted?: boolean;
  tags: string[];
  commentsCount: number;
  comments: Array<{
    id: string;
    author: string;
    text: string;
    date: string;
  }>;
}

export interface IndianOriginCity {
  id: string;
  name: string;
  state: string;
  coordinates: Coordinates;
}
