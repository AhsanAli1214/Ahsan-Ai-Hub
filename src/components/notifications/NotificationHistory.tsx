'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Clock, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export function NotificationHistory() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('ahsan-notification-history');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse notification history');
      }
    }

    // Listener for new notifications added by the bridge
    const handleNewNotification = () => {
      const updated = localStorage.getItem('ahsan-notification-history');
      if (updated) {
        setNotifications(JSON.parse(updated));
      }
    };

    window.addEventListener('notification-history-updated', handleNewNotification);
    return () => window.removeEventListener('notification-history-updated', handleNewNotification);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('ahsan-notification-history');
    setNotifications([]);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('ahsan-notification-history', JSON.stringify(updated));
  };

  if (notifications.length === 0) {
    return (
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="h-6 w-6 text-muted-foreground opacity-20" />
          </div>
          <p className="text-sm text-muted-foreground">No notification history yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pb-4 pt-0 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Recent Updates
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
            Mark read
          </Button>
          <Button variant="ghost" size="sm" onClick={clearHistory} className="text-xs h-8 text-destructive hover:text-destructive">
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {notifications.sort((a, b) => b.timestamp - a.timestamp).map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  notif.read ? 'bg-background/50 border-border/50' : 'bg-primary/5 border-primary/20 ring-1 ring-primary/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm leading-tight pr-4">{notif.title}</h4>
                  {!notif.read && <Badge variant="default" className="text-[10px] h-4 px-1">New</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{notif.message}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground opacity-60">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
