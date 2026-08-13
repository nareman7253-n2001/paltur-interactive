import type {
  ActivityItem,
  DashboardSummary,
  TouristEvent,
  TouristSpot,
  TrafficReport,
} from '@workspace/api-client-react';

/**
 * The public demo defaults to mock mode until the production API is configured.
 * Set VITE_DATA_MODE=api to query the deployed backend instead.
 */
export const isMockMode = import.meta.env.VITE_DATA_MODE !== 'api';

export const mockDashboardSummary: DashboardSummary = {
  activeTrafficReports: 4,
  pendingWasteReports: 7,
  activeObstacles: 3,
  totalUsers: 1_284,
  totalPointsEarned: 42_650,
  touristSpotsNearby: 5,
  eventsThisWeek: 4,
  congestionScore: 62,
  ecoScore: 78,
};

export const mockTouristSpots: TouristSpot[] = [
  {
    id: 1,
    name: 'Al-Manara Square',
    category: 'culture',
    lat: 31.9038,
    lng: 35.2042,
    description: 'The civic heart of Ramallah, surrounded by cafés, galleries, and local shops.',
    crowdLevel: 'medium',
    hasTrafficWarning: true,
  },
  {
    id: 2,
    name: 'Old City Heritage Walk',
    category: 'heritage',
    lat: 31.9071,
    lng: 35.1999,
    description: 'A walkable route through heritage buildings and independent Palestinian artisans.',
    crowdLevel: 'low',
    hasTrafficWarning: false,
  },
  {
    id: 3,
    name: 'Rukab Ice Cream',
    category: 'market',
    lat: 31.9016,
    lng: 35.2068,
    description: 'A local favourite for traditional ice cream and a popular evening meeting point.',
    crowdLevel: 'high',
    hasTrafficWarning: true,
  },
];

export const mockTouristEvents: TouristEvent[] = [
  {
    id: 101,
    name: 'Ramallah Heritage Walk',
    venueId: 1,
    venueName: 'Al-Manara Square',
    startDate: '2026-08-20T16:30:00.000Z',
    endDate: '2026-08-20T18:30:00.000Z',
    category: 'culture',
    description: 'A guided evening walk through heritage sites, stories, and local businesses.',
    pointsReward: 75,
  },
  {
    id: 102,
    name: 'Community Clean-up Day',
    venueId: 2,
    venueName: 'Al-Irsal Street',
    startDate: '2026-08-22T07:30:00.000Z',
    endDate: '2026-08-22T10:30:00.000Z',
    category: 'community',
    description: 'Join local volunteers to keep public spaces clean and earn eco rewards.',
    pointsReward: 120,
  },
  {
    id: 103,
    name: 'Palestinian Crafts Market',
    venueId: 3,
    venueName: 'Ramallah Cultural Palace',
    startDate: '2026-08-24T12:00:00.000Z',
    endDate: '2026-08-24T19:00:00.000Z',
    category: 'market',
    description: 'Meet independent makers and discover handmade Palestinian products.',
    pointsReward: 50,
  },
];

export const mockTrafficReports: TrafficReport[] = [
  {
    id: 201,
    lat: 31.9056,
    lng: 35.2037,
    severity: 'high',
    description: 'Heavy congestion near the Al-Manara intersection during the evening peak.',
    status: 'active',
    createdAt: '2026-08-12T14:15:00.000Z',
    reporterUsername: 'Lina A.',
  },
  {
    id: 202,
    lat: 31.912,
    lng: 35.21,
    severity: 'medium',
    description: 'Temporary lane restriction due to road maintenance work.',
    status: 'active',
    createdAt: '2026-08-12T13:40:00.000Z',
    reporterUsername: 'Omar K.',
  },
];

export const mockActivityFeed: ActivityItem[] = [
  {
    id: 301,
    module: 'traffic',
    action: 'reported traffic congestion',
    description: 'Heavy congestion was reported near Al-Manara Square.',
    points: 15,
    username: 'Lina A.',
    createdAt: '2026-08-12T14:15:00.000Z',
  },
  {
    id: 302,
    module: 'waste',
    action: 'joined a clean-up event',
    description: 'The Al-Irsal community clean-up received a new volunteer.',
    points: 30,
    username: 'Ahmad S.',
    createdAt: '2026-08-12T13:45:00.000Z',
  },
  {
    id: 303,
    module: 'tourism',
    action: 'booked a heritage walk',
    description: 'A new reservation was made for the Ramallah Heritage Walk.',
    points: 75,
    username: 'Maya R.',
    createdAt: '2026-08-12T12:50:00.000Z',
  },
];
