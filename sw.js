// GT50 Service Worker v1.2.0 - MIME TYPE FIX
const VERSION = '1.2.0';
const CACHE_NAME = 'gt50-cache-' + VERSION;

const isGitHubPages = self.location.hostname.includes('github.io');
const BASE_PATH = isGitHubPages ? '/Gt50/' : './';

console.log('[SW] v' + VERSION + ' - Base:', BASE_PATH);

// MIME type mapping - CRITICAL for offline JavaScript execution
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getMimeType(url) {
  const ext = url.substring(url.lastIndexOf('.'));
  return MIME_TYPES[ext] || 'text/plain';
}

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

// Install - fetch and cache with proper headers
self.addEventListener('install', event => {
  console.log('[SW] INSTALL v' + VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching', STATIC_CACHE_URLS.length, 'files');
        
        // Cache each file individually
        return Promise.all(
          STATIC_CACHE_URLS.map(url => {
            return fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error('HTTP ' + response.status);
                }
                
                // Clone response and ensure correct MIME type
                const mimeType = getMimeType(url);
                const headers = new Headers(response.headers);
                headers.set('Content-Type', mimeType);
                
                const modifiedResponse = new Response(response.body, {
                  status: response.status,
                  statusText: response.statusText,
                  headers: headers
                });
                
                cache.put(url, modifiedResponse);
                console.log('[SW] ✓', url, '(' + mimeType + ')');
                return true;
              })
              .catch(err => {
                console.error('[SW] ✗', url, err.message);
                return false;
              });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', event => {
  console.log('[SW] ACTIVATE v' + VERSION);
  
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.map(name => {
          if (name.startsWith('gt50-') && name !== CACHE_NAME) {
            console.log('[SW] Delete:', name);
            return caches.delete(name);
          }
        })
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch - serve from cache with correct MIME types
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Skip non-GET and cross-origin
  if (event.request.method !== 'GET' || !url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) {
          // CRITICAL: Ensure cached response has correct MIME type
          const mimeType = getMimeType(url);
          const headers = new Headers(cached.headers);
          
          if (!headers.get('Content-Type') || headers.get('Content-Type') === 'text/plain') {
            headers.set('Content-Type', mimeType);
            
            return cached.blob().then(blob => {
              return new Response(blob, {
                status: cached.status,
                statusText: cached.statusText,
                headers: headers
              });
            });
          }
          
          console.log('[SW] CACHE:', url);
          return cached;
        }
        
        // Not in cache, fetch from network
        console.log('[SW] NETWORK:', url);
        return fetch(event.request)
          .then(response => {
            if (response && response.status === 200) {
              const mimeType = getMimeType(url);
              const headers = new Headers(response.headers);
              headers.set('Content-Type', mimeType);
              
              const modifiedResponse = new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: headers
              });
              
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, modifiedResponse.clone());
              });
              
              return modifiedResponse;
            }
            return response;
          })
          .catch(err => {
            console.error('[SW] FAIL:', url, err.message);
            
            // Don't return fallback HTML - just fail
            // This prevents serving wrong pages
            throw err;
          });
      })
  );
});

// Messages
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: VERSION });
  }
});

console.log('[SW] Ready v' + VERSION);
