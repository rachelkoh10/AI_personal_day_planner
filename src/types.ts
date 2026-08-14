export type WalkingComfort = 'very_little' | 'some' | 'happy' | 'no_preference';

export type TimeAvailable = '30m' | '1h' | '2h' | '3h' | 'half_day' | 'full_day' | 'custom';

export type BudgetTier = 'free' | 'under_20' | 'under_50' | 'under_100' | 'custom';

export type GroupType = 'solo' | 'partner' | 'friends' | 'family' | 'children' | 'seniors';

export type ActivityCategory =
  | 'food'
  | 'nature'
  | 'shopping'
  | 'culture'
  | 'relaxing'
  | 'entertainment'
  | 'walking'
  | 'indoor'
  | 'outdoor'
  | 'family'
  | 'romantic'
  | 'photography';

export interface UserPreferences {
  location: string;
  lat?: number;
  lng?: number;
  timeAvailable: TimeAvailable;
  customTimeMinutes?: number;
  budgetTier: BudgetTier;
  customMaxBudget?: number;
  categories: ActivityCategory[];
  walkingComfort: WalkingComfort;
  groupType: GroupType;
  seniorGentleMode: boolean;
  indoorPreference?: boolean;
}

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description: string;
  locationName: string;
  area: string;
  coordinates: { lat: number; lng: number };
  estimatedCostMin: number;
  estimatedCostMax: number;
  durationMinutes: number;
  isIndoor: boolean;
  walkingDistanceMeters: number;
  seniorFriendly: boolean;
  wheelchairAccessible: boolean;
  openingHours: string;
  rating: number;
  imageUrl?: string;
  dataSources: string[];
}

export interface TransitLeg {
  mode: 'mrt' | 'bus' | 'walk' | 'taxi';
  details: string;
  durationMinutes: number;
  costEstimate: number;
}

export interface ItineraryItem {
  id: string;
  startTime: string;
  endTime: string;
  activity: Activity;
  transitToNext?: TransitLeg;
  tips?: string;
  indoorBackupPlan?: string;
}

export interface DataSourceAttribution {
  name: string;
  sourceType: 'NEA' | 'LTA' | 'OneMap' | 'data.gov.sg' | 'URA' | 'SingStat';
  lastUpdated: string;
  status: 'connected' | 'delayed' | 'unavailable';
  recordsRetrieved?: number;
}

export interface PlanReasoning {
  budgetExplanation: string;
  timeExplanation: string;
  walkingExplanation: string;
  weatherExplanation: string;
  overallSummary: string;
}

export interface TripPlan {
  id: string;
  title: string;
  createdAt: string;
  preferences: UserPreferences;
  items: ItineraryItem[];
  totalCostEstimate: number;
  totalDurationMinutes: number;
  walkingLevel: 'Low' | 'Moderate' | 'High';
  weatherStatus: 'Good' | 'Caution' | 'Rain Expected';
  weatherForecastText: string;
  reasoning: PlanReasoning;
  sources: DataSourceAttribution[];
  monitoringActive: boolean;
}

export interface AgentStep {
  id: string;
  timestamp: string;
  phase: 'Perception' | 'Data Retrieval' | 'Tool Call' | 'Reasoning' | 'Optimization' | 'Assembly' | 'Monitoring';
  toolName?: string;
  description: string;
  details?: Record<string, unknown>;
  status: 'pending' | 'success' | 'warning' | 'error';
}

export interface AccessibilitySettings {
  textSize: 'normal' | 'large' | 'extra-large';
  contrast: 'standard' | 'high-contrast';
  motion: 'normal' | 'reduced';
  displayMode: 'light' | 'dark' | 'high-contrast-dark';
  seniorEasyMode: boolean;
}

export type SubscriptionTier = 'free' | 'plus' | 'premium';

export interface UserSubscription {
  tier: SubscriptionTier;
  monthlyPlanLimit: number;
  plansUsedThisMonth: number;
  renewalDate: string;
  autonomousMonitoringEnabled: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeUsersToday: number;
  subscribers: {
    free: number;
    plus: number;
    premium: number;
  };
  revenueMonthly: {
    subscriptions: number;
    ads: number;
    affiliates: number;
    total: number;
  };
  agentMetrics: {
    plansGeneratedTotal: number;
    replansTriggered: number;
    monitoringActiveSessions: number;
    avgGenerationTimeMs: number;
  };
  dataSources: {
    name: string;
    type: string;
    status: 'connected' | 'delayed' | 'unavailable';
    latencyMs: number;
    lastChecked: string;
    recordsCount: number;
  }[];
}

export interface AdOffer {
  id: string;
  advertiserName: string;
  title: string;
  description: string;
  area: string;
  discountBadge: string;
  category: ActivityCategory;
  isSponsored: boolean;
  ctaText: string;
  ctaLink?: string;
}
