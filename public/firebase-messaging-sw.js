importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// We need to initialize firebase inside the service worker
// The config can be parsed from URL params or hardcoded if env vars aren't injected here
// Since this is a static file, we rely on standard NEXT_PUBLIC_ defaults not being available directly.
// A common pattern is to fetch a config.json or hardcode for demo purposes.
// We will just listen to push events directly since standard FCM requires the config.

self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.notification?.body || data.data?.body,
      icon: '/icon.png',
      data: data.data,
    };

    event.waitUntil(
      self.registration.showNotification(
        data.notification?.title || data.data?.title || 'Carbon Footprint',
        options
      )
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
