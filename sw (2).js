var V="wk-v3";
var FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","base.css","calendar.css","stats.css","sheet.css","storage.js","core.js","calendar.js","stats.js","sheet.js","start.js"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES.map(function(u){return new Request(u,{cache:"reload"})}))}));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}));
  self.clients.claim();
});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET")return;
  var same=new URL(r.url).origin===self.location.origin;
  if(same){
    e.respondWith(fetch(r,{cache:"no-cache"}).then(function(res){
      if(res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}
      return res;
    }).catch(function(){return caches.match(r).then(function(h){return h||caches.match("index.html")})}));
  }else{
    e.respondWith(caches.match(r).then(function(h){return h||fetch(r).then(function(res){
      if(res&&(res.ok||res.type==="opaque")){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}
      return res;
    })}));
  }
});
