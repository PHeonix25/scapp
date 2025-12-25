import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { gymMasterClient } from '@/lib/gymmaster/client';

// Allow static HTML export to include this route's output during build.
// For `output: "export"` builds, Next requires either `dynamic = 'force-static'`
// or an explicit `revalidate` to be configured. The health route performs
// checks at build-time when exporting static HTML, so force-static is used
// to satisfy the exporter.
export const dynamic = 'force-static';
export const runtime = 'nodejs';

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

export async function GET() {
  try {
    const timestamp = new Date();
    const checks = {
      database: await checkDatabaseHealth(),
      gymmaster: await checkGymMasterHealth(),
    };

    const hasUnhealthy = checks.database.status === 'unhealthy' || checks.gymmaster.status === 'unhealthy';
    const status: 'healthy' | 'unhealthy' = hasUnhealthy ? 'unhealthy' : 'healthy';

    return NextResponse.json({
      status,
      timestamp: timestamp.toISOString(),
      checks,
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: {
            status: 'unhealthy',
            message: 'Failed to check database health',
          },
          gymmaster: {
            status: 'unhealthy',
            message: 'Failed to check GymMaster health',
          },
        },
      },
      { status: 500 }
    );
  }
}
