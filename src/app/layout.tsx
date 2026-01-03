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
    canonical: "https://ahsan-ai-hub.vercel.app",
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
    "AI Vision Assistant",
    "AI Video Summarizer",
    "AI Voice Chat",
    "Personalized Learning Paths",
    "AI Presentation Designer",
    "biometric AI lock",
    "secure chat sharing",
    "local chat history",
    "private AI storage",
    "anonymous AI backup",
    "encrypted chat sync",
    "biometric protected AI",
    "share AI chat transcript",
    "save AI conversation",
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
      "Use Ahsan AI Hub for free: AI chat assistant, text rewriter, and code explainer. Features biometric lock for privacy, secure chat sharing, and local chat history saving. 100% private, no login, developed by Ahsan Ali.",
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
import { siteStatusConfig } from "@/config/site-status";
import { MaintenanceOverlay } from "@/components/MaintenanceOverlay";
import { ComingSoonOverlay } from "@/components/ComingSoonOverlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* ... existing head ... */}
        </head>
        <body
          className={cn(
            "font-body antialiased",
            inter.variable,
            poppins.variable,
          )}
        >
          <Script
            src="https://my.hellobar.com/4fe5efe57e6d5c0a5537089958704c74668aef8f.js"
            strategy="afterInteractive"
          />
          {siteStatusConfig.mode === 'maintenance' && <MaintenanceOverlay />}
          {siteStatusConfig.mode === 'coming-soon' && <ComingSoonOverlay />}
          
          {siteStatusConfig.mode === 'live' ? (
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* ... existing live site structure ... */}
            </ThemeProvider>
          ) : null}
        </body>
      </html>
    </ViewTransitions>
  );
}


