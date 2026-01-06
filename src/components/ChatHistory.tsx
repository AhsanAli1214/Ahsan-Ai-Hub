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

import { useRouter } from 'next/navigation';

export function ChatHistory() {
  const router = useRouter();
  const { sessions, currentSessionId, createSession, switchSession, deleteSession, deleteAllSessions } = useChatHistory();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showDeleteAllWarning, setShowDeleteAllWarning] = useState(false);

  const handleNewChat = () => {
    createSession();
    router.push('/recommendations');
  };

  const handleSessionClick = (id: string) => {
    switchSession(id);
    router.push('/recommendations');
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
    <div className="flex flex-col h-full bg-background/50">
      <div className="p-4 border-b bg-card/50 backdrop-blur-sm space-y-3">
        <div className="flex gap-2">
          <Button
            onClick={handleNewChat}
            className="flex-1 gap-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 font-semibold"
            variant="default"
          >
            <Plus className="h-5 w-5" />
            New Conversation
          </Button>
          {sessions.length > 0 && (
            <Button
              onClick={handleDeleteAllClick}
              className="gap-2 rounded-xl bg-destructive/5 text-destructive hover:bg-destructive/15 transition-colors border-destructive/10"
              variant="outline"
              size="icon"
              title="Clear all history"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {sessions.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              <HardDrive className="h-3 w-3" />
              <span>Storage: {calculateTotalStorage()} KB</span>
            </div>
            <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary/40 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(parseFloat(calculateTotalStorage()) / 10, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="bg-muted/30 p-4 rounded-full">
                <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground max-w-[180px]">Your AI chat history will appear here for quick access.</p>
              </div>
            </div>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  'relative group border-transparent transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer',
                  currentSessionId === session.id 
                    ? 'bg-primary/5 border-primary/20 shadow-sm' 
                    : 'bg-card border-border/40 hover:bg-accent/5'
                )}
                onClick={() => handleSessionClick(session.id)}
              >
                {currentSessionId === session.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                )}
                
                <div className="p-4">
                  <div className="flex items-start gap-2 min-w-0">
                    <div className={cn(
                      "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-colors",
                      currentSessionId === session.id ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
                    )}>
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold truncate">
                          {session.title}
                        </p>
                        <span className="text-[10px] font-medium text-muted-foreground/60 whitespace-nowrap">
                          {formatDate(session.updatedAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted/50 text-muted-foreground/80 uppercase">
                          {session.messages.length} messages
                        </span>
                        {session.messages.length > 0 && (
                          <p className="text-[11px] text-muted-foreground truncate italic">
                            "{session.messages[session.messages.length - 1].content.substring(0, 30)}..."
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-lg p-0 flex-shrink-0 opacity-60 hover:opacity-100 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => handleDeleteClick(e, session.id)}
                      title="Delete conversation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
