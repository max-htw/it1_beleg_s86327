const CACHE_NAME = "lernapp-v1";
const OFFLINE_FILES = [
  "/",
  "/index.html",
  "/style/styles.css",
  "/js/main.js",
  "/js/model.js",
  "/js/view.js",
  "/js/utils.js",
  "/data/questions.json",
  "/manifest.json",
  "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css",
  "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js",
  "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/auto-render.min.js",
  "https://cdn.jsdelivr.net/npm/vexflow@4.2.2/build/cjs/vexflow.js",
  "http://unpkg.com/tone"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_FILES);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      return new Response("Offline – Datei nicht verfügbar", {
        status: 503,
        statusText: "Service Unavailable"
      });
    })
  );
});
