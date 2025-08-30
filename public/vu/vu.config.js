/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/service/',
    encodeUrl: Ultraviolet.codec.plain.encode,
    decodeUrl: Ultraviolet.codec.plain.decode,
    handler: '/vu/vu.handler.js',
    client: '/vu/vu.client.js',
    bundle: '/vu/vu.bundle.js',
    config: '/vu/vu.config.js',
    sw: '/vu/vu.sw.js',
};
