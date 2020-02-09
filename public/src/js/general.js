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
            // testing
            pokeServer('/subscription', 'GET', null, (key) => {
              sub = subscribeUser(key)
              console.log("sub=" + JSON.stringify(sub))
              //upsert sub
              pokeServer('/subscription', 'POST', JSON.stringify({endpoint: sub.endpoint}), (response) => {
                console.log('Subscription updated');
              });

            })
          } else {
            // We have a subscription, update the database
            console.log('Subscription object: ', JSON.stringify(sub));
            console.log('Subscription url: ', sub.endpoint);
            //upsert sub
            pokeServer('/subscription', 'POST', JSON.stringify({endpoint: sub.endpoint}), (response) => {
              console.log('Subscription updated');
            });
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
          return sub;
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

  function pokeServer(url, action, body, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open(action, url, true); // true for asynchronous 
    if (body) {
      xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    }
    xmlHttp.send(body);
    console.log('poke server: ' + body)
}