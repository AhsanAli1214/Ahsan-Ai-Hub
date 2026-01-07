'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export function PushifyScript() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw-pushify.js')
          .then(registration => {
            console.log('Pushify SW registered:', registration);
          })
          .catch(error => {
            console.error('Pushify SW registration failed:', error);
          });
      });
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
