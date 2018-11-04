/**
 * @class @longjs/proxy
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */

import { Core, Plugin } from '@longjs/core'
import * as httpProxy from 'http-proxy'
import * as url from 'url';
import * as stream from 'stream';
import { Agent, IncomingMessage, ServerResponse } from 'http';
import { ServerOptions } from 'https'

export interface PathRewrite {
    [key: string]: string;
}

export interface Routers {
    [key: string]: string;
}

export interface ProxyOptions {
    /** Buffer */
    buffer?: stream.Stream;
    /** URL string to be parsed with the url module. */
    target?: string | url.Url;
    /** URL string to be parsed with the url module. */
    forward?: string| url.Url;
    /** Object to be passed to http(s).request. */
    agent?: Agent;
    /** Object to be passed to https.createServer(). */
    ssl?: ServerOptions;
    /** If you want to proxy websockets. */
    ws?: boolean;
    /** Adds x- forward headers. */
    xfwd?: boolean;
    /** Verify SSL certificate. */
    secure?: boolean;
    /** Explicitly specify if we are proxying to another proxy. */
    toProxy?: boolean;
    /** Specify whether you want to prepend the target's path to the proxy path. */
    prependPath?: boolean;
    /** Specify whether you want to ignore the proxy path of the incoming request. */
    ignorePath?: boolean;
    /** Local interface string to bind for outgoing connections. */
    localAddress?: boolean;
    /** Changes the origin of the host header to the target URL. */
    changeOrigin?: boolean;
    /** specify whether you want to keep letter case of response header key */
    preserveHeaderKeyCase?: boolean;
    /** Basic authentication i.e. 'user:password' to compute an Authorization header. */
    auth?: string;
    /** Rewrites the location hostname on (301 / 302 / 307 / 308) redirects, Default: null. */
    hostRewrite?: string;
    /** Rewrites the location host/ port on (301 / 302 / 307 / 308) redirects based on requested host/ port.Default: false. */
    autoRewrite?: boolean;
    /** Rewrites the location protocol on (301 / 302 / 307 / 308) redirects to 'http' or 'https'.Default: null. */
    protocolRewrite?: string;
    /** rewrites domain of set-cookie headers. */
    cookieDomainRewrite?: false | string | {[oldDomain: string]: string};
    /** object with extra headers to be added to target requests. */
    headers?: {[header: string]: string};
    /** Timeout (in milliseconds) when proxy receives no response from target. Default: 120000 (2 minutes) */
    proxyTimeout?: number;
    /** If set to true, none of the webOutgoing passes are called and it's your responsibility to appropriately return the response by listening and acting on the proxyRes event */
    selfHandleResponse?: boolean;
    pathRewrite?: PathRewrite;
}

export interface Options {
    [key: string]: ProxyOptions
}

let _proxy: httpProxy = httpProxy.createProxyServer({})

export async function proxyTable(ctx: Core.Context, options: Options = {}) {
    for (let key in options) {
        await proxy(key, ctx, options[key])
    }
}

export async function proxy(path: string, ctx: Core.Context, proxyOptions: ProxyOptions) {
    return new Promise((next, reject) => {
        const { changeOrigin, pathRewrite } = proxyOptions
        if (!/\^/.test(path)) path = `^${path}`
        if (!/\$$/.test(path)) path = `${path}$`
        if (RegExp(path).test(ctx.path)) {
            if (typeof changeOrigin === 'undefined') proxyOptions.changeOrigin = true
            const path = ctx.path
            for (let item in pathRewrite) {
                let itemPath: string = item
                let itemPath2: string;
                // pathRewrite
                if (!/\^/.test(itemPath)) itemPath = `^${itemPath}`
                if (!/\$$/.test(itemPath)) {
                    itemPath = `${itemPath}$`
                    itemPath2 = `${itemPath}/$`
                }
                if (RegExp(itemPath).test(path)) {
                    ctx.req.url = ctx.req.url.replace(RegExp(itemPath), pathRewrite[item]).replace(/[\/]{2,}/g, '/')
                } else if (RegExp(itemPath2).test(path)) {
                    ctx.req.url = ctx.req.url.replace(RegExp(itemPath2), pathRewrite[item]).replace(/[\/]{2,}/g, '/')
                }
            }
            // proxy
            _proxy.web(ctx.req as IncomingMessage, ctx.res as ServerResponse, proxyOptions)
            _proxy.on('error', function(err) {
                reject(err)
            })
        } else {
            next()
        }
    })
}

export class Proxy implements Plugin {
    private _proxy: httpProxy = _proxy
    constructor(public options: Options) { }
    public async handlerRequest(ctx: Core.Context, configs: any) {
        if (!configs) configs = this.options
        await this.proxyTable(ctx, this.options)
    }

    public async proxyTable(ctx: Core.Context, options: Options = {}) {
        for (let key in options) {
            await proxy(key, ctx, options[key])
        }
    }

    public async proxy(path: string, ctx: Core.Context, proxyOptions: ProxyOptions) {
        return new Promise((next, reject) => {
            const { changeOrigin, pathRewrite } = proxyOptions
            if (RegExp(path).test(ctx.path)) {
                if (typeof changeOrigin === 'undefined') proxyOptions.changeOrigin = true
                const path = ctx.path
                for (let item in pathRewrite) {
                    let itemPath: string = item
                    let itemPath2: string;
                    // pathRewrite
                    if (!/\^/.test(itemPath)) itemPath = `^${itemPath}`
                    if (!/\$$/.test(itemPath)) {
                        itemPath = `${itemPath}$`
                        itemPath2 = `${itemPath}/$`
                    }
                    if (RegExp(itemPath).test(path)) {
                        ctx.req.url = ctx.req.url.replace(RegExp(itemPath), pathRewrite[item]).replace(/[\/]{2,}/g, '/')
                    } else if (RegExp(itemPath2).test(path)) {
                        ctx.req.url = ctx.req.url.replace(RegExp(itemPath2), pathRewrite[item]).replace(/[\/]{2,}/g, '/')
                    }
                }
                // proxy
                this._proxy.web(ctx.req as IncomingMessage, ctx.res as ServerResponse, proxyOptions)
                this._proxy.on('error', function(err) {
                    reject(err)
                })
            } else {
                next()
            }
        })
    }
}

export default Proxy