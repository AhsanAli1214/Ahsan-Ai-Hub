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
        const isOptedOut = await window.OneSignal.User.PushSubscription.optedOut;
        const permission = await window.OneSignal.Notifications.permission;
        
        // Correct logic: Subscribed means optedIn is true AND optedOut is false AND permission is granted
        setIsSubscribed(isOptedIn && !isOptedOut && (permission === true || permission === 'granted'));
      } catch (err) {
        console.error("Status Update Error:", err);
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

      const initOneSignal = async () => {
        if (window.OneSignal) {
          await updateStatus();
          
          // Use correct event listeners for OneSignal v16+
          window.OneSignal.Notifications.addEventListener('permissionChange', updateStatus);
          
          // Ensure we also listen for subscription changes
          if (window.OneSignal.User && window.OneSignal.User.PushSubscription) {
             window.OneSignal.User.PushSubscription.addEventListener('change', updateStatus);
          }
        }
      };

      const checkOneSignal = setInterval(() => {
        if (window.OneSignal) {
          clearInterval(checkOneSignal);
          initOneSignal();
        }
      }, 500);

      setTimeout(() => clearInterval(checkOneSignal), 5000);
      
      return () => {
        if (window.OneSignal) {
          window.OneSignal.Notifications.removeEventListener('permissionChange', updateStatus);
        }
      };
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (!window.OneSignal) {
      toast({
        variant: "destructive",
        title: "OneSignal not loaded",
        description: "Please refresh the page and try again.",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isSubscribed) {
        await window.OneSignal.User.PushSubscription.optOut();
        toast({
          title: "Notifications Disabled",
          description: "You will no longer receive push notifications.",
        });
      } else {
        // OneSignal 16+ logic: PushSubscription.optIn() handles permission request if needed
        // but we can be explicit for better UX
        const permission = await window.OneSignal.Notifications.requestPermission();
        
        if (permission === 'granted' || permission === 'default') {
          await window.OneSignal.User.PushSubscription.optIn();
          // Verify if actually subscribed
          const isNowOptedIn = await window.OneSignal.User.PushSubscription.optedIn;
          if (isNowOptedIn) {
            toast({
              title: "Notifications Enabled",
              description: "You'll now receive updates and announcements.",
            });
          }
        } else if (permission === 'denied') {
          toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "Please enable notifications in your browser settings to stay updated.",
          });
        }
      }
      await updateStatus();
    } catch (err) {
      console.error("OneSignal Error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
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
    <div className="flex flex-col gap-2 min-h-[56px]">
      <Button
        onClick={handleToggleNotifications}
        disabled={isLoading}
        className={cn(
          'w-full gap-3 transition-all duration-300 font-semibold py-6 text-base rounded-2xl',
          isSubscribed
        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
        : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg shadow-primary/20'
        )}
        size="lg"
      >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isSubscribed ? (
        <>
          <CheckCircle2 className="h-5 w-5" />
          Notifications Active
        </>
      ) : (
        <>
          <Bell className="h-5 w-5" />
          Enable Notifications
        </>
      )}
    </Button>
  </div>
  );
}
