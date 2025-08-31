importScripts(
  "/vu/vu.bundle.js",
)
importScripts("/vu/vu.config.js")
importScripts(__uv$config.sw)
importScripts("/scram/scramjet.all.js");



if (navigator.userAgent.includes("Firefox")) {
  Object.defineProperty(globalThis, "crossOriginIsolated", {
    value: true,
    writable: true,
  })
}

const vu = new uvServiceWorker()
const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("install", () => {
  self.skipWaiting()
})

async function handleRequest(event) {
  await scramjet.loadConfig()
  if (scramjet.route(event)) {
    return scramjet.fetch(event)
  }


  if (vu.route(event)) return await vu.fetch(event);
    
  return await fetch(event.request)
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event))
})
