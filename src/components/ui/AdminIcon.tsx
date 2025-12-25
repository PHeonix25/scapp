
import Link from "next/link";
import { useEffect, useState } from "react";

export function AdminIcon() {
    const [systemHealth, setSystemHealth] = useState<'healthy' | 'unhealthy' | 'loading'>('loading');

      useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/admin/health');
        if (response.ok) {
          const data = await response.json();
          setSystemHealth(data.status);
        }
      } catch {
        setSystemHealth('unhealthy');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const getFillColor = () =>
    systemHealth === "unhealthy"
      ? "var(--destructive)"
      : "none";

  const getStrokeColor = () =>
    systemHealth === "unhealthy"
      ? "black"
      : "currentColor";
  
  return (
    <Link
      key="admin"
      href="/admin"
      className="mr-4 text-muted-foreground hover:text-foreground inline-flex items-center justify-center"
      title="Admin"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke={getStrokeColor()}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" fill={getFillColor()} />
        <circle cx="8" cy="10" r="1.5" />
        <circle cx="16" cy="10" r="1.5" />
        {/* Smile when healthy/loading, frown when unhealthy */}
        {(() => {
          const mouthPath =
            systemHealth === 'unhealthy'
              ? 'M8 17 C10 14, 14 14, 16 17'
              : 'M8 15 C10 18, 14 18, 16 15';
          return <path d={mouthPath} fill="none" />;
        })()}
      </svg>
      </Link>
    );
  }
