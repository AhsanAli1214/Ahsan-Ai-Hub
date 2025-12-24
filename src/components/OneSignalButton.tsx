'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OneSignalButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    setIsProduction(typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'));
    
    if (typeof window !== 'undefined' && (window as any).OneSignal && isProduction) {
      setTimeout(() => {
        try {
          (window as any).OneSignal.Slidedown.onPromptClose(() => {
            checkSubscriptionStatus();
          });
          checkSubscriptionStatus();
        } catch (e) {
          console.log('OneSignal setup skipped in dev');
        }
      }, 1000);
    }
  }, [isProduction]);

  const checkSubscriptionStatus = async () => {
    if (typeof window !== 'undefined' && (window as any).OneSignal) {
      try {
        const isOptedIn = await (window as any).OneSignal.User.pushSubscription.optedIn;
        setIsSubscribed(isOptedIn);
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    }
  };

  const handleToggleSubscription = async () => {
    if (typeof window !== 'undefined' && (window as any).OneSignal) {
      setIsLoading(true);
      try {
        if (isSubscribed) {
          await (window as any).OneSignal.User.pushSubscription.optOut();
        } else {
          // If they haven't been prompted yet, show the prompt
          const hasPermission = (window as any).OneSignal.Notifications.permission;
          if (!hasPermission || hasPermission === 'default') {
             await (window as any).OneSignal.Slidedown.promptPush();
          } else {
             await (window as any).OneSignal.User.pushSubscription.optIn();
          }
        }
        // Small delay to let OneSignal update internal state
        setTimeout(checkSubscriptionStatus, 500);
      } catch (error) {
        console.error('Error toggling subscription:', error);
        alert('Failed to update notification settings. Please check your browser permissions.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Push notifications are only available on the live website.');
    }
  };

  return (
    <Button
      onClick={handleToggleSubscription}
      disabled={isLoading}
      variant={isSubscribed ? "outline" : "default"}
      className={`w-full gap-2 transition-all duration-300 ${
        isSubscribed
          ? 'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
      }`}
      size="lg"
    >
      <Bell className={cn("h-5 w-5", isSubscribed && "fill-current")} />
      {isLoading ? 'Processing...' : isSubscribed ? 'Disable Notifications' : 'Enable Notifications'}
    </Button>
  );
}
