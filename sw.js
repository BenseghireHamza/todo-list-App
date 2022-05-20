const CACHE_NAME = 'version-1';
const urlsToCache = [
    "index.html",
    "offline.html",
    "./scss/style.css",
    "./js/index.js",
    "./js/scrollreveal.min.js",
    "./font/Roboto-Medium.ttf",
    "./img/background-img.png",
    "./img/Hamza.png",
    "./img/bin.png",
    "./img/button.png",
    "./img/stationary-jar.png"
];
const self = this;
// install serviceWorker and add cache to the browser 
self.addEventListener('install', (event) =>{  
    event.waitUntil(
          caches.open(CACHE_NAME).then((cache) =>{
              cache.addAll(urlsToCache);
          })
    )
})

// listen for request 
self.addEventListener('fetch', (event) =>{
     event.respondWith(
        (async ()=>{
            const resource = await caches.match(event.request);
            if(resource){
                return resource;
            }

            const response = await fetch(event.request);
            return response;
        })(),
   );
});

// activate serviceWoker 
self.addEventListener('activate', async (event) =>{
    const keys = await caches.keys();
    await Promise.all(keys.map((key)=>{
        if(key !== CACHE_NAME){
            return caches.delete(key);
        }
    }));
   clients.claim()
});
