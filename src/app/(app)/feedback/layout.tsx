import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Your Feedback | Ahsan AI Hub - Improve Your AI Experience",
  description: "Your feedback helps us grow. Tell us what you think about Ahsan AI Hub's free AI tools, chat experience, and privacy-first features. Help us build the best free AI hub.",
  alternates: {
    canonical: '/feedback',
  },
  keywords: ['Ahsan AI feedback', 'suggest AI features', 'report AI bugs', 'Ahsan Ali AI help', 'improve free AI chat'],
  openGraph: {
    title: "Feedback - Ahsan AI Hub | Shape the Future of Free AI",
    description: "Help us improve the world's most private free AI hub by sharing your experience. We value your opinion!",
    url: 'https://ahsan-ai-hub.vercel.app/feedback',
    siteName: 'Ahsan AI Hub',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Share Your Feedback | Ahsan AI Hub',
    description: 'Tell us how to make Ahsan AI Hub better for you. No login required.',
    images: ['/og-image.png'],
  },
};

export { default } from './page';
