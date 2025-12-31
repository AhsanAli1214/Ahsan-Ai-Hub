'use client';

import React, { useEffect, useState } from 'react';
import { X, Bell, Info, Star, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export function InAppAnnouncement() {
  const [announcement, setAnnouncement] = useState<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'update' | 'news';
    active: boolean;
  } | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).OneSignal) {
      const OneSignal = (window as any).OneSignal;
      
      const handleNotification = (event: any) => {
        // Log for debugging PWA/Mobile
        console.log('OneSignal Notification Received:', event);
        
        const notification = event.notification;
        
        // Force reset visibility to handle consecutive notifications
        setIsVisible(false);
        
        // Use a small timeout to ensure the state reset is processed before showing the new one
        setTimeout(() => {
          setAnnouncement({
            id: notification.notificationId + Date.now(), // Ensure unique ID for React reconciliation
            title: notification.title || 'New Update',
            message: notification.body || '',
            type: 'news',
            active: true,
          });
          setIsVisible(true);
        }, 100);
      };

      // Add with try-catch for robustness in PWA environment
      try {
        OneSignal.Notifications.addEventListener('foregroundWillDisplay', handleNotification);
        OneSignal.Notifications.addEventListener('click', handleNotification);
      } catch (err) {
        console.error('Error adding OneSignal listeners:', err);
      }
    }
  }, []);

  const handleDismiss = () => {
    if (announcement) {
      localStorage.setItem('dismissed-announcement', announcement.id);
      setIsVisible(false);
    }
  };

  if (!announcement || !isVisible) return null;

  const Icon = {
    info: Info,
    update: Star,
    news: Megaphone,
  }[announcement.type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-20 left-4 right-4 z-[100] md:bottom-8 md:left-auto md:right-8 md:w-96"
      >
        <div className="relative overflow-hidden rounded-2xl bg-card border border-primary/20 shadow-2xl p-5 backdrop-blur-xl bg-opacity-95">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 space-y-1 pr-6">
              <h3 className="font-bold text-sm leading-none">{announcement.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {announcement.message}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={handleDismiss} variant="outline" className="text-xs h-8 rounded-lg">
              Got it
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
