const CACHE_NAME = 'audit-bim-v1';

// Fichiers à mettre en cache immédiatement au premier lancement
const urlsToCache = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Interception des requêtes : on sert le cache si disponible, sinon on va sur le réseau et on met en cache pour la prochaine fois
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
              // On met dynamiquement en cache les gros fichiers (comme web-ifc.wasm)
              if (event.request.method === 'GET' && fetchRes.status === 200) {
                  cache.put(event.request.url, fetchRes.clone());
              }
              return fetchRes;
          });
      });
    }).catch(() => console.log('Réseau indisponible, mode hors-ligne actif.'))
  );
});
