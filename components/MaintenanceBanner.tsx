'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function MaintenanceBanner() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setMaintenanceMode(data.settings?.maintenanceMode || false);
      setMaintenanceMessage(data.settings?.maintenanceMessage || '');
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !maintenanceMode || !visible) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Maintenance Mode Active:</span> {maintenanceMessage}
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-amber-600 hover:text-amber-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
