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
    default: 'Ahsan AI Hub - #1 Best Free AI Chat & Content Creation Platform',
    template: '%s | Ahsan AI Hub'
  },
  description: 'Ahsan AI Hub is the world\'s leading privacy-first AI platform. Get unrestricted access to "Ahsan AI" tools for writing, coding, and brainstorming with zero data logging and no account required.',
  keywords: [
    'Ahsan AI Hub',
    'Ahsan AI',
    'Wadani AI',
    'Ahsan Ali AI Hub',
    'free AI chat no login',
    'best free AI text rewriter',
    'privacy-protected AI assistant',
    'Gemini powered Ahsan AI',
    'AI tool hub 2025',
    'anonymous AI chat',
    'Ahsan Ali Developer AI',
  ],
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ahsan AI Hub',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ahsan-ai-hub.vercel.app',
    siteName: 'Ahsan AI Hub',
    title: 'Ahsan AI Hub - Advanced AI Chat & Content Generation Platform',
    description: 'Powerful AI tools for chat, content creation, writing, email marketing, and problem-solving. Get instant help with 10+ AI-powered tools.',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Ahsan AI Hub Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahsan AI Hub - Advanced AI Platform',
    description: 'Powerful AI tools for chat, content creation, writing, and more',
    images: ['/icon-512.png'],
  },
  alternates: {
    canonical: 'https://ahsan-ai-hub.vercel.app',
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
        <meta name="google-site-verification" content="C3kD33pr8zGcgloDD-hhPTHJVKhicxKot5N39asPcX4" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ahsan AI Hub" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="description" content="Discover Ahsan AI Hub - the ultimate AI-powered platform for intelligent chat, content generation, email writing, and creative tools." />
        <meta name="author" content="Ahsan AI Hub" />
        <link rel="canonical" href="https://ahsan-ai-hub.vercel.app" />
        <link rel="alternate" hrefLang="en" href="https://ahsan-ai-hub.vercel.app" />
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
            navigator.serviceWorker.register('/sw.js').catch(err => {
            });
          }
        `}} />
        <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" />
        <Script id="onesignal-init" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: `
          if (window.location.hostname.includes('vercel.app')) {
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              try {
                await OneSignal.init({
                  appId: "8a693786-f992-42d3-adfb-56a230adcea5",
                });
              } catch (e) {
              }
            });
          }
        `}} />
        <Script id="schema-webapp" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'Ahsan AI Hub',
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
          'name': 'Ahsan AI Hub',
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
              {children}
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
