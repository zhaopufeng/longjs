/**
 * Controller
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */

import Server, { Core, HttpException } from '@longjs/core'
import * as assert from 'assert'
import { IncomingHttpHeaders } from 'http';
import * as mimeTypes from 'mime-types'
import * as statuses from 'statuses'
import 'reflect-metadata'
import { HttpErrorConstructor } from 'http-errors';

interface IClassDecoratorCallback {
    (options: Options): void;
}
/**
 * @method createClassDecorator
 */
export function createClassDecorator(callback: IClassDecoratorCallback): ClassDecorator {
    return <C extends IController>(target: C): C | void  => {
        const options = target.prototype.____$options || {}
        // Set options.target
        if (!options.target) options.target = target as any
        callback(options)
        if (!options.target) options.target = target as any
        target.prototype.____$options = options
    }
}

export function Controller(path: string) {
    return createClassDecorator((options) => {
        const { target } = options
        // Set options metadata
        options.metadatas = Reflect.getMetadata('design:paramtypes', target) || []
        // Set options route root path
        options.path = path
    })
}

export interface IRequestDecorator<T> {
    (route: string): MethodDecorator;
    <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
}
export function createRequestDecorator<T, Decorator = IRequestDecorator<any>>(type: RequestMethodType): Decorator {
    function decorator(...args: any[]) {
        if (args.length === 1) {
            return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {
                return handler([target, propertyKey, descriptor], args[0])
            }
        }

        const [ target, propertyKey, descriptor] = args;
        return handler([ target, propertyKey, descriptor])
    }

    function handler(decorators: [any, string, TypedPropertyDescriptor<T>], value?: string) {
        if (value) {
            assert(typeof value === 'string', `The '@${type}(~)' decorator path Invalid: path is not string.`)
        }
        const [ target, propertyKey, descriptor ] = decorators
        const options: Options = target.____$options || {}
        options.handlers = options.handlers || {}
        const iHandler =  options.handlers[propertyKey]  = options.handlers[propertyKey] || {}
        const methodTypes = iHandler.methodTypes = iHandler.methodTypes || []
        if (!~methodTypes.indexOf('ALL')) {
            methodTypes.push(type)
        }
        iHandler.routePath = iHandler.routePath = []
        iHandler.routePath.push(value)
        target.____$options = options
    }

    return decorator as any
}

export const All = createRequestDecorator('ALL')
export const Copy = createRequestDecorator('COPY')
export const Delete = createRequestDecorator('DELETE')
export const Get = createRequestDecorator('GET')
export const Head = createRequestDecorator('HEAD')
export const Link = createRequestDecorator('LINK')
export const Lock = createRequestDecorator('LOCK')
export const Options = createRequestDecorator('OPTIONS')
export const Patch = createRequestDecorator('PATCH')
export const Propfind = createRequestDecorator('PORPFIND')
export const Post = createRequestDecorator('POST')
export const Purge = createRequestDecorator('PURGE')
export const Put = createRequestDecorator('PUT')
export const Unlink = createRequestDecorator('UNLINK')
export const Unlock = createRequestDecorator('UNLOCK')
export const View = createRequestDecorator('VIEW')

