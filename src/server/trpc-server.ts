import { prisma } from './db';
import { createCaller } from './routers/_app';

export const trpcServer = createCaller({
  db: prisma,
  user: undefined, // TODO: Implement authentication logic
});
