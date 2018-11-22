import { Core } from 'src';
import { IncomingHttpHeaders } from 'http';
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
                contentType,
                statusMessage,
                route = new Map<string, RequestMethodTypes>(),
                methods = new Map<string, IMethod>(),
                exceptioncapture = {}
            } = IHandler
            const callbackOps: IMethodDecoratorCallbackOptions = {}
            ; (callback as IMethodDecoratorCallback)(callbackOps, values)

            // Append route path
            if (callbackOps.path || callbackOps.path === null) {
                if (route.has(callbackOps.path)) {
                    if (callbackOps.path === null) {
                        assert(!route.get(callbackOps.path).has(id as RequestMethodType), `Invalid: @${id} decorator should not be used repeatedly.`)
                    } else {
                        assert(!route.get(callbackOps.path).has(id as RequestMethodType), `Invalid: @${id}('${callbackOps.path}') decorator should not be used repeatedly.`)
                    }
                } else {
                    route.set(callbackOps.path, new Set())
                }
                route.get(callbackOps.path).add(id as RequestMethodType)
                // If All in Set collection，clear other
                if (route.get(callbackOps.path).has('ALL')) {
                    route.get(callbackOps.path).clear()
                    route.get(callbackOps.path).add('ALL')
                }
                IHandler.route = route
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
            if (contentType) {
                assert(!callbackOps.contentType, `@${id}('${values}') Invalid: content-type had already been set.`)
            }
            // Set responseType
            if (callbackOps.contentType) {
                assert(mimeTypes.contentType(values), `@${id}('${values}') Invalid: ${values} is not mime-type.`)
                IHandler.contentType = callbackOps.contentType
            }

            // Checing message
            if (statusMessage) {
                assert(!callbackOps.statusMessage, `@${id}('${values}') Invalid: message had already been set.`)
            }

            // Set statusMessage
            if (callbackOps.statusMessage) {
                const reg = /[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g
                assert(!reg.test(callbackOps.statusMessage), `@${id}('${callbackOps.statusMessage}') Invalid: Special characters cannot be included.`)
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
                if (typeof callbackOps.exceptioncapture === 'function') {
                    assert(!exceptioncapture.exception, `@${id} decorator Invalid: decorator should not be used repeatedly.`)
                    exceptioncapture.exception = callbackOps.exceptioncapture
                } else {
                    assert(!exceptioncapture.catch, `@${id} decorator Invalid: decorator should not be used repeatedly.`)
                    exceptioncapture.catch = callbackOps.exceptioncapture
                }
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
                options.path = args[0]
            })
        } else if (args.length === 3) {
            const [target, propertyKey, descriptor] = args
            return createDecorator(id, (options: IMethodDecoratorCallbackOptions) => {
                options.path = null
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

export type RequestMethodTypes = Set<RequestMethodType>
export type StatusCode = 100 | 101 | 102 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 300 | 301 | 302 | 303 | 304 | 305 | 306 |
307 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 421 | 422 |
423 | 424 | 425 | 426 | 449 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 509 | 510 | 600 |
'100' | '101' | '102' | '200' | '201' | '202' | '203' | '204' | '205' | '206' | '207' | '300' | '301' | '302' | '303' | '304' |
'305' | '306' | '307' | '400' | '401' | '402' | '403' | '404' | '405' | '406' | '407' | '408' | '409' | '410' | '411' | '412' |
'413' | '414' | '415' | '416' | '417' | '421' | '422' | '423' | '424' | '425' | '426' | '449' | '451' | '500' | '501' | '502' |
'503' | '504' | '505' | '506' | '507' | '509' | '510' | '600';
export interface IHandler {
    route?: Map<string, RequestMethodTypes>;
    parameters?: Map<string, IParameter>;
    methods?: Map<string, IMethod>;
    statusCode?: StatusCode;
    headers?: IncomingHttpHeaders;
    contentType?: string;
    statusMessage?: string;
    exceptioncapture?: {
        catch?: Core.HttpException;
        exception?: Core.HttpExceptionConstructor;
    }
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
    statusCode?: StatusCode;
    headers?: IncomingHttpHeaders;
    contentType?: string;
    statusMessage?: string;
    callback?: DecoratorCallback;
    exceptioncapture?: Core.HttpException | Core.HttpExceptionConstructor;
    path?: string;
}
export interface IParameterDecoratorCallback {
    (ctx: Core.Context, values?: any): any | Core.HttpException;
}
export interface IPropertyDecoratorCallback {
    (ctx: Core.Context, values?: any): any | Core.HttpException;
}
export type DecoratorCallback = (ctx: Core.Context, values?: any) => void;
export type RequestMethodType = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT' | 'COPY' | 'LINK' | 'UNLINK' | 'PURGE' | 'LOCK' | 'UNLOCK' | 'PORPFIND' | 'VIEW'