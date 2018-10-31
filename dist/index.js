"use strict";
/**
 * @class Server
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-21 0:07
 * @export Server
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const statuses = require("statuses");
const pathToRegExp = require("path-to-regexp");
const http_1 = require("http");
const CreateContext_1 = require("./lib/CreateContext");
const CreateResponse_1 = require("./lib/CreateResponse");
const CreateRequest_1 = require("./lib/CreateRequest");
const stream_1 = require("stream");
const utils_1 = require("./lib/utils");
class Server extends EventEmitter {
    /**
     * constructor
     */
    constructor(options = {}) {
        super();
        this.options = options;
        this.subdomainOffset = 2;
        this.env = process.env.NODE_ENV || 'development';
        options.configs = options.configs || {};
        this.keys = options.keys || ['long:sess'];
        this.subdomainOffset = options.subdomainOffset || 2;
        this.env = process.env.NODE_ENV || 'development';
        // Map controllers
        if (Array.isArray(options.controllers)) {
            const controllers = options.controllers;
            controllers.forEach((Controller) => {
                if (typeof Controller.prototype.$options !== 'object' || Controller.prototype.$options)
                    Controller.prototype.$options = {};
                const { routes = {}, route = '' } = Controller.prototype.$options;
                if (routes) {
                    Object.keys(routes).forEach((key) => {
                        if (Array.isArray(routes[key])) {
                            routes[key].forEach((iRoute) => {
                                iRoute.keys = [];
                                iRoute.routePath = (route + iRoute.routePath).replace(/[\/]{2,}/g, '/');
                                iRoute.RegExp = pathToRegExp(iRoute.routePath, iRoute.keys, {
                                    strict: options.routeStrict
                                });
                            });
                        }
                    });
                }
            });
        }
        // Start server listen port
        if (options.port) {
            if (options.host) {
                this.listen(options.port, options.host);
            }
            else {
                this.listen(options.port);
            }
        }
    }
    /**
     * callback
     * Handler custom http proccess
     */
    callback() {
        return (request, response) => {
            this.start(request, response);
        };
    }
    listen(...args) {
        http_1.createServer(this.callback())
            .listen(...args);
        return this;
    }
    async handleResponse(context) {
        if (!context.finished) {
            const { controllers = [] } = this.options;
            const { path, method } = context;
            // Map controllers
            for (let Controller of controllers) {
                const $options = Controller.prototype.$options || {};
                const { routes = {}, parameters = {}, propertys = {}, methods = {} } = $options;
                const matchRoutes = routes[method];
                // Check matchRoutes is Array
                if (Array.isArray(matchRoutes)) {
                    // Merge routes
                    if (Array.isArray(routes['ALL']))
                        matchRoutes.push(...routes['ALL']);
                    const matches = matchRoutes.filter((matchRoute) => {
                        return matchRoute.RegExp.test(path);
                    });
                    // matches routes
                    if (matches.length > 0) {
                        // Inject propertys
                        if (propertys) {
                            Object.keys(propertys).forEach((key) => {
                                const property = propertys[key];
                                const { handler, arg } = property;
                                Controller.prototype[key] = handler(context, arg, this.options.configs);
                            });
                        }
                        if (methods) {
                            Object.keys(methods).forEach((key) => {
                                const method = methods[key];
                                method.handler(context, method.options, this.options.configs);
                            });
                        }
                        // Map metadata
                        let { metadatas } = Controller.prototype.$options;
                        if (Array.isArray(metadatas)) {
                            metadatas = metadatas.map((K) => {
                                return new K(context, this.options.configs);
                            });
                        }
                        // new Controller
                        const instance = new Controller(...metadatas);
                        // Map mathces route
                        for (let matchRoute of matches) {
                            if (!context.finished && !context.headerSent) {
                                const { keys, RegExp, propertyKey } = matchRoute;
                                // Match path params
                                keys.forEach((item, index) => {
                                    const { name } = item;
                                    const params = RegExp.exec(path);
                                    context.params[name] = params[index + 1];
                                });
                                // Inject parameters
                                let injectParameters = [];
                                if (parameters) {
                                    const parameter = parameters[propertyKey];
                                    if (parameter) {
                                        injectParameters = parameters[propertyKey].map((parameter) => {
                                            if (parameter.arg) {
                                                return parameter.handler(context, parameter.arg, this.options.configs);
                                            }
                                            return parameter.handler(context, null, this.options.configs);
                                        });
                                    }
                                }
                                // Run response handler
                                const data = await instance[propertyKey](...injectParameters);
                                if (data && context.writable) {
                                    context.body = data;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * start
     * Application start method
     */
    async start(request, response) {
        try {
            // Create http/https context
            const context = this.createContext(request, response);
            // Run plugin request
            const { plugins = [] } = this.options;
            for (let plugin of plugins) {
                if (typeof plugin.handlerRequest === 'function')
                    await plugin.handlerRequest(context);
            }
            // Run plugin requested
            for (let plugin of plugins) {
                if (typeof plugin.handlerRequested === 'function')
                    await plugin.handlerRequested(context);
            }
            // Run plugin response
            for (let plugin of plugins) {
                if (typeof plugin.handlerResponse === 'function')
                    await plugin.handlerResponse(context);
            }
            // Responses
            await this.handleResponse(context);
            await this.respond(context, response);
            // Run plugin responded
            for (let plugin of plugins) {
                if (typeof plugin.handlerResponded === 'function')
                    await plugin.handlerResponded(context);
            }
            /**
             * Handler not found
             * 1. Response is not finished
             * 2. Response is not headerSent
             * 3. Response is writable
             * 4. response body == null
             */
            if (!context.finished && !context.headerSent && context.writable && context.response.body == null)
                context.throw(404);
        }
        catch (error) {
            // Handler exception
            this.exception(response, error);
            this.emit('exception', error);
            const { plugins = [] } = this.options;
            for (let plugin of plugins) {
                if (typeof plugin.handlerException === 'function')
                    await plugin.handlerException(error, request, response);
            }
        }
    }
    /**
     * respond
     * Application respond
     */
    async respond(context, response) {
        // Check context writable
        if (!context.writable)
            return;
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
            if (!response.headersSent && utils_1.isJSON(body)) {
                context.length = Buffer.byteLength(JSON.stringify(body));
            }
            return response.end();
        }
        // responses
        if (body) {
            if (Buffer.isBuffer(body))
                return response.end(body);
            if (typeof body === 'string')
                return response.end(body);
            if (body instanceof stream_1.Stream)
                return body.pipe(response);
            if (typeof body === 'object') {
                // body: json
                body = JSON.stringify(body);
                if (!response.headersSent) {
                    context.length = Buffer.byteLength(body);
                }
                return response.end(body);
            }
            if ('number' === typeof body) {
                body = body.toString();
                context.type = 'text';
                context.length = Buffer.byteLength(body);
                return response.end(body);
            }
        }
    }
    /**
     * exception
     * Exception handler method
     */
    exception(response, error) {
        let status;
        // If not number
        if (isNaN(error.message)) {
            status = statuses[error.message];
        }
        else {
            status = ~~error.message;
        }
        if ('development' === this.env && !status)
            console.log(error);
        if (!response.finished) {
            status = status || 500;
            const data = statuses[status];
            response.setHeader('Content-Length', Buffer.byteLength(data));
            response.statusCode = status;
            response.end(data);
        }
    }
    /**
     * createContext
     * Server context create method
     */
    createContext(req, res) {
        const request = new CreateRequest_1.CreateRequest(req, res, this);
        const response = new CreateResponse_1.CreateResponse(req, res, this);
        const context = new CreateContext_1.CreateContext(req, res, request, response, this);
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        return context;
    }
}
exports.default = Server;
__export(require("./lib/Decorators"));
