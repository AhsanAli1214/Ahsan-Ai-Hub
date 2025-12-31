'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
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
  Shield,
  Lock,
  Eye,
} from 'lucide-react';

import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAppContext, type PersonalityMode } from '@/context/AppContext';

// Performance: Lazy load heavy components
const AhsanAiHubLogo = dynamic(() => import('@/components/icons').then(mod => mod.AhsanAiHubLogo), { ssr: true });
const ConnectionStatus = dynamic(() => import('@/components/network/ConnectionStatus').then(mod => mod.ConnectionStatus), { ssr: false });
const OneSignalButton = dynamic(() => import('@/components/OneSignalButton').then(mod => mod.OneSignalButton), { 
  ssr: false,
  loading: () => <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" /> 
});
const PWAInstallButton = dynamic(() => import('@/components/PWAInstallButton').then(mod => mod.PWAInstallButton), { 
  ssr: false,
  loading: () => <div className="h-14 w-full animate-pulse rounded-2xl bg-muted" />
});
const NotificationHistory = dynamic(() => import('@/components/notifications/NotificationHistory').then(mod => mod.NotificationHistory), {
  ssr: false,
  loading: () => <div className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
});
const WhatsAppSupportButton = dynamic(() => import('@/components/WhatsAppSupportButton').then(mod => mod.WhatsAppSupportButton), { ssr: false });

const QUICK_ACTIONS = [
  { id: '1', label: 'Rewrite Text', icon: BookText, prompt: 'Please rewrite this text to be clearer: ' },
  { id: '2', label: 'Explain Code', icon: Code, prompt: 'Can you explain this code: ' },
  { id: '3', label: 'Generate Ideas', icon: Lightbulb, prompt: 'Generate creative ideas for: ' },
  { id: '4', label: 'Solve Question', icon: HelpCircle, prompt: 'Help me solve this problem: ' },
];

const SMART_PROMPTS = [
  { label: 'Explain this to me like I\'m five', prompt: 'Explain this to me like I\'m five: ' },
  { label: 'Summarize the following text', prompt: 'Summarize the following text: ' },
  { label: 'Write a poem about...', prompt: 'Write a poem about a rainy day.' },
  { label: 'Translate to French', prompt: 'Translate this to French: ' },
  { label: 'What are the pros and cons of...', prompt: 'What are the pros and cons of learning to code?' },
  { label: 'Create a recipe for...', prompt: 'Create a recipe for a vegan chocolate cake.' },
];

const PERSONALITY_MODES_CONFIG: Record<PersonalityMode, { label: string; icon: React.ElementType }> = {
  friendly: { label: 'Friendly', icon: Smile },
  professional: { label: 'Professional', icon: Briefcase },
  creative: { label: 'Creative', icon: Zap },
  teacher: { label: 'Teacher', icon: BookOpen },
};

