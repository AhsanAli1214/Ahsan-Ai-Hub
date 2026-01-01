const CACHE_NAME = 'ahsan-ai-hub-v2-2025-12-27';
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
  '/icon-192.png?v=2025-12-27',
  '/icon-512.png?v=2025-12-27',
  '/icon-maskable-192.png?v=2025-12-27',
  '/icon-maskable-512.png?v=2025-12-27',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Add Background Sync support
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-feedback') {
    event.waitUntil(
      // Logic for background sync
      Promise.resolve()
    );
  }
});

// App Badging API Logic
const updateBadge = async (count) => {
  if ('setAppBadge' in navigator) {
    if (count > 0) {
      await navigator.setAppBadge(count);
    } else {
      await navigator.clearAppBadge();
    }
  }
};

// Periodic Background Sync for fresh content
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(
      (async () => {
        // Increment badge count as a demo of background activity
        const count = parseInt(await self.registration.index.get('badge-count') || '0') + 1;
        await updateBadge(count);
        return Promise.resolve();
      })()
    );
  }
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Ahsan AI Hub';
  const options = {
    body: data.body || 'New update available!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      updateBadge(1) // Show badge on notification
    ])
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    Promise.all([
      clients.openWindow(event.notification.data.url),
      updateBadge(0) // Clear badge on click
    ])
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          return response || caches.open(CACHE_NAME).then((cache) => cache.match(OFFLINE_URL));
        });
      })
    );
    return;
  }

  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
