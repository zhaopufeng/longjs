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
const typeIs = require("type-is");
const parse = require("co-body");
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
        this._plugins = [];
        options.configs = options.configs || {};
        options.pluginConfigs = options.pluginConfigs || {};
        this.keys = options.keys || ['long:sess'];
        this.subdomainOffset = options.subdomainOffset || 2;
        this.env = process.env.NODE_ENV || 'development';
        const { plugins = [] } = this.options;
        this.use(...plugins);
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
    use(...plugins) {
        const { _plugins = [] } = this;
        const { requests = [], responses = [], respondeds = [], closes = [], exceptions = [] } = _plugins;
        plugins.forEach((plugin, i) => {
            const uid = crypto_1.randomBytes(24).toString('hex');
            const pluginConfig = {};
            if (typeof plugin.init === 'function')
                plugin.init(this.options);
            plugin['uid'] = uid;
            if (typeof plugin.request === 'function')
                requests.push(plugin);
            if (typeof plugin.response === 'function')
                responses.push(plugin);
            if (typeof plugin.responded === 'function')
                respondeds.push(plugin);
            if (typeof plugin.close === 'function')
                closes.push(plugin);
            if (typeof plugin.exception === 'function')
                exceptions.push(plugin);
            this.options.pluginConfigs[uid] = pluginConfig;
        });
        _plugins.requests = requests;
        _plugins.responses = responses;
        _plugins.respondeds = respondeds;
        _plugins.closes = closes;
        _plugins.exceptions = exceptions;
        this._plugins = _plugins;
        return this;
    }
    listen(...args) {
        http_1.createServer(this.callback())
            .listen(...args);
        return this;
    }
    getPluginId(pluginConstructor) {
        const plugin = this.options.plugins.filter((plugin) => plugin instanceof pluginConstructor);
        if (plugin.length > 0) {
            return plugin[0].uid;
        }
    }
    /**
     * start
     * Application start method
     */
    async start(request, response) {
        // Create http/https context
        const context = this.createContext(request, response);
        const { configs = {} } = this.options;
        if (!/(GET|DELETE|HEAD|COPY|PURGE|UNLOCK)/.test(context.method)) {
            // Parse body
            const { body = {}, strict = true } = configs;
            const { limit = {} } = body;
            const request = context.req;
            if (typeIs(request, 'json') === 'json') {
                context.request.body = await parse.json(request, { limit: limit.json, strict });
            }
            else if (typeIs(request, 'urlencoded') === 'urlencoded') {
                context.request.body = await parse.form(request, { limit: limit.form, strict });
            }
            else if (typeIs(request, 'text') === 'text') {
                context.request.body = await parse.text(request, { limit: limit.text, strict });
            }
        }
        const data = {};
        const { pluginConfigs } = this.options;
        try {
            const { _plugins = [] } = this;
            const { requests = [], responses = [], closes = [], respondeds = [] } = _plugins;
            // Run plugin request
            for (let plugin of requests) {
                await plugin.request(context, pluginConfigs[plugin.uid], data);
            }
            // Run plugin response
            for (let plugin of responses) {
                await plugin.response(context, pluginConfigs[plugin.uid], data);
            }
            // Run plugin responded
            for (let plugin of respondeds) {
                await plugin.responded(context, pluginConfigs[plugin.uid], data);
            }
            // Core run respond
            await this.respond(context);
            // respond
            for (let plugin of closes) {
                await plugin.close(context, pluginConfigs[plugin.uid], data);
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
            const { exceptions = [] } = this._plugins;
            for (let plugin of exceptions) {
                await plugin.exception(error, context, pluginConfigs[plugin.uid], data);
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
            const reg = /[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
            if (error.message && !reg.test(error.message)) {
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
