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
const http_1 = require("http");
const CreateContext_1 = require("./lib/CreateContext");
const CreateResponse_1 = require("./lib/CreateResponse");
const CreateRequest_1 = require("./lib/CreateRequest");
const BodyParser_1 = require("./lib/BodyParser");
const statuses = require("statuses");
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
        this.configs = {};
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
    /**
     * start
     * Application start method
     */
    async start(request, response) {
        try {
            const context = this.createContext(request, response);
            const { beforeRequest, requested, beforeResponse, responsed } = this.options;
            // Handler hook beforeRequest
            if (typeof beforeRequest === 'function') {
                await beforeRequest(context);
                const bodyParser = new BodyParser_1.BodyParser(context, this.configs.bodyParser);
                await bodyParser.parse();
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
        const context = new CreateContext_1.CreateContext(req, res, request, response);
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        return context;
    }
}
exports.default = Server;
