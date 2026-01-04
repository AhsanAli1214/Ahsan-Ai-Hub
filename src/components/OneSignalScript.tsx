'use client';

import Script from 'next/script';

export function OneSignalScript() {
  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
      />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "8a693786-f992-42d3-adfb-56a230adcea5",
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
        `}
      </Script>
    </>
  );
}
