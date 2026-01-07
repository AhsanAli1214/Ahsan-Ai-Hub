'use client';

import Script from 'next/script';

export function PushifyScript() {
  return (
    <Script 
      id="pushify-pixel"
      src="https://pushify.com/pixel/d8WKDcqdI1j1AD4k" 
      strategy="afterInteractive"
      defer
    />
  );
}
