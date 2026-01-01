'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { ChatInterface } from '@/components/recommendations/ChatInterface';

export default function RecommendationsPage() {
  useEffect(() => {
    document.title = "Free AI Chat Online - Ahsan AI Hub";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Experience the world's best free AI chat with no login required. Private, secure, and powered by advanced language models.");
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', "https://ahsan-ai-hub.vercel.app/recommendations");
  }, []);

  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('initialPrompt') || '';

  return (
    <main className="flex h-full flex-col bg-background md:pb-0" aria-labelledby="chat-heading">
      <AppHeader title="AI Chat" />
      <h1 id="chat-heading" className="sr-only">Free AI Chat Online - Ahsan AI Hub</h1>
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          initialPrompt={initialPrompt}
        />
      </div>
    </main>
  );
}
