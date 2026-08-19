const CACHE_NAME = 'agromina-v1';

// Pasang Service Worker langsung tanpa menunggu
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Ambil alih kontrol tab secara langsung
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Strategi: Network First (Utamakan internet, jika offline gunakan cache)
self.addEventListener('fetch', event => {
  // Hanya proses request GET (bukan POST/PUT)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Jika internet lancar, simpan/perbarui respon terbaru ke cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Jika internet terputus/offline, ambil dari cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Jika file tidak ada di cache sama sekali
        return new Response('Koneksi terputus. Silakan periksa jaringan Anda.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
        });
      })
  );
});
