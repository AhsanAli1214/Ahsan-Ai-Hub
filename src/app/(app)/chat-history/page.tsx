import { AppHeader } from '@/components/layout/AppHeader';
import { ChatHistory } from '@/components/ChatHistory';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat History | Ahsan Ai Hub',
  description: 'Manage and review your past AI conversations.',
};

export default function ChatHistoryPage() {
  return (
    <div className="flex h-full flex-col bg-background">
      <AppHeader title="Chat History" />
      <div className="flex-1 overflow-auto">
        <div className="container max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-12">
          <ChatHistory />
        </div>
      </div>
    </div>
  );
}
