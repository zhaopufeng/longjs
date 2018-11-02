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
    createRequestDecorator,
    createHttpExceptionDecorator,
    createPropertyAndParameterDecorator,
    Core
} from '@longjs/Core'
import 'validator'
import 'reflect-metadata'
import validateParams, { ValidatorKeys } from './lib';

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
 * Parameter && Property Decorator
 * Header
 */
export interface Headers {
    [key: string]: any;
}
export const Headers = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string[]) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = ctx.headers[k]
        })
        return data
    }
    return ctx.headers
})

/**
 * Parameter && Property Decorator
 * Body
 */
export type Body<T = any> = T;
export const Body = createPropertyAndParameterDecorator<ValidatorKeys>('Body', (ctx: Core.Context, validateKeys: ValidatorKeys) => {
    const data: Body = {}
    if (!Array.isArray(validateKeys) && typeof validateKeys ===  'object') {
        Object.keys(validateKeys).forEach((k: string) => {
            data[k] = ctx.body[k] || validateKeys[k].defalut
        })
        const errors = validateParams(data, validateKeys)
        if (Object.keys(errors).length > 0) {
            const error: Core.HttpException & Error = new Error('Request Body data is not valid.')
            error.errors = errors
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
            error.errors = errors
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
            error.errors = errors
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
export const Session = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string[]) => {
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
export const Request = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string[]) => {
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
export const Response = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string[]) => {
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
 * Type
 */
export const Type = createMethodDecorator<string>((ctx, options) => {
    const { value } = options.descriptor
    options.descriptor.value = async function(...args: any[]) {
        let data = await value.call(this, ...args)
        if (data) {
            ctx.type = options.arg
        }
        return data
    }
})

/**
 * MethodDecorators
 * Status
 */
export const Status = createMethodDecorator<string>((ctx, options) => {
    const { value } = options.descriptor
    options.descriptor.value = async function(...args: any[]) {
        let data = await value.call(this, ...args)
        if (data) {
            ctx.status = options.arg
        }
        return data
    }
})

/**
 * MethodDecorators
 * Catch
 */
export const Catch = createHttpExceptionDecorator<Core.HttpErrorConstructor>((ctx, options, error) => {
    throw new options.arg(error)
})

/**
 * RequestMethodDecorators
 * Get
 */
export const Get = createRequestDecorator<string>('GET')

/**
 * RequestMethodDecorators
 * All
 */
export const All = createRequestDecorator<string>('ALL')

/**
 * RequestMethodDecorators
 * Delete
 */
export const Delete = createRequestDecorator<string>('DELETE')

/**
 * RequestMethodDecorators
 * Head
 */
export const Head = createRequestDecorator<string>('HEAD')

/**
 * RequestMethodDecorators
 * Options
 */
export const Options = createRequestDecorator<string>('OPTIONS')

/**
 * RequestMethodDecorators
 * Patch
 */
export const Patch = createRequestDecorator<string>('PATCH')

/**
 * RequestMethodDecorators
 * Post
 */
export const Post = createRequestDecorator<string>('POST')

/**
 * RequestMethodDecorators
 * Put
 */
export const Put = createRequestDecorator<string>('PUT')

export * from './lib'