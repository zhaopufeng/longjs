/// <reference types="node" />
/**
 * @class Server
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Server
 */
import CoreClass, { Core } from '@longjs/core';
import { StaticServe } from './StaticServe';
import { Controller } from './Decorators';
import * as https from 'https';
import * as Knex from 'knex';
export declare class Server {
    options: Server.Options;
    app: CoreClass;
    listend: boolean;
    controllers: Controller[];
    staticServe: StaticServe;
    constructor(options: Server.Options);
    env: Core.Env;
    subdomainOffset: number;
    proxy: boolean;
    keys: string[];
    /**
     * http/https listen port
     * @param { Number } port
     */
    listen(port: number): void;
    /**
     * handleResponse
     * @param { Server.Context } ctx
     */
    private handleResponse;
}
export declare namespace Server {
    interface Options {
        https?: https.ServerOptions;
        port?: number;
        proxy?: boolean;
        keys?: string[];
        env?: Core.Env;
        controllers?: Controller[];
        configs?: Configs;
        routeStrict?: boolean;
    }
    interface Configs extends Core.Configs {
        staticServeOpts?: StaticServe.Opts;
        database?: ServerDatabaseOptions;
    }
    type RequestMethodTypes = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT';
    type PropertyDecoratorTypes = 'query' | 'body' | 'session' | 'files' | 'params' | 'header' | 'headers' | 'request' | 'response';
    type Database = Knex;
    interface ServerDatabaseOptions extends Knex.Config {
        [key: string]: any;
    }
    interface ControllerClass extends Controller {
        new (...args: any[]): Controller;
    }
    interface Context extends Core.Context {
        [key: string]: any;
    }
}