export default function HomePage() {
  const { personalityMode } = useAppContext();
  const currentMode = PERSONALITY_MODES_CONFIG[personalityMode] || PERSONALITY_MODES_CONFIG.creative;

  return (
    <main className="flex h-full flex-col">
      <AppHeader title="Home" />
      <div className="sr-only">
        <h1>Ahsan AI Hub - The World's #1 Privacy-First Free AI Companion</h1>
        <p>Ahsan AI Hub (also known as Ahsan AI) is a powerful, anonymous AI platform developed by Ahsan Ali. We offer the best free AI chat experience, AI text rewriter, and code explainer with 100% privacy and no login required.</p>
        <nav>
          <a href="/recommendations">Free AI Chat Online</a>
          <a href="/content-tools">AI Content Tools & Generators</a>
          <a href="/privacy">Privacy-First Policy</a>
          <a href="/download-apk">Download Ahsan AI Mobile App</a>
        </nav>
      </div>
      
      <ConnectionStatus />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <article className="mx-auto max-w-4xl space-y-8">
          <section className="rounded-lg bg-accent p-6 text-accent-foreground shadow-md md:p-8">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
                <AhsanAiHubLogo width={144} height={144} fillContainer className="text-accent-foreground" priority />
              </div>
              <div className="flex-1">
                <h1 className="font-headline text-3xl font-bold md:text-4xl">Ahsan Ai Hub</h1>
                <p className="mt-1 text-lg text-accent-foreground/80">Your Intelligent AI Companion</p>
                <p className="mt-2 text-sm font-medium text-accent-foreground/70">Developed by Ahsan Ali</p>
              </div>
              <Button asChild size="lg" variant="secondary" className="hidden md:flex">
                <Link href="/recommendations">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Chatting
                </Link>
              </Button>
            </div>
            <Button asChild size="lg" variant="secondary" className="mt-6 w-full md:hidden">
              <Link href="/recommendations" className="justify-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Chatting
              </Link>
            </Button>
          </section>

          <div className="relative overflow-hidden rounded-[2.5rem] bg-primary/5 border border-primary/20 p-8 md:p-12 shadow-2xl">
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-5xl font-black text-foreground leading-[1.1] tracking-tight">Premium AI Experience <br /><span className="text-primary">100% Privacy-First</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group flex items-start gap-4 p-4 rounded-2xl bg-background/40 border border-border/40">
                    <Lock className="h-5 w-5 text-primary" />
                    <div><p className="font-bold">Zero Login</p><p className="text-xs text-muted-foreground mt-1">Instant access without accounts.</p></div>
                  </div>
                  <div className="group flex items-start gap-4 p-4 rounded-2xl bg-background/40 border border-border/40">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div><p className="font-bold">PWA Powered</p><p className="text-xs text-muted-foreground mt-1">Native app experience.</p></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full lg:w-auto">
                <Suspense fallback={null}><WhatsAppSupportButton className="w-full lg:w-56" /></Suspense>
                <Button asChild size="lg" className="w-full lg:w-56 h-14 rounded-2xl font-black text-sm uppercase tracking-widest gap-3 shadow-xl"><Link href="/recommendations">Start Exploring <Zap className="h-4 w-4 fill-current" /></Link></Button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-headline text-xl font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {QUICK_ACTIONS.map((action) => (
                <Link href={`/recommendations?initialPrompt=${encodeURIComponent(action.prompt)}`} key={action.id}>
                  <Card className="flex h-full flex-col items-center justify-center p-4 text-center transition-transform hover:scale-105">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary"><action.icon className="h-6 w-6" /></div>
                    <p className="text-sm font-medium">{action.label}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div id="install-section">
            <h2 className="mb-4 font-headline text-xl font-semibold">Get the Native Experience</h2>
            <Card className="relative overflow-hidden p-8 md:p-12 border-primary/20 bg-muted/30 rounded-[2.5rem]">
              <div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:text-left lg:gap-12">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-primary text-primary-foreground shadow-2xl mb-8 lg:mb-0"><Smartphone className="h-10 w-10" /></div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl md:text-3xl font-black">Ahsan AI Hub Mobile</h3>
                  <p className="text-base text-muted-foreground font-medium">Transform your browser into a high-performance native app.</p>
                  <div className="flex flex-col gap-4 lg:flex-row pt-4">
                    <div className="flex-1 lg:flex-none lg:w-80"><PWAInstallButton /></div>
                    <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest border-2"><Link href="/download-apk"><Download className="h-4 w-4 mr-2" />Download APK</Link></Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="flex items-center justify-between p-4">
            <div className='flex items-center'>
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent"><currentMode.icon className="h-5 w-5" /></div>
              <div><p className="text-xs text-muted-foreground">Current Mode</p><p className="font-semibold">{currentMode.label}</p></div>
            </div>
            <Button variant="ghost" size="sm" asChild><Link href="/settings">Change</Link></Button>
          </Card>

          <section className="space-y-6">
            <Card className="bg-card border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Enable Push Notifications</CardTitle>
                  <CardDescription>Stay updated with latest features</CardDescription>
                </div>
                <Smartphone className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent className="space-y-4">
                <OneSignalButton />
              </CardContent>
            </Card>
            <NotificationHistory />
          </section>

          <section className="pb-12">
            <h2 className="mb-4 font-headline text-xl font-semibold">Smart Prompts</h2>
            <div className="flex flex-wrap gap-2">
              {SMART_PROMPTS.map((prompt, index) => (
                <Button key={index} variant="outline" asChild><Link href={`/recommendations?initialPrompt=${encodeURIComponent(prompt.prompt)}`}>{prompt.label}</Link></Button>
              ))}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
