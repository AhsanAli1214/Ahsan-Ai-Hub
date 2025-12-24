'use client';

import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  BookText,
  Code,
  HelpCircle,
  Lightbulb,
  Smile,
  Briefcase,
  Zap,
  BookOpen,
  MessageCircle,
  Cloud,
  Download,
  Smartphone,
} from 'lucide-react';
import Link from 'next/link';
import { AhsanAiHubLogo } from '@/components/icons';
import { useAppContext, type PersonalityMode } from '@/context/AppContext';
import { InstallInstructions } from '@/components/InstallInstructions';
import { InstallGuide } from '@/components/InstallGuide';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const QUICK_ACTIONS = [
  {
    id: '1',
    label: 'Rewrite Text',
    icon: BookText,
    prompt: 'Please rewrite this text to be clearer: ',
  },
  {
    id: '2',
    label: 'Explain Code',
    icon: Code,
    prompt: 'Can you explain this code: ',
  },
  {
    id: '3',
    label: 'Generate Ideas',
    icon: Lightbulb,
    prompt: 'Generate creative ideas for: ',
  },
  {
    id: '4',
    label: 'Solve Question',
    icon: HelpCircle,
    prompt: 'Help me solve this problem: ',
  },
];

const SMART_PROMPTS = [
    { label: 'Explain this to me like I\'m five', prompt: 'Explain this to me like I\'m five: ' },
    { label: 'Summarize the following text', prompt: 'Summarize the following text: ' },
    { label: 'Write a poem about...', prompt: 'Write a poem about a rainy day.' },
    { label: 'Translate to French', prompt: 'Translate this to French: ' },
    { label: 'What are the pros and cons of...', prompt: 'What are the pros and cons of learning to code?' },
    { label: 'Create a recipe for...', prompt: 'Create a recipe for a vegan chocolate cake.' },
];

const PERSONALITY_MODES_CONFIG: Record<
  PersonalityMode,
  { label: string; icon: React.ElementType }
> = {
  friendly: { label: 'Friendly', icon: Smile },
  professional: { label: 'Professional', icon: Briefcase },
  creative: { label: 'Creative', icon: Zap },
  teacher: { label: 'Teacher', icon: BookOpen },
};


interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function HomePage() {
  const { personalityMode } = useAppContext();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const currentMode =
    PERSONALITY_MODES_CONFIG[personalityMode] ||
    PERSONALITY_MODES_CONFIG.creative;

  // Setup beforeinstallprompt event listener
  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Store globally for PWAInstall component
      (window as any).lastBeforeInstallPromptEvent = e;
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      (window as any).lastBeforeInstallPromptEvent = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Function to trigger app installation
  const handleInstallApp = async () => {
    if (deferredPrompt && !isInstalled) {
      try {
        // Try to trigger the native install prompt
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
        } else {
          // User dismissed the native prompt, show manual installation instructions
          setShowInstructions(true);
        }
      } catch (error) {
        console.error('Installation error:', error);
        // If native install fails, show manual instructions
        setShowInstructions(true);
      }
    } else if (!isInstalled) {
      // No native install prompt available, show manual installation instructions
      // This will work for browsers that don't support the install prompt
      setShowInstructions(true);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Home" />
      {/* Crawlable Content for SEO */}
      <div className="sr-only">
        <h1>Ahsan AI Hub - Your Intelligent AI Companion</h1>
        <p>
          Ahsan AI Hub is an AI-powered platform offering smart chat, automation, and creative AI tools. 
          Get instant help with writing, coding, brainstorming, and problem solving powered by advanced AI.
        </p>
        <nav>
          <a href="/recommendations">AI Chat</a>
          <a href="/content-tools">Content Tools</a>
          <a href="/about">About</a>
          <a href="/features">Features</a>
          <a href="/contact">Contact</a>
          <a href="/faq">FAQ</a>
        </nav>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <InstallInstructions
            open={showInstructions}
            onOpenChange={setShowInstructions}
          />
          {/* Hero Section */}
          <div className="rounded-lg bg-accent p-6 text-accent-foreground shadow-md md:p-8">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent/80">
                <AhsanAiHubLogo fillContainer className="text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h1 className="font-headline text-3xl font-bold md:text-4xl">
                  Ahsan Ai Hub
                </h1>
                <p className="mt-1 text-lg text-accent-foreground/80">
                  Your Intelligent AI Companion
                </p>
              </div>
              <Button asChild size="lg" variant="secondary" className="hidden md:flex">
                <Link href="/recommendations">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Chatting
                </Link>
              </Button>
            </div>
            {/* Mobile Start Chatting Button */}
            <Button asChild size="lg" variant="secondary" className="mt-6 w-full md:hidden">
              <Link href="/recommendations" className="justify-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Chatting
              </Link>
            </Button>
          </div>

          {/* Quick Actions Section */}
          <div>
            <h2 className="mb-4 font-headline text-xl font-semibold">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  href={`/recommendations?initialPrompt=${encodeURIComponent(
                    action.prompt
                  )}`}
                  key={action.id}
                  passHref
                >
                  <Card className="flex h-full transform flex-col items-center justify-center p-4 text-center transition-transform hover:scale-105 hover:shadow-lg">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <action.icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">{action.label}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Install App Section */}
          <div>
            <h2 className="mb-4 font-headline text-xl font-semibold">
              Install App
            </h2>
            <Card className="p-6 md:p-8 space-y-6">
              <div className="flex flex-col items-center text-center md:flex-row md:text-left md:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Cloud className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Get Our App</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Install the Ahsan AI Hub app on your device for easy access and offline support.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col gap-2 w-full md:w-auto">
                  <Button
                    onClick={handleInstallApp}
                    size="lg"
                    className="w-full"
                    disabled={isInstalled}
                  >
                    <Cloud className="mr-2 h-5 w-5" />
                    {isInstalled ? 'App Installed ✓' : 'Install App'}
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full"
                  >
                    <a href="/Ahsan%20Ai%20Hub.apk" download>
                      <Download className="mr-2 h-5 w-5" />
                      Download APK
                    </a>
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-sm mb-4">Installation Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center mb-3">
                      <Cloud className="mr-2 h-5 w-5 text-blue-600" />
                      <h5 className="font-semibold text-sm">Chrome Browser</h5>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click "Install App" to add the app as a native app on your Android or Desktop using Chrome's PWA feature.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center mb-3">
                      <Smartphone className="mr-2 h-5 w-5 text-green-600" />
                      <h5 className="font-semibold text-sm">Android APK</h5>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click "Download APK" to download the app file directly. Install it on your Android device.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Mode Section */}
          <Card className="flex items-center justify-between p-4">
              <div className='flex items-center'>
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
                      <currentMode.icon className="h-5 w-5" />
                  </div>
                  <div>
                      <p className="text-xs text-muted-foreground">Current Mode</p>
                      <p className="font-semibold">{currentMode.label}</p>
                  </div>
              </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">Change</Link>
            </Button>
          </Card>


          {/* Push Notifications Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Enable Push Notifications</CardTitle>
                <CardDescription>
                  Get notified about new features and important updates
                </CardDescription>
              </div>
              <Smartphone className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to receive push notifications directly on your device. Stay updated with the latest features and announcements.
              </p>
              <div className="flex items-center justify-center p-4 rounded-lg bg-accent/5 border border-accent/20">
                <div className='onesignal-customlink-container'></div>
              </div>
            </CardContent>
          </Card>

          {/* Smart Prompts Section */}
          <div>
            <h2 className="mb-4 font-headline text-xl font-semibold">
              Smart Prompts
            </h2>
            <div className="flex flex-wrap gap-2">
              {SMART_PROMPTS.map((prompt, index) => (
                <Button key={index} variant="outline" asChild>
                  <Link
                    href={`/recommendations?initialPrompt=${encodeURIComponent(
                      prompt.prompt
                    )}`}
                  >
                    {prompt.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
