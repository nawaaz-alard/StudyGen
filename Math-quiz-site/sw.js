const CACHE_NAME = 'math-hub-v3-patrick-hand';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './src/styles/main.css',
    './src/styles/dragdrop.css',
    './src/scripts/app.js',
    './src/scripts/data.js',
    './src/scripts/widgets.js',
    './src/scripts/canvas.js',
    './src/scripts/gamification.js',
    './src/assets/icon-192.png',
    './src/assets/icon-512.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('fetch', (e) => {
    // Handle external fonts (Google Fonts) with Stale-While-Revalidate if possible, or simple network-first
    // For now, simple Cache-First falling back to Network
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
