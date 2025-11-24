const CACHE_NAME = 'universal-converter-cache-v1';
// Changed paths to relative (./ and file names) to ensure it works correctly
const urlsToCache = [
  './', 
  'index.html',
  'manifest.json',
  // You should add your icon files here if you create them later:
  'icon-192x192.png',
  'icon-512x512.png',
];

// Install event: Caches the core app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache, pre-caching shell...');
        // Corrected: Use relative paths in cache.addAll
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Serves content from cache first, falling back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache match - fetch from network
        return fetch(event.request);
      })
  );
});

// Activate event: Cleans up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});