'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    OneSignal: any;
  }
}

export function OneSignalButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupported, setIsSupported] = useState(true);
  const { toast } = useToast();

  const updateStatus = async () => {
    if (typeof window !== 'undefined' && window.OneSignal) {
      try {
        const isOptedIn = await window.OneSignal.User.PushSubscription.optedIn;
        setIsSubscribed(isOptedIn);
      } catch (err) {
        console.error('Error getting notification status:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!('Notification' in window)) {
        setIsSupported(false);
        setIsLoading(false);
        return;
      }

      const checkOneSignal = setInterval(async () => {
        if (window.OneSignal) {
          clearInterval(checkOneSignal);
          await updateStatus();
          window.OneSignal.Notifications.addEventListener('permissionChange', updateStatus);
        }
      }, 500);

      setTimeout(() => clearInterval(checkOneSignal), 5000);
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (!window.OneSignal) return;

    setIsLoading(true);
    try {
      if (isSubscribed) {
        await window.OneSignal.User.PushSubscription.optOut();
        toast({
          title: "Notifications Disabled",
          description: "You will no longer receive push notifications.",
        });
      } else {
        const permission = await window.OneSignal.Notifications.requestPermission();
        if (permission === 'granted') {
          await window.OneSignal.User.PushSubscription.optIn();
          toast({
            title: "Notifications Enabled",
            description: "You'll now receive updates and announcements.",
          });
        }
      }
      await updateStatus();
    } catch (err) {
      console.error('Error toggling notifications:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification settings.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <p>Your browser doesn't support notifications.</p>
      </div>
    );
  }

  return (
    <Button
      onClick={handleToggleNotifications}
      disabled={isLoading}
      className={cn(
        'w-full gap-3 transition-all duration-300 font-semibold py-6 text-base rounded-2xl',
        isSubscribed
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
      )}
      size="lg"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : isSubscribed ? (
        <>
          <CheckCircle2 className="h-5 w-5" />
          Notifications Enabled ✓
        </>
      ) : (
        <>
          <Bell className="h-5 w-5" />
          Enable Notifications
        </>
      )}
    </Button>
  );
}