// Only MehodDecorator
export interface IMethodDecorator<V, T = any> {
    (arg: V): MethodDecorator;
    // (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
}
export interface IMethodDecoratorCallback {
    (options: {
        statusCode?: number;
        headers?: IncomingHttpHeaders;
        responseType?: string;
        statusMessage?: string;
        callback?: DecoratorCallback;
        exceptioncapture?: ExceptionCaptureCallback;
    }, values?: any): void;
}
export interface IMethodDecoratorCallbackOptions {
    statusCode?: number;
    headers?: IncomingHttpHeaders;
    responseType?: string;
    statusMessage?: string;
    callback?: DecoratorCallback;
    exceptioncapture?: ExceptionCaptureCallback;
}
export function createMehodDecorator<V, Decorator = IMethodDecorator<V>, T = any>(id: string, callback: IMethodDecoratorCallback): Decorator {
    function decorator(...args: any[]) {
        if (args.length === 1) {
            const value = args[0]
            return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
                return handler([target, propertyKey, descriptor], value)
            }
        }

        const [ target, propertyKey, descriptor ] = args
        return handler([ target, propertyKey, descriptor ])
        function handler(decorators: [any, string, TypedPropertyDescriptor<T>], values?: any) {
            const [ target, propertyKey, descriptor ] = decorators;
            const options: Options = target.____$options || {}
            options.handlers = options.handlers || {}
            const handlers = options.handlers[propertyKey] = options.handlers[propertyKey] || {}
            const { headers, statusCode, responseType, statusMessage, methods = {}, exceptioncapture = {} } = handlers
            const callbackOps: IMethodDecoratorCallbackOptions = {}
            callback(callbackOps, values)

            // Checking statusCode
            if (statusCode) {
                assert(!callbackOps.statusCode, `@${id}('${values}') Invalid: statusCode had already been set.`)
            }
            // Set statusCode
            if (callbackOps.statusCode) {
                assert(statuses[values], `@${id}('${values}') Invalid: ${values} is not http statusCode.`)
                handlers.statusCode = callbackOps.statusCode
            }

            // Checing headers
            if (headers) {
                assert(!callbackOps.headers, `@${id}(${JSON.stringify(values)}) Invalid: headers had already been set.`)
            }
            // Set headers
            if (callbackOps.headers) {
                handlers.headers = callbackOps.headers
            }

            // Checking responseType
            if (responseType) {
                assert(!callbackOps.responseType, `@${id}('${values}') Invalid: content-type had already been set.`)
            }
            // Set responseType
            if (callbackOps.responseType) {
                assert(mimeTypes.contentType(values), `@${id}('${values}') Invalid: ${values} is not mime-type.`)
                handlers.responseType = callbackOps.responseType
            }

            // Checing message
            if (statusMessage) {
                assert(!callbackOps.statusMessage, `@${id}('${values}') Invalid: message had already been set.`)
            }

            // Set statusMessage
            if (callbackOps.statusMessage) {
                handlers.statusMessage = callbackOps.statusMessage
            }

            if (callbackOps.callback) {
                assert(!methods[id], `@${id}() decorator Invalid: decorator should not be used repeatedly.`)
                methods[id] = {
                    values,
                    callback: callbackOps.callback
                }
                handlers.methods = methods
            }

            if (callbackOps.exceptioncapture) {
                assert(!exceptioncapture[id], `@${id}() decorator Invalid: decorator should not be used repeatedly.`)
                exceptioncapture[id] = callbackOps.exceptioncapture
                handlers.exceptioncapture = exceptioncapture
            }
            target.____$options = options;
        }
    }

    return decorator as any
}

export const Type = createMehodDecorator<string>('Type', (options, values) => {
    options.responseType = values
})

export const Status = createMehodDecorator<number>('Status', (options, values) => {
    options.statusCode = values
})

export const Message = createMehodDecorator<string>('Message', (options, values) => {
    options.statusMessage = values
})

export const Catch = createMehodDecorator<Core.HttpExceptionConstructor>('Catch', (options, values: Core.HttpExceptionConstructor) => {
    options.exceptioncapture = function(err) {
        const { message, data, statusCode } = err
        throw new values({
            message,
            data,
            statusCode
        })
    }
})

export const Exception = createMehodDecorator<Core.HttpException>('Exception', (options, values: Core.HttpException) => {
    options.exceptioncapture = function(err) {
        const { message, data, statusCode } = err
        throw values
    }
})

export interface IParameterDecorator<K, V> {
    (key: K, value: V): ParameterDecorator;
    // (target: Object, propertyKey: string, parametersIndex: number): void;
}
export interface IParameterDecoratorCallback {
    (ctx: Core.Context, values?: any): any | Core.HttpException;
}
export function createParameterDecorator<K = any, V = any, Decorator = IParameterDecorator<K, V>>(id: string, callback: IParameterDecoratorCallback, ...values: any[]): Decorator {
    function decorator(...args: any) {
        if (args.length < 3) {
            return (target: Object, propertyKey: string, parametersIndex: number): void => {
                return handler([target, propertyKey, parametersIndex], ...args)
            }
        }
        const [target, propertyKey, parametersIndex] = args;
        if (values) {
            return handler([target, propertyKey, parametersIndex], values)
        }
    }

    function handler(decorators: [any, string, number], values?: any[]) {
        const [ target, propertyKey, parametersIndex ] = decorators
        const options: Options = target.____$options || {}
        const handlers = options.handlers[propertyKey] = options.handlers[propertyKey] || {}
        const { parameters = {} } = handlers
        // const parameter = parameters[id] = parameters[id] || {}
        assert(!parameters[id], `@${id}() Invalid: decorator should not be used repeatedly.`)
        parameters[id] = {
            values,
            index: parametersIndex,
            callback
        }
        handlers.parameters = parameters;
        target.____$options = options
    }

    return decorator as any
}

