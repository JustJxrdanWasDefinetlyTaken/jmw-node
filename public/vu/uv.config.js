/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/service/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/vu/uv.handler.js',
    client: '/vu/uv.client.js',
    bundle: '/vu/uv.bundle.js',
    config: '/vu/uv.config.js',
    sw: '/vu/uv.sw.js',
};

