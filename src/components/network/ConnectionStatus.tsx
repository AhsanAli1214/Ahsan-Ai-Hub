'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSlow, setIsSlow] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setShowStatus(true);

      if (!online) {
        toast({
          title: "Network Connection Lost",
          description: "You're currently offline. Some features may not work correctly.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Back Online",
          description: "Your connection has been restored.",
          variant: "default",
          className: "bg-green-600 text-white border-none",
        });
      }

      // Hide status indicator after 3 seconds if online
      if (online) {
        const timer = setTimeout(() => setShowStatus(false), 3000);
        return () => clearTimeout(timer);
      }
    };

    const checkNetworkSpeed = () => {
      // @ts-ignore - experimental API
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const updateSpeed = () => {
          const slow = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
          setIsSlow(slow);
          if (slow) {
            setShowStatus(true);
            toast({
              title: "Slow Connection Detected",
              description: "Your network speed is low. AI responses might take longer.",
              variant: "default",
              className: "bg-yellow-600 text-white border-none",
            });
          }
        };
        connection.addEventListener('change', updateSpeed);
        updateSpeed();
        return () => connection.removeEventListener('change', updateSpeed);
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    const cleanupSpeed = checkNetworkSpeed();

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (cleanupSpeed) cleanupSpeed();
    };
  }, [toast]);

  if (!showStatus && isOnline && !isSlow) return null;

  return (
    <div className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform",
      showStatus ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
    )}>
      <div className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-full shadow-2xl border backdrop-blur-md",
        !isOnline ? "bg-destructive/90 text-destructive-foreground border-destructive" :
        isSlow ? "bg-yellow-500/90 text-white border-yellow-600" :
        "bg-green-600/90 text-white border-green-700"
      )}>
        {!isOnline ? (
          <>
            <WifiOff className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">No Internet Connection</span>
          </>
        ) : isSlow ? (
          <>
            <AlertTriangle className="h-4 w-4 animate-bounce" />
            <span className="text-sm font-medium">Slow Network Connection</span>
          </>
        ) : (
          <>
            <Wifi className="h-4 w-4" />
            <span className="text-sm font-medium">Connection Restored</span>
          </>
        )}
      </div>
    </div>
  );
}
