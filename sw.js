/* Knowatt service worker — BUMP THIS STRING ON EVERY RELEASE */
const CACHE="knowatt-v1-2026-06-24";
const CORE=["/","/app/","/index.html","/app/index.html","/manifest.webmanifest",
  "/assets/knowatt-icon-rounded.png","/assets/knowatt-mark.png","/assets/knowatt-word.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE).catch(()=>{})));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  const u=new URL(r.url);
  // never cache supabase / stripe / api calls
  if(u.origin!==location.origin||u.pathname.startsWith("/api/")){return;}
  e.respondWith(
    fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res;})
      .catch(()=>caches.match(r).then(m=>m||caches.match("/app/")))
  );
});