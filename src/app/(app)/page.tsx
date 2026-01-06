'use client';

import Image from 'next/image';
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
const WhatsAppSupportButton = dynamic(() => import('@/components/WhatsAppSupportButton').then(mod => mod.WhatsAppSupportButton), { ssr: false });
const AppHeader = dynamic(() => import('@/components/layout/AppHeader').then(mod => mod.AppHeader), { ssr: true });

const AnnouncementBanner = dynamic(() => import('@/components/AnnouncementBanner').then(mod => ({ default: mod.AnnouncementBanner })), { ssr: false });
const Toaster = dynamic(() => import('@/components/ui/toaster').then(mod => ({ default: mod.Toaster })), { ssr: false });
const CookieBanner = dynamic(() => import('@/components/CookieBanner').then(mod => ({ default: mod.CookieBanner })), { ssr: false });
const PWAInstall = dynamic(() => import('@/components/PWAInstall').then(mod => ({ default: mod.PWAInstall })), { ssr: false });
const FeedbackDialog = dynamic(() => import('@/components/FeedbackDialog').then(mod => ({ default: mod.FeedbackDialog })), { ssr: false });

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
    <main className="flex h-full flex-col" aria-labelledby="home-heading">
      <AppHeader title="Ahsan AI Hub" />
      <h1 id="home-heading" className="sr-only">Ahsan AI Hub - The World's #1 Privacy-First Free AI Companion</h1>
      <div className="sr-only">
        <p>Ahsan AI Hub (also known as Ahsan AI) is a powerful, anonymous AI platform developed by Ahsan Ali. We offer the best free AI chat experience, AI text rewriter, and code explainer with 100% privacy and no login required.</p>
        <nav aria-label="Quick links">
          <Link href="/recommendations">Free AI Chat Online</Link>
          <Link href="/content-tools">AI Content Tools & Generators</Link>
          <Link href="/privacy">Privacy-First Policy</Link>
          <Link href="/download-apk">Download Ahsan AI Mobile App</Link>
        </nav>
      </div>
      
      <ConnectionStatus />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <article className="mx-auto max-w-4xl space-y-8">
          <section className="rounded-lg bg-accent p-6 text-accent-foreground shadow-md md:p-8" aria-labelledby="hero-heading">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="relative flex h-36 w-36 md:h-48 md:w-48 shrink-0 items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="Ahsan AI Hub Logo" 
                  width={192} 
                  height={192} 
                  priority 
                  className="h-auto w-full object-contain brightness-100 dark:brightness-110 contrast-110 drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] transition-all duration-300"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 id="hero-heading" className="font-headline text-3xl font-bold md:text-4xl tracking-tight">Ahsan Ai Hub</h2>
                <p className="mt-1 text-lg text-accent-foreground/90 leading-tight">Your Intelligent AI Companion</p>
                <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
                  <div className="h-px w-8 bg-accent-foreground/30" aria-hidden="true" />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-foreground/70">
                    Developed by <span className="text-accent-foreground font-bold">Ahsan Ali Wadani</span>
                  </p>
                </div>
              </div>
              <Button asChild size="lg" variant="secondary" className="hidden md:flex shadow-lg" aria-label="Start chatting with AI">
                <Link href="/recommendations">
                  <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                  Start Chatting
                </Link>
              </Button>
            </div>
            <Button asChild size="lg" variant="secondary" className="mt-6 w-full md:hidden shadow-lg h-14" aria-label="Start chatting with AI">
              <Link href="/recommendations" className="justify-center">
                <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                Start Chatting
              </Link>
            </Button>
          </section>

          <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-black/40 backdrop-blur-xl p-8 md:p-12 shadow-2xl border border-zinc-200 dark:border-white/10 transition-all duration-500 hover:shadow-primary/5 hover:border-zinc-300 dark:hover:border-white/20">
            {/* Background Decorative Elements - Hidden on mobile for performance */}
            <div className="hidden md:block absolute -top-24 -right-24 h-80 w-80 bg-primary/20 blur-[120px] rounded-full transition-all duration-700 group-hover:bg-primary/30" />
            <div className="hidden md:block absolute -bottom-24 -left-24 h-80 w-80 bg-primary/10 blur-[120px] rounded-full transition-all duration-700 group-hover:bg-primary/20" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
              <div className="flex-1 space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-100 leading-[1] tracking-tight">
                  Premium AI <br />Experience <br />
                  <span className="text-primary whitespace-nowrap">100% Privacy-First</span>
                </h2>
                <div className="flex flex-col gap-3 max-w-md">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
                    <div className="bg-primary/10 p-2 rounded-lg" aria-hidden="true">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Zero Login</p>
                      <p className="text-[10px] text-zinc-700 dark:text-zinc-300 mt-0.5">Instant access without accounts or personal data.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
                    <div className="bg-primary/10 p-2 rounded-lg" aria-hidden="true">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Local Storage</p>
                      <p className="text-[10px] text-zinc-700 dark:text-zinc-300 mt-0.5">All history stays in your browser. We see nothing.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
                    <div className="bg-primary/10 p-2 rounded-lg" aria-hidden="true">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">PWA Powered</p>
                      <p className="text-[10px] text-zinc-700 dark:text-zinc-300 mt-0.5">Native app experience on any device, anywhere.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full lg:w-64">
                <Suspense fallback={null}>
                  <WhatsAppSupportButton 
                    className="w-full h-14 rounded-2xl bg-[#22245b] hover:bg-[#22245b]/90 text-white border-none font-bold text-xs uppercase tracking-wider gap-2 shadow-lg" 
                  />
                </Suspense>
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20"
                >
                  <Link href="/recommendations">
                    START EXPLORING <Zap className="h-4 w-4 fill-current" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="w-full h-12 rounded-2xl text-zinc-600 dark:text-zinc-400 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-primary/10 hover:text-primary transition-all border border-zinc-200/50 dark:border-white/10 hover:border-primary/20 bg-white/50 dark:bg-white/5"
                >
                  <Link href="/privacy" className="flex items-center justify-center gap-2">
                    <Shield className="h-3 w-3" /> PRIVACY POLICY
                  </Link>
                </Button>
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

          <div id="install-section" aria-labelledby="install-heading">
            <h2 id="install-heading" className="mb-4 font-headline text-xl font-semibold text-foreground dark:text-white">Official App</h2>
            <Card className="relative overflow-hidden p-6 md:p-10 border-zinc-200/50 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md rounded-[2rem] shadow-2xl">
              <div className="relative z-10 flex flex-col items-center gap-8 lg:flex-row lg:text-left">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2.5rem] bg-primary/20 text-primary border border-primary/20 shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]" aria-hidden="true">
                  <Smartphone className="h-10 w-10" />
                </div>
                <div className="flex-1 space-y-3 text-center lg:text-left">
                  <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Ahsan AI Hub for Mobile</h3>
                  <p className="text-zinc-700 dark:text-zinc-300 font-medium">Experience the full power of Ahsan AI as a native app on your home screen. Fast, private, and always ready.</p>
                  <div className="flex flex-col gap-4 sm:flex-row pt-6">
                    <div className="w-full sm:w-auto sm:min-w-[240px]">
                      <PWAInstallButton />
                    </div>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg" 
                      className="h-16 px-10 rounded-2xl font-black text-sm uppercase tracking-[0.2em] border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-all shadow-sm dark:shadow-none"
                      aria-label="Download Ahsan AI Hub APK"
                    >
                      <Link href="/download-apk">
                        <Download className="h-5 w-5 mr-3" />
                        Download APK
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Decorative Glow */}
              <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-primary/10 blur-[100px] rounded-full" />
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
