'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cloud, Download, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallButton() {
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
        description: 'You can now launch Ahsan AI Hub from your home screen.',
      });
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
        className="w-full bg-emerald-600 text-white shadow-lg py-6 text-base font-semibold rounded-2xl"
      >
        <Cloud className="mr-2 h-5 w-5" />
        ✓ App Installed Successfully
      </Button>
    );
  }

  return (
    <div className="w-full space-y-3">
      <Button
        onClick={handleInstallClick}
        disabled={isLoading || !deferredPrompt}
        size="lg"
        className={`w-full font-semibold text-base py-6 transition-all duration-300 rounded-2xl flex items-center justify-center gap-2 ${
          !deferredPrompt
            ? 'bg-gray-400 cursor-not-allowed text-gray-600'
            : 'bg-blue-700 hover:bg-blue-800 shadow-lg hover:shadow-xl text-white'
        }`}
      >
        <Cloud className="h-5 w-5 animate-pulse" />
        {isLoading ? 'Installing...' : '⚡ Install App Now'}
      </Button>
      
      {!deferredPrompt && (
        <Card className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <div className="flex gap-2 text-sm text-amber-700 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p><strong>Tip:</strong> Use "Download APK" option or install from your browser menu (⋮) → "Install app"</p>
          </div>
        </Card>
      )}
    </div>
  );
}
