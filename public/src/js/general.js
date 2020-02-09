if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(function(reg) {
      console.log('Service Worker Registered!', reg);
  
      Notification.requestPermission(function(status) {
        if(status == "granted"){
        reg.pushManager.getSubscription().then(function(sub) {
          if (sub === null) {
            // Update UI to ask user to register for Push
            // console.log('Not subscribed to push service!');
            subscribeUser();
            // testing
            getSubscription('/subscription', (key) => {
              subscribeUser(key)
            })
            /////////////////////
          } else {
            // We have a subscription, update the database
            console.log('Subscription object: ', sub);
          }
        });
        }
    });
    })
     .catch(function(err) {
      console.log('Service Worker registration failed: ', err);
    });
  }

  function subscribeUser(publicKey) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(function(reg) {
        
        //get vapid keys
        reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKey
        }).then(function(sub) {
          console.log('Endpoint URL: ', sub.endpoint);
        }).catch(function(e) {
          if (Notification.permission === 'denied') {
            console.warn('Permission for notifications was denied');
          } else {
            console.error('Unable to subscribe to push', e);
          }
        });
      })
    }
  }

  function getSubscription(url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}