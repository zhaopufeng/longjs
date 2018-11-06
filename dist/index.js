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
const http_1 = require("http");
const CreateContext_1 = require("./lib/CreateContext");
const CreateResponse_1 = require("./lib/CreateResponse");
const CreateRequest_1 = require("./lib/CreateRequest");
const stream_1 = require("stream");
const utils_1 = require("./lib/utils");
const crypto_1 = require("crypto");
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
        options.pluginConfigs = options.pluginConfigs || {};
        this.keys = options.keys || ['long:sess'];
        this.subdomainOffset = options.subdomainOffset || 2;
        this.env = process.env.NODE_ENV || 'development';
        const { plugins = [] } = this.options;
        this.options.plugins = plugins;
        // Plugin register uid
        plugins.handlerRequests = [];
        plugins.handlerRequesteds = [];
        plugins.handlerResponses = [];
        plugins.handlerRespondeds = [];
        plugins.handlerResponseAfters = [];
        plugins.handlerExceptions = [];
        plugins.forEach((plugin, i) => {
            const uid = crypto_1.randomBytes(24).toString('hex');
            const pluginConfig = {};
            if (typeof plugin.init === 'function')
                plugin.init(this.options, pluginConfig, this.options.configs);
            plugin.uid = uid;
            // 1. handlerRequest
            if (typeof plugin.handlerRequest === 'function') {
                plugins.handlerRequests.push(plugin);
            }
            // 2. handlerRequested
            if (typeof plugin.handlerRequested === 'function') {
                plugins.handlerRequesteds.push(plugin);
            }
            // 3. handlerResponse
            if (typeof plugin.handlerResponse === 'function') {
                plugins.handlerResponses.push(plugin);
            }
            // 4. handlerRequested
            if (typeof plugin.handlerRequested === 'function') {
                plugins.handlerRespondeds.push(plugin);
            }
            // 5. handlerResponseAfter
            if (typeof plugin.handlerResponseAfter === 'function') {
                plugins.handlerResponseAfters.push(plugin);
            }
            // 6. handlerException
            if (typeof plugin.handlerException === 'function') {
                plugins.handlerExceptions.push(plugin);
            }
            options.pluginConfigs[uid] = pluginConfig;
        });
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
    getPluginID(pluginConstructor) {
        const { plugins = [] } = this.options;
        let uid;
        plugins.forEach((plugin) => {
            if (plugin instanceof pluginConstructor) {
                uid = plugin.uid;
                return true;
            }
        });
        return uid;
    }
    /**
     * start
     * Application start method
     */
    async start(request, response) {
        // Create http/https context
        const context = this.createContext(request, response);
        try {
            const { plugins } = this.options;
            const { handlerRequests, handlerRequesteds, handlerResponses, handlerResponseAfters, handlerRespondeds } = plugins;
            // Run plugin request
            for (let plugin of handlerRequests) {
                await plugin.handlerRequest(context, this.options.pluginConfigs[plugin.uid], this.options.pluginConfigs);
            }
            // Run plugin requested
            for (let plugin of handlerRequesteds) {
                await plugin.handlerRequested(context, this.options.pluginConfigs[plugin.uid], this.options.pluginConfigs);
            }
            // Run plugin response
            for (let plugin of handlerResponses) {
                await plugin.handlerResponse(context, this.options.pluginConfigs[plugin.uid], this.options.pluginConfigs);
            }
            // Before controllors response run handlerResponseAfter plugin hooks
            for (let plugin of handlerResponseAfters) {
                await plugin.handlerResponseAfter(context, this.options.pluginConfigs[plugin.uid], this.options.pluginConfigs);
            }
            // Core run respond
            await this.respond(context);
            // Run plugin responded
            for (let plugin of handlerRespondeds) {
                await plugin.handlerResponded(context, this.options.pluginConfigs[plugin.uid], this.options.pluginConfigs);
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
            this.exception(context, error);
            this.emit('exception', [error, context]);
            const { handlerExceptions } = this.options.plugins;
            for (let plugin of handlerExceptions) {
                await plugin.handlerException(error, context, this.options.pluginConfigs[plugin.uid], this.options.pluginConfigs);
            }
        }
    }
    /**
     * respond
     * Application respond
     */
    async respond(context) {
        // Check context writable
        if (!context.writable)
            return;
        // Get response body
        let body = context.response.body;
        // check response statusCode
        const code = context.status;
        const response = context.res;
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
    exception(context, error) {
        let status;
        // If not number
        if (error.statusCode) {
            status = error.statusCode;
        }
        else if (isNaN(error.message)) {
            status = statuses[error.message];
        }
        if ('development' === this.env && !status)
            console.log(error);
        if (!context.finished) {
            status = status || 500;
            const data = error.data || statuses[status];
            context.status = status;
            if (error.message) {
                if (error.message.length > 0)
                    context.message = error.message;
            }
            context.body = data;
            this.respond(context);
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
__export(require("./lib/HttpException"));
