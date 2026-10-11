const CACHE_NAME = "quiz-game-shell-v1";
const APP_FILES = [
  "/",
  "/index.html",
  "/about.html",
  "/privacy.html",
  "/login.html",
  "/signup.html",
  "/verify.html",
  "/reset-password.html",
  "/home.html",
  "/level.html",
  "/quiz.html",
  "/mini-game.html",
  "/chat.html",
  "/chats.html",
  "/ai.html",
  "/leaderboard.html",
  "/style.css",
  "/auth-ui.js",
  "/local-profile.js",
  "/offline.js",
  "/service-worker.js",
  "/i18n.js",
  "/ai.js",
  "/logo.svg",
  "/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith("quiz-game-shell-") && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin ||
      url.pathname.startsWith("/api/") || url.pathname.startsWith("/socket.io/")) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok && (request.mode === "navigate" || APP_FILES.includes(url.pathname))) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(url.pathname, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await caches.match(url.pathname);
      if (cached) return cached;
      throw error;
    }
  })());
});
