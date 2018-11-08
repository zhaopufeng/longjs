/**
 * @class Server
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-21 0:07
 * @export Server
 */

import * as httpAssert from 'http-assert'
import * as EventEmitter from 'events'
import * as statuses from 'statuses'
import * as Keygrip from 'keygrip'
import * as typeIs from 'type-is'
import * as parse from 'co-body'
import * as Cookies from 'cookies'
import { Socket } from 'net'
import { ListenOptions } from 'net'
import { IncomingMessage, ServerResponse, createServer, OutgoingHttpHeaders, IncomingHttpHeaders } from 'http'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import { CreateContext } from './lib/CreateContext'
import { CreateResponse } from './lib/CreateResponse'
import { CreateRequest } from './lib/CreateRequest'
import { Stream } from 'stream'
import { isJSON } from './lib/utils'
import { Plugin } from './lib/Plugin'
import { randomBytes } from 'crypto'

export default class Server extends EventEmitter {
    public proxy: boolean;
    public subdomainOffset: number = 2
    public env: Core.Env = process.env.NODE_ENV as Core.Env || 'development'
    public silent: boolean
    public keys: Keygrip | string[];
    private _plugins: Core.Plugins = []

    /**
     * constructor
     */
    constructor(public options: Core.Options = {}) {
        super()
        options.configs = options.configs || {}
        options.pluginConfigs = options.pluginConfigs || {}
        this.keys = options.keys || ['long:sess']
        this.subdomainOffset = options.subdomainOffset || 2
        this.env = process.env.NODE_ENV as  Core.Env || 'development'

        const { plugins = [] } = this.options
        this.use(...plugins)

        // Start server listen port
        if (options.port) {
            if (options.host) {
                this.listen(options.port, options.host)
            } else {
                this.listen(options.port)
            }
        }
    }

    /**
     * callback
     * Handler custom http proccess
     */
    public callback() {
        return (request: IncomingMessage | Http2ServerRequest, response: ServerResponse | Http2ServerResponse) => {
            this.start(request, response)
        }
    }

    public use(...plugins: Plugin[]): this {
        const { _plugins = [] } = this
        const { requests = [], responses = [], respondeds = [], closes = [], exceptions = [] } = _plugins
        plugins.forEach((plugin, i) => {
            const uid = randomBytes(24).toString('hex')
            const pluginConfig = {}
            if (typeof plugin.init === 'function') plugin.init(this.options)
            ; (plugin as any)['uid'] = uid
            if (typeof plugin.request === 'function') requests.push(plugin)
            if (typeof plugin.response === 'function') responses.push(plugin)
            if (typeof plugin.responded === 'function') respondeds.push(plugin)
            if (typeof plugin.close === 'function') closes.push(plugin)
            if (typeof plugin.exception === 'function') exceptions.push(plugin)
            this.options.pluginConfigs[uid] = pluginConfig
        })
        _plugins.requests = requests
        _plugins.responses = responses
        _plugins.respondeds = respondeds
        _plugins.closes = closes
        _plugins.exceptions = exceptions
        this._plugins = _plugins
        return this;
    }

