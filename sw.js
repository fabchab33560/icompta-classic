/* Cache des seuls fichiers publics de l'application, jamais des données comptables. */
const CACHE='icompta-classic-shell-v10-1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icone-192.png','./icone-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('icompta-classic-shell')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);
 if(url.origin!==self.location.origin)return;
 if(e.request.mode==='navigate'){
   e.respondWith(caches.match('./index.html').then(c=>c||fetch(e.request)));return;
 }
 if(!/\.(?:html|webmanifest|png|js|css)$/.test(url.pathname))return;
 e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));
});
