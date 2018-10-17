/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Decorators
 */

import 'reflect-metadata'
import chalk from 'chalk'
import { Server } from '..';
import * as Knex from 'knex'
import * as pathToRegExp from 'path-to-regexp'

interface Options<T = any> {
    target?: Server.Controller;
    propertyKey?: string | symbol;
    descriptor?: TypedPropertyDescriptor<T>
    parameterIndex?: number;
}

type CreateDecoratorCallback = (options: Server.ControllerOptions, propertyKey?: string| symbol, descriptorOrIndex?: TypedPropertyDescriptor<any> | number) => void

/**
 * 自定义指令方法
 * @param callback 回调函数 返回核心的options选项
 * @param Controller 可选自定义装饰器获取到的 构造函数
 */
export function createDecorator(callback: CreateDecoratorCallback, Controller?: Server.Controller): Server.Decorator {
    function decorator<C extends Server.Controller>(target: C): C | void;
    function decorator<C extends Server.Controller>(target: C, propertyKey: string | symbol): void;
    function decorator<C extends Server.Controller>(target: C, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
    function decorator<C extends Server.Controller>(target: C, propertyKey: string | symbol, parameterIndex: number): void;
    function decorator<C extends Server.Controller>(...args: any[]): any {
        if (args.length === 1) { // 只有一个参数时是类装饰器 否则是其他类型装饰器
            const [ target ] = args;
            const meta = Reflect.getMetadata('design:paramtypes', target) || []
            const options = target.prototype.$options = target.prototype.$options || {}
            if (options.services) {
                options.services = [...options.services, ...meta]
            } else {
                options.services = meta
            }
            target.prototype.$options = {
                propertys: options.propertys || {},
                handlers: options.handlers || {},
                services: options.services,
                parameters: options.parameters || {},
                databases: options.databases || {},
                target: target
            }

            callback(target.prototype.$options)
        } else {
            const [target, propertyKey, descriptor] = args
            const options = target.$options = target.$options || {}
            target.$options = {
                propertys: options.propertys || {},
                handlers: options.handlers || {},
                parameters: options.parameters || {},
                databases: options.databases || {}
            }
            callback(target.$options, propertyKey, descriptor)
        }
    }
    if (!Controller) {
        return decorator
    } else {
        const meta = Reflect.getMetadata('design:paramtypes', Controller)
        if (Controller.prototype) {
            const options = Controller.prototype.$options
            if (options.services) {
                options.services = [...options.services, ...meta]
            } else {
                options.services = meta
            }
            Controller.prototype.$options = options || {}
            Controller.prototype.$options = {
                propertys: options.propertys || {},
                handlers: options.handlers || {},
                services: options.services,
                parameters: options.parameters || {},
                databases: options.databases || {}
            }
            callback(Controller.prototype.$options)
        } else {
            Controller.$options = Controller.$options || {}
            const options = Controller.$options
            Controller.$options = {
                propertys: options.propertys || {},
                handlers: options.handlers || {},
                services: options.services || [],
                parameters: options.parameters || {},
                databases: options.databases || {}
            }
            callback(Controller.$options)
        }
    }
}

/**
 * PropertyDecorator
 * Files
 *
 * Examples
 * ```
 * ```
 */
export function Controller(path: string): Server.ClassDecorator {
    return createDecorator((options: Server.ControllerOptions) => {
        const baseRoute = options.baseRoute = (path + '/').replace(/[\/]{2,}/g, '/')
        options.target.$options = options
        const handlers = options.handlers
        // Check controller default handler
        if (typeof options.target.prototype.index === 'function') {
            if (handlers['/index']) {
                handlers[baseRoute] = JSON.parse(JSON.stringify(handlers['/index']))
            } else {
                // If controller default handler not method decorator, default method is ALL
                handlers[baseRoute] = {
                    propertyKey: 'index',
                    type: ['ALL']
                }
            }
        }
        Object.keys(handlers).forEach((key: string) => {
            if (!/\/$/.test(key)) {
                const path = (baseRoute + key).replace(/[\/]{2,}/g, '/')
                const keys: any = []
                handlers[key].regexp = pathToRegExp(path, keys, {
                    strict: true
                })
                handlers[key].keys = keys;
            } else {
                const keys: any = []
                handlers[key].regexp = pathToRegExp(baseRoute, keys, {
                    strict: true
                })
                handlers[key].keys = keys;
            }
        })

        options.match = (ctx: Server.Context) => {
            ctx.controllers = ctx.controllers || []
            const matched: Server.ControllerHandler[] = []
            Object.keys(handlers).forEach((key: string) => {
                const handler = handlers[key]
                if (handler.regexp.test(ctx.path) && (!~~handler.type.indexOf(ctx.method as Server.RequestMethodTypes) || !~~handler.type.indexOf('ALL'))) {
                    matched.push(handler as Server.ControllerHandler)
                    const data = handler.regexp.exec(ctx.path)
                    handler.keys.forEach((key: pathToRegExp.Key, index: number) => {
                        ctx.params[key.name] = data[index + 1]
                    })
                }
            })
            if (matched.length > 0) {
                ctx.controllers.push({
                    target: options.target as Server.ControllerClass,
                    handlers: matched
                })
            }
        }

        // Inject services
        options.injectServices = function(ctx: Server.Context) {
            return options.services.map((K: any) => {
                return new K(ctx)
            })
        }

        options.injectParameters = function(ctx: Server.Context, propertyKey: string) {
            // Get parameters decorators params.
            const parameters = options.parameters
            // result.
            const params: Array<{[key: string]: any}> = []
            // Check whether there are decorator data on the routing method.
            if (!Array.isArray(parameters[propertyKey])) return [];
            parameters[propertyKey].forEach((k: Server.Parameters) => {
                params[k.parameterIndex] = params[k.parameterIndex] || {}
                if (Array.isArray(k.args)) {
                    k.args.forEach((value) => {
                        const data = (ctx as any)[k.type] || (ctx.request as any)[k.type]
                        if (typeof data === 'object') {
                            params[k.parameterIndex][value] = data[value]
                        }
                    })
                } else if (typeof k.args === 'object') {
                    // mark
                    // const data: object | undefined = (ctx as any)[k.type] || (ctx.request as any)[k.type]
                    // const result: any = {}
                    // for (let key in k.args) {
                    //     if (!data) return;
                    //     const d = (data as any)[key]
                    //     if (!d) return;
                    //     if (d instanceof (k.args as any)[key]) {
                    //         result[key] = (data as any)[key]
                    //     }
                    // }
                    // params[k.parameterIndex] = result
                } else if (typeof k.args === 'string') {
                    params[k.parameterIndex] = (ctx as any)[k.type][k.args] || (ctx.request as any)[k.type][k.args]
                } else {
                    params[k.parameterIndex] = (ctx as any)[k.type] || (ctx.request as any)[k.type]
                }
            })
            return params
        }

        // Inject databases
        options.injectDatabases = function(config: Server.ServerDatabaseOptions) {
            const databases = options.databases
            if (JSON.stringify(databases) !== '{}' && !config) throw new Error(chalk.redBright('Database is not configure!'))
            Object.keys(databases).forEach((key: string) => {
                if (typeof databases[key] === 'string') {
                    options.target.prototype[key] = Knex(config)(databases[key])
                } else {
                    options.target.prototype[key] = Knex(config)
                }
            })
        }

        // Inject propertys
        options.injectPropertys = function(ctx: Server.Context) {
            const propertys = Object.keys(options.propertys)
            propertys.forEach((key: string) => {
                const type =  options.propertys[key]
                if (type === 'session') {
                    options.target.prototype[key] = ctx['session']
                } else {
                    options.target.prototype[key] = (ctx.request as { [key: string]: any })[type]
                }
            })
        }
    }) as Server.ClassDecorator
}

/**
 * createPropertyDecorator
 * @param type
 */
function createPropertyOrParameterDecorator(type: Server.PropertyDecoratorTypes) {
    function decorator(target: Object, propertyKey: string | symbol): void;
    function decorator(target: Object, propertyKey: string | symbol, parameterIndex: number): void;
    function decorator(field: string | string []): ParameterDecorator;
    function decorator(...args: any[]): any {
        function handler(options: Server.ControllerOptions, propertyKey: string | symbol, parameterIndex: number) {
            if (typeof parameterIndex === 'number') { // 参数装饰器
                const key = propertyKey as string
                options.parameters[key] = options.parameters[key] || []
                options.parameters[key].push({
                    parameterIndex,
                    type,
                    args: args.length === 1 ? args[0] : undefined
                })
            } else { // 属性装饰器
                options.propertys[propertyKey as string] =  type
            }
        }
        if (args.length === 1) {
            return createDecorator((options: Server.ControllerOptions, propertyKey: string | symbol, parameterIndex: number) => {
                handler(options, propertyKey, parameterIndex)
            })
        } else {
            const [ target, propertyKey, parameterIndex ] = args;
            createDecorator((options: Server.ControllerOptions) => {
               handler(options, propertyKey, parameterIndex)
            }, target)
        }
    }
    return decorator
}

/**
 * PropertyDecorator
 * Query
 *
 * Examples
 * ```
 * ```
 */
 export const Query = createPropertyOrParameterDecorator('query')

/**
 * PropertyDecorator
 * Param
 *
 * Examples
 * ```
 * ```
 */
 export const Param = createPropertyOrParameterDecorator('params')

/**
 * PropertyDecorator
 * Body
 *
 * Examples
 * ```
 * ```
 */
 export const Body = createPropertyOrParameterDecorator('body')

/**
 * PropertyDecorator
 * Body
 *
 * Examples
 * ```
 * ```
 */
export const Session = createPropertyOrParameterDecorator('session')

/**
 * PropertyDecorator
 * Files
 *
 * Examples
 * ```
 * ```
 */
 export const Files = createPropertyOrParameterDecorator('files')

 export const Header = createPropertyOrParameterDecorator('header')

 export const Headers = createPropertyOrParameterDecorator('headers')

/**
 * createRequestMethodDecorator
 * @param type
 */
function createRequestMethodDecorator(type: Server.RequestMethodTypes) {
    function decorator(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
    function decorator(route: string): MethodDecorator;
    function decorator(...args: any[]): any {
        function handler(options: Server.ControllerOptions, propertyKey: string, descriptor: TypedPropertyDescriptor<any>, path: string) {
            // If the path does not start with '/', before '/'.
            // If route path is not '/'
            if (!/^\//.test(path)) {
                path = '/' + path
            }
            // Check the method is included in the router.
            if (options.handlers[path]) {
                // If method exists, it means that the route contains a request mode.
                if (options.handlers[path].type) {
                    // If it is an array, it means that 2 or more requests are already included.
                    if (Array.isArray(options.handlers[path].type)) {
                        const types  = options.handlers[path].type as Server.RequestMethodTypes[]
                        if (!~types.indexOf(type)) {
                            throw new Error(chalk.redBright(`router path ${path} ${type} is repeat in method ${descriptor.value.name}`))
                        }
                        types.push(type)
                    } else {
                        // If All is not included, add this method type.
                        if (!~options.handlers[path].type.indexOf('ALL')) {
                            options.handlers[path].type = [...options.handlers[path].type, type]
                        }
                    }
                }
            } else {
                options.handlers[path] = {
                    propertyKey,
                    type: [type]
                }
            }
        }
        if (args.length === 1) {
            const [ route ] = args;
            return createDecorator((options, propertyKey, descriptor) => {
                handler(options, propertyKey as string, descriptor as TypedPropertyDescriptor<any>, route || propertyKey)
            })
        } else {
            const [ target, propertyKey, descriptor ] = args;
            createDecorator((options) => {
                handler(options, propertyKey, descriptor, propertyKey )
            }, target)
        }
    }
    return decorator
}

/**
 * RequestMethodDecorators
 * Get
 *
 * Examples
 * ```
 * ```
 */
export const Get = createRequestMethodDecorator('GET')

/**
 * RequestMethodDecorators
 * All
 *
 * Examples
 * ```
 * ```
 */
export const All = createRequestMethodDecorator('ALL')

/**
 * RequestMethodDecorators
 * Delete
 *
 * Examples
 * ```
 * ```
 */
export const Delete = createRequestMethodDecorator('DELETE')

/**
 * RequestMethodDecorators
 * Head
 *
 * Examples
 * ```
 * ```
 */
export const Head = createRequestMethodDecorator('HEAD')

/**
 * RequestMethodDecorators
 * Options
 *
 * Examples
 * ```
 * ```
 */
export const Options = createRequestMethodDecorator('OPTIONS')

/**
 * RequestMethodDecorators
 * Patch
 *
 * Examples
 * ```
 * ```
 */
export const Patch = createRequestMethodDecorator('PATCH')

/**
 * RequestMethodDecorators
 * Post
 *
 * Examples
 * ```
 * ```
 */
export const Post = createRequestMethodDecorator('POST')

/**
 * RequestMethodDecorators
 * Put
 *
 * Examples
 * ```
 * ```
 */
export const Put = createRequestMethodDecorator('PUT')

export const Request = createPropertyOrParameterDecorator('request')

export const Response = createPropertyOrParameterDecorator('response')

/**
 * PropertyDecorator
 *
 * Examples
 * ```
 * ```
 */
export function Database(target: Object, propertyKey: string): void;
export function Database(table: string): PropertyDecorator;
export function Database<C extends Server.Controller>(...args: Array<string | Object | C>): any {
    if (args.length === 1) {
        const table: string = args[0] as string;
        return createDecorator((options: Server.ControllerOptions, propertyKey: string) => {
            options.databases[propertyKey] = table;
        })
    } else {
        const target = args[0] as C
        const propertyKey = args[1] as string
        createDecorator((options: Server.ControllerOptions) => {
            options.databases[propertyKey] = null;
        }, target)
    }
}