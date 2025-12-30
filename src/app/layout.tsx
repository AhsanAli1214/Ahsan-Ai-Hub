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
        <link rel="preconnect" href="https://cdn.onesignal.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.onesignal.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vitals.vercel-analytics.com" />
        <link rel="preconnect" href="https://d3mkw6s8thqya7.cloudfront.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://d3mkw6s8thqya7.cloudfront.net" />
        <link rel="prefetch" href="/recommendations" as="document" />
        <link rel="prefetch" href="/content-tools" as="document" />
        <link rel="canonical" href="https://ahsan-ai-hub.vercel.app" />
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e1b4b" media="(prefers-color-scheme: dark)" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
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
              <Analytics />
              <SpeedInsights />
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
                      });
                    } catch (e) {
                      // Silent error handling for OneSignal
                    }
                  });
              `}} />

              {/* Aisensy WhatsApp Widget - Lazy Load */}
              <Script
                id="aisensy-wa-widget-loader"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                  __html: `
                    (function() {
                      const script = document.createElement('script');
                      script.type = 'text/javascript';
                      script.src = 'https://d3mkw6s8thqya7.cloudfront.net/integration-plugin.js';
                      script.id = 'aisensy-wa-widget';
                      script.setAttribute('widget-id', 'aaathq');
                      script.async = true;
                      
                      // Custom styles for Aisensy Widget
                      const style = document.createElement('style');
                      style.innerHTML = \`
                        #aisensy-wa-widget-container, 
                        .aisensy-wa-widget-container,
                        [id*="aisensy"],
                        iframe[src*="aisensy"],
                        [id*="wa-widget"] {
                          bottom: 120px !important;
                          right: 20px !important;
                          z-index: 999999 !important;
                          pointer-events: auto !important;
                          display: block !important;
                          visibility: visible !important;
                        }
                        @media (max-width: 768px) {
                          #aisensy-wa-widget-container,
                          .aisensy-wa-widget-container,
                          [id*="aisensy"],
                          iframe[src*="aisensy"],
                          [id*="wa-widget"] {
                            display: none !important;
                            visibility: hidden !important;
                            pointer-events: none !important;
                          }
                        }
                        /* Target the specific floating button element if possible */
                        div[class*="aisensy-wa-widget-button"],
                        a[href*="wa.me"] {
                          bottom: inherit !important;
                        }
                      \`;
                      document.head.appendChild(style);

                      script.onload = function() {
                        const reposition = () => {
                          const selectors = [
                            '[id*="aisensy"]', 
                            '[class*="aisensy"]', 
                            'iframe[src*="aisensy"]',
                            '[id*="wa-widget"]',
                            'div[style*="position: fixed"][style*="bottom: 0"]',
                            'div[style*="position:fixed"][style*="bottom:0"]'
                          ];
                          
                          selectors.forEach(selector => {
                            const elements = document.querySelectorAll(selector);
                            elements.forEach(el => {
                              // If it's at the very bottom, move it up
                              const style = window.getComputedStyle(el);
                              if (style.position === 'fixed' || style.position === 'absolute') {
                                el.style.setProperty('bottom', window.innerWidth < 768 ? '140px' : '120px', 'important');
                                el.style.setProperty('z-index', '999999', 'important');
                                el.style.setProperty('pointer-events', 'auto', 'important');
                              }
                            });
                          });
                        };
                        
                        reposition();
                        const observer = new MutationObserver(reposition);
                        observer.observe(document.body, { childList: true, subtree: true });
                        
                        setInterval(reposition, 2000);
                      };

                      document.body.appendChild(script);
                    })();
                  `
                }}
              />
            </ChatHistoryProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
