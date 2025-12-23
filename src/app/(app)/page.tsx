'use client';

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
} from 'lucide-react';
import Link from 'next/link';
import { AhsanAiHubLogo } from '@/components/icons';
import { useAppContext, type PersonalityMode } from '@/context/AppContext';

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


// AWS App download URLs for different platforms
const AWS_APP_URLS = {
  windows: 'https://aws.amazon.com/windows/applications/',
  mac: 'https://aws.amazon.com/mac/applications/',
  linux: 'https://aws.amazon.com/linux/applications/',
  ios: 'https://apps.apple.com/us/app/aws-mobile-console/id1435001185',
  android: 'https://play.google.com/store/apps/details?id=com.amazon.aws.console',
};

export default function HomePage() {
  const { personalityMode } = useAppContext();

  const currentMode =
    PERSONALITY_MODES_CONFIG[personalityMode] ||
    PERSONALITY_MODES_CONFIG.creative;

  // Function to detect device type and download AWS app
  const handleDownloadAWSApp = () => {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    
    let downloadUrl = AWS_APP_URLS.windows; // default

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      downloadUrl = AWS_APP_URLS.ios;
    } else if (/Android/.test(userAgent)) {
      downloadUrl = AWS_APP_URLS.android;
    } else if (/Mac/.test(userAgent)) {
      downloadUrl = AWS_APP_URLS.mac;
    } else if (/Linux/.test(userAgent)) {
      downloadUrl = AWS_APP_URLS.linux;
    } else if (/Win/.test(userAgent)) {
      downloadUrl = AWS_APP_URLS.windows;
    }

    // Open download link in new window
    if (typeof window !== 'undefined') {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Home" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
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

          {/* AWS App Download Section */}
          <div>
            <h2 className="mb-4 font-headline text-xl font-semibold">
              Download AWS App
            </h2>
            <Card className="flex flex-col items-center justify-center p-6 text-center md:p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Cloud className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">AWS Console App</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Download the AWS Console app on your device for easy access and management on the go.
              </p>
              <Button
                onClick={handleDownloadAWSApp}
                size="lg"
                className="w-full md:w-auto"
              >
                <Cloud className="mr-2 h-5 w-5" />
                Download AWS App
              </Button>
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
