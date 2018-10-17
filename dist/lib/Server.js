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
const https = require("https");
class Server {
    constructor(options) {
        this.options = options;
        if (!Array.isArray(options.controllers))
            return;
        this.controllers = options.controllers;
        options.configs = options.configs || {};
        let { beforeRequest, beforeResponse } = this;
        beforeRequest = beforeRequest.bind(this);
        beforeResponse = beforeResponse.bind(this);
        // Init Core
        this.core = new core_1.default({
            configs: options.configs,
            beforeRequest,
            beforeResponse
        });
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
        return this.core.env;
    }
    // Set core env
    set env(env) {
        this.core.env = env;
    }
    // Set core subdomainOffset
    set subdomainOffset(offset) {
        this.core.subdomainOffset = offset;
    }
    // Get core subdomainOffset
    get subdomainOffset() {
        return this.core.subdomainOffset;
    }
    // Get core proxy state
    get proxy() {
        return this.core.proxy;
    }
    // Set core proxy state
    set proxy(proxy) {
        this.core.proxy = proxy;
    }
    // Get core keys
    get keys() {
        return this.core.keys;
    }
    // Set core keys
    set keys(keys) {
        this.core.keys = keys;
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
                .createServer(this.options.https, this.core.callback())
                .listen(port || 3000);
            this.listend = true;
        }
        else { // http
            this.core.listen(port || 3000);
            this.listend = true;
        }
    }
    async beforeRequest(ctx) {
        ctx.routes = [];
        // Handler routes
        this.controllers.forEach((Controller) => {
            Controller.$options.match(ctx);
        });
        // New Controller
        for (let item of ctx.controllers) {
            // Register services
            const { injectServices, injectPropertys, injectDatabases } = item.target.$options;
            injectDatabases(this.options.configs.database);
            const services = injectServices(ctx, this.options.configs);
            injectPropertys(ctx);
            item.controller = new item.target(...services);
        }
    }
    async beforeResponse(ctx) {
        for (let item of ctx.controllers) {
            for (let handler of item.handlers) {
                const { injectParameters } = item.target.$options;
                const parameters = injectParameters(ctx, handler.propertyKey);
                let data = await item.controller[handler.propertyKey](...parameters);
                if (data) {
                    ctx.status = 200;
                    ctx.body = data;
                }
            }
        }
    }
}
exports.Server = Server;
