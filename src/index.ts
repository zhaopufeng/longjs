/**
 * @class @longjs/proxy
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */

import { Server } from '@longjs/server'
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

export function proxyTable(ctx: Server.Context, options: Options = {}) {
    Object.keys(options).forEach((key: string) => {
        proxy(key, ctx, options[key])
    })
}

export function proxy(path: string, ctx: Server.Context, proxyOptions: ProxyOptions) {
    const { pathRewrite, changeOrigin } = proxyOptions
    // changeOrigin default true
    if (typeof changeOrigin !== 'boolean') proxyOptions.changeOrigin = true
    if (RegExp(path).test(ctx.path)) {
        _proxy.web(ctx.req as IncomingMessage, ctx.res as ServerResponse, proxyOptions)
    }
}

export default proxyTable