import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/contexts/theme-context';
import { AppProvider } from '@/context/AppContext';
import { ChatHistoryProvider } from '@/context/ChatHistoryContext';
import { PWAInstall } from '@/components/PWAInstall';
import { ConnectionStatus } from '@/components/network/ConnectionStatus';
import { ReCaptchaScript } from '@/components/ReCaptcha';
import Script from 'next/script';
import { Inter, Poppins } from 'next/font/google';
import { ErrorBoundary } from '@/components/error-boundary';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Suspense } from 'react';
import { InAppAnnouncement } from '@/components/InAppAnnouncement';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#3b82f6',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://ahsan-ai-hub.vercel.app'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Ahsan Ai Hub - Free AI Chat, Writing & Code Tools No Login',
    template: 'Ahsan Ai Hub'
  },
  description: 'Ahsan AI Hub by Ahsan Ali Wadani: The #1 free AI chat assistant with no login required. Use our free AI writing assistant, blog post generator, resume builder, code explainer, math solver, translator (50+ languages), text-to-speech, and 9+ more tools. No signup needed. Zero tracking.',
  keywords: [
    'Ahsan AI', 'Ahsan Ai Hub', 'Ahsan Ali Ai', 'Ahsan Ai by Ahsan Ali',
    'Ahsan Ai Hub by Ahsan Ali', 'Ahsan Ali Wadani', 'Ahsan Wadani', 'Ahsan Tech Hub',
    'free AI chat assistant no login required', 'AI chatbot online free no signup',
    'free AI writing assistant online no login', 'AI blog post generator free no signup',
    'AI article writer free online', 'AI content generator for blogs free',
    'AI resume builder free no signup', 'AI cover letter generator free online no signup',
    'AI email writing assistant free online no login', 'AI math problem solver free online no login',
    'free AI math homework helper no signup', 'AI code explanation tool free no login',
    'free AI programming assistant online no login', 'AI coding help free no signup',
    'AI study guide generator free no login', 'AI flashcard generator free online no signup',
    'AI quiz maker free online no signup', 'free AI translator supporting 50+ languages no login',
    'AI text to speech converter free online no signup', 'AI social media content creator free no signup',
    'AI caption generator free no signup', 'AI creative writing assistant free online no login',
    'free AI tools for students no login', 'AI writing tools for content creators free no signup',
    'AI productivity assistant free online no login', 'free AI chat', 'best free AI tools 2025',
    'AI text rewriter', 'AI code explainer', 'privacy-first AI', 'no login AI',
    'advanced AI free', 'AI story generator', 'free translation tools', 'unlimited text to speech',
    'anonymous AI', 'AI productivity hub', 'Ahsan Ali AI', 'AI generator tools',
    'best AI platform 2025', 'free AI tools', 'AI assistant', 'creative AI tools'
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ahsan Ai Hub',
    startupImage: [
      {
        url: '/icon-512.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
      }
    ]
  },
  formatDetection: {
    telephone: false,
  },
  itunes: {
    appId: 'com.ahsan_ai_hub.twa',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ahsan-ai-hub.vercel.app',
    siteName: 'Ahsan AI Hub by Ahsan Ali',
    title: 'Ahsan AI Hub - Best Free AI Assistant 2025 | No Login Required',
    description: 'Use Ahsan AI Hub for free: AI chat assistant, text rewriter, code explainer, math solver, and 50+ language translator. 100% private, no login, developed by Ahsan Ali.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ahsan AI Hub - The Privacy-First Free AI Companion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Ahsan_Ali_12',
    creator: '@Ahsan_Ali_12',
    title: 'Ahsan AI Hub - Free AI Chat & Tools (No Signup)',
    description: "Experience the world's most private free AI hub. Developed by Ahsan Ali. No login required.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'C3kD33pr8zGcgloDD-hhPTHJVKhicxKot5N39asPcX4',
  },
};

import { ViewTransitions } from 'next-view-transitions';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
        <link rel="preconnect" href="https://cdn.onesignal.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.onesignal.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vitals.vercel-analytics.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link rel="prefetch" href="/images/developer.jpg" as="image" />
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e1b4b" media="(prefers-color-scheme: dark)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('selectedColorTheme') || 'default';
                document.documentElement.setAttribute('data-theme', theme);
                const isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={cn('font-body antialiased', inter.variable, poppins.variable)}>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Ahsan AI Hub",
              "alternateName": "Ahsan AI",
              "url": "https://ahsan-ai-hub.vercel.app",
              "description": "The world's #1 privacy-first free AI companion. Developed by Ahsan Ali. Features AI chat, text rewriting, math solving, and translation.",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "All",
              "author": {
                "@type": "Person",
                "name": "Ahsan Ali",
                "url": "https://github.com/AhsanAli1214"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <ChatHistoryProvider>
              <ReCaptchaScript />
              <ErrorBoundary>
                <Suspense fallback={null}>
                  {children}
                </Suspense>
              </ErrorBoundary>
              <Toaster />
              <Suspense fallback={null}>
                <PWAInstall />
              </Suspense>
              <Suspense fallback={null}>
                <ConnectionStatus />
              </Suspense>
              <Analytics mode={'production'} />
              <SpeedInsights />
              <InAppAnnouncement />
              {/* Load OneSignal after everything else */}
              <Script 
                src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" 
                strategy="lazyOnload" 
                async 
              />
              <Script id="onesignal-init" strategy="lazyOnload" dangerouslySetInnerHTML={{__html: `
                  window.OneSignalDeferred = window.OneSignalDeferred || [];
                  OneSignalDeferred.push(async function(OneSignal) {
                    try {
                      await OneSignal.init({
                        appId: "8a693786-f992-42d3-adfb-56a230adcea5",
                        safari_web_id: "web.onesignal.auto.145674d8-00a8-48b8-80f0-864708765432", 
                        notifyButton: {
                          enable: true,
                        },
                        allowLocalhostAsSecureOrigin: true,
                        display: "dialog",
                        notificationDisplayOrder: "desc",
                        promptOptions: {
                          slidedown: {
                            enabled: true,
                            autoPrompt: true,
                            timeDelay: 5,
                            pageViews: 1,
                          }
                        }
                      });
                    } catch (e) {
                      // Silent error handling for OneSignal
                    }
                  });
              `}} />
            </ChatHistoryProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  </ViewTransitions>
);
}
