import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Your Data, Your Control - Ahsan AI Hub",
  description: "Learn how Ahsan AI Hub protects your privacy. We don't store chats, require no login, and use zero tracking cookies. 100% private AI experience.",
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: "Privacy Policy - Ahsan AI Hub",
    description: "Our commitment to your privacy: No data collection, no login, no tracking.",
    url: 'https://ahsan-ai-hub.vercel.app/privacy',
    siteName: 'Ahsan AI Hub',
    images: [{ url: '/og-image.png' }],
  },
};

export { default } from './privacy-client';
