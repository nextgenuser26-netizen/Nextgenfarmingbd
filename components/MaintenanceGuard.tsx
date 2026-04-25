'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
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
    }
  };

  useEffect(() => {
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
  }, [maintenanceMode, isAdmin, pathname, router]);

  return <>{children}</>;
}
