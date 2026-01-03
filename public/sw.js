const CACHE_NAME = 'ahsan-ai-hub-v4-2026-01-03';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/about',
  '/content-tools',
  '/faq',
  '/contact',
  '/settings',
  '/chat-history',
  '/recommendations',
  '/features',
  '/privacy',
  '/terms',
  '/data-rights',
  '/cookies',
  '/download-apk',
  '/api-reference',
  '/community',
  '/blog',
  '/careers',
  '/docs',
  OFFLINE_URL,
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/logo.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );
      }),
      self.clients.claim(),
      // Keep service worker alive
      'periodicSync' in self.registration ? 
        self.registration.periodicSync.register('app-keep-alive', {
          minInterval: 24 * 60 * 60 * 1000 
        }) : Promise.resolve()
    ])
  );
});

// Real-time Push Notifications
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : 'New update from Ahsan AI Hub!' };
  }
  
  const title = data.title || 'Ahsan AI Hub';
  const options = {
    body: data.body || 'Open the app to see what is new.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: 'ahsan-ai-notification',
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || '/recommendations'
    },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background Sync for feedback or other data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    // Implement sync logic if needed
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
