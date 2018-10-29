"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Server
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Server
 */
const core_1 = require("@longjs/core");
const StaticServe_1 = require("./StaticServe");
const https = require("https");
const pathToRegExp = require("path-to-regexp");
class Server {
    constructor(options) {
        this.options = options;
        // Map controllers
        if (Array.isArray(options.controllers)) {
            const controllers = this.controllers = options.controllers;
            controllers.forEach((Controller) => {
                const { routes, route } = Controller.prototype.$options;
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
        const configs = options.configs = options.configs || {};
        // Create static serve
        if (configs.staticServeOpts)
            this.staticServe = new StaticServe_1.StaticServe(configs.staticServeOpts);
        let { handleResponse } = this;
        // Init Core
        this.app = new core_1.default({ configs: options.configs });
        const { app } = this;
        app.handleResponse(handleResponse.bind(this));
        // Assert is port
        if (options.port) {
            this.listen(options.port);
        }
        // Assert is env
        if (options.env) {
            this.env = options.env;
        }
        // Assert is keys
        if (options.keys) {
            this.keys = options.keys;
        }
        // Assert is proxy
        if (options.proxy) {
            this.proxy = options.proxy;
        }
    }
    // Get core env
    get env() {
        return this.app.env;
    }
    // Set core env
    set env(env) {
        this.app.env = env;
    }
    // Set core subdomainOffset
    set subdomainOffset(offset) {
        this.app.subdomainOffset = offset;
    }
    // Get core subdomainOffset
    get subdomainOffset() {
        return this.app.subdomainOffset;
    }
    // Get core proxy state
    get proxy() {
        return this.app.proxy;
    }
    // Set core proxy state
    set proxy(proxy) {
        this.app.proxy = proxy;
    }
    // Get core keys
    get keys() {
        return this.app.keys;
    }
    // Set core keys
    set keys(keys) {
        this.app.keys = keys;
    }
    /**
     * http/https listen port
     * @param { Number } port
     */
    listen(port) {
        if (this.listend)
            return;
        // listen https
        if (this.options.https) {
            https
                .createServer(this.options.https, this.app.callback())
                .listen(port || 3000);
            this.listend = true;
        }
        else { // http
            this.app.listen(port || 3000);
            this.listend = true;
        }
    }
    /**
     * handleResponse
     * @param { Server.Context } ctx
     */
    async handleResponse(ctx) {
        // Static responses
        if (this.staticServe) {
            await this.staticServe.handler(ctx);
        }
        if (!ctx.finished) {
            const { controllers } = this;
            const { path, method } = ctx;
            // Map controllers
            for (let Controller of controllers) {
                const { routes, parameters, propertys, methods } = Controller.prototype.$options;
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
                                Controller.prototype[key] = handler(ctx, arg, this.options.configs);
                            });
                        }
                        if (methods) {
                            Object.keys(methods).forEach((key) => {
                                const method = methods[key];
                                method.handler(ctx, method.options, this.options.configs);
                            });
                        }
                        // Map metadata
                        let { metadatas } = Controller.prototype.$options;
                        if (Array.isArray(metadatas)) {
                            metadatas = metadatas.map((K) => {
                                return new K(ctx, this.options.configs);
                            });
                        }
                        // new Controller
                        const instance = new Controller(...metadatas);
                        // Map mathces route
                        for (let matchRoute of matches) {
                            if (!ctx.finished && !ctx.headerSent) {
                                const { keys, RegExp, propertyKey } = matchRoute;
                                // Match path params
                                keys.forEach((item, index) => {
                                    const { name } = item;
                                    const params = RegExp.exec(path);
                                    ctx.params[name] = params[index + 1];
                                });
                                // Inject parameters
                                let injectParameters = [];
                                if (parameters) {
                                    const parameter = parameters[propertyKey];
                                    if (parameter) {
                                        injectParameters = parameters[propertyKey].map((parameter) => {
                                            if (parameter.arg) {
                                                return parameter.handler(ctx, parameter.arg, this.options.configs);
                                            }
                                            return parameter.handler(ctx, null, this.options.configs);
                                        });
                                    }
                                }
                                // Run response handler
                                const data = await instance[propertyKey](...injectParameters);
                                if (data && ctx.writable) {
                                    ctx.body = data;
                                }
                            }
                        }
                    }
                }
            }
        }
        // Static responses
        if (!ctx.finished) {
            if (this.staticServe) {
                await this.staticServe.deferHandler(ctx);
            }
        }
    }
}
exports.Server = Server;
