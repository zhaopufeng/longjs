/**
 * @class Server
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Server
 */
import CoreClass, { Core } from '@longjs/core';
import * as https from 'https'
import * as Knex from 'knex';
import * as pathToRegexp from 'path-to-regexp'

export class Server {
    // core application
    public core: CoreClass;
    // https/http listen state
    public listend: boolean;
    // controllers
    public controllers: Server.Controller[];

    constructor(public options: Server.Options) {
        if (!Array.isArray(options.controllers)) return;
        this.controllers = options.controllers
        const _that = this;
        this.core = new CoreClass({
            configs: options.configs,
            async beforeRequest(ctx: Server.Context) {
                ctx.routes = []

                // Handler routes
                _that.controllers.forEach((Controller: Server.Controller) => {
                    Controller.$options.match(ctx)
                });

                // New Controller
                for (let item of ctx.controllers) {
                    // Register services
                    const { injectServices, injectPropertys  } = item.target.$options
                    const services = injectServices(ctx)
                    injectPropertys(ctx)
                    item.controller = new item.target(...services)
                }
            },
            async requested() {
                // console.log(`Requested`)
            },
            async beforeResponse(ctx: Server.Context) {
                for (let item of ctx.controllers) {
                    for (let handler of item.handlers) {
                        const { injectParameters  } = item.target.$options
                        const parameters =  injectParameters(ctx, handler.propertyKey)
                        let data = await item.controller[handler.propertyKey](...parameters)
                        if (data) {
                            ctx.body = data
                        }
                    }
                }
            },
            async responsed(ctx: Server.Context) {
                // console.log(`Responsed`)
            }
        })

        // Assert is port
        if (options.port) {
            this.listen(options.port)
        }

        // Assert is env
        if (options.env) {
            this.env = options.env
        }

        // Assert is keys
        if (options.keys) {
            this.keys = options.keys
        }

        // Assert is proxy
        if (options.proxy) {
            this.proxy = options.proxy
        }
    }

    // Get core env
    public get env() {
        return this.core.env
    }

    // Set core env
    public set env(env: Core.Env) {
        this.core.env = env
    }

    // Set core subdomainOffset
    public set subdomainOffset(offset: number) {
        this.core.subdomainOffset = offset
    }
    // Get core subdomainOffset
    public get subdomainOffset() {
        return this.core.subdomainOffset;
    }

    // Get core proxy state
    public get proxy() {
        return this.core.proxy
    }

    // Set core proxy state
    public set proxy(proxy: boolean) {
        this.core.proxy = proxy
    }

    // Get core keys
    public get keys() {
        return this.core.keys
    }

    // Set core keys
    public set keys(keys: string | string[]) {
        this.core.keys = keys
    }

    /**
     * http/https listen port
     * @param { Number } port
     */
    public listen(port: number) {
        if (this.listend) return;
        // listen https
        if (this.options.https) {
            https
                .createServer(this.options.https, this.core.callback())
                .listen(port || 3000)
            this.listend = true;
        } else { // http
            this.core.listen(port || 3000)
            this.listend = true;
        }
    }
}

export namespace Server {
    export interface Options {
        https?: https.ServerOptions;
        port?: number;
        proxy?: boolean;
        keys?: string | string[];
        env?: Core.Env;
        controllers?: Controller[];
        configs?: Configs;
    }

    export interface Configs extends Core.Configs {
        staticOptions: any;
    }

    export type ClassDecorator = <C>(target: C) => C | void;

    export type Decorator = ClassDecorator | ParameterDecorator | MethodDecorator | PropertyDecorator;

    export type RequestMethodTypes = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT';

    export type PropertyDecoratorTypes = 'query' | 'body' | 'session' | 'files' | 'params' | 'header' | 'headers' | 'request' | 'response';

    export type Database = Knex

    export interface ControllerOptionsParameter {
        [key: string]: Parameters[];
    }

    export interface Parameters {
        type?: PropertyDecoratorTypes;
        parameterIndex?: number;
        args?: string | string[] | object;
    }

    export interface ControllerHandler {
        [key: string]: {
            propertyKey?: string;
            type?: RequestMethodTypes[];
            regexp?: RegExp;
            keys?: pathToRegexp.Key[];
        };
    }

    export interface ControllerOptionsDatabase {
        [key: string]: string | null;
    }

    export interface ControllerOptions {
        propertys?: { [key: string]: PropertyDecoratorTypes };
        parameters?: ControllerOptionsParameter;
        databases?: ControllerOptionsDatabase;
        handlers?: ControllerHandler;
        injectServices?: (ctx: Context) => any [];
        injectPropertys?: (ctx: Context) => void;
        injectDatabases?: (config: Server.ServerDatabaseOptions) => void;
        injectParameters?: (ctx: Context, propertyKey: string) => any;
        baseRoute?: string;
        services?: Array<{ new (...args: any[]): any }>;
        target?: Controller;
        match?: (ctx: Core.Context) => any;
    }

    export interface ServerDatabaseOptions extends Knex.Config {
        [key: string]: any;
    }

    export interface Controller {
        index?(): Promise<any>;
        $options?: ControllerOptions;
        prototype?: {
            $options?: ControllerOptions;
            [key: string]: any;
        }
        [key: string]: any;
    }

    export interface ControllerClass extends Controller {
        new (...args: any[]): Controller;
    }

    export interface Context extends Core.Context {
        controllers?: ControllerRoute[]
    }

    export interface ControllerRoute {
        target?: ControllerClass;
        controller?: Controller;
        handlers?: any;
    }
}