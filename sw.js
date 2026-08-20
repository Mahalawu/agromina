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

const CACHE_NAME = 'agromina-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        return new Response('Koneksi terputus. Silakan periksa jaringan Anda.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
        });
      })
  );
});

// ==========================================
// TAMBAHAN FITUR PUSH NOTIFICATION (FCM)
// ==========================================

// Listener saat server mengirim notifikasi
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Instruksi Agromina', body: event.data.text() };
    }
  }

  const title = data.title || 'Pemberitahuan Tugas Agromina';
  const options = {
    body: data.body || 'Ada instruksi baru dari supervisor.',
    icon: 'https://mahalawu.github.io/agromina/fish.png',
    badge: 'https://mahalawu.github.io/agromina/fish.png',
    vibrate: [200, 100, 200], // Pola getar HP
    data: {
      url: data.url || 'https://mahalawu.github.io/agromina/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Listener saat operator menekan pop-up notifikasi di HP
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Tutup notifikasi
  
  // Buka atau fokuskan kembali ke aplikasi Agromina
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
