'use client';

import { useEffect } from 'react';

/**
 * Notification Bridge
 * This component handles OneSignal foreground events and syncs them to LocalStorage
 * so the NotificationHistory component can display them in real-time.
 * The UI dialog has been removed as per user request.
 */
export function InAppAnnouncement() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).OneSignal) {
      const OneSignal = (window as any).OneSignal;
      
      const handleNotification = (event: any) => {
        console.log('OneSignal Notification Received:', event);
        const notification = event.notification;
        
        const newNotif = {
          id: notification.notificationId || (Date.now().toString()),
          title: notification.title || 'New Update',
          message: notification.body || '',
          timestamp: Date.now(),
          read: false,
          image: notification.image || notification.bigPicture || notification.largeIcon || null
        };

        // Update History in LocalStorage
        const history = JSON.parse(localStorage.getItem('ahsan-notification-history') || '[]');
        
        // Prevent duplicates
        if (!history.find((h: any) => h.id === newNotif.id)) {
          // Keep only the last 5 notifications
          const updatedHistory = [newNotif, ...history].slice(0, 5);
          localStorage.setItem('ahsan-notification-history', JSON.stringify(updatedHistory));
          
          // Trigger event for history component to refresh in real-time
          window.dispatchEvent(new CustomEvent('notification-history-updated'));
        }
      };

      try {
        // OneSignal 16.x event names
        OneSignal.Notifications.addEventListener('foregroundWillDisplay', handleNotification);
        OneSignal.Notifications.addEventListener('click', handleNotification);
      } catch (err) {
        console.error('Error adding OneSignal listeners:', err);
      }
    }
  }, []);

  return null; // UI removed as requested
}
