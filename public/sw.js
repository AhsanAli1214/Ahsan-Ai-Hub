const CACHE_NAME = 'ahsan-ai-hub-v3-2026-01-03';
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

// Enhanced caching strategy with stale-while-revalidate for dynamic content
const DYNAMIC_CACHE = 'ahsan-ai-dynamic-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Advanced background processing and wake lock support
self.addEventListener('fetch', (event) => {
  // Ensure the service worker stays active during long fetches
  if (event.request.url.includes('/api/ai')) {
    event.waitUntil(
      (async () => {
        if ('wakeLock' in self.registration) {
          try { await self.registration.wakeLock.request('screen'); } catch (e) {}
        }
      })()
    );
  }
  // ... existing fetch logic
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Pre-register for periodic sync if possible
      'periodicSync' in self.registration ? 
        self.registration.periodicSync.register('app-keep-alive', {
          minInterval: 24 * 60 * 60 * 1000 // Once a day
        }) : Promise.resolve()
    ])
  );
});

// Add Background Sync support
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-feedback') {
    event.waitUntil(
      (async () => {
        const feedbacks = await getPendingFeedbacks();
        for (const feedback of feedbacks) {
          try {
            await sendFeedback(feedback);
            await deletePendingFeedback(feedback.id);
          } catch (e) {
            console.error('Sync failed for feedback', feedback.id);
          }
        }
      })()
    );
  }
});

// Content Indexing API
if ('index' in self.registration) {
  self.registration.index.add({
    id: 'free-ai-chat',
    launchUrl: '/recommendations',
    title: 'Free AI Chat',
    description: 'Privacy-first free AI chat assistant',
    icons: [{
      src: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
    }],
    category: 'productivity'
  });
}

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
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : 'New update available!' };
  }
  
  const title = data.title || 'Ahsan AI Hub';
  const options = {
    body: data.body || 'New update available!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      { action: 'explore', title: 'Open App', icon: '/icon-192.png' },
      { action: 'close', title: 'Close', icon: '/icon-192.png' }
    ],
    tag: 'ahsan-ai-notification',
    renotify: true,
    requireInteraction: true
  };
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      // Logic to only show notification if not already in focus or if specifically requested
      const isAppInstalled = self.matchMedia && self.matchMedia('(display-mode: standalone)').matches;
      
      return Promise.all([
        self.registration.showNotification(title, options),
        updateBadge(1)
      ]);
    })
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
