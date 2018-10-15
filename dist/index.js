"use strict";
/**
 * @class Server
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-21 0:07
 * @export Server
 */
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const statuses = require("statuses");
const http_1 = require("http");
const CreateContext_1 = require("./lib/CreateContext");
const CreateResponse_1 = require("./lib/CreateResponse");
const CreateRequest_1 = require("./lib/CreateRequest");
const CreateBody_1 = require("./lib/CreateBody");
const CreateSession_1 = require("./lib/CreateSession");
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
        if (this.configs.session) {
            session = new CreateSession_1.CreateSession(this.configs.session);
        }
        else {
            session = new CreateSession_1.CreateSession();
        }
        return (request, response) => {
            this.start(request, response, session);
        };
    }
    listen(...args) {
        http_1.createServer(this.callback())
            .listen(...args);
        return this;
    }
    /**
     * start
     * Application start method
     */
    async start(request, response, session) {
        try {
            // Create http/https context
            const context = this.createContext(request, response);
            // Get hooks
            const { beforeRequest, requested, beforeResponse, responsed } = this.options;
            // Handler hook beforeRequest
            if (typeof beforeRequest === 'function') {
                await session.create(context);
                await beforeRequest(context);
                const body = new CreateBody_1.CreateBody(context, this.configs.bodyParser);
                await body.create();
            }
            // Handler hook requested
            if (typeof requested === 'function') {
                await requested(context);
            }
            // Handler hook beforeResponse
            if (typeof beforeResponse === 'function') {
                await beforeResponse(context);
            }
            // Handler hook responsed
            if (typeof responsed === 'function') {
                await responsed(context);
                await session.reload(context);
            }
            // Handler not found
            if (!context.finished) {
                context.throw(404);
            }
        }
        catch (error) {
            this.exception(response, error);
        }
    }
    /**
     * exception
     * Exception handler method
     */
    async exception(response, error) {
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
            response.statusCode = status || 500;
            response.end(statuses[status || 500]);
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
