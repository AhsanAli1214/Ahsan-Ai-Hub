import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact & Support | Ahsan AI Hub",
  description: "Get in touch with Ahsan AI Hub support for help with our free AI tools. Direct WhatsApp and email support channels available.",
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: "Contact & Support - Ahsan AI Hub",
    description: "Direct contact channels for Ahsan AI Hub support and collaboration.",
    url: 'https://ahsan-ai-hub.vercel.app/contact',
    siteName: 'Ahsan AI Hub',
    images: [{ url: '/og-image.png' }],
  },
};

export { default } from './page';