export interface IPropertyDecorator<K> {
    (key: K): PropertyDecorator;
    (target: any, propertyKey: string): void;
}
export interface IPropertyDecoratorCallback {
    (ctx: Core.Context, values?: any): any | Core.HttpException;
}
export function createPropertyDecorator<K, Decorator = IPropertyDecorator<K>>(id: string, callback: IPropertyDecoratorCallback, ...values: any[]): Decorator {
    function decorator(...args: any[]) {
        if (args.length === 1) {
            return (target: any, propertyKey: string): void => {
                return handler([target, propertyKey], args[0])
            }
        }
        const [target, propertyKey] = args;
        if (values) {
            return handler([target, propertyKey], values)
        } else {
            return handler([target, propertyKey])
        }
    }
    function handler(decorators: [any, string], values?: any) {
        const [target, propertyKey] = decorators
        const options: Options = target.____$options || {}
        const { propertys = {} } = options
        const property = propertys[propertyKey] = propertys[propertyKey] || {}
        assert(!property[id], `@${id}() Invalid: decorator should not be used repeatedly.`)
        property[id] = {
            callback,
            values
        }
        options.propertys = propertys
        target.____$options = options
    }

    return decorator as any
}

export interface CombinedDecorator {
    (target: any, propertyKey: string, parametersIndex: number): void;
    (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
}
export interface CombinedDecoratorCallback {
    (ctx: Core.Context | IMethodDecoratorCallbackOptions, values?: any): any | Core.HttpException;
}

export function createCombinedDecorator<Decorator = CombinedDecorator>(id: string, callback: CombinedDecoratorCallback, more?: boolean): Decorator {
    function decorators(...args: any[]) {
        if (!more) {
            if (args.length === 2) {
                const [ target, propertyKey ] = args
                return createPropertyDecorator(id, (ctx, values) => {
                    return callback(ctx, values)
                })(target, propertyKey)
            } else if (args.length ===  3) {
                const [ target, propertyKey, parametersIndex ] = args
                if (typeof parametersIndex === 'number') {
                    return createParameterDecorator<any, any, {
                        (target: Object, propertyKey: string, parametersIndex: number): void;
                    }>(id, (ctx, values) => {
                       return callback(ctx, values)
                    })(target, propertyKey, parametersIndex)
                }
                return createMehodDecorator(id, (options) => {
                    return;
                })
            }
        }
    }

    return decorators as any
}

export interface NoParamsDecorator {
    (target: Object, propertyKey: string): void;
    (target: Object, propertyKey: string, parameterIndex: number): void;
}
export const Request = createCombinedDecorator<NoParamsDecorator>('Request', (ctx: Core.Context) => {
    return ctx.request
})

export const Response = createCombinedDecorator<NoParamsDecorator>('Response', (ctx: Core.Context) => {
    return ctx.response
})

export const Session = createCombinedDecorator<NoParamsDecorator>('Session', (ctx: Core.Context) => {
    return ctx.session
})

/**
 * interface
 */
export interface IParameter {
    callback?: DecoratorCallback;
    index?: number;
    values?: any;
}

export interface IParameters {
    [id: string]: IParameter;
}

export interface IMethod {
    callback?: DecoratorCallback;
    values?: any;
}

export interface IMethods {
    [id: string]: IMethod;
}

export interface IHandler {
    routePath?: string[];
    methodTypes?: RequestMethodType[];
    parameters?: IParameters;
    methods?: IMethods;
    statusCode?: number;
    headers?: IncomingHttpHeaders;
    responseType?: string;
    statusMessage?: string;
    exceptioncapture?: {
        [id: string]: ExceptionCaptureCallback
    }
}

export interface IHandlers {
    [key: string]: IHandler;
}

export interface IProperty {
    [id: string]: {
        callback?: DecoratorCallback;
        values?: any;
    }
}

export interface IPropertys {
    [key: string]: IProperty
}

export interface Options {
    target?: IControllerConstructor;
    propertys?: IPropertys;
    metadatas?: Array<{ new(...args: any[]): any }>;
    handlers?: IHandlers;
    path?: string;
}

export interface IController {
    prototype?: {
        ____$options?: Options;
    }
}

export interface IControllerConstructor {
    new (...args: any[]): any;
    prototype?: {
        ____$options?: Options;
    }
}

export interface DecoratorCallback {
    (ctx: Core.Context, values?: any): void;
}

export interface ExceptionCaptureCallback {
    (error: Core.HttpException, decoratorValue?: Core.HttpException | Core.HttpExceptionConstructor): void;
}

export type RequestMethodType = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT' | 'COPY' | 'LINK' | 'UNLINK' | 'PURGE' | 'LOCK' | 'UNLOCK' | 'PORPFIND' | 'VIEW'