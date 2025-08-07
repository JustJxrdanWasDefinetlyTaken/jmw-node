importScripts('../epoxy/index.js');
importScripts('vu/uv.bundle.js');
importScripts('vu/uv.config.js');
importScripts(__uv$config.sw || 'vu/uv.sw.js');

const uv = new UVServiceWorker();

self.addEventListener('fetch', event => {
    event.respondWith(
        (async ()=>{
            if(uv.route(event)) {
                return await uv.fetch(event);
            }
            return await fetch(event.request);
        })()
    );
});