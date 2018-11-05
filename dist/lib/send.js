"use strict";
/**
 * util send
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
const resolve_path_1 = require("./resolve-path");
const assert = require("assert");
const httpError = require("http-errors");
const mz_1 = require("mz");
const path_1 = require("path");
async function default_1(ctx, path, opts = {}) {
    assert(ctx, 'context required');
    assert(path, 'pathname required');
    const root = opts.root ? path_1.normalize(path_1.resolve(opts.root)) : '';
    const trailingSlash = path[path.length - 1] === '/';
    path = path.substr(path_1.parse(path).root.length);
    const index = opts.index;
    const maxage = opts.maxage || opts.maxAge || 0;
    const immutable = opts.immutable || false;
    const hidden = opts.hidden || false;
    const format = opts.format !== false;
    const extensions = Array.isArray(opts.extensions) ? opts.extensions : false;
    const brotli = opts.brotli !== false;
    const gzip = opts.gzip !== false;
    const setHeaders = opts.setHeaders;
    if (setHeaders && typeof setHeaders !== 'function') {
        throw new TypeError('option setHeaders must be function');
    }
    // normalize path
    const _path = decode(path);
    if (!~_path) {
        return ctx.throw(400, 'failed to decode');
    }
    else {
        path = _path;
    }
    // index file support
    if (index && trailingSlash)
        path += index;
    path = resolve_path_1.default(root, path);
    // hidden file support, ignore
    if (!hidden && isHidden(root, path))
        return;
    let encodingExt = '';
    // serve brotli file when possible otherwise gzipped file when possible
    if (ctx.acceptsEncodings('br', 'identity') === 'br' && brotli && (await mz_1.fs.exists(path + '.br'))) {
        path = path + '.br';
        ctx.set('Content-Encoding', 'br');
        ctx.res.removeHeader('Content-Length');
        encodingExt = '.br';
    }
    else if (ctx.acceptsEncodings('gzip', 'identity') === 'gzip' && gzip && (await mz_1.fs.exists(path + '.gz'))) {
        path = path + '.gz';
        ctx.set('Content-Encoding', 'gzip');
        ctx.res.removeHeader('Content-Length');
        encodingExt = '.gz';
    }
    if (extensions && !/\.[^/]*$/.exec(path)) {
        const list = [].concat(extensions);
        for (let item of list) {
            if (typeof item !== 'string') {
                throw new TypeError('option extensions must be array of strings or false');
            }
            if (!/^\./.exec(item))
                item = '.' + item;
            if (await mz_1.fs.exists(path + item)) {
                path = path + item;
                break;
            }
        }
    }
    let stats;
    try {
        stats = await mz_1.fs.stat(path);
        // Format the path to serve static file servers
        // and not require a trailing slash for directories,
        // so that you can do both `/directory` and `/directory/`
        if (stats.isDirectory()) {
            if (format && index) {
                path += '/' + index;
                stats = await mz_1.fs.stat(path);
            }
            else {
                return;
            }
        }
    }
    catch (err) {
        const notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'];
        if (notfound.includes(err.code)) {
            throw httpError(404, err);
        }
        err.status = 500;
        throw err;
    }
    if (setHeaders)
        setHeaders(ctx.res, path, stats);
    // stream
    // media
    const range = ctx.request.get('range');
    if (range) {
        let parts = range.replace(/bytes=/, '').split('-');
        let [rangeStart, rangeEnd] = parts;
        let start = Number(rangeStart);
        let end = stats.size - 1;
        let chunksize = stats.size - start;
        ctx.set('Content-Range', `bytes ${start}-${end}/${stats.size}`);
        ctx.set('Accept-Ranges', 'bytes');
        ctx.status = 206;
        ctx.body = mz_1.fs.createReadStream(path, {
            start,
            end
        });
        ctx.length = chunksize;
        if (!ctx.type)
            ctx.type = type(path, encodingExt);
    }
    else {
        ctx.set('Content-Length', stats.size.toString());
        if (!ctx.response.get('Last-Modified'))
            ctx.set('Last-Modified', stats.mtime.toUTCString());
        if (!ctx.response.get('Cache-Control')) {
            const directives = ['max-age=' + (maxage / 1000 | 0)];
            if (immutable) {
                directives.push('immutable');
            }
            ctx.set('Cache-Control', directives.join(','));
        }
        if (!ctx.type)
            ctx.type = type(path, encodingExt);
        ctx.body = mz_1.fs.createReadStream(path);
    }
    return path;
}
exports.default = default_1;
/**
 * File type.
 */
function type(file, ext) {
    return ext !== '' ? path_1.extname(path_1.basename(file, ext)) : path_1.extname(file);
}
exports.type = type;
/**
 * Decode `path`.
 */
function decode(path) {
    try {
        return decodeURIComponent(path);
    }
    catch (err) {
        return -1;
    }
}
exports.decode = decode;
/**
 *  Check if it's hidden.
 */
function isHidden(root, path) {
    path = path.substr(root.length).split(path_1.sep);
    for (let i = 0; i < path.length; i++) {
        if (path[i][0] === '.')
            return true;
    }
    return false;
}
exports.isHidden = isHidden;
