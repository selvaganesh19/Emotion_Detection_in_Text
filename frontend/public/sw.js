const CACHE_NAME = 'emotion-detector-v1';
const STATIC_CACHE = 'emotion-detector-static-v1';
const DYNAMIC_CACHE = 'emotion-detector-dynamic-v1';

const staticAssets = [
  '/',
  '/manifest.json',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/android-icon-192x192.png',
  '/apple-icon-180x180.png'
];

const dynamicAssets = [
  '/_next/static/',
  '/api/'
];

// Install event - cache static assets
self.addEventListener('install', function(event) {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(staticAssets);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          console.log('[SW] Serving from cache:', request.url);
          return response;
        }

        console.log('[SW] Fetching from network:', request.url);
        return fetch(request)
          .then(networkResponse => {
            // Don't cache if not a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Decide which cache to use
            const cacheName = url.pathname.startsWith('/_next/') || 
                            url.pathname.startsWith('/api/') ? 
                            DYNAMIC_CACHE : STATIC_CACHE;

            // Clone the response before caching
            const responseToCache = networkResponse.clone();
            caches.open(cacheName)
              .then(cache => {
                cache.put(request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // If both cache and network fail, return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync');
    // Handle background sync for offline text analysis
  }
});

// Push notifications (if needed in the future)
self.addEventListener('push', function(event) {
  if (event.data) {
    console.log('[SW] Push message received:', event.data.text());
    // Handle push notifications
  }
});