    /**
     * listen
     * Http listen method
     */
    public listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): this;
    public listen(port: number, hostname?: string, listeningListener?: () => void): this;
    public listen(port: number, backlog?: number, listeningListener?: () => void): this;
    public listen(port: number, listeningListener?: () => void): this;
    public listen(path: string, backlog?: number, listeningListener?: () => void): this;
    public listen(path: string, listeningListener?: () => void): this;
    public listen(options: ListenOptions, listeningListener?: () => void): this;
    public listen(handle: any, backlog?: number, listeningListener?: () => void): this;
    public listen(handle: any, listeningListener?: () => void): this;
    public listen(...args: any[]): this {
        createServer(this.callback())
        .listen(...args)
        return this;
    }

    public getPluginId(pluginConstructor: { new (...args: any[]): any}) {
        const plugin = this.options.plugins.filter((plugin) => plugin instanceof pluginConstructor)
        if (plugin.length > 0) {
            return plugin[0].uid;
        }
    }

    /**
     * start
     * Application start method
     */
    private async start(request: IncomingMessage | Http2ServerRequest, response: ServerResponse | Http2ServerResponse): Promise<any>  {
        // Create http/https context
        const context = this.createContext(request, response)
        const { configs = {} } = this.options;
        if (!/(GET|DELETE|HEAD|COPY|PURGE|UNLOCK)/.test(context.method)) {
            // Parse body
            const { body = {}, strict = true} = configs
            const { limit = {} } = body
            const request = context.req as IncomingMessage
            if (typeIs(request, 'json') === 'json') {
                context.request.body = await parse.json(request, { limit: limit.json, strict})
            } else if (typeIs(request, 'urlencoded') === 'urlencoded') {
                context.request.body = await parse.form(request, { limit: limit.form, strict})
            } else if (typeIs(request, 'text') === 'text') {
                context.request.body = await parse.text(request, { limit: limit.text, strict})
            }
        }
        const data: { [key: string]: any } = {}
        const { pluginConfigs } = this.options
        try {
            const { _plugins = [] } = this
            const { requests = [], responses = [], closes = [], respondeds = [] } = _plugins
            // Run plugin request
            for (let plugin of requests) {
                await plugin.request(context, pluginConfigs[plugin.uid], data)
            }
            // Run plugin response
            for (let plugin of responses) {
                await plugin.response(context, pluginConfigs[plugin.uid], data)
            }
            // Run plugin responded
            for (let plugin of respondeds) {
                await plugin.responded(context, pluginConfigs[plugin.uid], data)
            }

            // Core run respond
            await this.respond(context)

            // respond
            for (let plugin of closes) {
                await plugin.close(context, pluginConfigs[plugin.uid], data)
            }
            /**
             * Handler not found
             * 1. Response is not finished
             * 2. Response is not headerSent
             * 3. Response is writable
             * 4. response body == null
             */
            if (!context.finished && !context.headerSent && context.writable && context.response.body == null) context.throw(404)

        } catch (error) {
            // Handler exception
            this.exception(context, error)
            this.emit('exception', [error, context])
            const { exceptions = [] } = this._plugins
            for (let plugin of exceptions) {
                await plugin.exception(error, context, pluginConfigs[plugin.uid], data)
            }
        }
    }

    /**
     * respond
     * Application respond
     */
    private async respond(context: Core.Context): Promise<any> {
        // Check context writable
        if (!context.writable) return;

        // Get response body
        let body = context.response.body;

        // check response statusCode
        const code = context.status;

        const response = context.res as ServerResponse

        // ignore body
        if (statuses.empty[code]) {
            // strip headers
            context.body = null;
            return response.end();
        }

        // If request method is HEAD
        if ('HEAD' === context.method) {
            if (!response.headersSent && isJSON(body)) {
                context.length = Buffer.byteLength(JSON.stringify(body));
            }
            return response.end();
        }

        // responses
        if (body) {
            if (Buffer.isBuffer(body)) return response.end(body)

            if (typeof body === 'string') return response.end(body)

            if (body instanceof Stream) return body.pipe(response)

            if (typeof body === 'object') {
                // body: json
                body = JSON.stringify(body);
                if (!response.headersSent) {
                    context.length = Buffer.byteLength(body);
                }
                return response.end(body);
            }

            if ('number' === typeof body) {
                body = body.toString()
                context.type = 'text';
                context.length = Buffer.byteLength(body)
                return response.end(body)
            }
        }
    }

    /**
     * exception
     * Exception handler method
     */
    private exception(context: Core.Context, error: Core.HttpException & Error) {
        let status: number;
        // If not number
        if (error.statusCode) {
            status = error.statusCode
        } else if (isNaN(error.message as any)) {
            status = statuses[error.message]
        }

        if ('development' === this.env && !status) console.log(error)

        if (!context.finished) {
            status = status || 500
            const data = error.data || statuses[status]
            context.status = status
            const reg = /[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/
            if (error.message && !reg.test(error.message)) {
                if (error.message.length > 0) context.message = error.message
            }
            context.body = data
            this.respond(context)
        }
    }

    /**
     * createContext
     * Server context create method
     */
    protected createContext(
        req: IncomingMessage | Http2ServerRequest,
        res: ServerResponse | Http2ServerResponse,
    ): Core.Context {
        const request = new CreateRequest(req, res, this)
        const response = new CreateResponse(req, res, this)
        const context: Core.Context = new CreateContext(req, res, request, response, this)
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        return context;
    }
}

