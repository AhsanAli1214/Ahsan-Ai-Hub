'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OneSignalButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const [hasNotificationSupport, setHasNotificationSupport] = useState(false);

  useEffect(() => {
    setIsProduction(typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'));
    setHasNotificationSupport('Notification' in window || 'serviceWorker' in navigator);
    
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
          setIsSubscribed(false);
        } else {
          const hasPermission = (window as any).OneSignal.Notifications.permission;
          if (!hasPermission || hasPermission === 'default') {
            await (window as any).OneSignal.Slidedown.promptPush();
          } else {
            await (window as any).OneSignal.User.pushSubscription.optIn();
          }
          setTimeout(checkSubscriptionStatus, 500);
        }
      } catch (error) {
        console.error('Error toggling subscription:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (!isProduction) {
      console.info('Push notifications only available on production');
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Button
        onClick={handleToggleSubscription}
        disabled={isLoading}
        className={cn(
          'w-full gap-3 transition-all duration-300 font-semibold py-6 text-base rounded-2xl',
          isSubscribed
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
        )}
        size="lg"
      >
        {isSubscribed ? (
          <>
            <CheckCircle2 className="h-5 w-5" />
            {isLoading ? 'Processing...' : 'Notifications Enabled ✓'}
          </>
        ) : (
          <>
            <Bell className="h-5 w-5" />
            {isLoading ? 'Processing...' : 'Enable Notifications'}
          </>
        )}
      </Button>
      
      {!hasNotificationSupport && (
        <div className="flex gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>Your browser doesn't support notifications. Try using Chrome or Edge.</p>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground leading-relaxed text-center">
        Get real-time updates about new features, important announcements, and personalized recommendations.
      </p>
    </div>
  );
}
