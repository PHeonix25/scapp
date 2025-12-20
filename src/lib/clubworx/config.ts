/**
 * Interface for Clubworx API endpoints
 */
export interface ClubworxEndpoints {
  // Member endpoints
  members: string;
  membersSearch: string;

  // Class endpoints
  classes: string;
  classInstances: string;

  // Booking and attendance
  bookings: string;
  attendance: string;

  // Skills and levels
  styles: string; // For skills/ranks

  // User management
  instructors: string;

  // Events and scheduling
  events: string;
  upcomingEvents: string;
}

/**
 * Clubworx API Configuration
 *
 * This configuration contains the base URL, authentication settings, and endpoint
 * definitions for the Clubworx API v2 integration.
 */
export interface ClubworxClientConfig {
  /** Base URL for Clubworx API v2 */
  baseUrl: string;

  /** Account key for API authentication */
  accountKey: string | undefined;

  /** Contact key for API authentication */
  contactKey: string | undefined;

  /** API Endpoints */
  endpoints: ClubworxEndpoints;

  /** Rate limiting (requests per second) */
  rateLimit: number;

  /** Request timeout (ms) */
  timeout: number;

  /** Default pagination */
  defaultPageSize: number;
  maxPageSize: number;

  /** Default request headers */
  requestHeaders: {
    'Content-Type': string;
    Accept: string;
    'User-Agent': string;
    'Accept-Encoding': string;
    'Cache-Control': string;
    Pragma: string;
    Expires: string;
  };
}

// Default configuration values
const defaultConfig: ClubworxClientConfig = {
  // Base URL for Clubworx API v2
  baseUrl:
    process.env.CLUBWORX_API_BASE_URL || 'https://app.clubworx.com/api/v2',

  // Authentication
  accountKey: process.env.CLUBWORX_ACCOUNT_KEY,
  contactKey: process.env.CLUBWORX_CONTACT_KEY,

  // API Endpoints
  endpoints: {
    // Member endpoints
    members: '/members',
    membersSearch: '/members/search',

    // Class endpoints
    classes: '/classes',
    classInstances: '/class-instances',

    // Booking and attendance
    bookings: '/bookings',
    attendance: '/attendance',

    // Skills and levels
    styles: '/styles', // For skills/ranks

    // User management
    instructors: '/instructors',

    // Events and scheduling
    events: '/events',
    upcomingEvents: '/events/upcoming',
  },

  // Rate limiting (requests per second)
  rateLimit: 2, // Clubworx typically allows 2 requests per second

  // Request timeout (ms)
  timeout: 10000,

  // Default pagination
  defaultPageSize: 20,
  maxPageSize: 100,

  // Default request headers
  requestHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': 'SocialCircusApp/1.0',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
};

export default defaultConfig;
