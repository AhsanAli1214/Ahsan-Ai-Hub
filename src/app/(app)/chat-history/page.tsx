import { AppHeader } from '@/components/layout/AppHeader';
import { ChatHistory } from '@/components/ChatHistory';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat History | Ahsan Ai Hub',
  description: 'Manage and review your past AI conversations.',
};

export default function ChatHistoryPage() {
  return (
    <div className="flex h-full flex-col bg-background selection:bg-primary/20">
      <AppHeader title="Chat History" />
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto h-full pb-24">
          <ChatHistory />
        </div>
      </div>
    </div>
  );
}
