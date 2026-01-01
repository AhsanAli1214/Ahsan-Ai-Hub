import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact & Support | Ahsan AI Hub - Get Free AI Help Now",
  description: "Get in touch with Ahsan AI Hub support for help with our free AI tools. Direct WhatsApp and email support channels available for technical help and collaboration.",
  alternates: {
    canonical: '/contact',
  },
  keywords: ['contact Ahsan AI', 'AI support help', 'Ahsan Ali WhatsApp', 'free AI tool support', 'collaborate with Ahsan AI'],
  openGraph: {
    title: "Contact & Support - Ahsan AI Hub | Direct Support Channels",
    description: "Direct contact channels for Ahsan AI Hub support and collaboration. WhatsApp, Instagram, and Email available.",
    url: 'https://ahsan-ai-hub.vercel.app/contact',
    siteName: 'Ahsan AI Hub',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact & Support | Ahsan AI Hub',
    description: 'Directly connect with the Ahsan AI Hub team for help and feedback.',
    images: ['/og-image.png'],
  },
};

export { default } from './page';