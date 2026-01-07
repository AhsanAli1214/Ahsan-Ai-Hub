'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export function PushifyScript() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Small delay to ensure browser is ready and doesn't block LCP
      const timer = setTimeout(() => {
        navigator.serviceWorker.register('/sw-pushify.js')
          .then(registration => {
            console.log('Pushify SW registered:', registration);
            // Request permission explicitly if needed, though Pushify script usually handles this
            if (Notification.permission === 'default') {
              Notification.requestPermission();
            }
          })
          .catch(error => {
            console.error('Pushify SW registration failed:', error);
          });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <Script 
        id="pushify-pixel"
        src="https://pushify.com/pixel/d8WKDcqdI1j1AD4k"
        strategy="afterInteractive"
      />
    </>
  );
}
