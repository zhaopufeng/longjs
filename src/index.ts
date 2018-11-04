/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */

import {
    createClassDecorator,
    createMethodDecorator,
    createParameterDecorator,
    createPropertyDecorator,
    createRequestMethodDecorator,
    createHttpExceptionCaptureDecorator,
    createPropertyAndParameterDecorator,
    Core,
    ControllerOptions
} from '@longjs/Core'
import 'validator'
import 'reflect-metadata'
import validateParams, { ValidatorKeys } from './lib';
import { IncomingHttpHeaders } from 'http';
import * as assert from 'assert'

/**
 * Controller Decorator
 * @param path
 */
export function Controller(path: string): ClassDecorator {
    return createClassDecorator((options) => {
        const { target } = options
        // Set options metadata
        options.metadatas = Reflect.getMetadata('design:paramtypes', target) || []
        // Set options route root path
        options.route = (path + '/').replace(/[\/]{2,}/g, '/')
    })
}

/**
 * HeadersDecorator
 */
export interface Headers {
    [key: string]: any;
}
type HeadersDecorator = PropertyDecorator & ParameterDecorator
interface HeadersFnDecorator {
    (key: { [K in keyof IncomingHttpHeaders]: string }): ParameterDecorator
}
export const Headers = createPropertyAndParameterDecorator<any, HeadersDecorator & HeadersFnDecorator>('Headers', (ctx: Core.Context, value: { [K in keyof IncomingHttpHeaders]: string }) => {
    if (typeof value === 'object') {
        assert(!Array.isArray(value), 'Headers decorator parameter is not a object.')
        const { headers } = ctx
        const data: { [K in keyof IncomingHttpHeaders]: string } = {}
        const errors: any = {}
        Object.keys(value).forEach((k) => {
            if (headers[k] !== value[k]) {
                errors[k] = value[k]
            } else {
                data[k] = value[k]
            }
        })

        if (Object.keys(errors).length > 0) {
            const error: Core.HttpException & Error = new Error('Authentication Failed on http request headers.')
            error.data = errors
            throw error
        }
        return data
    }
    return ctx.headers
})

/**
 * Parameter && Property Decorator
 * Body
 */
export type Body<T = any> = T;
export const Body = createPropertyAndParameterDecorator<number>('Body', (ctx: Core.Context, validateKeys: ValidatorKeys) => {
    const data: Body = {}
    if (!Array.isArray(validateKeys) && typeof validateKeys ===  'object') {
        Object.keys(validateKeys).forEach((k: string) => {
            data[k] = ctx.body[k] || validateKeys[k].defalut
        })
        const errors = validateParams(data, validateKeys)
        if (Object.keys(errors).length > 0) {
            const error: Core.HttpException & Error = new Error('Request Body data is not valid.')
            error.data = errors
            throw error
        }
        return data
    }

    return ctx.body
})

/**
 * Parameter && Property Decorator
 * Query
 */
export type Query<T = any> = T;
export const Query = createPropertyAndParameterDecorator<ValidatorKeys>('Query', (ctx: Core.Context, validateKeys: ValidatorKeys) => {
    const data: Query = {}
    if (!Array.isArray(validateKeys) && typeof validateKeys ===  'object') {
        Object.keys(validateKeys).forEach((k: string) => {
            data[k] = ctx.query[k] || validateKeys[k].defalut
        })
        const errors = validateParams(data, validateKeys)
        if (Object.keys(errors).length > 0) {
            const error: Core.HttpException & Error = new Error('Request query string data is not valid.')
            error.data = errors
            throw error
        }
        return data
    }
    return ctx.query
})

/**
 * Parameter && Property Decorator
 * Request
 */
export type Params<T = any> = T;
export const Params = createPropertyAndParameterDecorator<ValidatorKeys>('Params', (ctx: Core.Context, validateKeys: ValidatorKeys): Params => {
    const data: Params = {}
    if (!Array.isArray(validateKeys) && typeof validateKeys ===  'object') {
        Object.keys(validateKeys).forEach((k: string) => {
            data[k] = ctx.params[k] || validateKeys[k].defalut
        })
        const errors = validateParams(data, validateKeys)
        if (Object.keys(errors).length > 0) {
            const error: Core.HttpException & Error = new Error('Request path parameter data is not valid.')
            error.data = errors
            throw error
        }
        return data
    }
    return ctx.params
})

/**
 * Parameter && Property Decorator
 * Session
 */
export interface Session {
    [key: string]: any;
}
export const Session = createPropertyAndParameterDecorator<string[]>('Session', (ctx: Core.Context, args: string[]) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = ctx.session[k]
        })
        return data
    }
    return ctx.session
})

