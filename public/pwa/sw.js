self.addEventListener('install', function (event) {
    console.log('SW Installed');
    event.waitUntil(
      caches.open('static')
        .then(function (cache) {
          cache.addAll([
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

            '/static/index.html',
            '/static/login.html',
            '/static/project.html',
            '/static/signUp.html',
            '/static/workItem.html',
            '/static/statistics.html',

            'https://fonts.googleapis.com/css?family=Raleway:400,700'
          ]);
        })
    );
    // self.clients.claim();
  });

  self.addEventListener('activate', function () {
    console.log('SW Activated');
  });

  self.addEventListener('sync', function (event) {
    console.log('SW sync'+ JSON.stringify(event));
  });
  self.addEventListener('push', function (event) {
    console.log('SW push'+ JSON.stringify(event));
  });
  self.addEventListener('message', function (event) {
    console.log('SW message'+ JSON.stringify(event));
  });

  self.addEventListener('fetch', function(event) {
    console.log('this event: ' + JSON.stringify(event));
    event.respondWith(
      caches.match(event.request)
        .then(function(res) {
          if (res) {
            return res;
          } else {
            return fetch(event.request);
          }
        })
    );
  });