export * from './lib/Plugin'
export * from './lib/HttpException'

export namespace Core {
    export interface Plugins extends Array<Plugin> {
        requests?: Plugin[];
        responses?: Plugin[];
        closes?: Plugin[];
        respondeds?: Plugin[];
        exceptions?: Plugin[];
    }

    export interface HttpException {
        statusCode?: number;
        message?: string;
        data?: any;
    }

    export interface HttpExceptionConstructor extends HttpException {
        new (error: HttpException): HttpException;
    }

    export interface HttpHandler {
        (ctx?: Context): Promise<any>
    }

    export interface Configs {
        body?: {
            limit?: {
                json?: number;
                form?: number;
                text?: number;
            }
        };
        [key: string]: any;
    }

    export interface Options {
        port?: number;
        host?: string;
        configs?: Configs;
        pluginConfigs?: Configs;
        keys?: Keygrip | string[];
        env?: Env;
        proxy?: boolean;
        subdomainOffset?: number;
        silent?: boolean;
        plugins?: Plugins;
    }

    export interface BaseContext extends ContextDelegatedRequest, ContextDelegatedResponse {

        /**
         * Similar to .throw(), adds assertion.
         *
         *    this.assert(this.user, 401, 'Please login!');
         *
         * See: https://github.com/jshttp/http-assert
         */
        assert: typeof httpAssert;

        /**
         * Throw an error with `msg` and optional `status`
         * defaulting to 500. Note that these are user-level
         * errors, and the message may be exposed to the client.
         *
         *    this.throw(403)
         *    this.throw('name required', 400)
         *    this.throw(400, 'name required')
         *    this.throw('something exploded')
         *    this.throw(new Error('invalid'), 400);
         *    this.throw(400, new Error('invalid'));
         *
         * See: https://github.com/jshttp/http-errors
         */
        throw(message: string, code?: number, properties?: {}): never;
        throw(status: number): never;
        throw(...properties: Array<number | string | {}>): never;
    }

    export interface BaseRequest extends ContextDelegatedRequest {
        /**
         * Get the charset when present or undefined.
         */
        charset: string;
        /**
         * Return parsed Content-Length when present.
         */
        length: number;
        /**
         * Return the request mime type void of
         * parameters such as "charset".
         */
        type: string;

        /**
         * Is
         */
        is(...types: string[]): string | false;
    }

    export interface BaseResponse extends ContextDelegatedResponse {
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        socket: Socket;

        /**
         * Return response header.
         */
        header: OutgoingHttpHeaders;

        /**
         * Return response header, alias as response.header
         */
        headers: OutgoingHttpHeaders;

        /**
         * Check whether the response is one of the listed types.
         * Pretty much the same as `this.request.is()`.
         *
         * @param {String|Array} types...
         * @return {String|false}
         * @api public
         */
        // is(): string;
        is(...types: string[]): string | false;
        is(type: string): string | false;

        /**
         * Return response header.
         *
         * Examples:
         *
         *     this.get('Content-Type');
         *     // => "text/plain"
         *
         *     this.get('content-type');
         *     // => "text/plain"
         */
        get(field: string): string | number | string[];

    }

