import axios, { type AxiosInstance, type AxiosRequestConfig, type Method, type AxiosError } from 'axios';
import config, { type GymMasterClientConfig } from '@/lib/gymmaster/config';

const debug = process.env.GYMMASTER_DEBUG;
const GYMMASTER_DEBUG = (debug === '1' || (typeof debug === 'string' && debug.toLowerCase() === 'true'));

import type {
  GymMasterMember,
  GymMasterClass,
  GymMasterClassSchedule,
  GymMasterClub,
  GymMasterMemberClassBooking,
  GymMasterMemberWaitlist,
  GymMasterMemberServiceBooking,
} from './types';

type MemberBookingsResponse = {
  classbookings: GymMasterMemberClassBooking[];
  classwaitlists: GymMasterMemberWaitlist[];
  servicebookings: GymMasterMemberServiceBooking[];
};

type LoginResult = {
  token?: string;
  expires?: number;
  memberid?: number | string;
};

// Some GymMaster endpoints return `{ result: T }` while others return `T` directly.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function extractResult<T>(response: { data: unknown }): T {
  const data = response.data;
  if (isRecord(data) && 'result' in data) {
    return (data as Record<string, unknown>)['result'] as T;
  }
  return data as T;
}

export class GymMasterClient {
  private _axios: AxiosInstance;
  private _config: GymMasterClientConfig;

  constructor(config: GymMasterClientConfig) {
    this._config = config;
    this._axios = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout ?? 5000,
      headers: config.requestHeaders,
    });
  }

  private async request<T>(
    method: Method,
    path: string,
    options?: { params?: Record<string, unknown>; data?: unknown; axiosConfig?: AxiosRequestConfig }
  ): Promise<T> {
    const redact = (obj: unknown) => {
      try {
        const s = JSON.stringify(obj, (k, v) => {
          if (k === 'api_key' || k === 'token') return '***REDACTED***';
          return v;
        });
        return JSON.parse(s);
      } catch {
        return obj;
      }
    };

    try {
      const params = {
        api_key: this._config.apiKey,
        ...(options?.params ?? {}),
      } as Record<string, unknown>;

      const reqConfig: AxiosRequestConfig = {
        method,
        url: path,
        params,
        data: options?.data,
        ...(options?.axiosConfig ?? {}),
      };

      const fullUri = this._axios.getUri({ url: path, params });

      if (GYMMASTER_DEBUG) console.debug('GymMaster API Request START', {
        method,
        fullUri,
        baseURL: this._axios.defaults.baseURL,
        headers: redact((reqConfig.headers ?? this._axios.defaults.headers) as unknown),
        params: redact(params),
        data: redact(options?.data),
      });

      const response = await this._axios.request(reqConfig);

      if (GYMMASTER_DEBUG) console.debug('GymMaster API Request SUCCESS', {
        method,
        fullUri,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
      });

      return extractResult<T>(response as { data: unknown });
    } catch (error) {
      const axiosError = error as AxiosError;
      const resp = axiosError?.response;
      const req = (axiosError?.config ?? {}) as AxiosRequestConfig;

      if (GYMMASTER_DEBUG) console.error('GymMaster API Request ERROR', {
        method,
        path,
        baseURL: this._axios.defaults.baseURL,
        request: {
          url: req?.url,
          method: req?.method,
          headers: redact(req?.headers),
          params: redact(req?.params),
          data: redact(req?.data),
        },
        response: {
          status: resp?.status,
          statusText: resp?.statusText,
          data: resp?.data,
          headers: resp?.headers,
        },
        message: axiosError?.message,
      });

      if (resp?.status === 500) {
        throw new Error('GymMaster API returned a server error (500). Please try again later.');
      }

      if (resp?.status === 401 || resp?.status === 403) {
        throw new Error('GymMaster API authentication failed. Please check your credentials.');
      }

      if (resp?.status === 404) {
        throw new Error('GymMaster API resource not found (404).');
      }

      if (axiosError?.code === 'ECONNABORTED') {
        throw new Error('GymMaster API request timed out. Please try again.');
      }

      if (axiosError?.message?.includes('Network Error')) {
        throw new Error('Unable to connect to GymMaster API. Please check your internet connection.');
      }

      const detail = resp?.data && typeof resp.data === 'object' ? JSON.stringify(resp.data).slice(0, 200) : resp?.data;
      throw new Error(`GymMaster API error: ${resp?.status || ''} ${resp?.statusText || ''} ${detail || axiosError?.message || 'Unknown error'}`);
    }
  }

  async getMembers(when?: string, companyid?: number): Promise<GymMasterMember[]> {
    return this.request<GymMasterMember[]>('GET', this._config.endpoints.members, {
      params: { when, companyid, page_size: this._config.defaultPageSize },
    });
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const params = new URLSearchParams();
    params.append('api_key', this._config.apiKey ?? '');
    params.append('email', email);
    params.append('password', password);
    const response = await this._axios.post(this._config.endpoints.login, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return extractResult<LoginResult>(response);
  }

  async getMemberProfile(): Promise<GymMasterMember> {
    return this.request<GymMasterMember>('GET', this._config.endpoints.memberProfile);
  }

  async getClassSchedule(
    week?: string,
    resourceid?: number,
    companyid?: number,
    classid?: number,
    staffid?: number
  ): Promise<GymMasterClassSchedule[]> {
    return this.request<GymMasterClassSchedule[]>('GET', this._config.endpoints.classSchedule, {
      params: { week, resourceid, companyid, classid, staffid },
    });
  }

  async getV2Classes(week?: string, token?: string): Promise<GymMasterClass[]> {
    return this.request<GymMasterClass[]>('GET', this._config.endpoints.v2Classes, {
      params: { week, token: token ?? null },
    });
  }

  async getCompanies(): Promise<GymMasterClub[]> {
    return this.request<GymMasterClub[]>('GET', this._config.endpoints.companies);
  }

  async getMemberBookings(): Promise<MemberBookingsResponse> {
    return this.request<MemberBookingsResponse>('GET', this._config.endpoints.v2MemberBookings);
  }

  async getClassAttendees(bookingId: number): Promise<string[]> {
    // endpoint: /v2/booking/classes/{bookingid}/attendees
    const path = `${this._config.endpoints.v2Classes}/${bookingId}/attendees`;
    return this.request<string[]>('GET', path);
  }
}

// Singleton factory
let clientInstance: GymMasterClient | null = null;
export const createGymMasterClient = (cfg: GymMasterClientConfig): GymMasterClient => {
  if (clientInstance) return clientInstance;
  clientInstance = new GymMasterClient(cfg);
  return clientInstance;
};

export const gymMasterClient = createGymMasterClient(config);
