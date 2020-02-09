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
              subscribeUser(key,sendEndpoint)
            })
          } else {
            // We have a subscription, update the database
            sendEndpoint (sub)
          }
        });
        }
    });
    })
     .catch(function(err) {
      console.log('Service Worker registration failed: ', err);
    });
  }

function sendEndpoint (subToSend) {
  var newSubJSON = JSON.stringify(subToSend);
  console.log("sub=" + newSubJSON)
  pokeServer('/subscription', 'POST', newSubJSON, (response) => {
    console.log('Subscription updated');
  });
}
  function subscribeUser(publicKey, callback) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(function(reg) {
        //get vapid keys
        reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKey
        }).then(function(sub) {
          callback(sub);
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