    export  interface Request extends BaseRequest {
        app: Server;
        req: IncomingMessage | Http2ServerRequest;
        res: ServerResponse | Http2ServerResponse;
        ctx: Context;
        body: any;
        files: any;
        response: Response;
        originalUrl: string;
        ip: string;
    }

    export interface Response extends BaseResponse {
        app: Server;
        req: IncomingMessage | Http2ServerRequest;
        res: ServerResponse | Http2ServerResponse;
        ctx: Context;
        request: Request;
    }

    export interface Context extends BaseContext {
        app: Server;
        request: Request;
        response: Response;
        req: IncomingMessage | Http2ServerRequest;
        res: ServerResponse | Http2ServerResponse;
        originalUrl: string;
        cookies: Cookies;
        files: any;
        session?: Session;
        _session?: string;
        /**
         * To bypass Koa's built-in response handling, you may explicitly set `ctx.respond = false;`
         */
        respond?: boolean;
        [key: string]: any;
    }

    export interface Session {
        refresh?(): void;
        sid: string;
        old?: string;
        [key: string]: any;
    }

    export interface ContextDelegatedRequest {
        /**
         * Return request header.
         */
        header: IncomingHttpHeaders;

        /**
         * Return request header, alias as request.header
         */
        headers: IncomingHttpHeaders;

        /**
         * Get/Set request URL.
         */
        url: string;

        /**
         * Get origin of URL.
         */
        origin: string;

        /**
         * Get full request URL.
         */
        href: string;

        /**
         * Get/Set request method.
         */
        method: string;

        /**
         * Get request pathname.
         * Set pathname, retaining the query-string when present.
         */
        path: string;

        /**
         * Get parsed query-string.
         * Set query-string as an object.
         */
        query: any;

        /**
         * Get/Set query string.
         */
        querystring: string;

        /**
         * Get the search string. Same as the querystring
         * except it includes the leading ?.
         *
         * Set the search string. Same as
         * response.querystring= but included for ubiquity.
         */
        search: string;

        /**
         * Parse the "Host" header field host
         * and support X-Forwarded-Host when a
         * proxy is enabled.
         */
        host: string;

        /**
         * Parse the "Host" header field hostname
         * and support X-Forwarded-Host when a
         * proxy is enabled.
         */
        hostname: string;

        /**
         * Get WHATWG parsed URL object.
         */
        URL?: URL;

        /**
         * Check if the request is fresh, aka
         * Last-Modified and/or the ETag
         * still match.
         */
        fresh: boolean;

        /**
         * Check if the request is stale, aka
         * "Last-Modified" and / or the "ETag" for the
         * resource has changed.
         */
        stale: boolean;

        /**
         * Check if the request is idempotent.
         */
        idempotent: boolean;

        /**
         * Return the request socket.
         */
        socket: Socket;

        /**
         * Return the protocol string "http" or "https"
         * when requested with TLS. When the proxy setting
         * is enabled the "X-Forwarded-Proto" header
         * field will be trusted. If you're running behind
         * a reverse proxy that supplies https for you this
         * may be enabled.
         */
        protocol: string;

        /**
         * Short-hand for:
         *
         *    this.protocol == 'https'
         */
        secure: boolean;

        /**
         * Request remote address. Supports X-Forwarded-For when app.proxy is true.
         */
        ip: string;

        /**
         * Request params
         */
        params: any;

        /**
         * When `app.proxy` is `true`, parse
         * the "X-Forwarded-For" ip address list.
         *
         * For example if the value were "client, proxy1, proxy2"
         * you would receive the array `["client", "proxy1", "proxy2"]`
         * where "proxy2" is the furthest down-stream.
         */
        ips: string[];

        /**
         * Return subdomains as an array.
         *
         * Subdomains are the dot-separated parts of the host before the main domain
         * of the app. By default, the domain of the app is assumed to be the last two
         * parts of the host. This can be changed by setting `app.subdomainOffset`.
         *
         * For example, if the domain is "tobi.ferrets.example.com":
         * If `app.subdomainOffset` is not set, this.subdomains is
         * `["ferrets", "tobi"]`.
         * If `app.subdomainOffset` is 3, this.subdomains is `["tobi"]`.
         */
        subdomains: string[];

