if (navigator.userAgent.includes("Firefox")) {
	Object.defineProperty(globalThis, "crossOriginIsolated", {
		value: true,
		writable: false,
	});
}

importScripts("/scram/scramjet.all.js");
const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

(async () => {
	await scramjet.loadConfig();

})

async function handleRequest(event) {
	if (scramjet.route(event)) {
		return scramjet.fetch(event);
	}

	return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event));
});