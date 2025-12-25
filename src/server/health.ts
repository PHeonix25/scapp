'use server';

import { prisma } from '@/server/db';
import { gymMasterClient } from '@/lib/gymmaster/client';

export type HealthStatus = {
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  checks: {
    database: {
      status: 'healthy' | 'unhealthy';
      message: string;
      responseTime?: number;
    };
    gymmaster: {
      status: 'healthy' | 'unhealthy';
      message: string;
      responseTime?: number;
    };
  };
};

export async function getApplicationHealth(): Promise<HealthStatus> {
  const timestamp = new Date();
  const checks = {
    database: await checkDatabaseHealth(),
    gymmaster: await checkGymMasterHealth(),
  };

  const hasUnhealthy = checks.database.status === 'unhealthy' || checks.gymmaster.status === 'unhealthy';

  const status: 'healthy' | 'unhealthy' = hasUnhealthy ? 'unhealthy' : 'healthy';

  return {
    status,
    timestamp,
    checks,
  };
}

async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  responseTime?: number;
}> {
  const startTime = performance.now();
  try {
    // Try a simple query to check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = performance.now() - startTime;
    return {
      status: 'healthy',
      message: 'Database connection successful',
      responseTime: Math.round(responseTime),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function checkGymMasterHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  responseTime?: number;
}> {
  const startTime = performance.now();
  try {
    // Try to get companies as a simple health check
    await gymMasterClient.getCompanies();
    const responseTime = performance.now() - startTime;
    return {
      status: 'healthy',
      message: 'GymMaster API connection successful',
      responseTime: Math.round(responseTime),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `GymMaster API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
