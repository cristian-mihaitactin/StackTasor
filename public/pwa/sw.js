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
            '/images/icons/close-window-52px.png',
            '/images/icons/checkmark-48.png',
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

            'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
            'https://code.jquery.com/jquery-3.2.1.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
            'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js',

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

  self.addEventListener('push', function(e) {
    var body;
  
    if (e.data) {
      console.log('Push data: ' + e.data);
      console.log('Push data.test(): ' + e.data.text());
      body = e.data.text(); 
    } else {
      body = 'Push message no payload';
    }
  
    var options = {
      body: body,
      icon: 'images/app-icon-144x144.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {action: 'explore', title: 'Task finished',
          icon: 'images/checkmark-48.png'},
        {action: 'close', title: 'Close notification',
          icon: '/images/icons/close-window-52px.png'},
      ]
    };
    e.waitUntil(
      self.registration.showNotification('Push Notification', options)
    );
  });

  self.addEventListener('notificationclose', function(e) {
    var notification = e.notification;
    var taskId = notification.data.updatedTask;
    var project = notification.data.projectId;
  
    console.log('Closed notification: ' + taskId + ', ' + project);
  });

  self.addEventListener('notificationclick', function(e) {
    console.log('notificationclick: ' + e.data);

    var notification = e.notification;
    var taskId = notification.data.updatedTask;
    var project = notification.data.projectId;

    var action = e.action;
  
    if (action === 'close') {
      notification.close();
    } else {
      clients.openWindow('http://www.example.com');
      notification.close();
    }
  });