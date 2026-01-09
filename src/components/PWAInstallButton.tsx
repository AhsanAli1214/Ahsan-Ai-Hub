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
      console.log('beforeinstallprompt event captured');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Immediately notify other components that installation is available
      window.dispatchEvent(new CustomEvent('pwa-installable', { detail: e }));
      
      // Auto-show toast if not installed to encourage installation
      if (!localStorage.getItem('pwa-install-prompt-shown')) {
        toast({
          title: 'Ahsan AI Hub is Ready',
          description: 'Install our official app for a faster, private experience!',
          action: (
            <Button size="sm" onClick={() => handleInstallClick(e as BeforeInstallPromptEvent)}>
              Install Now
            </Button>
          ),
        });
        localStorage.setItem('pwa-install-prompt-shown', 'true');
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
      toast({
        title: '✓ App Installed Successfully!',
        description: 'Ahsan AI Hub is now installed. You can launch it from your home screen.',
      });
    };

    if (typeof window !== 'undefined') {
      // Check local storage flag first
      if (localStorage.getItem('pwa-installed') === 'true') {
        setIsInstalled(true);
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, [toast]);

  const handleInstallClick = async (specificPrompt?: BeforeInstallPromptEvent) => {
    const promptToUse = specificPrompt || deferredPrompt;
    
    if (!promptToUse) {
      toast({
        title: 'Installation Info',
        description: isInstalled 
          ? 'App is already installed!' 
          : 'To install: Tap the 3-dot menu (⋮) and select "Install app" or "Add to Home screen".',
      });
      return;
    }

    setIsLoading(true);
    try {
      await promptToUse.prompt();
      const { outcome } = await promptToUse.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        toast({
          title: '✓ Installation Started',
          description: 'Ahsan AI Hub is being added to your device.',
        });
      }
    } catch (error) {
      console.error('PWA Install Error:', error);
      toast({
        title: 'Install failed',
        description: 'Please try again from your browser menu.',
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
        disabled={isLoading}
        size="lg"
        className={cn(
          "w-full font-black text-sm uppercase tracking-[0.2em] h-16 transition-all duration-300 rounded-2xl flex items-center justify-center gap-3 shadow-xl",
          "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 hover:scale-105 active:scale-95"
        )}
      >
        <Download className={cn("h-5 w-5", deferredPrompt && "animate-bounce")} />
        {isLoading ? 'Installing...' : 'Install App'}
      </Button>
      
      {!deferredPrompt && !isInstalled && (
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
