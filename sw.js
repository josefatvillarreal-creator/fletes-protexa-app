// Service worker mínimo: guarda solo la cápsula (esta página, sus iconos y su configuración) para que
// el icono instalado abra al instante. La aplicación real vive en Apps Script y siempre se pide a Google.
const CACHE = "fletes-capsula-v1";
const CAPSULA = ["./", "./index.html", "./config.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE).then((c) => c.addAll(CAPSULA)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  const url = new URL(evento.request.url);
  if (evento.request.method !== "GET" || url.origin !== self.location.origin) return;
  evento.respondWith(
    caches.match(evento.request, { ignoreSearch: true }).then((guardado) => guardado || fetch(evento.request)),
  );
});
