importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAMDSJMXm1eFGUM8bTZEWWM-OcnR-S28jE",
  authDomain: "agromina-notification.firebaseapp.com",
  projectId: "agromina-notification",
  storageBucket: "agromina-notification.firebasestorage.app",
  messagingSenderId: "744536343620",
  appId: "1:744536343620:web:21572e60b3558d759d2811"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || 'Pemberitahuan Agromina';
  const notificationOptions = {
    body: payload.notification.body || 'Ada instruksi baru dari supervisor.',
    icon: 'https://mahalawu.github.io/agromina/fish.png',
    badge: 'https://mahalawu.github.io/agromina/fish.png',
    vibrate: [200, 100, 200],
    data: { url: 'https://mahalawu.github.io/agromina/' }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
