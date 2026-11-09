import { Coordinates } from '../types/travel';

/**
 * Calculates the great-circle distance between two coordinates in kilometers using Haversine formula
 */
export function calculateHaversineDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d);
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Estimates realistic road and transit travel time in India
 */
export function estimateTravelDetails(distanceKm: number): {
  roadKm: number;
  drivingTimeHours: number;
  drivingTimeString: string;
  recommendedMode: 'Flight' | 'Express Train' | 'Cab / Highway Drive' | 'Local Transit';
} {
  // Indian highway routing usually adds 18-28% over straight line
  const roadKm = Math.round(distanceKm * 1.22);

  // Average road speed in India considering tollways and state roads ~ 55 km/h
  const drivingTimeHours = parseFloat((roadKm / 55).toFixed(1));

  let drivingTimeString = '';
  const hours = Math.floor(drivingTimeHours);
  const minutes = Math.round((drivingTimeHours - hours) * 60);

  if (hours === 0) {
    drivingTimeString = `${minutes} mins`;
  } else if (minutes === 0) {
    drivingTimeString = `${hours} hrs`;
  } else {
    drivingTimeString = `${hours}h ${minutes}m`;
  }

  let recommendedMode: 'Flight' | 'Express Train' | 'Cab / Highway Drive' | 'Local Transit';
  if (distanceKm <= 50) {
    recommendedMode = 'Local Transit';
  } else if (distanceKm <= 350) {
    recommendedMode = 'Cab / Highway Drive';
  } else if (distanceKm <= 750) {
    recommendedMode = 'Express Train';
  } else {
    recommendedMode = 'Flight';
  }

  return {
    roadKm,
    drivingTimeHours,
    drivingTimeString,
    recommendedMode,
  };
}
