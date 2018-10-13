/**
 * @class Server
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-21 0:07
 * @export Server
 */

import * as EventEmitter from 'events'
import { ListenOptions } from 'net'
import { IncomingMessage, ServerResponse, createServer } from 'http'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import { CreateContext } from './lib/CreateContext'
import { CreateResponse } from './lib/CreateResponse'
import { CreateRequest } from './lib/CreateRequest'
import { BodyParser } from './lib/BodyParser'
import { Core } from './interface'
import * as statuses from 'statuses'
import { Session } from './lib/Session';
import * as Keygrip from 'keygrip';

export * from './interface'
export * from './lib/SessionStore'

export default class Server extends EventEmitter {
    public proxy: boolean = false;
    public subdomainOffset: number = 2;
    public env: Core.Env = process.env.NODE_ENV as Core.Env || 'development';
    public silent: boolean;
    public keys: Keygrip | string[] = ['long:sess']
    public configs: Core.Configs = {};
    public session: Session;

    /**
     * constructor
     */
    constructor(public options: Core.Options = {}) {
        super()
        options.configs = options.configs || {}
        this.session = new Session(options.configs.session)
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

    /**
     * start
     * Application start method
     */
    private async start(request: IncomingMessage | Http2ServerRequest, response: ServerResponse | Http2ServerResponse): Promise<any>  {
        try {
            // Create http/https context
            const context = this.createContext(request, response)
            // Handler session
            await this.session.run(context)

            // Get hooks
            const { beforeRequest, requested, beforeResponse, responsed } = this.options;

            // Handler hook beforeRequest
            if (typeof beforeRequest === 'function') {
                await beforeRequest(context)
                const bodyParser = new BodyParser(context, this.configs.bodyParser)
                await bodyParser.parse()
            }

            // Handler hook requested
            if (typeof requested === 'function') {
                await requested(context)
            }

            // Handler hook beforeResponse
            if (typeof beforeResponse === 'function') {
                await beforeResponse(context)
                await this.session.refresh(context)
            }

            // Handler hook responsed
            if (typeof responsed === 'function') {
                await responsed(context)
            }

            // Handler not found
            if (!context.finished) {
                context.throw(404)
            }
        } catch (error) {
           this.exception(response, error)
        }
    }

    /**
     * exception
     * Exception handler method
     */
    private async exception(response: ServerResponse | Http2ServerResponse, error: Error) {
        let status: number;

        // If not number
        if (isNaN(error.message as any)) {
            status = statuses[error.message]
        } else {
            status = ~~error.message
        }

        if ('development' === this.env && !status) console.log(error)

        if (!response.finished) {
            response.statusCode = status || 500;
            (response as ServerResponse).end(statuses[status || 500]);
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