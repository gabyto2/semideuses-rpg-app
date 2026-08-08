const CACHE='semideuses-rpg-v02';
const CORE=['/','/index.html','/manifest.webmanifest','/icons/icon-180.png','/icons/icon-192.png','/icons/icon-512.png'];

async function precache(){
  const cache=await caches.open(CACHE);
  const response=await fetch('/index.html',{cache:'reload'});
  if(!response.ok)throw new Error('Não foi possível preparar o aplicativo offline.');
  const html=await response.clone().text();
  const assets=new Set(CORE);
  const links=html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g);
  for(const match of links){
    const url=new URL(match[1],self.location.origin);
    if(url.origin===self.location.origin)assets.add(url.pathname);
  }
  await Promise.all([
    cache.put('/',response.clone()),
    cache.put('/index.html',response.clone())
  ]);
  assets.delete('/');
  assets.delete('/index.html');
  await cache.addAll(Array.from(assets));
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    await precache();
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request){
  try{
    const response=await fetch(request);
    if(response&&response.ok){
      const cache=await caches.open(CACHE);
      await cache.put(request,response.clone());
    }
    return response;
  }catch(error){
    const cached=await caches.match(request);
    if(cached)return cached;
    if(request.mode==='navigate')return caches.match('/index.html');
    return new Response('',{status:504,statusText:'Offline'});
  }
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith(networkFirst(event.request));
});
