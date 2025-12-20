import axios, { type AxiosInstance } from 'axios';

import config, { type ClubworxClientConfig } from '@/lib/clubworx/config';

import type { ClubworxBooking, ClubworxEvent, ClubworxMember } from './types';

export class ClubworxClient {
  private _axios: AxiosInstance;
  private _config: ClubworxClientConfig;

  constructor(config: ClubworxClientConfig) {
    this._config = config;
    this._axios = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 5000,
      headers: config.requestHeaders,
    });
  }

  async getMembers(): Promise<ClubworxMember[]> {
    const response = await this._axios.get<ClubworxMember[]>(`/members`, {
      params: {
        account_key: this._config.accountKey,
        page: 4,
        page_size: this._config.defaultPageSize,
      },
    });
    //console.log('ℹ️ Members', response.data.length && response.data[0]);
    return response.data;
  }

  async getMembersSearch(query: string): Promise<ClubworxMember[]> {
    const response = await this._axios.get<ClubworxMember[]>(`/members`, {
      params: {
        account_key: this._config.accountKey,
        page: 1,
        page_size: this._config.defaultPageSize,
        search: query,
      },
    });
    // console.log("ℹ️ Search Results", response.data.length && response.data[0]);
    return response.data;
  }

  async getMember(contactKey: string): Promise<ClubworxMember> {
    const response = await this._axios.get<ClubworxMember>(
      `/members/${contactKey}`,
      {
        params: {
          account_key: this._config.accountKey,
        },
      }
    );
    // console.log('ℹ️ Member', response.data);
    return response.data;
  }

  async getClasses(start: Date, end: Date): Promise<ClubworxEvent[]> {
    const formatOptions = { timeZone: 'Australia/Sydney' };
    console.log(
      'ℹ️ Getting classes between',
      start.toLocaleDateString(['en-AU'], formatOptions),
      'and',
      end.toLocaleDateString(['en-AU'], formatOptions)
    );
    const response = await this._axios.get<ClubworxEvent[]>(`/events`, {
      params: {
        account_key: this._config.accountKey,
        contact_key: this._config.contactKey,
        event_starts_after: start.toLocaleDateString(['en-AU'], formatOptions),
        event_ends_before: end.toLocaleDateString(['en-AU'], formatOptions),
        page: 1,
        page_size: this._config.defaultPageSize,
      },
    });
    console.log('ℹ️ Classes returned', response.data.length);
    return response.data;
  }

  async getBookingsForEvent(eventId: string): Promise<ClubworxBooking[]> {
    // console.log('ℹ️ Getting bookings for event', eventId);
    const response = await this._axios.get<ClubworxBooking[]>(`/bookings`, {
      params: {
        account_key: this._config.accountKey,
        event_id: eventId,
      },
    });
    // console.log("ℹ️ Bookings for event", eventId, response.data);
    return response.data;
  }
}

// Create a singleton instance
let clientInstance: ClubworxClient | null = null;
export const createClubworxClient = (
  config: ClubworxClientConfig
): ClubworxClient => {
  if (clientInstance) return clientInstance;
  return (clientInstance = new ClubworxClient(config));
};

export const clubworxClient = createClubworxClient(config);
