import { z } from 'zod';

import { clubworxClient } from '@/lib/clubworx/client';

import { createTRPCRouter, publicProcedure } from '../trpc';

export interface ApiResponse<T> {
  success: boolean;
  payload: T;
}

const callApi = async <T>(func: Promise<T>): Promise<ApiResponse<T>> => {
  try {
    const data = await func;
    const result = { success: true, payload: data as T };
    // console.log('!!API RESULT', result.success);
    return result;
  } catch (error) {
    console.error('Clubworx API error:', error);
    throw new Error('Failed to fetch data from Clubworx API');
  }
};

export const clubworxRouter = createTRPCRouter({
  getMembers: publicProcedure.query(
    async () => await callApi(clubworxClient.getMembers())
  ),

  getMembersSearch: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(
      async ({ input }) =>
        await callApi(clubworxClient.getMembersSearch(input.query))
    ),

  getMember: publicProcedure
    .input(z.object({ contactKey: z.string() }))
    .query(
      async ({ input }) =>
        await callApi(clubworxClient.getMember(input.contactKey))
    ),

  getClasses: publicProcedure
    .input(
      z
        .object({ from: z.date(), to: z.date() })
        .refine(data => data.from <= data.to, {
          message: "'from' date must be before or equal to 'to' date",
          path: ['from'],
        })
    )
    .query(
      async ({ input }) =>
        await callApi(clubworxClient.getClasses(input.from, input.to))
    ),

  getBookingsForEvent: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(
      async ({ input }) =>
        await callApi(clubworxClient.getBookingsForEvent(input.eventId))
    ),
});

export type ClubworxRouter = typeof clubworxRouter;
