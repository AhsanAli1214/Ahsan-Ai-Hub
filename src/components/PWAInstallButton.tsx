'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cloud, Download, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallButton({ className }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    
    // Check if already installed
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast({
        title: '✓ App Installed Successfully!',
        description: 'Ahsan AI Hub is now installed. You can launch it from your home screen or app drawer.',
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      // Check if the event was already fired before listener was attached
      // Some browsers (like Mobile Chrome) might fire it early
      if ('BeforeInstallPromptEvent' in window) {
        // Unfortunately there's no way to retroactively grab the event,
        // but removing the delay helps capture it if it fires during hydration
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: 'Installation Not Available',
        description: 'Your browser may not support PWA installation yet.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        toast({
          title: '✓ App Installation Started',
          description: 'Ahsan AI Hub will appear on your home screen shortly.',
        });
      } else {
        toast({
          title: 'Installation Cancelled',
          description: 'You can install the app anytime from your browser menu.',
        });
      }
    } catch (error) {
      toast({
        title: 'Installation Error',
        description: 'Please try again or use download APK option.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  if (isInstalled) {
    return (
      <Button
        disabled
        size="lg"
        className={cn("w-full bg-emerald-600 text-white shadow-lg py-6 text-base font-semibold rounded-2xl transition-all", className)}
      >
        <Cloud className="mr-2 h-5 w-5" />
        ✓ App Installed Successfully
      </Button>
    );
  }

  return (
    <div className={cn("w-full space-y-3", className)}>
      <Button
        onClick={handleInstallClick}
        disabled={isLoading || !deferredPrompt}
        size="lg"
        className={cn(
          "w-full font-black text-sm uppercase tracking-[0.2em] h-16 transition-all duration-300 rounded-2xl flex items-center justify-center gap-3 shadow-xl",
          !deferredPrompt
            ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5'
            : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 hover:scale-105 active:scale-95'
        )}
      >
        <Download className={cn("h-5 w-5", deferredPrompt && "animate-bounce")} />
        {isLoading ? 'Installing...' : 'Install App'}
      </Button>
      
      {!deferredPrompt && (
        <Card className="p-4 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-white/5 backdrop-blur-sm">
          <div className="flex gap-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <div className="text-blue-800 dark:text-blue-300">
              <p className="font-semibold mb-1">How to Install as Native App:</p>
              <ul className="space-y-1 text-xs opacity-90">
                <li>• <strong>Android Chrome:</strong> Look for "Install app" in address bar or menu (⋮)</li>
                <li>• <strong>Android Firefox:</strong> Tap menu → "Install" for full native app</li>
                <li>• <strong>Desktop Chrome/Edge:</strong> Click "Install Ahsan Ai Hub" button in address bar</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
