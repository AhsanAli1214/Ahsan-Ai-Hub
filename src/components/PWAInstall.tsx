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
    // Check notification status
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('appinstalled event fired');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      
      // Delay toast to ensure it shows after any dialogs
      setTimeout(() => {
        toast({
          title: '✓ App Installed Successfully!',
          description: 'Ahsan Ai Hub is now installed as a native app on your device. You can find it in your app drawer.',
        });
      }, 500);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
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
          ✓ App Installed
        </Button>
      ) : showInstallPrompt ? (
        <Button
          onClick={handleInstallClick}
          size="sm"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md animate-pulse rounded-lg transition-all hover:scale-105 active:scale-95"
          title="Install Ahsan Ai Hub as a native app"
        >
          <Download className="h-4 w-4" />
          Install App
        </Button>
      ) : null}
    </div>
  );
}
