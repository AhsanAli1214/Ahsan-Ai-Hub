const CACHE_NAME = 'ahsan-ai-hub-v2-2025-12-27';
const URLS_TO_CACHE = [
  '/',
  '/about',
  '/content-tools',
  '/faq',
  '/contact',
  '/settings',
  '/chat-history',
  '/recommendations',
  '/icon-192.png?v=2025-12-27',
  '/icon-512.png?v=2025-12-27',
  '/icon-maskable-192.png?v=2025-12-27',
  '/icon-maskable-512.png?v=2025-12-27',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
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

self.addEventListener('fetch', (event) => {
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
