import { createTRPCRouter } from '../trpc';
import { circusRouter } from './circus';
import { clubworxRouter } from './clubworx';

export const appRouter = createTRPCRouter({
  circus: circusRouter,
  clubworx: clubworxRouter,
  // Add other routers here as needed
});

// Export router type definition that can be used on the client
export type AppRouter = typeof appRouter;

// Create a caller function for server-side usage
export const { createCaller } = appRouter;
