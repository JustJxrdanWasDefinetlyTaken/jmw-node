/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/service/',
    encodeUrl: Ultraviolet.codec.plain.encode,
    decodeUrl: Ultraviolet.codec.plain.decode,
    handler: '/vu/uv.handler.js',
    client: '/vu/uv.client.js',
    bundle: '/vu/uv.bundle.js',
    config: '/vu/uv.config.js',
    sw: '/vu/uv.sw.js',
};

