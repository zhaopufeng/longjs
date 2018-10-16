"use strict";
/**
 * @class utils
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Stream = require("stream");
const mimeTypes = require("mime-types");
const LRU_1 = require("./LRU");
function isJSON(body) {
    if (!body)
        return false;
    if ('string' === typeof body)
        return false;
    if ('function' === typeof body.pipe)
        return false;
    if (Buffer.isBuffer(body))
        return false;
    return true;
}
exports.isJSON = isJSON;
function ensureErrorHandler(stream, error) {
    if (stream instanceof Stream && !~stream.listeners('error').indexOf(error)) {
        stream.on('error', error);
    }
    return stream;
}
exports.ensureErrorHandler = ensureErrorHandler;
const typeLRUCache = new LRU_1.LRU(100);
function getType(type) {
    let mimeType = typeLRUCache.get(type);
    if (!mimeType) {
        mimeType = mimeTypes.contentType(type);
        typeLRUCache.set(type, mimeType);
    }
    return mimeType;
}
exports.getType = getType;
