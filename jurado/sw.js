const CACHE='jurado-csr-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Red primero (para recibir actualizaciones), caché si no hay conexión.
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(res=>{if(res.ok){const cp=res.clone();const k=new URL(e.request.url);k.search='';caches.open(CACHE).then(c=>c.put(k.toString(),cp))}return res})
 .catch(()=>{const k=new URL(e.request.url);k.search='';return caches.match(k.toString()).then(r=>r||caches.match('./index.html'))}))});
