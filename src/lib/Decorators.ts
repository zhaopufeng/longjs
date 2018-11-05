/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Decorators
 */

import Server, { Core } from '..';
import * as pathToRegExp from 'path-to-regexp'
import { IncomingHttpHeaders } from 'http';

type ClassDecoratorCallback = (options: ControllerOptions) => void;
type RequestMethodType = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT' | 'COPY' | 'LINK' | 'UNLINK' | 'PURGE' | 'LOCK' | 'UNLOCK' | 'PORPFIND' | 'VIEW'
type ParameterDecoratorHttpCallback = (ctx: Core.Context, data?: any) => void;
type PropertyDecoratorHttpCallback = (ctx: Core.Context, data?: any) => void;
type MethodDecoratorHttpCallback = (ctx: Core.Context, data?: any) => void;

interface Parameter {
    callback?: ParameterDecoratorHttpCallback;
    id?: string;
    value?: any;
}

interface Parameters {
    [key: string]: Parameter[];
}

interface Propertys {
    [key: string]: {
        callback?: PropertyDecoratorHttpCallback;
        value?: any;
    }
}

interface Method {
    callback?: MethodDecoratorHttpCallback;
    value?: any;
}

interface Methods {
    [key: string]: Method[]
}

interface Router {
    routePath?: string;
    propertyKey?: string;
    keys?: pathToRegExp.Key[];
    RegExp?: RegExp;
}

export interface ControllerOptions {
    route?: string;
    metadatas?: Array<{ new(...args: any[]): any }>;
    parameters?: Parameters;
    propertys?: Propertys;
    headers?: {
        [key: string]: IncomingHttpHeaders;
    };
    status?: {
        [key: string]: number;
    };
    methods?: Methods;
    responseTypes?: {
        [key: string]: string;
    }
    target?: Controller;
    routes?: {
        [key: string]: Router[]
    }
}

export interface Controller {
    readonly prototype: {
        $app: Server;
        ____$options: ControllerOptions;
    };
    [key: string]: any;
}

export interface ControllerConstructor {
    new (...args: any[]): Controller;
    readonly prototype: {
        ____$options: ControllerOptions;
    };
}

/**
 * createClassDecorator
 * 创建类装饰器方法
 */
export function createClassDecorator(callback: ClassDecoratorCallback): ClassDecorator {
    return <C extends Controller>(target: C): C | void => {
        // Get options
        let options = target.prototype.____$options || {}
        // Check options target is defined
        if (!options.target) options.target = target

        // Run callback
        callback(options)
        // Set controller route
        const { route, metadatas } = options
        if (route) options.route = route
        // Set metadata
        if (metadatas) options.metadatas = metadatas

        // Set options
        target.prototype.____$options = options
    }
}

/**
 * createMethodDecorator
 * 创建方法装饰器
 * @param callback
 */
export type MethodDecoratorInterface<K, V> = MethodDecorator & { (key: K, value?: V): MethodDecorator }
export interface MethodDecoratorCallback<K, V> {
    (options: ControllerOptions, decorator: [Object, string, TypedPropertyDescriptor<any>], key?: K, value?: V, ...args: any[]): ControllerOptions;
}
export function createMethodDecorator<K, V = any, D = MethodDecoratorInterface<K, V>>(callback: MethodDecoratorCallback<K, V>): D {
    function decorator(...args: any[]) {
        if (args.length < 3 && args.length > 0) {
            return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
                const [key, value] = args
                const options: ControllerOptions = target.____$options || {}
                // Reset options
                target.____$options = callback(options, [target, propertyKey, descriptor], key, value)
            }
        } else {
            const [ target, propertyKey, descriptor ] = args
            const options: ControllerOptions = target.____$options || {}

            // Reset options
            target.____$options = callback(options, [target, propertyKey, descriptor])
        }
    }
    return decorator as any
}

/**
 * createPropertyDecorator
 * 创建属性装饰器方法
 * @param callback
 */
export type PropertyDecoratorInterface<K> = PropertyDecorator & { (arg: K): PropertyDecorator }
export interface PropertyDecoratorCallback<K> {
    (options: ControllerOptions, decorator: [Object, string], key?: K, ...args: any[]): ControllerOptions;
}
export function createPropertyDecorator<K, D = PropertyDecoratorInterface<K>>(callback: PropertyDecoratorCallback<K>): D {
    function decorator(...args: any[]) {
        if (args.length === 1) {
            return (target: any, propertyKey: string): void => {
                const [arg] = args
                const options: ControllerOptions = target.____$options || {}
                // Reset options
                target.____$options = callback(options, [target, propertyKey], arg)
            }
        } else {
            const [ target, propertyKey ] = args
            const options: ControllerOptions = target.____$options || {}
            // Reset options
            target.____$options = callback(options, [target, propertyKey])
        }
    }
    return decorator as any
}

/**
 * createPropertyDecorator
 * 创建属性装饰器方法
 * @param callback
 */
