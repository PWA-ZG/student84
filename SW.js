const staticCacheName = "site-static";

const assets = [
  "/",
  "/css/style.css",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/images/Bon-Jovi-Brasao-logo-vector.png",
  "/images/Guns-N-Roses-logo.png",
  "/images/Nirvana-logo.png",
  "/images/ac-dc-logo-vector-01.png",
  "/images/ac-dc-logo-vector-01.png"
];

self.addEventListener("install", (event) => {
  console.log("service worker has been installed");
  const filesUpdate = (cache) => {
    const stack = [];
    assets.forEach((file) =>
      stack.push(
        cache
          .add(file)
          .catch((_) => console.error(`can't load ${file} to cache`))
      )
    );
    return Promise.all(stack);
  };

  event.waitUntil(caches.open(staticCacheName).then(filesUpdate));
});
//activate event
self.addEventListener("activate", (event) => {
  //console.log("service worker has been activated");
});

//fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      return cacheResponse || fetch(event.request);
    })
  ); 
});

self.addEventListener("sync", (event) => {
  console.log(event)
  if (event.tag === "sync") {
    event.waitUntil(pushNotify());
  }
});

self.addEventListener("sync", (event) => {
  console.log(event)
  if (event.tag === "sync-two") {
    event.waitUntil(pushNotifyTwo());
  }
});

function pushNotify() {
  self.registration.showNotification(`Video is successfuly downloaded!`);
}
function pushNotifyTwo() {
  self.registration.showNotification(`You are online now...`);
}
