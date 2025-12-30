'use client';

import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { ChatInterface } from '@/components/recommendations/ChatInterface';

export default function RecommendationsPage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('initialPrompt') || '';

  return (
    <div className="flex h-full flex-col bg-background md:pb-0">
      <AppHeader title="AI Chat" />
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          initialPrompt={initialPrompt}
        />
      </div>
    </div>
  );
}
