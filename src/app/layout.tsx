import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/contexts/theme-context';
import { AppProvider } from '@/context/AppContext';
import { PWAInstall } from '@/components/PWAInstall';
import { ColorThemeInitializer } from '@/components/ColorThemeInitializer';
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
  title: 'Ahsan Ai Hub',
  description: 'Your Intelligent AI Companion',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ahsan Ai Hub',
  },
  formatDetection: {
    telephone: false,
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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ahsan AI Hub" />
        <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer />
        <Script id="pwa-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js').catch(err => {
                console.log('Service Worker registration failed:', err);
              });
            }
          `}
        </Script>
      </head>
      <body className={cn('font-body antialiased', inter.variable, poppins.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ColorThemeInitializer />
          <AppProvider>
            {children}
            <Toaster />
            <PWAInstall />
          </AppProvider>
        </ThemeProvider>
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(async function(OneSignal) {
                try {
                  await OneSignal.init({
                    appId: "8a693786-f992-42d3-adfb-56a230adcea5",
                    safari_web_id: "web.onesignal.auto.1592f4e8-7629-48b3-b916-fa35b5011e11",
                    notifyButton: {
                      enable: true,
                    },
                  });
                } catch (error) {
                  console.log('OneSignal initialization skipped for development environment');
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
