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
          window.OneSignalDeferred.push(async function(OneSignal) {
            try {
              await OneSignal.init({
                appId: "8a693786-f992-42d3-adfb-56a230adcea5",
                safari_web_id: "web.onesignal.auto.123456789",
                notifyButton: {
                  enable: false
                },
                allowLocalhostAsSecureOrigin: true,
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
                      explanation: "Stay updated with the latest AI revolutionary tools and news."
                    },
                    unsubscribeEnabled: true
                  }
                }
              });

              // PWA Specific registration check
              if (window.matchMedia('(display-mode: standalone)').matches) {
                OneSignal.User.addTag("pwa_app", "true");
                const pushSubscription = OneSignal.User.PushSubscription;
                if (pushSubscription && pushSubscription.id) {
                  fetch('/api/onesignal/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      deviceId: pushSubscription.id,
                      deviceType: 5, // Web
                      identifier: pushSubscription.id 
                    })
                  }).catch(console.error);
                }
              }
            } catch (e) {
              console.error("OneSignal Init Error:", e);
            }
          });
        `}
      </Script>
    </>
  );
}
