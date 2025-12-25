'use client';
import { useState, useEffect } from 'react';
import { CircusButton, CircusCard, LoadingState } from '@/components/ui';
import { CheckCircle2, AlertCircle, Clock } from '@/components/ui/lucide-icons';

type HealthCheckResponse = {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
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

export default function AdminPage() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(30000); // milliseconds, 0 = disabled

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/health');
      if (!response.ok) {
        throw new Error('Failed to fetch health status');
      }
      const data = await response.json();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    if (refreshInterval === 0) return; // Disabled
    const interval = setInterval(fetchHealth, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading && !health) {
    return <LoadingState message="Loading health status..." />;
  }

  if (error && !health) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CircusCard>
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Status</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        </CircusCard>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CircusCard>
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">No Data</h2>
            <p className="text-muted-foreground">Unable to load health status</p>
          </div>
        </CircusCard>
      </div>
    );
  }

  const getStatusColor = (status: 'healthy' | 'unhealthy') => status === 'healthy' ? 'text-[#51cf66]' : 'text-destructive';
  const getStatusIcon = (status: 'healthy' | 'unhealthy') => status === 'healthy' ? (
                <CheckCircle2 className={`w-6 h-6 ${getStatusColor('healthy')}`} />
              ) : (
                <AlertCircle className={`w-6 h-6 ${getStatusColor('unhealthy')}`} />
              );
  const statusColor = getStatusColor(health.status);
  const statusBgColor = 'border bg-card';

  const getDependencyCard = (name: string, type: string, props : {
      status: 'healthy' | 'unhealthy';
      message: string;
      responseTime?: number;
    }) => {
    return (  
      <CircusCard>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{name}</h3>
                <p className="text-sm text-muted-foreground">{type}</p>
              </div>
              {getStatusIcon(props.status)}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">Status</p>
                <p
                  className={`text-sm ${getStatusColor(props.status)} font-bold`}
                >
                  {props.status === 'healthy' ? '✓ Connected' : '✗ Disconnected'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">Message</p>
                <p className="text-sm text-muted-foreground">{props.message}</p>
              </div>

              {props.responseTime !== undefined && (
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Response Time
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {props.responseTime}ms
                  </p>
                </div>
              )}
            </div>
          </div>
        </CircusCard>
  );}

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Application health and status information</p>
      </div>

      {/* Overall Status */}
      <div className={`rounded-lg border mb-8 p-6 ${statusBgColor}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {health.status === 'healthy' ? (
              <CheckCircle2 className={`w-8 h-8 ${statusColor}`} />
            ) : (
              <AlertCircle className={`w-8 h-8 ${statusColor}`} />
            )}
            <div>
              <h2 className="text-xl font-semibold text-foreground capitalize">
                System {health.status === 'healthy' ? 'Healthy' : 'Experiencing Issues'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Last checked: {new Date(health.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center mr-2">
              <label htmlFor="refresh-interval" className="text-xs font-small text-muted-foreground">
                Auto-refresh
              </label>
              <select
                id="refresh-interval"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="px-3 py-1 bg-background border border-input rounded-md text-xs text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="0">Disable</option>
                <option value="30000">30 sec</option>
                <option value="60000">60 sec</option>
                <option value="300000">5 mins</option>
              </select>
            </div>
            <CircusButton 
              action={fetchHealth} 
              disabled={loading}
              text={loading ? 'Refreshing...' : 'Refresh'}
            />
          </div>
        </div>
      </div>

      {/* Health Checks Grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Database */}
        {getDependencyCard('Database', 'PostgreSQL Connection', health.checks.database)}

        {/* GymMaster API */}
        {getDependencyCard('GymMaster API', 'External Service Connection', health.checks.gymmaster)}
      </div>
    </div>
  );
}
