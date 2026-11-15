/* Cache uniquement le code public. Les sauvegardes privées ne sont jamais collectées. */
const CACHE='icompta-classic-shell-v13-0';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icone-192.png','./icone-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('icompta-classic-shell')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const req=event.request; if(req.method!=='GET') return; const url=new URL(req.url); if(url.origin!==self.location.origin) return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(response=>{ if(response.ok){ const copy=response.clone(); event.waitUntil(caches.open(CACHE).then(cache=>cache.put('./index.html',copy))); } return response; }).catch(()=>caches.match('./index.html').then(cached=>cached||Response.error())));
    return;
  }
  if(!/\.(?:html|webmanifest|png|js|css)$/.test(url.pathname)) return;
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
