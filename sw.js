// 파일을 수정해서 다시 올릴 때는 아래 VERSION 값을 바꿔 주세요. 그래야 설치된 앱이 새 버전을 받습니다.
const VERSION = 'v3-48a2a3fd';
const CACHE = 'planet-sim-' + VERSION;
const FILES = ['./', 'index.html', 'three.min.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('planet-sim-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// 같은 주소의 파일은 저장본을 먼저 쓰고, 없으면 인터넷에서 받아 저장한다. 글꼴 같은 외부 파일은 그대로 통과시킨다.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match('index.html'))));
});
