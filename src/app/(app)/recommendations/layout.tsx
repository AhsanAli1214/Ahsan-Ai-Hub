import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Chat Assistant - Ahsan AI Hub',
  description: 'Experience the world\'s best free AI chat with no login required. Private, secure, and powered by advanced language models like Gemini 2.5 Flash.',
  alternates: {
    canonical: '/recommendations',
  },
};

export default function RecommendationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
