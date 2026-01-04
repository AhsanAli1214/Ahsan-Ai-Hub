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
    <div className="flex flex-col h-full bg-card border border-border/40 rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-md">
      <div className="p-8 border-b bg-muted/20">
        <h2 className="text-2xl font-black tracking-tight">Past Conversations</h2>
        <p className="text-sm font-medium text-muted-foreground mt-1">Reuse, delete, or manage your chat history sessions.</p>
      </div>
      <div className="p-8 border-b bg-card/50 backdrop-blur-sm space-y-6">
        <div className="flex gap-4">
          <Button
            onClick={handleNewChat}
            className="flex-1 h-14 gap-3 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 font-black uppercase tracking-widest text-xs"
            variant="default"
          >
            <Plus className="h-5 w-5" />
            New Conversation
          </Button>
          {sessions.length > 0 && (
            <Button
              onClick={handleDeleteAllClick}
              className="h-14 w-14 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all border border-destructive/20 shadow-lg shadow-destructive/5"
              variant="outline"
              size="icon"
              title="Clear all history"
            >
              <Trash2 className="h-6 w-6" />
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
        <div className="p-8 space-y-4">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="bg-primary/10 p-6 rounded-[2rem] border border-primary/20 shadow-2xl shadow-primary/10">
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black tracking-tight">No conversations yet</p>
                <p className="text-sm font-medium text-muted-foreground max-w-[240px] leading-relaxed">Your AI chat history will appear here for quick access.</p>
              </div>
            </div>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  'relative group border-border/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 active:scale-[0.98] cursor-pointer rounded-[2rem] overflow-hidden',
                  currentSessionId === session.id 
                    ? 'bg-primary/5 border-primary/30 shadow-xl shadow-primary/5' 
                    : 'bg-card/40 hover:bg-accent/10'
                )}
                onClick={() => handleSessionClick(session.id)}
              >
                {currentSessionId === session.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(59,130,246,0.5)]" />
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={cn(
                      "h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg",
                      currentSessionId === session.id ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted/50 text-muted-foreground border border-border/40"
                    )}>
                      <MessageSquare className="h-7 w-7" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-lg font-black truncate tracking-tight text-foreground group-hover:text-primary transition-colors">
                          {session.title}
                        </p>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap bg-muted/30 px-2 py-1 rounded-full">
                          {formatDate(session.updatedAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-primary/10 text-primary uppercase tracking-wider border border-primary/10">
                          {session.messages.length} messages
                        </span>
                        {session.messages.length > 0 && (
                          <p className="text-xs font-medium text-muted-foreground truncate italic opacity-70 group-hover:opacity-100 transition-opacity">
                            "{session.messages[session.messages.length - 1].content.substring(0, 45)}..."
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 rounded-xl p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive/20 hover:text-destructive active:scale-90"
                      onClick={(e) => handleDeleteClick(e, session.id)}
                      title="Delete conversation"
                    >
                      <Trash2 className="h-5 w-5" />
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
