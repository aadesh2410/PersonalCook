// Service Worker for PersonalCook PWA
// Caches all static assets on install so the app works fully offline.
//
// ⚠️  CACHE VERSION — bump this string whenever the service worker logic
//     changes so that existing users get the new worker and stale caches
//     are cleared automatically during the activate step.
const CACHE_NAME = 'personalcook-v1';

// These patterns cover every asset Expo Metro web outputs under dist/.
const STATIC_PATTERNS = [
  '/',
  '/index.html',
  /^\/_expo\/static\//,
  /^\/assets\//,
];

// ── Install ────────────────────────────────────────────────────────────────
// Pre-cache the shell immediately so the app can load offline from the very
// first revisit after installation.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(['/', '/index.html'])
    )
  );
  // Activate the new worker without waiting for existing tabs to close.
  self.skipWaiting();
});

// ── Activate ──────────────────────────────────────────────────────────────
// Remove any caches from previous versions of the service worker.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all open pages immediately.
  self.clients.claim();
});

// ── Fetch ──────────────────────────────────────────────────────────────────
// Cache-first for static assets (hashed bundles, images, fonts).
// Network-first for navigation requests so updates are picked up quickly.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept same-origin requests.
  if (url.origin !== self.location.origin) return;

  const isStatic = STATIC_PATTERNS.some((pattern) =>
    typeof pattern === 'string'
      ? url.pathname === pattern
      : pattern.test(url.pathname)
  );

  if (isStatic) {
    // Cache-first: return cached copy instantly; fetch and cache on miss.
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
  } else {
    // Network-first for everything else (e.g. navigation requests).
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
