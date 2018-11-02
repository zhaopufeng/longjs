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
import * as accepts from 'accepts'
import * as pathToRegExp from 'path-to-regexp'
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
import { Plugins } from './lib/Plugin'
import { Controller, ControllerConstructor } from './lib/Decorators'
import { randomBytes } from 'crypto'

export default class Server extends EventEmitter {
    public proxy: boolean;
    public subdomainOffset: number = 2
    public env: Core.Env = process.env.NODE_ENV as Core.Env || 'development'
    public silent: boolean
    public keys: Keygrip | string[];

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
         // Map controllers
        if (Array.isArray(options.controllers)) {
            const controllers  = options.controllers
            controllers.forEach((Controller: Controller) => {
                Controller.prototype.$app = this;
                if (typeof Controller.prototype.$options !== 'object' || !Controller.prototype.$options) Controller.prototype.$options = {}
                const { routes = {}, route = ''} = Controller.prototype.$options
                if (routes) {
                    Object.keys(routes).forEach((key: string) => {
                        if (Array.isArray(routes[key])) {
                            routes[key].forEach((iRoute) => {
                                iRoute.keys = []
                                iRoute.routePath = (route + iRoute.routePath).replace(/[\/]{2,}/g, '/')
                                iRoute.RegExp = pathToRegExp(iRoute.routePath, iRoute.keys, {
                                    strict: options.routeStrict
                                })
                            })
                        }
                    })
                }
            })
        }

        const { plugins = [] } = this.options
            // Plugin register uid
            plugins.forEach((plugin, i) => {
            const uid = randomBytes(24).toString('hex')
            if (typeof plugin.init === 'function') plugin.init(this.options)
            ; (plugin as any).uid = uid
            options.pluginConfigs[uid] = {}
        })

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

    private async handleResponse(context: Core.Context) {
        if (!context.finished ) {
            const { controllers = [] } = this.options
            const { path, method } = context

            // Map controllers
            for (let Controller of controllers) {
                const $options = (Controller as ControllerConstructor).prototype.$options || {}
                const { routes = {}, parameters = {}, propertys = {}, methods = {} } = $options
                const matchRoutes = routes[method]
                // Check matchRoutes is Array
                if (Array.isArray(matchRoutes)) {
                    // Merge routes
                    if (Array.isArray(routes['ALL'])) matchRoutes.push(...routes['ALL'])
                    const matches = matchRoutes.filter((matchRoute) => {
                        return matchRoute.RegExp.test(path)
                    })

                    // matches routes
                    if (matches.length > 0) {
                        // Inject propertys
                        if (propertys) {
                            Object.keys(propertys).forEach((key: string) => {
                                const property = propertys[key]
                                const { handler, arg } = property
                                ; (Controller as any).prototype[key] = handler(context, arg)
                            })
                        }

                        if (methods) {
                            Object.keys(methods).forEach((key: string) => {
                                const method = methods[key]
                                method.handler(context, method.options)
                            })
                        }
                        // Map metadata
                        let { metadatas } = Controller.prototype.$options
                        if (Array.isArray(metadatas)) {
                            metadatas = metadatas.map((K) => {
                                return new K(context, this.options.configs)
                            })
                        }
                        // new Controller
                        const instance = new (Controller as ControllerConstructor)(...metadatas)
                        // Map mathces route
                        for (let matchRoute of matches) {
                            if (!context.finished && !context.headerSent) {
                                const { keys, RegExp, propertyKey } = matchRoute
                                // Match path params
                                keys.forEach((item, index) => {
                                    const { name } = item
                                    const params = RegExp.exec(path)
                                    context.params[name] = params[index + 1]
                                })

                                // Inject parameters
                                let injectParameters: any = []
                                if (parameters) {
                                    const parameter = parameters[propertyKey]
                                    if (parameter) {
                                        injectParameters = parameters[propertyKey].map((parameter) => {
                                            if (parameter.arg) {
                                                return parameter.handler(context, parameter.arg)
                                            }
                                            return parameter.handler(context)
                                        })
                                    }
                                }

                                // Run response handler
                                const data = await instance[propertyKey](...injectParameters)
                                if (data && context.writable) {
                                    context.body = data
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public getPluginID(pluginConstructor: { new (...args: any[]): any}) {
        const { plugins = [] } = this.options
        let uid: string;
        plugins.forEach((plugin) => {
            if (plugin instanceof pluginConstructor) {
                uid = plugin.uid
                return true;
            }
        })
        return uid;
    }

    /**
     * start
     * Application start method
     */
    private async start(request: IncomingMessage | Http2ServerRequest, response: ServerResponse | Http2ServerResponse): Promise<any>  {
        try {
            // Create http/https context
            const context = this.createContext(request, response)

            // Run plugin request
            const { plugins = [] } = this.options
            for (let plugin of plugins) {
                const configs = this.options.pluginConfigs[plugin.uid]
                if (typeof plugin.handlerRequest === 'function')  await plugin.handlerRequest(context, configs)
            }

            // Run plugin requested
            for (let plugin of plugins) {
                const configs = this.options.pluginConfigs[plugin.uid]
                if (typeof plugin.handlerRequested === 'function')  await plugin.handlerRequested(context, configs)
            }

            // Run plugin response
            for (let plugin of plugins) {
                const configs = this.options.pluginConfigs[plugin.uid]
                if (typeof plugin.handlerResponse === 'function')  await plugin.handlerResponse(context, configs)
            }

            // Responses
            await this.handleResponse(context)

            // Before controllors response run handlerResponseAfter plugin hooks
            for (let plugin of plugins) {
                const configs = this.options.pluginConfigs[plugin.uid]
                if (typeof plugin.handlerResponseAfter === 'function')  await plugin.handlerResponseAfter(context, configs)
            }

            // Core run respond
            await this.respond(context, response as ServerResponse)

            // Run plugin responded
            for (let plugin of plugins) {
                const configs = this.options.pluginConfigs[plugin.uid]
                if (typeof plugin.handlerResponded === 'function')  await plugin.handlerResponded(context, configs)
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
            this.exception(response, error)
            this.emit('exception', error)
            const { plugins = [] } = this.options
            for (let plugin of plugins) {
                const configs = this.options.pluginConfigs[plugin.uid]
                if (typeof plugin.handlerException === 'function')  await plugin.handlerException(error, request as IncomingMessage, response as ServerResponse, configs)
            }
        }
    }

    /**
     * respond
     * Application respond
     */
    private async respond(context: Core.Context, response: ServerResponse): Promise<any> {
        // Check context writable
        if (!context.writable) return;

        // Get response body
        let body = context.response.body;

        // check response statusCode
        const code = context.status;

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
    private exception(response: ServerResponse | Http2ServerResponse, error: Error) {
        let status: number;

        // If not number
        if (isNaN(error.message as any)) {
            status = statuses[error.message]
        } else {
            status = ~~error.message
        }

        if ('development' === this.env && !status) console.log(error)

        if (!response.finished) {
            status = status || 500

            const data = statuses[status]
            response.setHeader('Content-Length', Buffer.byteLength(data))
            response.statusCode = status
            ; (response as ServerResponse).end(data);
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

export * from './lib/Decorators'
export * from './lib/Plugin'

export namespace Core {

    export interface HttpHandler {
        (ctx?: Context): Promise<any>
    }

    export interface Configs {
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
        controllers?: Array<{ new (...args: any[]): any }>;
        routeStrict?: boolean;
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