import type { Metadata, Viewport } from 'next';
import './globals.css';
import '../styles/accessibility.css';
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

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
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
    title: 'Ahsan Ai Hub - Free AI Chat, Writing & Code Tools No Login Required',
    description: 'Experience unlimited free AI chat assistant, writing assistant, blog generator, resume builder, code explainer, math solver, translator (50+ languages), and 9+ more tools. No login, no signup, 100% private, completely free with Ahsan AI by Ahsan Ali.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ahsan AI Hub by Ahsan Ali - Your Privacy-First AI Companion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Ahsan_Ali_12',
    creator: '@Ahsan_Ali_12',
    title: 'Ahsan AI Hub by Ahsan Ali Wadani - Free AI Chat & Tools',
    description: 'Ahsan Ai Hub - Free AI chat assistant, writing tool, code explainer, resume builder, and 9+ more. No login required, no signup. 100% private. Try Ahsan AI today!',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Ahsan Ai Hub - Free AI Chat, Writing & Code Tools No Login</title>
        <meta name="google-site-verification" content="C3kD33pr8zGcgloDD-hhPTHJVKhicxKot5N39asPcX4" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="color-scheme" content="light dark" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ahsan Ai Hub" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e293b" media="(prefers-color-scheme: dark)" />
        <meta name="author" content="Ahsan Ali" />
        <meta name="application-name" content="Ahsan Ai Hub" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <link rel="preconnect" href="https://i.postimg.cc" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.postimg.cc" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon.png?v=2025-12-28" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=2025-12-28" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png?v=2025-12-28" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2025-12-28" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png?v=2025-12-28" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png?v=2025-12-28" />
        <link rel="mask-icon" href="/icon-maskable-512.png?v=2025-12-28" color="#3b82f6" />
        <link rel="shortcut icon" href="/favicon.ico?v=2025-12-28" type="image/x-icon" />
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
        <Script id="pwa-register" strategy="afterInteractive" async defer dangerouslySetInnerHTML={{__html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
        <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" async defer />
        <Script id="onesignal-init" strategy="afterInteractive" async defer dangerouslySetInnerHTML={{__html: `
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              try {
                await OneSignal.init({
                  appId: "8a693786-f992-42d3-adfb-56a230adcea5",
                  safari_web_id: "web.onesignal.auto.145674d8-00a8-48b8-80f0-864708765432", 
                  notifyButton: {
                    enable: true,
                  },
                });
              } catch (e) {
                // Silent error handling for OneSignal
              }
            });
        `}} />
        <Script id="schema-webapp" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'Ahsan Ai Hub',
          'description': 'Advanced AI-powered platform for chat, content generation, and creative tools',
          'url': 'https://ahsan-ai-hub.vercel.app',
          'applicationCategory': 'Productivity',
          'operatingSystem': 'Web',
          'offers': {
            '@type': 'AggregateOffer',
            'priceCurrency': 'USD',
            'lowPrice': '0',
            'highPrice': '0',
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.8',
            'ratingCount': '1200',
            'bestRating': '5',
            'worstRating': '1',
          },
        })}} />
        <Script id="schema-org" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'Ahsan AI Hub',
          'alternateName': ['Ahsan AI', 'Ahsan Ali AI', 'Ahsan Ai by Ahsan Ali', 'Ahsan AI Hub by Ahsan Ali', 'Ahsan Wadani', 'Ahsan Tech Hub', 'Ahsan Ali Wadani'],
          'url': 'https://ahsan-ai-hub.vercel.app',
          'logo': 'https://ahsan-ai-hub.vercel.app/logo.png',
          'image': 'https://ahsan-ai-hub.vercel.app/og-image.png',
          'description': 'Ahsan AI Hub by Ahsan Ali Wadani: The #1 privacy-first platform for free AI chat, 9+ generation tools, translation, and text-to-speech. Powered by advanced AI. No login, zero tracking. Experience Ahsan AI, Ahsan Tech Hub, and more.',
          'keywords': 'Ahsan AI, Ahsan Ali AI, Ahsan Ai Hub, Ahsan Tech Hub, Ahsan Wadani, Ahsan Ali Wadani, free AI chat, AI tools',
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.8',
            'ratingCount': '1200',
          },
          'founder': {
            '@type': 'Person',
            'name': 'Ahsan Ali'
          },
          'sameAs': [
            'https://twitter.com/Ahsan_Ali_12'
          ],
          'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'Support',
            'email': 'support@ahsan-ai-hub.com'
          }
        })}} />
      </head>
      <body className={cn('font-body antialiased', inter.variable, poppins.variable)}>
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
                {children}
              </ErrorBoundary>
              <Toaster />
              <PWAInstall />
              <ConnectionStatus />
            </ChatHistoryProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}