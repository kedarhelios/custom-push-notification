// sw.js

self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push Received.", event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || "Default Title";
  const options = {
    body: data.body || "Default body",
    icon: data.icon || "/default-icon.png",
    badge: data.badge || "/default-badge.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification click Received.", event);

  event.notification.close();

  // Open a URL when the notification is clicked
  event.waitUntil(clients.openWindow("http://localhost:3000/"));
});
