/**
 * @class Server
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-21 0:07
 * @export Server
 */
/// <reference types="node" />
import * as EventEmitter from 'events';
import { ListenOptions } from 'net';
import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import { Core } from './interface';
export * from './interface';
export default class Server extends EventEmitter {
    options: Core.Options;
    proxy: boolean;
    subdomainOffset: number;
    env: Core.Env;
    silent: boolean;
    keys: string | string[];
    configs: Core.Configs;
    /**
     * constructor
     */
    constructor(options?: Core.Options);
    /**
     * callback
     * Handler custom http proccess
     */
    callback(): (request: IncomingMessage | Http2ServerRequest, response: ServerResponse | Http2ServerResponse) => void;
    /**
     * listen
     * Http listen method
     */
    listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): this;
    listen(port: number, hostname?: string, listeningListener?: () => void): this;
    listen(port: number, backlog?: number, listeningListener?: () => void): this;
    listen(port: number, listeningListener?: () => void): this;
    listen(path: string, backlog?: number, listeningListener?: () => void): this;
    listen(path: string, listeningListener?: () => void): this;
    listen(options: ListenOptions, listeningListener?: () => void): this;
    listen(handle: any, backlog?: number, listeningListener?: () => void): this;
    listen(handle: any, listeningListener?: () => void): this;
    /**
     * start
     * Application start method
     */
    private start;
    /**
     * exception
     * Exception handler method
     */
    private exception;
    /**
     * createContext
     * Server context create method
     */
    protected createContext(req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse): Core.Context;
}
