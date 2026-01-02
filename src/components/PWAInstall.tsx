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

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('beforeinstallprompt event fired - PWA is installable');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
      // Ensure the button is visible even if the state was dismissed before
      localStorage.setItem('pwa-install-available', 'true');
    };

    const handleInstallableEvent = (e: any) => {
      console.log('pwa-installable custom event captured');
      setDeferredPrompt(e.detail as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
      localStorage.setItem('pwa-install-available', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('pwa-installable', handleInstallableEvent);

    // Check if we should show the prompt immediately (e.g. from local storage)
    if (localStorage.getItem('pwa-install-available') === 'true' && !window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(true);
    }

    return () => {
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
