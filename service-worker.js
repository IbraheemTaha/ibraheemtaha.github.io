const CACHE_VERSION = 'v1.2.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const HTML_CACHE = `html-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  './',
  'index.html',
  'css/bootstrap.min.css?ver=1.1.0',
  'css/main.css?ver=1.1.0',
  'css/mycss.css',
  'js/core/jquery.3.2.1.min.js?ver=1.1.0',
  'js/core/popper.min.js?ver=1.1.0',
  'js/core/bootstrap.min.js?ver=1.1.0',
  'js/now-ui-kit.js?ver=1.1.0',
  'js/aos.js?ver=1.1.0',
  'scripts/main.js?ver=1.1.0',
  'scripts/myscripts.js',
  'scripts/cv-generator.js?ver=13.0',
  'images/cc-bg-1-640.webp',
  'images/cc-bg-1-1280.webp',
  'images/cc-bg-1-1920.webp',
  'images/ibraheem-profile-320.jpg',
  'images/ibraheem-profile-640.jpg',
  'images/icon.jpg',
  'images/staticmap-1200.webp',
  'pages/privacy-policy.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== HTML_CACHE) {
            return caches.delete(key);
          }
          return null;
        })
      )
    ).then(() => self.clients.claim())
  );
});

function isHtmlRequest(request) {
  return request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');
}

function isStaticAsset(request) {
  return request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font';
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(HTML_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('index.html')))
    );
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
