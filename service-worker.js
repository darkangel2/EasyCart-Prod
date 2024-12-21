/*************  ✨ Codeium Command ⭐  *************/
// This is the "Offline-first" service worker impl in sw-precache.
// Not a part of the Workbox project, but uses a similar API style.
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.core.setCacheNameDetails({
  prefix: 'easy-cart-nilgiris',
  suffix: 'v1'
});

workbox.skipWaiting();
workbox.clientsClaim();

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL('/index.html'), {

  blacklist: [/\/api\/.*/, /\/auth\/.*/],
  whitelist: [/\/static\/.*/]
});

workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Code taken from https://github.com/GoogleChrome/workbox/issues/1797
workbox.routing.registerRoute(
  ({ event }) => event.request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Cache CSS, JS and HTML files.
workbox.routing.registerRoute(
  ({ event }) =>
    event.request.destination === 'style' ||
    event.request.destination === 'script' ||
    event.request.destination === 'document',
  new workbox.strategies.CacheFirst({
    cacheName: 'static-resources',
  })
);

self.addEventListener('install', event => {
  console.log('Service worker installing...');
  // Add a call to skipWaiting here if you want to force the waiting service worker to become the active service worker
});

self.addEventListener('activate', event => {
  console.log('Service worker activating...');
  // Perform some task
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
