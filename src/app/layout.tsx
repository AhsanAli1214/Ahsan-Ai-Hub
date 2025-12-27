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

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
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
    default: 'Ahsan Ai Hub - Free AI Chat & Content Tools',
    template: '%s | Ahsan Ai Hub'
  },
  description: 'Ahsan Ai Hub: The #1 privacy-first platform for free AI chat, 9+ generation tools, translation, and text-to-speech. Powered by Gemini 2.0 Flash. No login, zero tracking.',
  keywords: [
    'Ahsan Ai Hub', 'free AI chat', 'Ahsan AI', 'best free AI tools 2025',
    'AI text rewriter', 'AI code explainer', 'privacy-first AI', 'no login AI',
    'Gemini 2.0 Flash free', 'AI email writer', 'AI story generator',
    'free translation tools', 'unlimited text to speech', 'anonymous AI',
    'AI productivity hub', 'Ahsan Ali AI'
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ahsan Ai Hub',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ahsan-ai-hub.vercel.app',
    siteName: 'Ahsan Ai Hub',
    title: 'Ahsan Ai Hub - Free AI Chat & Professional Content Tools',
    description: 'Experience unlimited AI chat, 9+ generation tools, and 50+ language translations. 100% private, no account needed, completely free.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ahsan Ai Hub - Your Privacy-First AI Companion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Ahsan_Ali_12',
    creator: '@Ahsan_Ali_12',
    title: 'Ahsan Ai Hub - Free AI Chat & Professional Content Tools',
    description: 'Free AI chat and 10+ professional tools. No login, 100% private.',
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
        <title>Ahsan Ai Hub</title>
        <meta name="google-site-verification" content="C3kD33pr8zGcgloDD-hhPTHJVKhicxKot5N39asPcX4" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ahsan Ai Hub" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="author" content="Ahsan Ali" />
        <meta name="application-name" content="Ahsan Ai Hub" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192.png" />
        <link rel="mask-icon" href="/icon-512.png" color="#3b82f6" />
        <link rel="shortcut icon" href="/favicon.ico" />
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
        <Script id="pwa-register" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
              }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
              });
            });
          }
        `}} />
        <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" />
        <Script id="onesignal-init" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: `
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
                console.error('OneSignal initialization error:', e);
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
          'offers': {
            '@type': 'AggregateOffer',
            'priceCurrency': 'USD',
            'lowPrice': '0',
            'highPrice': '0',
          },
        })}} />
        <Script id="schema-org" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'Ahsan Ai Hub',
          'url': 'https://ahsan-ai-hub.vercel.app',
          'logo': 'https://ahsan-ai-hub.vercel.app/icon-512.png',
          'description': 'Advanced AI-powered platform for intelligent chat, content generation, and creative tools',
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