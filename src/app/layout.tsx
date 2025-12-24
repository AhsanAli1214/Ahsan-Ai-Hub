import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/contexts/theme-context';
import { AppProvider } from '@/context/AppContext';
import { PWAInstall } from '@/components/PWAInstall';
import Script from 'next/script';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#3b82f6',
};

export const metadata: Metadata = {
  title: 'Ahsan AI Hub - Smart AI Chat, Content Tools & Automation',
  description: 'Ahsan AI Hub is an AI-powered platform offering smart chat, automation, and creative AI tools. Get instant help with writing, coding, brainstorming, and problem solving.',
  keywords: 'AI chat, content tools, AI writing, code explanation, brainstorming, AI assistant',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ahsan Ai Hub',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Ahsan AI Hub - Your Intelligent AI Companion',
    description: 'An AI-powered platform for smart chat, content creation, and automation',
    url: 'https://ahsan-ai-hub.vercel.app',
    siteName: 'Ahsan AI Hub',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Ahsan AI Hub Logo',
      },
    ],
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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ahsan AI Hub" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('selectedColorTheme') || 'default';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
        <Script id="pwa-register" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => {
              console.error('Service Worker registration failed:', err);
            });
          }
        `}} />
        <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" async />
        <Script id="onesignal-sdk-init" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: `
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          window.OneSignalDeferred.push(async function(OneSignal) {
            try {
              if (typeof OneSignal === 'undefined') {
                console.warn('OneSignal SDK not loaded');
                return;
              }
              
              await OneSignal.init({
                appId: "8a693786-f992-42d3-adfb-56a230adcea5",
                safari_web_id: "web.onesignal.auto.1592f4e8-7629-48b3-b916-fa35b5011e11",
                allowLocalhostAsSecureOrigin: true,
              });
              
              console.log('OneSignal initialized successfully');
            } catch (error) {
              console.error('OneSignal initialization error:', error);
            }
          });
        `}} />
      </head>
      <body className={cn('font-body antialiased', inter.variable, poppins.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            {children}
            <Toaster />
            <PWAInstall />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
