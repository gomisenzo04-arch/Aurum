/* ============================================
   Aurum — Service Worker v1.0
   Mode hors-ligne complet pour les 4 pages
   ============================================ */

var CACHE_NAME = 'aurum-v46';

console.log('[Aurum SW] v3 active');

var URLS_TO_CACHE = [
  './',
  './index.html',
  './Aurum_Hub.html',
  './Aurum_Academy.html',
  './Aurum.html',
  './Aurum_Capital.html',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/icon-maskable.svg'
];

/* CDN externes utilisés par les pages */
var CDN_URLS = [
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

/* ---- INSTALL : cache toutes les ressources locales ---- */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      /* Cache local en priorité */
      return cache.addAll(URLS_TO_CACHE).then(function() {
        /* CDN : on essaie mais on ne bloque pas l'install */
        return Promise.allSettled(
          CDN_URLS.map(function(url) {
            return fetch(url, { mode: 'cors' }).then(function(response) {
              if (response.ok) {
                return cache.put(url, response);
              }
            });
          })
        );
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

/* ---- ACTIVATE : nettoie les anciens caches ---- */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* ---- FETCH : Network-first pour HTML, Cache-first pour assets ---- */
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  /* Ignorer les requêtes non-GET */
  if (event.request.method !== 'GET') return;

  /* Ignorer chrome-extension et autres protocoles */
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  /* HTML : Network-first (fraîcheur), fallback cache */
  if (event.request.headers.get('accept') &&
      event.request.headers.get('accept').indexOf('text/html') !== -1) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        return caches.match(event.request).then(function(cached) {
          return cached || caches.match('./index.html');
        });
      })
    );
    return;
  }

  /* Google Fonts : cache-first (ne changent jamais) */
  if (url.hostname === 'fonts.googleapis.com' ||
      url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        }).catch(function() {
          return new Response('', { status: 200, headers: { 'Content-Type': 'text/css' } });
        });
      })
    );
    return;
  }

  /* CDN (Chart.js, html2pdf) : cache-first */
  if (url.hostname === 'cdnjs.cloudflare.com' ||
      url.hostname === 'cdn.jsdelivr.net') {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  /* Autres : stale-while-revalidate */
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      var fetchPromise = fetch(event.request).then(function(response) {
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        return cached;
      });
      return cached || fetchPromise;
    })
  );
});
