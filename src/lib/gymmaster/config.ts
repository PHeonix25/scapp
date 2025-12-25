/**
 * GymMaster API Endpoints
 */
export interface GymMasterEndpoints {
  members: string;
  memberProfile: string;
  login: string;
  companies: string;
  classSchedule: string;
  classSeats: string;
  v2Classes: string;
  v2MemberBookings: string;
  services: string;
  resourcesAndSessions: string;
  serviceBookings: string;
  equipment: string;
  rooms: string;
  memberships: string;
  products: string;
  promotions: string;
  settings: string;
  version: string;
  measurements: string;
}

export interface GymMasterClientConfig {
  baseUrl: string;
  apiKey?: string;
  token?: string;
  endpoints: GymMasterEndpoints;
  timeout: number;
  defaultPageSize: number;
  requestHeaders: Record<string, string>;
}

const defaultConfig: GymMasterClientConfig = {
  baseUrl: process.env.GYMMASTER_API_BASE_URL || 'https://www.gymmaster.com/portal/api',
  apiKey: process.env.GYMMASTER_API_KEY,
  token: process.env.GYMMASTER_TOKEN,
  endpoints: {
    members: '/v1/members',
    memberProfile: '/v1/member/profile',
    login: '/v1/login',
    companies: '/v1/companies',
    classSchedule: '/v1/booking/classes/schedule',
    classSeats: '/v1/booking/classes/seats',
    v2Classes: '/v2/booking/classes',
    v2MemberBookings: '/v2/member/bookings',
    services: '/v1/booking/services',
    resourcesAndSessions: '/v1/booking/resources_and_sessions',
    serviceBookings: '/v1/booking/servicebookings',
    equipment: '/v1/booking/servicebookings/equipment',
    rooms: '/v1/booking/servicebookings/rooms',
    memberships: '/v1/memberships',
    products: '/v2/products',
    promotions: '/v2/promotions',
    settings: '/v1/settings',
    version: '/v1/version',
    measurements: '/v2/member/measurements',
  },
  timeout: 10000,
  defaultPageSize: 20,
  requestHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': 'SocialCircusApp/1.0',
  },
};

export default defaultConfig;
