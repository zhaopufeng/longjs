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
import * as https from 'https';
import * as Knex from 'knex';
import * as pathToRegexp from 'path-to-regexp';
export declare class Server {
    options: Server.Options;
    core: CoreClass;
    listend: boolean;
    controllers: Server.Controller[];
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
     * Hook beforeRequest
     * @param { Server.Context } ctx
     */
    private beforeRequest;
    /**
     * Hook beforeResponse
     * @param { Server.Context } ctx
     */
    private beforeResponse;
    /**
     * Hook responsed
     * @param { Server.Context } ctx
     */
    private responsed;
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
    }
    interface Configs extends Core.Configs {
        staticServeOpts?: StaticServe.Opts;
        database?: ServerDatabaseOptions;
    }
    type ClassDecorator = <C>(target: C) => C | void;
    type Decorator = ClassDecorator | ParameterDecorator | MethodDecorator | PropertyDecorator;
    type RequestMethodTypes = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT';
    type PropertyDecoratorTypes = 'query' | 'body' | 'session' | 'files' | 'params' | 'header' | 'headers' | 'request' | 'response';
    type Database = Knex;
    interface ControllerOptionsParameter {
        [key: string]: Parameters[];
    }
    interface Parameters {
        type?: PropertyDecoratorTypes;
        parameterIndex?: number;
        args?: string | string[] | object;
    }
    interface ControllerHandler {
        [key: string]: {
            propertyKey?: string;
            type?: RequestMethodTypes[];
            regexp?: RegExp;
            keys?: pathToRegexp.Key[];
        };
    }
    interface ControllerOptionsDatabase {
        [key: string]: string | null;
    }
    interface ControllerOptions {
        propertys?: {
            [key: string]: PropertyDecoratorTypes;
        };
        parameters?: ControllerOptionsParameter;
        databases?: ControllerOptionsDatabase;
        handlers?: ControllerHandler;
        injectServices?: (ctx: Context, configs: Configs) => any[];
        injectPropertys?: (ctx: Context) => void;
        injectDatabases?: (config: Server.ServerDatabaseOptions) => void;
        injectParameters?: (ctx: Context, propertyKey: string) => any;
        baseRoute?: string;
        services?: Array<{
            new (...args: any[]): any;
        }>;
        target?: Controller;
        match?: (ctx: Core.Context) => any;
    }
    interface ServerDatabaseOptions extends Knex.Config {
        [key: string]: any;
    }
    interface Controller {
        index?(): Promise<any>;
        $options?: ControllerOptions;
        prototype?: {
            $options?: ControllerOptions;
            [key: string]: any;
        };
        [key: string]: any;
    }
    interface ControllerClass extends Controller {
        new (...args: any[]): Controller;
    }
    interface Context extends Core.Context {
        controllers?: ControllerRoute[];
    }
    interface ControllerRoute {
        target?: ControllerClass;
        controller?: Controller;
        handlers?: any;
    }
}