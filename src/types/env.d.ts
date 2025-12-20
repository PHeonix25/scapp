namespace NodeJS {
  export interface ProcessEnv {
    // Database
    DATABASE_URL: string;

    // Clubworx API
    CLUBWORX_API_BASE_URL: string;
    CLUBWORX_ACCOUNT_KEY: string;
    CLUBWORX_CONTACT_KEY: string;
    CLUBWORX_RATE_LIMIT: string;
    CLUBWORX_TIMEOUT: string;
  }
}
