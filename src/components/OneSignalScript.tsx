'use client';

import Script from 'next/script';

export function OneSignalScript() {
  return (
    <Script
      src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.OneSignal = window.OneSignal || [];
        window.OneSignal.push(() => {
          window.OneSignal.init({
            appId: "898a3b5a-c5c8-47e5-9d5a-c5c847e59d5a",
            safari_web_id: "web.onesignal.auto.123456789",
            notifyButton: {
              enable: false,
            },
            promptOptions: {
              customlink: {
                enabled: true,
                style: "button",
                size: "large",
                color: {
                  button: "#3b82f6",
                  text: "#ffffff"
                },
                text: {
                  subscribe: "Enable Notifications",
                  unsubscribe: "Disable Notifications",
                  explanation: "Stay updated with the latest AI revolutionary tools and news.",
                },
                unsubscribeEnabled: true,
              }
            }
          });
        });
      }}
    />
  );
}
