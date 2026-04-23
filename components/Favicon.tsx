'use client';

import { useEffect } from 'react';

export default function Favicon() {
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.settings?.favicon) {
          // Update favicon
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.settings.favicon;
        }
      } catch (error) {
        console.error('Error fetching settings for favicon:', error);
      }
    };

    fetchSettings();
  }, []);

  return null;
}
