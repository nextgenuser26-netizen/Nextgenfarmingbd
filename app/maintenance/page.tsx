'use client';

import { useEffect, useState } from 'react';
import { Settings, RefreshCw, Mail, Phone } from 'lucide-react';

export default function MaintenancePage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-6">
              <Settings className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Site Under Maintenance
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {settings?.maintenanceMessage || 'We are currently under maintenance. Please check back later.'}
          </p>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-4">
              We're working hard to improve your experience. The site will be back online shortly.
            </p>
            
            {/* Contact Info */}
            {settings && (
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                {settings.contactEmail && (
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {settings.contactEmail}
                  </a>
                )}
                {settings.contactPhone && (
                  <a
                    href={`tel:${settings.contactPhone}`}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {settings.contactPhone}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Check Again
          </button>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {settings?.siteName || 'NextGen FarmingBD'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
