var cacheList = [
  '/',
  '/favicon.ico',
  '/css/app.css',
  '/css/index.css',
  '/css/login.css',
  '/css/popup.css',
  '/css/project.css',
  '/css/workItem.css',
  '/images/icons/app-icon-96x96.png',
  '/images/icons/app-icon-144x144.png',
  '/images/icons/app-icon-256x256.png',
  '/images/icons/app-icon-512x512.png',
  '/js/app.js',
  '/js/collapsible.js',
  '/js/formHandling.js',
  '/js/formPopupManager.js',
  '/js/general.js',
  '/js/project.js',
  '/js/task.js',
  '/js/stat.js',

  '/static/index.html',
  '/static/login.html',
  '/static/project.html',
  '/static/signUp.html',
  '/static/workItem.html',
  '/static/statistics.html',

  'https://fonts.googleapis.com/css?family=Raleway:400,700'
]
const version = "v1"
const cacheVersionName = `static-${cacheList.length}-${version}`

self.addEventListener('install', function (event) {
    console.log('SW Installed');
    event.waitUntil(
      caches.open(cacheVersionName)
        .then(function (cache) {
          cache.addAll(cacheList);
        })
    );
    // self.clients.claim();
  });
  self.addEventListener('sync', function (event) {
    console.log('SW sync'+ JSON.stringify(event));
  });

  self.addEventListener('message', function (event) {
    console.log('SW message'+ JSON.stringify(event));
  });

  //cache then network 
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open(cacheVersionName).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    );
  });

  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
            return cacheName != cacheVersionName;
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });

  self.addEventListener('push', function(e) {
    var body;
  
    if (e.data) {
      body = e.data.text();
    } else {
      body = 'Push message no payload';
    }
    var options = {
      body: body,
      icon: 'images/notification-flat.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {action: 'explore', title: 'Explore this new world',
          icon: 'images/checkmark.png'},
        {action: 'close', title: 'I don\'t want any of this',
          icon: 'images/xmark.png'},
      ]
    };
    e.waitUntil(
      self.registration.showNotification('Push Notification', options)
    );
  });