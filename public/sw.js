// Minimal service worker — its sole job is to make Subflix installable as a
// PWA on Chrome for Android. It uses a network-first strategy and falls back
// to whatever is cached when the device is offline. No precaching of the app
// shell, so deploys are picked up immediately without stale-asset headaches.
const CACHE = "subflix-runtime-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Only handle GET navigations/assets; let everything else hit the network.
  if (request.method !== "GET" || new URL(request.url).origin !== location.origin) {
    return;
  }
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
