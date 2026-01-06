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
      <div className="flex-1 overflow-hidden">
        <div className="container max-w-4xl mx-auto h-full p-4 md:p-6">
          <div className="bg-card border rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-muted/30">
              <h2 className="text-lg font-semibold">Past Conversations</h2>
              <p className="text-sm text-muted-foreground">Reuse, delete, or manage your chat history sessions.</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
