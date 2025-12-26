'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Cloud, X } from 'lucide-react';

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
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Check notification status
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleNotificationClick = () => {
    if (typeof window !== 'undefined' && window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async function(OneSignal: any) {
        try {
          await OneSignal.Notifications.requestPermission();
          setNotificationsEnabled(Notification.permission === 'granted');
        } catch (e) {
          console.error('Notification error:', e);
        }
      });
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallPrompt(false);
        localStorage.setItem('pwa-installed', 'true');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  return (
    <div className="flex items-center gap-2">
      {!notificationsEnabled && (
        <Button
          onClick={handleNotificationClick}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-primary/30 hover:bg-primary/10 transition-all rounded-lg"
        >
          <Bell className="h-4 w-4 text-primary" />
          Enable Notifications
        </Button>
      )}

      {isInstalled ? (
        <Button disabled variant="outline" size="sm" className="rounded-lg opacity-60">
          App Installed
        </Button>
      ) : showInstallPrompt ? (
        <Button
          onClick={handleInstallClick}
          size="sm"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md animate-pulse rounded-lg"
        >
          <Cloud className="h-4 w-4" />
          Install App
        </Button>
      ) : (
        <Button disabled variant="ghost" size="sm" className="text-muted-foreground/50">
          Install Not Available
        </Button>
      )}
    </div>
  );
}
