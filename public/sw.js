// Advanced Service Worker for Ahsan AI Hub
const CACHE_NAME = 'ahsan-ai-hub-v7-1767807000';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/logo.png',
  '/manifest.json',
  '/globals.css'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
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
      self.clients.claim()
    ])
  );
});

// Background Sync for AI Tasks
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-ai-query') {
    event.waitUntil(retryAIQueries());
  }
});

async function retryAIQueries() {
  console.log('Background sync: Retrying pending AI queries...');
  // Logic to process queued queries from IndexedDB would go here
}

// Periodic Sync for Widget Data
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'ai-tip-update') {
    event.waitUntil(updateWidgetData());
  }
});

async function updateWidgetData() {
  try {
    const response = await fetch('/api/pwa/widget');
    if (response.ok) {
      const data = await response.json();
      const cache = await caches.open(CACHE_NAME);
      await cache.put('/widgets/ai-tip-data.json', new Response(JSON.stringify(data)));
    }
  } catch (err) {
    console.error('Widget update failed:', err);
  }
}

// Fetch Event with Enhanced Offline Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response but refresh in background (Stale-While-Revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
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
      });
    })
  );
});

// Push Notifications
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
    data: { url: data.url || '/recommendations' },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url);
    })
  );
});
