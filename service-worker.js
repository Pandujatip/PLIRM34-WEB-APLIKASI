const CACHE_NAME = "plirm34-pwa-v20260503-12";
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css?v=20260503-07",
  "/app.auth.js?v=20260426-15",
  "/app.carbon-brush.js?v=20260502-05",
  "/app.service.js?v=20260502-02",
  "/app.mso.js?v=20260426-15",
  "/app.dashboard.js?v=20260502-02",
  "/app.admin.js?v=20260503-03",
  "/app.js?v=20260503-12",
  "/manifest.webmanifest",
  "/pwa-icons/icon-192.png",
  "/pwa-icons/icon-512.png",
  "/pwa-icons/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isCacheableRequest(request) {
  if (request.method !== "GET") {
    return false;
  }
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return false;
  }
  if (url.pathname.startsWith("/items")
    || url.pathname.startsWith("/bootstrap")
    || url.pathname.startsWith("/login")
    || url.pathname.startsWith("/logout")
    || url.pathname.startsWith("/session")
    || url.pathname.startsWith("/masters")
    || url.pathname.startsWith("/activity-logs")
    || url.pathname.startsWith("/admin")) {
    return false;
  }
  return request.destination === "document"
    || request.destination === "script"
    || request.destination === "style"
    || request.destination === "image"
    || request.destination === "font"
    || url.pathname === "/manifest.webmanifest";
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (!isCacheableRequest(request)) {
    return;
  }

  const url = new URL(request.url);
  const shouldPreferNetwork = request.destination === "document"
    || request.destination === "script"
    || request.destination === "style"
    || url.pathname === "/"
    || url.pathname === "/index.html";

  if (shouldPreferNetwork) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkResponse = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkResponse;
    })
  );
});
