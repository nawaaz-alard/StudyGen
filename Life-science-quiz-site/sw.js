const CACHE_NAME = 'lifesci-v1';
const ASSETS = [
    './index.html',
    './src/styles/main.css',
    './src/styles/dragdrop.css',
    './src/scripts/app.js',
    './src/scripts/data.js',
    './src/scripts/gamification.js',
    './src/scripts/widgets.js',
    './src/scripts/canvas.js',
    './src/assets/bg-nature.jpg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Outfit:wght@400;700;800&display=swap'
];

// Install Event - Cache Core Assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate Event - Cleanup Old Caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Network First, Clean Fallback
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request)
            .then((res) => {
                // Clone response to cache
                const resClone = res.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, resClone);
                });
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
