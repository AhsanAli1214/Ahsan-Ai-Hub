'use client';

import React, { useState } from 'react';
import { useChatHistory } from '@/context/ChatHistoryContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, MessageSquare, AlertTriangle, HardDrive } from 'lucide-react';
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
  const { sessions, currentSessionId, createSession, switchSession, deleteSession, deleteAllSessions } = useChatHistory();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showDeleteAllWarning, setShowDeleteAllWarning] = useState(false);

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

  const handleDeleteAllClick = () => {
    setShowDeleteAllWarning(true);
  };

  const handleConfirmDeleteAll = () => {
    deleteAllSessions();
    setShowDeleteAllWarning(false);
  };

  const calculateTotalStorage = () => {
    let totalChars = 0;
    sessions.forEach(session => {
      totalChars += session.title.length;
      session.messages.forEach(msg => {
        totalChars += msg.content.length;
      });
    });
    return (totalChars * 2 / 1024).toFixed(2); // Rough estimate in KB
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
      <div className="p-3 sm:p-4 border-b space-y-2">
        <Button
          onClick={handleNewChat}
          className="w-full gap-2 rounded-lg"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        {sessions.length > 0 && (
          <Button
            onClick={handleDeleteAllClick}
            className="w-full gap-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
            variant="outline"
          >
            <Trash2 className="h-4 w-4" />
            Delete All
          </Button>
        )}
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
        <AlertDialogContent className="max-w-sm">
          <div className="flex gap-3 items-start mb-2">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <AlertDialogTitle className="text-lg">Delete This Chat Session?</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                This action cannot be undone. The chat history and all messages in this session will be permanently deleted from your device.
              </AlertDialogDescription>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete Session
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteAllWarning} onOpenChange={setShowDeleteAllWarning}>
        <AlertDialogContent className="max-w-sm">
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <AlertDialogTitle className="text-lg">Delete All Chat Sessions?</AlertDialogTitle>
                <AlertDialogDescription className="mt-2 leading-relaxed">
                  This will permanently delete <span className="font-semibold text-foreground">{sessions.length} chat session{sessions.length !== 1 ? 's' : ''}</span> and all associated messages from your device.
                </AlertDialogDescription>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 space-y-2">
              <div className="flex gap-2 items-start text-sm">
                <HardDrive className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-950 dark:text-amber-100">Storage & Performance Benefits:</p>
                  <ul className="text-amber-900 dark:text-amber-200 space-y-1 mt-1">
                    <li>• Free up <span className="font-medium">{calculateTotalStorage()} KB</span> of device storage</li>
                    <li>• Improve website performance and speed</li>
                    <li>• Reduce memory usage for faster browsing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                💡 <span className="font-medium">Tip:</span> Consider deleting old or unnecessary sessions periodically to keep your chat history organized and maintain optimal browsing experience.
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteAll} className="bg-destructive hover:bg-destructive/90">
              Delete All Sessions
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