        accept: any;

        /**
         * Get
         */
        get(field: string): string | number | string[];

        /**
         * accepts
         */
        accepts(args: string | string[]): string[] | string | false;
        accepts(...args: string[]): string[] | string | false;

        /**
         * acceptsLanguages
         */
        acceptsLanguages(args: string | string[]): string | false;
        acceptsLanguages(...args: string[]): string | false;

        /**
         * acceptsLanguages
         */
        acceptsCharsets(args: string | string[]): string | false;
        acceptsCharsets(...args: string[]): string | false;

        /**
         * acceptsLanguages
         */
        acceptsEncodings(args: string | string[]): string | false;
        acceptsEncodings(...args: string[]): string | false;
    }

    export interface ContextDelegatedResponse {
        /**
         * Response finished
         */
        finished: boolean;

        /**
         * Get/Set response status code.
         */
        status: number;

        /**
         * Get response status message
         */
        message: string;

        /**
         * Get/Set response body.
         */
        body: any;

        /**
         * Return parsed response Content-Length when present.
         * Set Content-Length field to `n`.
         */
        length: number;

        /**
         * Check if a header has been written to the socket.
         */
        headerSent: boolean;

        /**
         * Vary on `field`.
         */
        vary(field: string): void;

        /**
         * Perform a 302 redirect to `url`.
         *
         * The string "back" is special-cased
         * to provide Referrer support, when Referrer
         * is not present `alt` or "/" is used.
         *
         * Examples:
         *
         *    this.redirect('back');
         *    this.redirect('back', '/index.html');
         *    this.redirect('/login');
         *    this.redirect('http://google.com');
         */
        redirect(url: string, alt?: string): void;

        /**
         * Set Content-Disposition header to "attachment" with optional `filename`.
         */
        attachment(filename: string): void;

        /**
         * Return the response mime type void of
         * parameters such as "charset".
         *
         * Set Content-Type response header with `type` through `mime.lookup()`
         * when it does not contain a charset.
         *
         * Examples:
         *
         *     this.type = '.html';
         *     this.type = 'html';
         *     this.type = 'json';
         *     this.type = 'application/json';
         *     this.type = 'png';
         */
        type: string;

        /**
         * Get the Last-Modified date in Date form, if it exists.
         * Set the Last-Modified date using a string or a Date.
         *
         *     this.response.lastModified = new Date();
         *     this.response.lastModified = '2013-09-13';
         */
        lastModified: Date;

        /**
         * Get/Set the ETag of a response.
         * This will normalize the quotes if necessary.
         *
         *     this.response.etag = 'md5hashsum';
         *     this.response.etag = '"md5hashsum"';
         *     this.response.etag = 'W/"123456789"';
         *
         * @param {String} etag
         * @api public
         */
        etag: string;

        /**
         * Set header `field` to `val`, or pass
         * an object of header fields.
         *
         * Examples:
         *
         *    this.set('Foo', ['bar', 'baz']);
         *    this.set('Accept', 'application/json');
         *    this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
         */
        set(field: { [key: string]: string }): void;
        set(field: string, val: string | string[]): void;

        /**
         * Append additional header `field` with value `val`.
         *
         * Examples:
         *
         * ```
         * this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
         * this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
         * this.append('Warning', '199 Miscellaneous warning');
         * ```
         */
        append(field: string, val: string | string[]): void;

        /**
         * Remove header `field`.
         */
        remove(field: string): void;

        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         */
        writable: boolean;

        /**
         * Flush any set headers, and begin the body
         */
        flushHeaders(): void;
    }

    export type Env = 'development' | 'production'

    export interface Hook {
        (ctx?: Context): Promise<any>;
    }
}