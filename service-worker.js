var cacheName = "v2";
var cacheFiles = [
  './',
  '/index.html',
  '/contact.html',
  '/about.html',
  '/style/movie.css',
  '/style/bootstrap.min.css',
  '/script/movie.js',
  '/script/bootstrap.min.js',
  '/script/jquery-3.3.1.min.js',
  '/images/movie.jpg',
  '/images/movie-icon.jpg',
  '/images/icons/app-icon-128.png',
  '/images/icons/app-icon-144.png',
  '/images/icons/app-icon-152.png',
  '/images/icons/app-icon-192.png',
  '/images/icons/app-icon-256.png',
  '/movie.json'
]

self.addEventListener('install', function(e){
  console.log("[Service Worker] Installed")
  e.waitUntil(
    caches.open(cacheName).then(function(cache){
      console.log("[Service Worker] caching cacheFiles");
      return cache.addAll(cacheFiles);
    })
  )
});

self.addEventListener('activate', function(e){
  console.log("[Service Worker] Activated")
  e.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(cacheNames.map(function(thisCacheName){
        if (thisCacheName != cacheName) {
          console.log("[Service Worker] Removing Cache Files from ",  thisCacheName)
          return caches.delete(thisCacheName);
        }

      }))

    })
  )
});

self.addEventListener('fetch', function(e){
  console.log("[Service Worker] Fetching", e.request.url);

  e.respondWith(

    caches.match(e.request).then(function(response){

      if(response){
        console.log('[Service Worker] found in cache', e.request.url);
        return response;
      }

      var requestClone = e.request.clone();
      fetch(requestClone)
        .then(function(response) {

          if(!response){
            console.log("[Service Worker] No response from Fetch")
            return response;
          }

          var responseClone = response.clone();

          caches.open(cacheName).then(function(cache){
            cache.put(e.request, responseClone);
            return response;
          })

        })
        .catch(function(err){
          console.log("[Service Worker] Error Fetching and caching details ", err);
        })
    })
  )
});
