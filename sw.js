/* Stock Journal service worker – lets the installed app open without internet.
 * App files: network first (so a new version shows up straight away), saved copy when offline.
 * Versioned libraries (Chart.js, Firebase, SheetJS): saved copy first, they never change.
 * Your trades are not handled here – Firebase keeps its own offline copy and syncs it.
 */
const CACHE = 'sj-v1';
const SHELL = ['./', 'firebase-config.js', 'manifest.webmanifest', 'icons/icon-192.png'];
const LIBS = ['cdnjs.cloudflare.com', 'www.gstatic.com', 'cdn.sheetjs.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const keep = (req, res) => {
  if (res && !res.redirected && (res.ok || res.type === 'opaque')) { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); }
  return res;
};

self.addEventListener('fetch', e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== 'GET') return;
  if (LIBS.includes(u.hostname) && /\/(firebasejs|ajax\/libs|xlsx-)/.test(u.pathname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => keep(req, r))));
    return;
  }
  if (u.origin !== location.origin || u.pathname.startsWith('/__/')) return; // Firebase sign-in/database traffic: leave alone
  const page = req.mode === 'navigate';
  e.respondWith((async () => {
    try {
      // a slow connection shouldn't make the app hang: fall back to the saved copy after 4 s
      const net = fetch(req).then(r => keep(page ? './' : req, r));
      const hit = await caches.match(page ? './' : req);
      return hit ? await Promise.race([net, new Promise((_, no) => setTimeout(no, 4000))]).catch(() => hit) : await net;
    } catch (err) {
      const hit = await caches.match(page ? './' : req);
      if (hit) return hit;
      throw err;
    }
  })());
});
