
const CACHE_NAME = 'gt50-v1.0.0';
const RUNTIME_CACHE = 'gt50-runtime';

// Files to cache on install
const STATIC_CACHE_URLS = [
  './index.html',
  './search.js',
  './styles.js',
  './template.js',
  './comp-header.js',
  './comp-insert.js',
  './comp-impex.js',
  './comp-settings.js',
  './import-registry.js',
  './imports-list.js',
  './import-loader.js',
  './create-new.js',
  './comp-utility.js',
  './comp-footer.js',
  './format-gt50.js',
  './format-json.js',
  './format-encrypted.js',
  './format-import.js',
  './comp-list.js',
  './comp-accumulation.js',
  './comp-history.js',
  './comp-progress.js',
  './comp-tier.js',
  './comp-checklist.js',
  './comp-divider.js',
  './comp-nest.js',
  './comp-cycle.js',
  './comp-tab.js',
  './comp-radio.js',
  './comp-threshold.js',
  './comp-text.js',
  './comp-import.js',
  './info.js',
  './comp-scale.js',
  './sort-filter.js',
  './comp-summary.js',
  './manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME_CACHE).then(cache => {
          return fetch(event.request).then(response => {
            // Only cache successful responses
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
      .catch(() => {
        // Return offline page if available
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});

// Message event - for manual cache updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