export type ParameterDecoratorInterface<K, V>  = ParameterDecorator & { (key: K, value?: V): ParameterDecorator }
export interface ParameterDecoratorCallback<K, V> {
    (options: ControllerOptions, decorator: [Object, string, number], key?: K, value?: V, ...args: any[]): ControllerOptions;
}
export function createParameterDecorator<K, V = any, D = ParameterDecoratorInterface<K, V>>(callback: ParameterDecoratorCallback<K, V>): D {
    function decorator(...args: any[]) {
        if (args.length === 1) {
            return (target: any, propertyKey: string, parameterIndex: number): void => {
                const [key, value] = args
                const options: ControllerOptions = target.____$options || {}
                // Reset options
                target.____$options = callback(options, [target, propertyKey, parameterIndex], key, value)
            }
        } else {
            const [ target, propertyKey, parameterIndex ] = args
            const options: ControllerOptions = target.____$options || {}
            // Reset options
            target.____$options = callback(options, [target, propertyKey, parameterIndex])
        }
    }
    return decorator as any
}

/**
 * createPropertyAndParameterDecorator
 * 创建同时能兼容参数装饰器和属性装饰器方法
 */
export interface PropertyAndParameterDecorator<V> {
    (args: V): ParameterDecorator;
    (target: Object, propertyKey: string): void;
    (target: Object, propertyKey: string, parameterIndex: number): void;
}
export function createPropertyAndParameterDecorator<V, D = PropertyAndParameterDecorator<V>>(id: string, callback: MethodDecoratorHttpCallback): D {
    function decorator(...args: any[]) {
        if (args.length === 1) {
            const [ arg ] = args
            return (...targs: any[]) => {
                handler(arg, ...targs)
            }
        } else {
            handler(null, ...args)
        }
        function handler(value: V, ...sagrs: any[]) {
            const [ target, propertyKey, parameterIndex ] = sagrs
            if (typeof parameterIndex === 'number' && sagrs.length === 3) {
                const options: ControllerOptions = target.____$options || {}
                const parameters = options.parameters = options.parameters || {}
                const parameter = parameters[propertyKey] = parameters[propertyKey] || []
                parameter[parameterIndex] = {
                    callback,
                    value,
                    id
                }
                // Reset options
                target.____$options = options
            } else {
                const options: ControllerOptions = target.____$options || {}
                const propertys = options.propertys = options.propertys || {}
                const property = propertys[propertyKey] = propertys[propertyKey] || {}
                property.callback = callback
                property.value = value
                // Reset options
                target.____$options = options
            }
        }
    }
    return decorator as any
}

/**
 * RequestMethodDecorator
 * 创建http请求方式装饰器
 */
export type RequestMethodDecorator = MethodDecorator & { (route: string): MethodDecorator; }
export function createRequestMethodDecorator(type: RequestMethodType): RequestMethodDecorator {
    return createMethodDecorator<string, any, RequestMethodDecorator>((options, decorator, route) => {
        const [ target, propertyKey ] = decorator
        const routes = options.routes = options.routes || {}

        if (!route) route = propertyKey;
        // If the path does not start with '/',insert '/' before route.
        if (!/^\//.test(route)) route = `/${route}`

        // If the path Contains double `//`, replace with '/'.
        route = route.replace(/[\/]{2,}/g, '/')

        // If request type `ALL` in routes return
        if (routes['ALL']) {
            if (routes['ALL'].length > 0) return options
        }

        const router = routes[type] = routes[type] || []

        // Check if the route is duplicated
        const filters = router.filter((k) =>  k.routePath === route)

        // If not is duplicated
        if (filters.length > 0) throw new Error(`In class ${target.constructor.name}, function ${propertyKey}(), route path '${route}' Repeat in request type '${type}'.`)

        // Append this router
        router.push({ routePath: route, propertyKey: propertyKey })

        return options
    })
}

/**
 * createHttpExceptionDecorator
 * 创建http异常捕获装饰器
 */

export interface HttpExceptionCaptureDecorator<T = Core.HttpException> {
    (HttpExceptionCaptureConstructor: T): MethodDecorator;
}
export function createHttpExceptionCaptureDecorator<T>(): HttpExceptionCaptureDecorator<T> {
    return createMethodDecorator<any, any, HttpExceptionCaptureDecorator<T>>((options, decorator, HttpException) => {
        const [ target, propertyKey, descriptor] = decorator
        const { value } = descriptor
        descriptor.value = async function(...args: any[]) {
            try {
                args.forEach((k) => {
                    if (k instanceof Error) {
                        throw k
                    }
                })
                return await value.call(this, ...args)
            } catch (error) {
                if (typeof HttpException === 'function') {
                    throw new HttpException({
                        message: error.message,
                        data: error.data,
                        statusCode: error.statusCode
                    })
                } else if (typeof HttpException === 'object') {
                    throw HttpException
                } else {
                    throw error
                }
            }
        }
        return options
    })
}