/**
 * Parameter && Property Decorator
 * Request
 */
export type Request = Core.Request
export const Request = createPropertyAndParameterDecorator<string[]>('Request', (ctx: Core.Context, args: string[]) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = (ctx.request as any)[k]
        })
        return data
    }
    return ctx.request
})

/**
 * Parameter && Property Decorator
 * Request
 */
export type Response = Core.Response
export const Response = createPropertyAndParameterDecorator<string[]>('Response', (ctx: Core.Context, args: string[]) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = (ctx.response as any)[k]
        })
        return data
    }
    return ctx.response
})

/**
 * Parameter && Property Decorator
 * Files
 */
export interface Files {
    [key: string]: any;
}
export const Files = createPropertyAndParameterDecorator<string[]>('Files', (ctx: Core.Context, args: string[]) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = ctx.files[k]
        })
        return data
    }
    return ctx.files
})

/**
 * MethodDecorators
 * Catch
 */
export const Catch = createHttpExceptionCaptureDecorator<Core.HttpExceptionConstructor>()

/**
 * MethodDecorators
 * HttpException
 */
export const Exception = createHttpExceptionCaptureDecorator<Core.HttpException>()

// Status
export const Status = createMethodDecorator<any, any, any>((options, decorator, headers) => {
    const [ target, PropertyKey ] = decorator
    options.methods = options.methods = {}
    options.methods[PropertyKey] = options.methods[PropertyKey] = {}
    options.methods[PropertyKey].callback = function(ctx) {
        assert(!Array.isArray(headers), 'Header cannot be an array.')
        assert(typeof headers === 'object', 'Header is not an object.')
        Object.keys(headers).forEach((key) => {
            ctx.response.set(key, headers[key])
        })
    }
    options.methods[PropertyKey].value = headers
    return options
})

/**
 * MethodDecorators
 * Header
 */
type Header = { [K in keyof IncomingHttpHeaders]: string; }
interface HeaderDecorator {
    (header: Header): any;
}
export const Header = createMethodDecorator<any, any, HeaderDecorator>((options, decorator, headers) => {
    const [ target, PropertyKey ] = decorator
    options.methods = options.methods = {}
    options.methods[PropertyKey] = options.methods[PropertyKey] = {}
    options.methods[PropertyKey].callback = function(ctx) {
        assert(!Array.isArray(headers), 'Header cannot be an array.')
        assert(typeof headers === 'object', 'Header is not an object.')
        Object.keys(headers).forEach((key) => {
            ctx.response.set(key, headers[key])
        })
    }
    options.methods[PropertyKey].value = headers
    return options
})

/**
 * RequestMethodDecorators
 * Get
 */
export const Get = createRequestMethodDecorator('GET')

/**
 * RequestMethodDecorators
 * All
 */
export const All = createRequestMethodDecorator('ALL')

/**
 * RequestMethodDecorators
 * Delete
 */
export const Delete = createRequestMethodDecorator('DELETE')

/**
 * RequestMethodDecorators
 * Head
 */
export const Head = createRequestMethodDecorator('HEAD')

/**
 * RequestMethodDecorators
 * Options
 */
export const Options = createRequestMethodDecorator('OPTIONS')

/**
 * RequestMethodDecorators
 * Patch
 */
export const Patch = createRequestMethodDecorator('PATCH')

/**
 * RequestMethodDecorators
 * Post
 */
export const Post = createRequestMethodDecorator('POST')

/**
 * RequestMethodDecorators
 * Put
 */
export const Put = createRequestMethodDecorator('PUT')

/**
 * RequestMethodDecorators
 * Copy
 */
export const Copy = createRequestMethodDecorator('COPY')

/**
 * RequestMethodDecorators
 * Link
 */
export const Link = createRequestMethodDecorator('LINK')

/**
 * RequestMethodDecorators
 * Unlink
 */
export const Unlink = createRequestMethodDecorator('UNLINK')

/**
 * RequestMethodDecorators
 * Purge
 */
export const Purge = createRequestMethodDecorator('PURGE')

/**
 * RequestMethodDecorators
 * Lock
 */
export const Lock = createRequestMethodDecorator('LOCK')

/**
 * RequestMethodDecorators
 * Unlock
 */
export const Unlock = createRequestMethodDecorator('UNLOCK')

/**
 * RequestMethodDecorators
 * Porpfind
 */
export const Porpfind = createRequestMethodDecorator('PORPFIND')

/**
 * RequestMethodDecorators
 * View
 */
export const View = createRequestMethodDecorator('VIEW')

export * from './lib'