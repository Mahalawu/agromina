const CACHE_NAME = 'agromina-v1';
const urlsToCache = [
  '/agromina/',
  '/agromina/index.html',
  '/agromina/manifest.json'
  // HANYA FILE LOKAL!
  // TIDAK PERLU cache GAS atau external URLs
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching PWA shell...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// STRATEGI: Network FIRST untuk semua request
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)  // Coba ambil dari network dulu
      .catch(() => {
        // Jika offline, coba dari cache
        return caches.match(event.request)
          .then(response => {
            // Jika ada di cache, tampilkan
            if (response) return response;
            
            // Jika tidak ada, tampilkan halaman offline (opsional)
            return caches.match('/agromina/offline.html');
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
