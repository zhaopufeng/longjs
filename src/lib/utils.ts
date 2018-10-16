/**
 * @class utils
 * @license MIT
 */

import * as Stream from 'stream'
import * as mimeTypes from 'mime-types'
import { LRU } from './LRU';

export function isJSON(body: any): boolean {
    if (!body) return false;
    if ('string' === typeof body) return false;
    if ('function' === typeof body.pipe) return false;
    if (Buffer.isBuffer(body)) return false;
    return true;
}

export function ensureErrorHandler(stream: Stream, error: (...args: any[]) => void): Stream {
    if (stream instanceof Stream && !~stream.listeners('error').indexOf(error)) {
        stream.on('error', error);
    }
    return stream;
}

const typeLRUCache = new LRU(100);

export function getType(type: string): string {
    let mimeType = typeLRUCache.get(type);
    if (!mimeType) {
        mimeType = mimeTypes.contentType(type);
        typeLRUCache.set(type, mimeType);
    }
    return mimeType as string;
}