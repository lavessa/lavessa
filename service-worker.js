// basic service worker for caching
const CACHE_NAME = 'lavessa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/cart.html',
  '/checkout.html',
  '/login.html',
  '/profile.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
