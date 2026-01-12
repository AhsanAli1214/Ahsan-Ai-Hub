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
                },
                welcomeNotification: {
                  disable: false,
                  title: "Welcome to Ahsan AI Hub!",
                  message: "You'll now receive revolutionary AI updates."
                }
              });

              // Enhanced PWA Permission & Registration logic
              const isPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
              
              if (isPWA) {
                OneSignal.User.addTag("pwa_app", "true");
                
                const pushSubscription = OneSignal.User.PushSubscription;
                
                // Automatically prompt for permission in PWA if not granted
                if (Notification.permission === 'default') {
                  setTimeout(async () => {
                    try {
                      await OneSignal.Notifications.requestPermission();
                    } catch (e) {
                      console.error("PWA auto-prompt error:", e);
                    }
                  }, 3000); // Small delay for better UX
                }
                
                const checkSubscription = async () => {
                  const currentSub = OneSignal.User.PushSubscription;
                  if (currentSub && currentSub.id) {
                    try {
                      await fetch('/api/onesignal/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          deviceId: currentSub.id,
                          deviceType: 5,
                          identifier: currentSub.id 
                        })
                      });
                    } catch (err) {
                      console.error("PWA registration fetch error:", err);
                    }
                  }
                };

                // Listen for subscription changes and permission changes
                OneSignal.User.PushSubscription.addEventListener("change", checkSubscription);
                checkSubscription();
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
