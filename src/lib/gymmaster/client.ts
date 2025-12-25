import axios, { type AxiosInstance, type AxiosRequestConfig, type Method } from 'axios';
import config, { type GymMasterClientConfig } from '@/lib/gymmaster/config';

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
    const params = { api_key: this._config.apiKey, token: this._config.token, ...(options?.params ?? {}) };
    const response = await this._axios.request({
      method,
      url: path,
      params,
      data: options?.data,
      ...(options?.axiosConfig ?? {}),
    });
    return extractResult<T>(response as { data: unknown });
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
      params: { week, token: token ?? this._config.token },
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
