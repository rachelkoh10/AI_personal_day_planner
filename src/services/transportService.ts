import { TransitLeg } from '../types';

export function calculateTransitEstimate(
  fromArea: string,
  toArea: string,
  modePreference: 'mrt' | 'bus' | 'walk' | 'taxi' = 'mrt'
): TransitLeg {
  if (fromArea === toArea) {
    return {
      mode: 'walk',
      details: 'Short 5-min walk along covered sheltered walkway',
      durationMinutes: 5,
      costEstimate: 0,
    };
  }

  if (modePreference === 'mrt') {
    return {
      mode: 'mrt',
      details: 'Downtown Line / EW Line (1-2 stations, direct access)',
      durationMinutes: 12,
      costEstimate: 1.45,
    };
  }

  if (modePreference === 'bus') {
    return {
      mode: 'bus',
      details: 'LTA Bus Line 7, 12, or 175 (3 stops with covered bus bay)',
      durationMinutes: 15,
      costEstimate: 1.2,
    };
  }

  if (modePreference === 'taxi') {
    return {
      mode: 'taxi',
      details: 'Taxi / Ride-hailing ride (6-8 minutes via ECP / CTE)',
      durationMinutes: 8,
      costEstimate: 11.5,
    };
  }

  return {
    mode: 'walk',
    details: 'Paved flat pedestrian walk with benches along the route',
    durationMinutes: 18,
    costEstimate: 0,
  };
}
