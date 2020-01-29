if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(function() {
        console.log('SW registered');
      });
  }

  Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
});

function displayNotification(projectId,taskId) {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      var options = {
        body: 'Here is a notification body!',
        icon: 'images/example.png',
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
      reg.showNotification('Hello world!', options);
    });
  }
}