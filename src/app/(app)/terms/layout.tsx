import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Fair Usage Policy - Ahsan AI Hub",
  description: "Review the terms and conditions for using Ahsan AI Hub. Learn about our service disclaimer, acceptable use, and commitment to free access.",
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: "Terms of Service - Ahsan AI Hub",
    description: "Fair usage policy and service agreement for the world's most private free AI hub.",
    url: 'https://ahsan-ai-hub.vercel.app/terms',
    siteName: 'Ahsan AI Hub',
    images: [{ url: '/og-image.png' }],
  },
};

export { default } from './page';
