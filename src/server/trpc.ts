import type { PrismaClient } from '@prisma/client';
import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { prisma } from './db';

// Context type
interface Context {
  // Add your context properties here
  user?: {
    id: string;
    role: string;
  };
  db: PrismaClient;
}

// Create context function for API routes
export const createTRPCContext = async () => {
  // TODO: Implement authentication logic here
  // For now, return a basic context with database connection
  return {
    db: prisma,
    user: undefined, // Will be populated when auth is implemented
  };
};

// If you need per-request context add its type inside <> and supply a createContext fn.
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const { router } = t;
export const publicProcedure = t.procedure;
export const createTRPCRouter = t.router;

// Protected procedure that checks if user is authenticated
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // user is now non-nullable in the ctx
    },
  });
});
