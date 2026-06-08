/**
 * Audit BIM — Service Worker
 * Cache-first pour ressources statiques, network-first pour APIs externes.
 * © Propriétaire — Redistribution interdite
 */

const CACHE_VERSION = 'audit-bim-v1.0.0';
const CACHE_STATIC  = `${CACHE_VERSION}-static`;

// Ressources à mettre en cache à l'installation
const PRECACHE_URLS = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
	'./libs/jszip.min.js',
	'./libs/viewer-bundle.js',
    // JSZip depuis CDN — tentera lors de la nav mais ne bloque pas l'install
];

// ── Install : précache des ressources critiques ──────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// ── Activate : nettoyage des anciens caches ──────────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys
                .filter(key => key.startsWith('audit-bim-') && key !== CACHE_STATIC)
                .map(key => caches.delete(key))
        )).then(() => self.clients.claim())
    );
});

// ── Fetch : stratégie hybride ────────────────────────────────────────────────
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requêtes non-GET et les requêtes Chrome extensions
    if (request.method !== 'GET') return;
    if (url.protocol === 'chrome-extension:') return;

    // Ressources CDN / ESM (Three.js, web-ifc) → network-first avec fallback cache
    const isExternal = !url.origin.includes(self.location.origin);
    if (isExternal) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_STATIC).then(c => c.put(request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Ressources locales → cache-first avec mise à jour réseau en arrière-plan
    event.respondWith(
        caches.match(request).then(cached => {
            const networkFetch = fetch(request).then(response => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_STATIC).then(c => c.put(request, clone));
                }
                return response;
            });
            return cached || networkFetch;
        })
    );
});
