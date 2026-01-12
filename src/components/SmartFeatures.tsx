'use client';

import React, { useState, useEffect } from 'react';
import { Search, History, Clock, MessageSquare, ArrowRight, Zap, PenTool } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChatHistory, ChatSession } from '@/context/ChatHistoryContext';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SmartWidgets() {
  const { sessions } = useChatHistory();
  const recentSessions = sessions.slice(0, 2);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Chat Snippet Widget */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-lg transition-all hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Recent Chats
          </CardTitle>
          <Button variant="ghost" size="icon" asChild className="h-6 w-6">
            <Link href="/chat-history"><ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          {recentSessions.length > 0 ? (
            <div className="space-y-2 mt-2">
              {recentSessions.map((session) => (
                <Link 
                  key={session.id} 
                  href="/recommendations" 
                  className="block p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20"
                >
                  <p className="text-xs font-semibold truncate">{session.title}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 italic">
                    {session.messages[session.messages.length - 1]?.content || 'Empty chat'}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-xs text-muted-foreground italic">No recent chats found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Access Tools Widget */}
      <Card className="overflow-hidden border-accent/20 bg-gradient-to-br from-background to-accent/5 shadow-lg transition-all hover:shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 mt-1">
          <Button asChild variant="outline" size="sm" className="h-14 flex-col gap-1 rounded-xl bg-background/50 border-accent/10 hover:bg-accent/10 hover:border-accent/30">
            <Link href="/recommendations">
              <MessageSquare className="h-4 w-4" />
              <span className="text-[10px] font-bold">AI Chat</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-14 flex-col gap-1 rounded-xl bg-background/50 border-accent/10 hover:bg-accent/10 hover:border-accent/30">
            <Link href="/content-tools">
              <PenTool className="h-4 w-4" />
              <span className="text-[10px] font-bold">Tools</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function LocalHistorySearch() {
  const { sessions } = useChatHistory();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = sessions.filter(session => {
      // Search in title
      if (session.title.toLowerCase().includes(searchTerm)) return true;
      
      // Search in messages content
      return session.messages.some(msg => msg.content.toLowerCase().includes(searchTerm));
    });

    setResults(filtered.slice(0, 5));
  }, [query, sessions]);

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search your offline history..."
          className="pl-10 h-12 rounded-2xl bg-muted/50 border-primary/10 focus-visible:ring-primary shadow-inner"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query && (
        <div className="rounded-2xl border bg-background/50 backdrop-blur-sm p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b mb-1">
            {results.length} results found
          </p>
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((session) => (
                <Link
                  key={session.id}
                  href="/recommendations"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{session.title}</p>
                    <p className="text-xs text-muted-foreground truncate italic">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No matches found in your local history.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
