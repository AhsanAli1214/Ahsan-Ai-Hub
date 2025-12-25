'use client';

import React, { useState, useMemo } from 'react';
import { useChatHistory } from '@/context/ChatHistoryContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, MessageSquare, Trash, AlertTriangle, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export function ChatHistory() {
  const { sessions, currentSessionId, createSession, switchSession, deleteSession, deleteAllSessions, getStorageUsage } = useChatHistory();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);

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
    setShowDeleteAll(true);
  };

  const handleConfirmDeleteAll = () => {
    deleteAllSessions();
    setShowDeleteAll(false);
    createSession('New Chat');
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

  const formatStorageSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const storageUsed = useMemo(() => getStorageUsage(), [sessions]);
  const totalMessages = useMemo(() => sessions.reduce((sum, s) => sum + s.messages.length, 0), [sessions]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border/50">
        <Button
          onClick={handleNewChat}
          className="w-full gap-2 rounded-lg bg-primary hover:bg-primary/90"
          variant="default"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-3 sm:p-4 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No chat history yet</p>
              <p className="text-xs mt-1 opacity-70">Start a new chat to begin</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  'p-3 cursor-pointer transition-all hover:bg-accent/10 group border-l-4 border-transparent',
                  currentSessionId === session.id 
                    ? 'bg-accent/15 border-accent/50 shadow-sm' 
                    : 'border-transparent hover:border-accent/30'
                )}
                onClick={() => switchSession(session.id)}
              >
                <div className="flex items-start gap-2 min-w-0">
                  <MessageSquare className={cn(
                    'h-4 w-4 shrink-0 mt-0.5 transition-colors',
                    currentSessionId === session.id ? 'text-accent' : 'text-muted-foreground'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1 break-words">
                      {session.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {session.messages.length} msg
                      </p>
                      <span className="text-xs text-muted-foreground/50">•</span>
                      <p className="text-xs text-muted-foreground/70">
                        {formatDate(session.updatedAt)}
                      </p>
                    </div>
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

      {/* Footer - Storage & Delete All */}
      {sessions.length > 0 && (
        <div className="border-t border-border/50 p-3 sm:p-4 space-y-3">
          {/* Storage Info */}
          <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Database className="h-3.5 w-3.5" />
              <span>Storage Usage</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Chat History</span>
                <Badge variant="secondary" className="text-xs">
                  {formatStorageSize(storageUsed)}
                </Badge>
              </div>
              <div className="flex justify-between text-xs">
                <span>Total Messages</span>
                <Badge variant="outline" className="text-xs">
                  {totalMessages}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground/60 mt-2">
                Clear unused history to optimize storage
              </p>
            </div>
          </div>

          {/* Delete All Button */}
          <Button
            onClick={handleDeleteAllClick}
            variant="destructive"
            size="sm"
            className="w-full gap-2"
          >
            <Trash className="h-4 w-4" />
            Delete All Chats
          </Button>
        </div>
      )}

      {/* Single Delete Confirmation */}
      <AlertDialog open={deleteTargetId !== null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="sm:max-w-md">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg">Delete Chat Session?</AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-sm">
                This chat session will be permanently deleted from your history. This action cannot be undone.
              </AlertDialogDescription>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Confirmation */}
      <AlertDialog open={showDeleteAll} onOpenChange={setShowDeleteAll}>
        <AlertDialogContent className="sm:max-w-md">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg">Delete All Chat History?</AlertDialogTitle>
              <AlertDialogDescription className="mt-3 text-sm space-y-2">
                <p>
                  <span className="font-semibold">Warning:</span> You are about to permanently delete all {sessions.length} chat session{sessions.length !== 1 ? 's' : ''}.
                </p>
                <p>
                  This will free up <Badge variant="outline">{formatStorageSize(storageUsed)}</Badge> of storage space and cannot be undone. All chat history will be lost.
                </p>
                <p className="text-xs text-muted-foreground/70 bg-muted/50 p-2 rounded border border-border/30 mt-2">
                  💡 Tip: Regularly clearing unused chat history helps keep your application running smoothly and saves browser storage space.
                </p>
              </AlertDialogDescription>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDeleteAll} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete All Chats
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
