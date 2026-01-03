import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/contexts/theme-context";
import { AppProvider } from "@/context/AppContext";
import { ChatHistoryProvider } from "@/context/ChatHistoryContext";
import { PWAInstall } from "@/components/PWAInstall";
import { ConnectionStatus } from "@/components/network/ConnectionStatus";
import { ReCaptchaScript } from "@/components/ReCaptcha";
import Script from "next/script";
import { Inter, Poppins } from "next/font/google";
import { ErrorBoundary } from "@/components/error-boundary";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import { InAppAnnouncement } from "@/components/InAppAnnouncement";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ahsan-ai-hub.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Ahsan Ai Hub - #1 Free AI Chat, Writing & Code Tools No Login",
    template: "%s | Ahsan Ai Hub",
  },
  description:
    "Ahsan AI Hub by Ahsan Ali Wadani: The world's best free AI chat assistant with no login required. Access premium AI writing, blog generation, resume building, code explaining, and math solving tools for free. 100% private, zero signup, and developed by Ahsan Ali.",
  keywords: [
    "Ahsan AI",
    "Ahsan Ai Hub",
    "Ahsan Ali AI",
    "Ahsan Ali Wadani",
    "Ahsan Wadani",
    "free AI chat no login",
    "best free AI chatbot 2026",
    "AI writer free no signup",
    "AI math solver online free",
    "AI code explainer no login",
    "AI resume builder free",
    "anonymous AI chat",
    "privacy-first AI",
    "no login AI assistant",
    "free AI writing tools",
    "AI blog generator free",
    "AI study assistant free",
    "free AI translation online",
    "advanced AI companion",
    "free AI productivity hub",
    "unlimited free AI tools",
    "Ahsan AI Hub by Ahsan Ali",
    "best free AI 2026",
    "Ahsan AI feedback",
    "AI tool suggestions",
    "privacy-first AI feedback",
    "google genkit ai tools",
    "nextjs 15 ai hub",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ahsan Ai Hub",
    startupImage: [
      {
        url: "/icon-512.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  itunes: {
    appId: "com.ahsan_ai_hub.twa",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ahsan-ai-hub.vercel.app",
    siteName: "Ahsan AI Hub by Ahsan Ali",
    title: "Ahsan AI Hub - #1 Best Free AI Assistant 2026 | No Login Required",
    description:
      "Use Ahsan AI Hub for free: AI chat assistant, text rewriter, code explainer, math solver, and 50+ language translator. 100% private, no login, developed by Ahsan Ali.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahsan AI Hub - The World's Most Powerful Privacy-First Free AI Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ahsan_Ali_12",
    creator: "@Ahsan_Ali_12",
    title: "Ahsan AI Hub - Free AI Chat & Professional Tools (No Signup)",
    description:
      "Experience the world's most private free AI hub. Developed by Ahsan Ali. Features advanced chat, writing, and coding tools without login.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "C3kD33pr8zGcgloDD-hhPTHJVKhicxKot5N39asPcX4",
  },
};

import { ViewTransitions } from "next-view-transitions";

import { CookieBanner } from "@/components/CookieBanner";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { announcementConfig } from "@/config/announcement";
import { BiometricLock } from "@/components/BiometricLock";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            rel="preload"
            href="/logo.png"
            as="image"
            type="image/png"
            fetchPriority="high"
          />
          <link
            rel="preconnect"
            href="https://cdn.onesignal.com"
            crossOrigin="anonymous"
          />
          <link rel="dns-prefetch" href="https://cdn.onesignal.com" />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link rel="preconnect" href="https://vitals.vercel-analytics.com" />
          <link rel="preconnect" href="https://va.vercel-scripts.com" />
          <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
          <link rel="dns-prefetch" href="https://www.google.com" />
          <link
            rel="preconnect"
            href="https://www.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://i.postimg.cc"
            crossOrigin="anonymous"
          />
          <link rel="dns-prefetch" href="https://i.postimg.cc" />
          <link
            rel="preconnect"
            href="https://images.unsplash.com"
            crossOrigin="anonymous"
          />
          <link rel="dns-prefetch" href="https://images.unsplash.com" />
          <link
            rel="preconnect"
            href="https://www.google-analytics.com"
            crossOrigin="anonymous"
          />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link
            rel="preconnect"
            href="https://www.googletagmanager.com"
            crossOrigin="anonymous"
          />
          <meta
            name="theme-color"
            content="#3b82f6"
            media="(prefers-color-scheme: light)"
          />
          <meta
            name="theme-color"
            content="#1e1b4b"
            media="(prefers-color-scheme: dark)"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="mobile-web-app-capable" content="yes" />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icon-192.png"
          />
          <link rel="apple-touch-icon" href="/icon-192.png" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
          />
          <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('selectedColorTheme') || 'default';
                  document.documentElement.setAttribute('data-theme', theme);
                  const isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Theme init failed', e);
                }
              })();
            `,
          }}
        />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Ahsan AI Hub",
                alternateName: "Ahsan Ai Hub",
                url: "https://ahsan-ai-hub.vercel.app",
                description:
                  "Privacy-first free AI hub by Ahsan Ali. High-performance AI chat, writing, and translation tools. No login required.",
                applicationCategory: "AI Assistant",
                operatingSystem: "All",
                author: {
                  "@type": "Person",
                  name: "Ahsan Ali",
                  url: "https://github.com/AhsanAli1214",
                },
              }),
            }}
          />
        </head>
        <body
          className={cn(
            "font-body antialiased",
            inter.variable,
            poppins.variable,
          )}
        >
          <Script
            id="json-ld"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([
                {
                  "@context": "https://schema.org",
                  "@type": "WebApplication",
                  name: "Ahsan AI Hub",
                  alternateName: "Ahsan AI",
                  url: "https://ahsan-ai-hub.vercel.app",
                  description:
                    "The world's #1 privacy-first free AI companion. Developed by Ahsan Ali. Features free AI chat, text rewriting, math solving, and 50+ language translation.",
                  applicationCategory: "ProductivityApplication",
                  operatingSystem: "All",
                  author: {
                    "@type": "Person",
                    name: "Ahsan Ali",
                    url: "https://github.com/AhsanAli1214",
                  },
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                  featureList: [
                    "Free AI Chat Assistant",
                    "AI Blog Post Generator",
                    "AI Code Explainer & Debugger",
                    "Free AI Resume Builder",
                    "AI Math Solver",
                    "50+ Language AI Translator",
                  ],
                },
                {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "Ahsan AI Hub",
                  url: "https://ahsan-ai-hub.vercel.app",
                  logo: "https://ahsan-ai-hub.vercel.app/icon-512.png",
                  contactPoint: {
                    "@type": "ContactPoint",
                    email: "tickets@ahsan-ai-hub.p.tawk.email",
                    contactType: "technical support",
                  },
                  sameAs: [
                    "https://twitter.com/Ahsan_Ali_12",
                    "https://github.com/AhsanAli1214",
                    "https://www.instagram.com/ahsan.ali.wadani",
                  ],
                },
              ]),
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
                <BiometricLock>
                  <ErrorBoundary>
                    {announcementConfig.showBanner && (
                      <AnnouncementBanner
                        id={announcementConfig.id}
                        title={announcementConfig.title}
                        message={announcementConfig.message}
                        imageUrl={announcementConfig.imageUrl}
                        senderName={announcementConfig.senderName}
                        ctaText={announcementConfig.ctaText}
                        ctaLink={announcementConfig.ctaLink}
                      />
                    )}
                    <Suspense fallback={null}>{children}</Suspense>
                  </ErrorBoundary>
                </BiometricLock>
                <Toaster />
                <CookieBanner />
                <FeedbackDialog />
                <Suspense fallback={null}>
                  <PWAInstall />
                </Suspense>
                <Suspense fallback={null}>
                  <ConnectionStatus />
                </Suspense>
                <Analytics mode={"production"} />
                <SpeedInsights />
          {/* Load OneSignal with lower priority */}
          <Script
            src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
            strategy="lazyOnload"
            async
          />
          <Script
            id="onesignal-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              try {
                await OneSignal.init({
                  appId: "8a693786-f992-42d3-adfb-56a230adcea5",
                  allowLocalhostAsSecureOrigin: true,
                  serviceWorkerParam: { scope: "/" },
                  serviceWorkerPath: "OneSignalSDKWorker.js",
                });
              } catch (e) {
                // Silent error handling for OneSignal
              }
            });
        `,
            }}
          />
          <Script
            src="https://botsailor.com/script/webchat-link.js?code=1767382948126993"
            strategy="lazyOnload"
          />
                <Script
                  id="sw-registration"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      if ('serviceWorker' in navigator) {
                        window.addEventListener('load', function() {
                          // Standard Service Worker for PWA
                          navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(registration) {
                            console.log('PWA ServiceWorker registration successful with scope: ', registration.scope);
                          }, function(err) {
                            console.log('PWA ServiceWorker registration failed: ', err);
                          });

                          // Ensure OneSignal Worker is also registered properly
                          navigator.serviceWorker.register('/OneSignalSDKWorker.js', { scope: '/' }).then(function(registration) {
                            console.log('OneSignal Worker registration successful with scope: ', registration.scope);
                          }).catch(function(err) {
                            console.log('OneSignal Worker registration failed: ', err);
                          });
                        });
                      }
                    `,
                  }}
                />
              </ChatHistoryProvider>
            </AppProvider>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
