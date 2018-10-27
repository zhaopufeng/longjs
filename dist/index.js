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
const CreateBody_1 = require("./lib/CreateBody");
const CreateSession_1 = require("./lib/CreateSession");
const stream_1 = require("stream");
const utils_1 = require("./lib/utils");
__export(require("./lib/SessionStore"));
class Server extends EventEmitter {
    /**
     * constructor
     */
    constructor(options = {}) {
        super();
        this.options = options;
        this.proxy = false;
        this.subdomainOffset = 2;
        this.env = process.env.NODE_ENV || 'development';
        this.keys = ['long:sess'];
        this.configs = {};
        this.configs = options.configs = options.configs || {};
    }
    /**
     * callback
     * Handler custom http proccess
     */
    callback() {
        let session;
        this.configs.session ? session = new CreateSession_1.CreateSession(this.configs.session) : session = new CreateSession_1.CreateSession();
        return (request, response) => {
            this.start(request, response, session);
        };
    }
    listen(...args) {
        http_1.createServer(this.callback())
            .listen(...args);
        return this;
    }
    beforeRequest(callback) {
        this._beforeRequest = callback;
    }
    response(callback) {
        this._response = callback;
    }
    /**
     * start
     * Application start method
     */
    async start(request, response, session) {
        try {
            // Create http/https context
            const context = this.createContext(request, response);
            // Load session
            await session.create(context);
            const { _beforeRequest, _response } = this;
            // Handler hook beforeRequest
            if (typeof _beforeRequest === 'function')
                await _beforeRequest(context);
            // Lood request body
            const createBody = new CreateBody_1.CreateBody(context, this.configs.bodyParser);
            // Create body
            await createBody.create();
            // Handler hook response
            if (typeof _response === 'function')
                await _response(context);
            // Reset session
            await session.reset(context);
            // Responses
            await this.respond(context, response);
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
