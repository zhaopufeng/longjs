import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { Core, HttpException } from '@longjs/core';
import * as assert from 'assert';
import * as mimeTypes from 'mime-types'
import * as statuses from 'statuses'
import 'reflect-metadata'

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

export function createDecorator<Decorator = IDecorator>(id: string, callback: IDecoratorCallback, values?: any): Decorator {
    function decorator(...args: any[]) {
        // 属性装饰器
        if (!args[2] && args[2] !== 0) {
            // 属性装饰器
            const [ target, propertyKey ] =  args
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
        // 参数装饰器
        if (typeof args[2] === 'number') {
            const [ target, propertyKey, parameterIndex ] =  args
            const options: Options = target.____$options || {}
            const handlers = options.handlers[propertyKey] = options.handlers[propertyKey] || {}
            const { parameters = {} } = handlers
            assert(!parameters[id], `@${id}() Invalid: decorator should not be used repeatedly.`)
            parameters[id] = {
                values,
                index: parameterIndex,
                callback
            }
            handlers.parameters = parameters;
            target.____$options = options
        }

        // 方法装饰器
        if (typeof args[2] === 'object') {
            const [ target, propertyKey, descriptor ] =  args
            const options: Options = target.____$options || {}
            options.handlers = options.handlers || {}
            const handlers = options.handlers[propertyKey] = options.handlers[propertyKey] || {}
            const { headers, statusCode, responseType, statusMessage, methodTypes = [], routePath = [], methods = {}, exceptioncapture = {} } = handlers
            const callbackOps: IMethodDecoratorCallbackOptions = {}
            ; (callback as IMethodDecoratorCallback)(callbackOps, values)

            // Append route path
            if (callbackOps.routePath) {
                routePath.push(callbackOps.routePath)
                handlers.routePath = routePath
            }

            // Append method types
            if (callbackOps.methodType) {
                methodTypes.push(callbackOps.methodType)
                handlers.methodTypes = methodTypes
            }
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

export function Type(type: string) {
    return createDecorator<MethodDecorator>('Type', (options: IMethodDecoratorCallbackOptions) => {
        options.responseType = type
    }, type)
}

export function Status(statusCode: number) {
    return createDecorator<MethodDecorator>('Status', (options: IMethodDecoratorCallbackOptions) => {
        options.statusCode = statusCode
    }, statusCode)
}

export function Message(statusMessage: string) {
    return createDecorator<MethodDecorator>('Message', (options: IMethodDecoratorCallbackOptions) => {
        options.statusMessage = statusMessage
    })
}

export function Catch(Exception: Core.HttpExceptionConstructor) {
    return createDecorator<MethodDecorator>('Catch', (options: IMethodDecoratorCallbackOptions) => {
        options.exceptioncapture = function(err: Core.HttpExceptionConstructor) {
            const { message, data, statusCode } = err
            throw new Exception({
                message,
                data,
                statusCode
            })
        }
    })
}

export function Exception(Exception: Core.HttpException) {
    return createDecorator<MethodDecorator>('Exception', (options: IMethodDecoratorCallbackOptions) => {
        options.exceptioncapture = function(err: Core.HttpExceptionConstructor) {
            if (err) {
                throw Exception
            }
        }
    })
}
export function createRequestDecorator(id: RequestMethodType): RequestDecorator {
    function decorator(...args: any[]) {
        if (args.length === 1) {
            return createDecorator(id, (options: IMethodDecoratorCallbackOptions) => {
                options.routePath = args[0]
                options.methodType = id
            })
        } else if (args.length === 3) {
            const [target, propertyKey, descriptor] = args
            return createDecorator(id, (options: IMethodDecoratorCallbackOptions) => {
                options.routePath = null
                options.methodType = id
            })(target, propertyKey, descriptor)
        }
    }
    return decorator as any
}

export const Request = createDecorator<RequestResponseSessionDecorator>('Request', (ctx: Core.Context) => {
    assert(ctx.request, 'Invalid: @Rquest decorator is not method decorator.')
    return ctx.request
})

export const Session = createDecorator<RequestResponseSessionDecorator>('Session', (ctx: Core.Context) => {
    assert(ctx.request, 'Invalid: @Rquest decorator is not method decorator.')
    return ctx.session
})

export const Response = createDecorator<RequestResponseSessionDecorator>('Response', (ctx: Core.Context) => {
    assert(ctx.request, 'Invalid: @Rquest decorator is not method decorator.')
    return ctx.request
})

export function createCombinedDecorator<Decorator = any>(id: string, callback: IDecoratorCallback): Decorator {
    function decorator(...args: any[]) {
        if (args.length === 1) {
            return createDecorator(id, callback, args[0])
        }
        if (args.length === 2) {
            if (typeof args[0] === 'string') {
                return createDecorator(id, callback, args)
            }
        }

        if (args.length === 3) {
            // 属性装饰器
            if (!args[2]) {
                const [ target, propertyKey ] = args
                return createDecorator(id, callback)(target, propertyKey)
            }
        }
    }
    return decorator as any
}

export type Header<T = IncomingHttpHeaders> = T
export const Header = createCombinedDecorator<HeaderDecorator>('Header', (ctx: Core.Context | IMethodDecoratorCallbackOptions, values: string | string[]) => {
    if (!ctx.headers) {
        // (ctx as IMethodDecoratorCallbackOptions).headers
       ; (ctx as IMethodDecoratorCallbackOptions).headers = {}
       ; (ctx as IMethodDecoratorCallbackOptions).headers[values[0]] = values[1]
    }

    if (ctx.headers && typeof values === 'string') {
        return ctx.headers[values as string]
    }

    if (ctx.headers && Array.isArray(values)) {
        const errors: any = {}
        if (ctx.headers[values[0]] !== values[1]) {
            errors[values[0]] = `parameter '${ctx.headers[values[0]]}' invalid.`
            throw new HttpException({
                message: 'Server Error: Request header invalid',
                data: errors
            })
        }
        const data: any = {}
        data[values[0]] = ctx.headers[values[0]]
        return data
    }
})

export type Headers<T = IncomingHttpHeaders> = T
export const Headers = createCombinedDecorator<HeadersDecorator>('Headers', (ctx: Core.Context | IMethodDecoratorCallbackOptions, values: IncomingHttpHeaders) => {
    if (!ctx.headers && typeof values === 'object') {
       ; (ctx as IMethodDecoratorCallbackOptions).headers = values as any
       return;
    }
    if (!values) {
        return ctx.headers
    }
    if (ctx.headers && typeof values === 'object') {
        const errors: any = {}
        const datas: any = {}
        Object.keys(values).forEach((k) => {
            if (values[k] !== ctx.headers[k]) {
                errors[k] = `parameter '${ctx.headers[k]}' invalid.`
            }
            datas[k] = ctx.headers[k]
        })
        if (Object.keys(errors).length > 0) {
            throw new HttpException({
                message: 'Server Error: Request header invalid',
                data: errors
            })
        }

        return datas
    }
})
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

/**
 * Interfaces
 * DecoratorCallbacks
 */
export type IDecoratorCallback = IMethodDecoratorCallback | IParameterDecoratorCallback | IPropertyDecoratorCallback
export interface IMethodDecoratorCallback {
    (options: IMethodDecoratorCallbackOptions, values?: any): void;
}
export interface IParameterDecoratorCallback {
    (ctx: Core.Context, values?: any): any | Core.HttpException;
}
export interface IPropertyDecoratorCallback {
    (ctx: Core.Context, values?: any): any | Core.HttpException;
}

export interface RequestDecorator {
    (route: string): MethodDecorator;
    <T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
}

/**
 * Interfaces
 * Decorators
 */
export interface HeaderDecorator {
    (key: string): PropertyDecorator;
    (key: string, value: string): {
        (target: Object, propertyKey: string, parameterIndex: number): void;
        <T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
    };
}

export interface HeadersDecorator {
    (header: IncomingHttpHeaders): {
        (target: Object, propertyKey: string, parameterIndex: number): void;
        <T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
    };
    (target: Object, propertyKey: string): void;
}
export interface RequestResponseSessionDecorator {
    (target: Object, propertyKey: string): void;
    (target: Object, propertyKey: string, parameterIndex: number): void;
}
export interface IDecorator {
    (target: Object, propertyKey: string): void;
    (target: Object, propertyKey: string, parameterIndex: number): void;
    <T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
}
export interface IMethodDecoratorCallbackOptions {
    statusCode?: number;
    headers?: IncomingHttpHeaders;
    responseType?: string;
    statusMessage?: string;
    callback?: DecoratorCallback;
    exceptioncapture?: ExceptionCaptureCallback;
    methodType?: RequestMethodType;
    routePath?: string;
}

/**
 * Interfaces controller
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