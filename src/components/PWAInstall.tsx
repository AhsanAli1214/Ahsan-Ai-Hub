'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    OneSignalDeferred: any[];
  }
}

export function PWAInstall() {
  const { toast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check notification status
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleAppInstalled = () => {
      console.log('appinstalled event fired');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-available');
      
      setTimeout(() => {
        toast({
          title: '✓ App Installed!',
          description: 'Ahsan Ai Hub is now on your device. Open it from your app drawer.',
        });
      }, 300);
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('beforeinstallprompt event fired - PWA is installable');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
      // Ensure the button is visible even if the state was dismissed before
      localStorage.setItem('pwa-install-available', 'true');
    };

    const handleVibrate = () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    };

    const handleInstallableEvent = (e: any) => {
      console.log('pwa-installable custom event captured');
      setDeferredPrompt(e.detail as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
      localStorage.setItem('pwa-install-available', 'true');
    };

    // Advanced PWA: Wake Lock and Periodic Sync Request
    if ('wakeLock' in navigator || 'periodicSync' in (navigator as any).serviceWorker || 'sync' in (navigator as any).serviceWorker) {
      const requestPersistence = async () => {
        try {
          // Request Wake Lock if supported
          if ('wakeLock' in navigator) {
            await (navigator as any).wakeLock.request('screen');
          }
          
          // Request Periodic Sync permission
          const registration = await navigator.serviceWorker.ready;
          if ('periodicSync' in registration) {
            const status = await (navigator as any).permissions.query({
              name: 'periodic-background-sync',
            });
            if (status.state === 'granted') {
              await (registration as any).periodicSync.register('content-sync', {
                minInterval: 24 * 60 * 60 * 1000,
              });
              await (registration as any).periodicSync.register('ai-tip-update', {
                minInterval: 12 * 60 * 60 * 1000, // Update twice a day
              });
            }
          }
        } catch (err) {
          console.warn('Persistence features not fully supported:', err);
        }
      };

      requestPersistence();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          requestPersistence();
        }
      });
    }

    // Advanced PWA: Badge API Support
    if ('setAppBadge' in navigator) {
      window.addEventListener('app-badge-update', ((e: CustomEvent) => {
        const count = e.detail?.count;
        if (count !== undefined) {
          if (count > 0) {
            (navigator as any).setAppBadge(count).catch(() => {});
          } else {
            (navigator as any).clearAppBadge().catch(() => {});
          }
        }
      }) as EventListener);
    }

    return () => {
      window.removeEventListener('click', handleVibrate);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pwa-installable', handleInstallableEvent);
    };
  }, [toast]);

  const handleNotificationClick = () => {
    if (typeof window !== 'undefined' && window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async function(OneSignal: any) {
        try {
          await OneSignal.Notifications.requestPermission();
          setNotificationsEnabled(Notification.permission === 'granted');
        } catch (e) {
        }
      });
    }
  };

  const handleInstallClick = async () => {
    console.log('Install button clicked', !!deferredPrompt);
    if (!deferredPrompt) {
      toast({
        title: "Installation Ready",
        description: "The app is ready to install. Try again or use your browser's install option.",
      });
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        // Don't set isInstalled here - wait for appinstalled event
        setShowInstallPrompt(false);
        console.log('User accepted install prompt, waiting for appinstalled event');
      } else {
        console.log('User dismissed install prompt');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Installation error:', error);
    }
  };

  return null;
}
