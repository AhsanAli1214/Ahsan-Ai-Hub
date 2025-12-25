'use client';

import React, { useState } from 'react';
import { useChatHistory } from '@/context/ChatHistoryContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ChatHistory() {
  const { sessions, currentSessionId, createSession, switchSession, deleteSession } = useChatHistory();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleNewChat = () => {
    createSession();
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteSession(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 border-b">
        <Button
          onClick={handleNewChat}
          className="w-full gap-2 rounded-lg"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 sm:p-4 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No chat history yet. Start a new chat!
            </div>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  'p-3 cursor-pointer transition-all hover:bg-accent/10 group',
                  currentSessionId === session.id ? 'bg-accent/20 border-accent/50' : ''
                )}
                onClick={() => switchSession(session.id)}
              >
                <div className="flex items-start gap-2 min-w-0">
                  <MessageSquare className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1 break-words">
                      {session.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {formatDate(session.updatedAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteClick(e, session.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <AlertDialog open={deleteTargetId !== null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Chat Session?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The chat history will be permanently deleted.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
