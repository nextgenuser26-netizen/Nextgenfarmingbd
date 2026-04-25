'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, user } = useAuth();

  const PUBLIC_PATHS = ['/admin', '/login', '/maintenance', '/api'];

  useEffect(() => {
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setMaintenanceMode(data.settings?.maintenanceMode || false);
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    // Allow access to public paths
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
    if (isPublicPath) {
      return;
    }

    // If maintenance mode is enabled and user is not admin, redirect to maintenance page
    if (maintenanceMode && !isAdmin) {
      if (pathname !== '/maintenance') {
        router.push('/maintenance');
      }
    }
  }, [maintenanceMode, isAdmin, pathname, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
