/**
 * util send
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */

/**
 * Module dependencies.
 */
import resolvePath from './resolve-path'
import * as assert from 'assert'
import * as httpError from 'http-errors'
import { fs } from 'mz'
import { normalize, basename, extname, resolve, parse, sep } from 'path'
import { Core } from '@longjs/core';
import { ServerResponse } from 'http';

export default async function(ctx: Core.Context, path: string, opts: Options = {}) {
    assert(ctx, 'context required')
    assert(path, 'pathname required')

    const root = opts.root ? normalize(resolve(opts.root)) : ''
    const trailingSlash = path[path.length - 1] === '/'
    path = path.substr(parse(path).root.length)
    const index = opts.index
    const maxage = opts.maxage || opts.maxAge || 0
    const immutable = opts.immutable || false
    const hidden = opts.hidden || false
    const format = opts.format !== false
    const extensions = Array.isArray(opts.extensions) ? opts.extensions : false
    const brotli = opts.brotli !== false
    const gzip = opts.gzip !== false
    const setHeaders = opts.setHeaders

    if (setHeaders && typeof setHeaders !== 'function') {
        throw new TypeError('option setHeaders must be function')
    }

    // normalize path
    const _path = decode(path)
    if (!~(_path as number)) {
        return ctx.throw(400, 'failed to decode')
    } else {
        path = _path as string;
    }

    // index file support
    if (index && trailingSlash) path += index

    path = resolvePath(root, path)

     // hidden file support, ignore
    if (!hidden && isHidden(root, path)) return

    let encodingExt = ''

    // serve brotli file when possible otherwise gzipped file when possible
    if (ctx.acceptsEncodings('br', 'identity') === 'br' && brotli && (await fs.exists(path + '.br'))) {
        path = path + '.br'
        ctx.set('Content-Encoding', 'br')
        ctx.res.removeHeader('Content-Length')
        encodingExt = '.br'
    } else if (ctx.acceptsEncodings('gzip', 'identity') === 'gzip' && gzip && (await fs.exists(path + '.gz'))) {
        path = path + '.gz'
        ctx.set('Content-Encoding', 'gzip')
        ctx.res.removeHeader('Content-Length')
        encodingExt = '.gz'
    }

    if (extensions && !/\.[^/]*$/.exec(path)) {
        const list = [].concat(extensions)
        for (let item of list) {
            if (typeof item !== 'string') {
                throw new TypeError('option extensions must be array of strings or false')
            }
            if (!/^\./.exec(item)) item = '.' + item
            if (await fs.exists(path + item)) {
                path = path + item
                break
            }
        }
    }

    let stats

    try {
        stats = await fs.stat(path)
        // Format the path to serve static file servers
        // and not require a trailing slash for directories,
        // so that you can do both `/directory` and `/directory/`
        if (stats.isDirectory()) {
          if (format && index) {
            path += '/' + index
            stats = await fs.stat(path)
          } else {
            return
          }
        }
      } catch (err) {
        const notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR']
        if (notfound.includes(err.code)) {
          throw httpError(404, err)
        }
        err.status = 500
        throw err
    }

    if (setHeaders) setHeaders(ctx.res as ServerResponse, path, stats)
    // stream

    // media
    const range: string = ctx.request.get('range') as string
    if (range) {
        let parts = range.replace(/bytes=/, '').split('-');
        let  [rangeStart, rangeEnd] = parts
        let start: number = Number(rangeStart)
        let end =  stats.size - 1
        let chunksize = stats.size - start
        ctx.set('Content-Range', `bytes ${start}-${end}/${stats.size}`)
        ctx.set('Accept-Ranges', 'bytes')
        ctx.status = 206
        ctx.body = fs.createReadStream(path, {
            start,
            end
        })
        ctx.length = chunksize
        if (!ctx.type)  ctx.type = type(path, encodingExt)
    } else {
        ctx.set('Content-Length', stats.size.toString())

        if (!ctx.response.get('Last-Modified')) ctx.set('Last-Modified', stats.mtime.toUTCString())
        if (!ctx.response.get('Cache-Control')) {
            const directives = ['max-age=' + (maxage / 1000 | 0)]
            if (immutable) {
            directives.push('immutable')
            }
            ctx.set('Cache-Control', directives.join(','))
        }

        if (!ctx.type) ctx.type = type(path, encodingExt)
        ctx.body = fs.createReadStream(path)
    }

    return path
}

/**
 * File type.
 */

export function type(file: string, ext: string) {
    return ext !== '' ? extname(basename(file, ext)) : extname(file)
}

/**
 * Decode `path`.
 */
export function decode(path: string) {
    try {
        return decodeURIComponent(path)
    } catch (err) {
        return -1
    }
}

/**
 *  Check if it's hidden.
 */
export function isHidden(root: string, path: string | string[]) {
    path = (path as string).substr(root.length).split(sep)
    for (let i = 0; i < (path as any).length; i++) {
      if (path[i][0] === '.') return true
    }
    return false
}

export interface Options {
    root?: string; // Root directory to restrict file access.
    index?: string | boolean; // Default file name, defaults to 'index.html'
    maxage?: number; // maxage Browser cache max-age in milliseconds. defaults to 0
    maxAge?: number; // maxage Browser cache max-age in milliseconds. defaults to 0
    immutable?: boolean; // Tell the browser the resource is immutable and can be cached indefinitely. (defaults to false)
    hidden?: boolean; // Allow transfer of hidden files. (defaults to false)
    format?: boolean; //  If not false (defaults to true), format the path to serve static file servers and not require a trailing slash for directories, so that you can do both /directory and /directory/.
    extensions?: any | any[]; // Try to match extensions from passed array to search for file when no extension is sufficed in URL. First found is served. (defaults to false)
    brotli?: boolean; // Try to serve the brotli version of a file automatically when brotli is supported by a client and if the requested file with .br extension exists. (defaults to true).
    gzip?: boolean; // Try to serve the gzipped version of a file automatically when gzip is supported by a client and if the requested file with .gz extension exists. defaults to true.
    setHeaders?: (res: ServerResponse, path: string, stats: fs.Stats) => void; // Function to set custom headers on response.
}