import { Core } from '@longjs/core';
import { IncomingHttpHeaders } from 'http';
import 'reflect-metadata'
import * as assert from 'assert'
import * as mimeTypes from 'mime-types'
import * as statuses from 'statuses'

interface IClassDecoratorCallback {
    (options: IOptions): void;
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

export function createDecorator<Decorator = IDecorator>(id: string, callback: IDecoratorCallback, values?: any): Decorator {
    function decorator(...args: any[]) {
        // 属性装饰器
        if (!args[2] && args[2] !== 0) {
            // 属性装饰器
            const [ target, propertyKey ] =  args
            const options: IOptions = target.____$options || {}
            const { propertys = new Map<string, IPropertys>() } = options
            if (!propertys.has(propertyKey)) propertys.set(propertyKey, new Map<string, IProperty>())
            const property = propertys.get(propertyKey)

            assert(!property.has(id), `@${id}() Invalid: decorator should not be used repeatedly.`)
            property.set(id, {
                callback,
                values
            })
            options.propertys = propertys
            target.____$options = options
        }
        // 参数装饰器
        if (typeof args[2] === 'number') {
            const [ target, propertyKey, index ] =  args
            const options: IOptions = target.____$options || new Map()
            const { handlers = new Map<string, IHandler>() } = options
            if (!handlers.has(propertyKey)) handlers.set(propertyKey, {})
            const handler = handlers.get(propertyKey)
            const { parameters = new Map<string, IParameter>() } = handler
            assert(!parameters.has(id), `@${id}() Invalid: decorator should not be used repeatedly.`)
            parameters.set(id, {
                values,
                index,
                callback
            })
            handler.parameters = parameters;
            target.____$options = options
        }

        // 方法装饰器
        if (typeof args[2] === 'object') {
            const [ target, propertyKey, descriptor ] =  args
            const options: IOptions = target.____$options || new Map()
            const { handlers = new Map<string, IHandler>() } = options
            if (!handlers.get(propertyKey)) handlers.set(propertyKey, {})
            const IHandler = handlers.get(propertyKey)
            const {
                headers,
                statusCode,
                responseType,
                statusMessage,
                routePath = new Map<string, IRoutePath>(),
                methods = new Map<string, IMethod>(),
                exceptioncapture = new Map<string, ExceptionCaptureCallback>()
            } = IHandler
            const callbackOps: IMethodDecoratorCallbackOptions = {}
            ; (callback as IMethodDecoratorCallback)(callbackOps, values)

            // Append route path
            if (callbackOps.routePath || callbackOps.routePath === null) {
                if (!routePath.has(callbackOps.routePath)) {
                    routePath.set(callbackOps.routePath, new Set())
                }
                routePath.get(callbackOps.routePath).add(id as RequestMethodType)
                // If All in Set collection，clear other
                if (routePath.get(callbackOps.routePath).has('ALL')) {
                    routePath.get(callbackOps.routePath).clear()
                    routePath.get(callbackOps.routePath).add('ALL')
                }
                IHandler.routePath = routePath
            }

            // Checking statusCode
            if (statusCode) {
                assert(!callbackOps.statusCode, `@${id}('${values}') Invalid: statusCode had already been set.`)
            }
            // Set statusCode
            if (callbackOps.statusCode) {
                assert(statuses[values], `@${id}('${values}') Invalid: ${values} is not http statusCode.`)
                IHandler.statusCode = callbackOps.statusCode
            }

            // Checing headers
            if (headers) {
                assert(!callbackOps.headers, `@${id}(${JSON.stringify(values)}) Invalid: headers had already been set.`)
            }
            // Set headers
            if (callbackOps.headers) {
                IHandler.headers = callbackOps.headers
            }

            // Checking responseType
            if (responseType) {
                assert(!callbackOps.responseType, `@${id}('${values}') Invalid: content-type had already been set.`)
            }
            // Set responseType
            if (callbackOps.responseType) {
                assert(mimeTypes.contentType(values), `@${id}('${values}') Invalid: ${values} is not mime-type.`)
                IHandler.responseType = callbackOps.responseType
            }

            // Checing message
            if (statusMessage) {
                assert(!callbackOps.statusMessage, `@${id}('${values}') Invalid: message had already been set.`)
            }

            // Set statusMessage
            if (callbackOps.statusMessage) {
                IHandler.statusMessage = callbackOps.statusMessage
            }

            if (callbackOps.callback) {
                assert(!methods.has(id), `@${id}() decorator Invalid: decorator should not be used repeatedly.`)
                methods.set(id, {
                    values,
                    callback: callbackOps.callback
                })
                IHandler.methods = methods
            }

            if (callbackOps.exceptioncapture) {
                assert(!exceptioncapture.has(id), `@${id}() decorator Invalid: decorator should not be used repeatedly.`)
                exceptioncapture.set(id, callbackOps.exceptioncapture)
                IHandler.exceptioncapture = exceptioncapture
            }
            options.handlers = handlers
            target.____$options = options;
        }
    }
    return decorator as any
}

export function createRequestDecorator(id: RequestMethodType): RequestDecorator {
    function decorator(...args: any[]) {
        if (args.length === 1) {
            return createDecorator(id, (options: IMethodDecoratorCallbackOptions) => {
                options.routePath = args[0]
            })
        } else if (args.length === 3) {
            const [target, propertyKey, descriptor] = args
            return createDecorator(id, (options: IMethodDecoratorCallbackOptions) => {
                options.routePath = null
            })(target, propertyKey, descriptor)
        }
    }
    return decorator as any
}

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

/**
 * Interfaces
 * DecoratorCallbacks
 */

export interface IProperty {
    callback?: DecoratorCallback;
    values?: any;
}
export interface IMethod {
    callback?: DecoratorCallback;
    values?: any;
}
export interface IParameter {
    callback?: DecoratorCallback;
    index?: number;
    values?: any;
}

export type IRoutePath = Set<RequestMethodType>
export interface IHandler {
    routePath?: Map<string, IRoutePath>;
    parameters?: Map<string, IParameter>;
    methods?: Map<string, IMethod>;
    statusCode?: number;
    headers?: IncomingHttpHeaders;
    responseType?: string;
    statusMessage?: string;
    exceptioncapture?: Map<string, ExceptionCaptureCallback>
}

export type IPropertys = Map<string, IProperty>
export interface IOptions {
    target?: IControllerConstructor;
    propertys?: Map<string, IPropertys>;
    metadatas?: Array<{new(...args: any): any}>;
    handlers?: Map<string, IHandler>;
    path?: string;
}

export interface IController {
    prototype?: {
        ____$options?: IOptions;
    }
}

export interface IControllerConstructor {
    new (...args: any[]): any;
    prototype?: {
        ____$options?: IOptions;
    }
}

export interface IDecorator {
    (target: Object, propertyKey: string): void;
    (target: Object, propertyKey: string, parameterIndex: number): void;
    <T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
}

export interface RequestDecorator {
    (route: string): MethodDecorator;
    <T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
}

export type IDecoratorCallback = IMethodDecoratorCallback | IParameterDecoratorCallback | IPropertyDecoratorCallback
export interface IMethodDecoratorCallback {
    (options: IMethodDecoratorCallbackOptions, values?: any): void;
}
export interface IMethodDecoratorCallbackOptions {
    statusCode?: number;
    headers?: IncomingHttpHeaders;
    responseType?: string;
    statusMessage?: string;
    callback?: DecoratorCallback;
    exceptioncapture?: ExceptionCaptureCallback;
    routePath?: string;
}
export interface IParameterDecoratorCallback {
    (ctx: Core.Context, values?: any): any | Core.HttpException;
}
export interface IPropertyDecoratorCallback {
    (ctx: Core.Context, values?: any): any | Core.HttpException;
}
export type DecoratorCallback = (ctx: Core.Context, values?: any) => void;
export type ExceptionCaptureCallback = (error: Core.HttpException, decoratorValue?: Core.HttpException | Core.HttpExceptionConstructor) => void;
export type RequestMethodType = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT' | 'COPY' | 'LINK' | 'UNLINK' | 'PURGE' | 'LOCK' | 'UNLOCK' | 'PORPFIND' | 'VIEW'