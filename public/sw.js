const CACHE_NAME = 'ahsan-ai-hub-v2';
const urlsToCache = [
  '/',
  '/recommendations',
  '/content-tools',
  '/about',
  '/contact',
  '/settings',
  '/globals.css',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Import OneSignal service worker
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use addAll but catch individual failures to ensure some caching happens
      return Promise.allSettled(
        urlsToCache.map(url => cache.add(url))
      ).then(results => {
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length > 0) {
          console.warn('Some PWA assets failed to cache during install:', failed);
        }
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and AI API calls for caching, but handle them for offline UX
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  
  // Don't cache AI API routes or external analytics
  if (url.pathname.startsWith('/api/ai') || 
      url.hostname.includes('google-analytics') || 
      url.hostname.includes('onesignal')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback for navigation requests when offline
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return null;
      });
    })
  );
});
