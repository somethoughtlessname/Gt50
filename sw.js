// GT50 Service Worker v1.0.9
const VERSION = '1.0.9';
const CACHE_NAME = 'gt50-cache-' + VERSION;
const RUNTIME_CACHE = 'gt50-runtime-' + VERSION;

// Detect if we're on GitHub Pages
const isGitHubPages = self.location.hostname.includes('github.io');
const BASE_PATH = isGitHubPages ? '/Gt50/' : './';

console.log('[SW] Service Worker initializing');
console.log('[SW] Version:', VERSION);
console.log('[SW] Is GitHub Pages:', isGitHubPages);
console.log('[SW] Base path:', BASE_PATH);

// Files to cache on install - ALL LOWERCASE for GitHub Pages
const STATIC_CACHE_URLS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'search.js',
  BASE_PATH + 'styles.js',
  BASE_PATH + 'template.js',
  BASE_PATH + 'comp-header.js',
  BASE_PATH + 'comp-insert.js',
  BASE_PATH + 'comp-impex.js',
  BASE_PATH + 'comp-settings.js',
  BASE_PATH + 'import-registry.js',
  BASE_PATH + 'imports-list.js',
  BASE_PATH + 'import-loader.js',
  BASE_PATH + 'create-new.js',
  BASE_PATH + 'comp-utility.js',
  BASE_PATH + 'comp-footer.js',
  BASE_PATH + 'format-gt50.js',
  BASE_PATH + 'format-encrypted.js',
  BASE_PATH + 'format-import.js',
  BASE_PATH + 'comp-list.js',
  BASE_PATH + 'comp-accumulation.js',
  BASE_PATH + 'comp-history.js',
  BASE_PATH + 'comp-progress.js',
  BASE_PATH + 'comp-tier.js',
  BASE_PATH + 'comp-checklist.js',
  BASE_PATH + 'comp-divider.js',
  BASE_PATH + 'comp-nest.js',
  BASE_PATH + 'comp-cycle.js',
  BASE_PATH + 'comp-tab.js',
  BASE_PATH + 'comp-radio.js',
  BASE_PATH + 'comp-threshold.js',
  BASE_PATH + 'comp-text.js',
  BASE_PATH + 'comp-import.js',
  BASE_PATH + 'info.js',
  BASE_PATH + 'comp-scale.js',
  BASE_PATH + 'sort-filter.js',
  BASE_PATH + 'comp-summary.js',
  BASE_PATH + 'comp-cloudsync.js',
  BASE_PATH + 'manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker version', VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching', STATIC_CACHE_URLS.length, 'static assets');
        return cache.addAll(STATIC_CACHE_URLS)
          .then(() => {
            console.log('[SW] All static assets cached successfully');
          })
          .catch(error => {
            console.error('[SW] Failed to cache assets:', error);
            // Try caching individually to see which file fails
            return Promise.all(
              STATIC_CACHE_URLS.map(url => 
                cache.add(url)
                  .then(() => console.log('[SW] Cached:', url))
                  .catch(err => console.error('[SW] Failed to cache:', url, err))
              )
            );
          });
      })
      .then(() => {
        console.log('[SW] Install complete, skipping waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker version', VERSION);
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete any cache that doesn't match current version
            if (cacheName.startsWith('gt50-') && 
                cacheName !== CACHE_NAME && 
                cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete, claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - cache first, fallback to network
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (!url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', url);
          return cachedResponse;
        }

        // Not in cache, try network
        console.log('[SW] Fetching from network:', url);
        return caches.open(RUNTIME_CACHE).then(cache => {
          return fetch(event.request)
            .then(response => {
              // Only cache successful responses
              if (response && response.status === 200) {
                console.log('[SW] Caching runtime resource:', url);
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(error => {
              console.error('[SW] Network fetch failed:', url, error);
              // If it's a navigation request and network failed, return cached index
              if (event.request.mode === 'navigate') {
                console.log('[SW] Navigation request failed, returning cached index.html');
                return caches.match(BASE_PATH + 'index.html');
              }
              throw error;
            });
        });
      })
      .catch(error => {
        console.error('[SW] Request failed completely:', url, error);
        // Last resort: return cached index for navigation
        if (event.request.mode === 'navigate') {
          return caches.match(BASE_PATH + 'index.html');
        }
      })
  );
});

// Message event - for manual cache updates and control
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting requested');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Clear cache requested');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('[SW] Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('[SW] All caches cleared');
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: VERSION, basePath: BASE_PATH });
  }
});

console.log('[SW] Service Worker script loaded');
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

