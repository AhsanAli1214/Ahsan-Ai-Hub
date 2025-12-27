'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { ChatInterface } from '@/components/recommendations/ChatInterface';

export default function RecommendationsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const initialPrompt = searchParams?.initialPrompt || '';

  return (
    <div className="flex h-full flex-col bg-background md:pb-0">
      <AppHeader title="AI Chat" />
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          initialPrompt={
            Array.isArray(initialPrompt) ? initialPrompt[0] : initialPrompt
          }
        />
      </div>
    </div>
  );
}
