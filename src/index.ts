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
    createPropertyAndParameterDecorator,
    Core
} from '@longjs/Core'

import 'reflect-metadata'
import * as Knex from 'knex'

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

export interface Headers {
    [key: string]: any;
}
/**
 * Parameter && Property Decorator
 * Header
 */
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
export interface Body {
    [key: string]: any;
}
export const Body = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string[]) => {
    if (Array.isArray(ctx.body)) return ctx.body;
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = ctx.body[k]
        })
        return data
    }
    return ctx.body
})

/**
 * Parameter && Property Decorator
 * Query
 */
export interface Query {
    [key: string]: any;
}
export const Query = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string[]) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = ctx.query[k]
        })
        return data
    }
    return ctx.query
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
 * Database
 */
export type Database = Knex
export type DatabaseQuery = Knex.QueryInterface
export const Database = createPropertyAndParameterDecorator<string>((ctx: Core.Context, args: string, configs) => {
    if (args && configs.database) {
        return Knex(configs.database)(args)
    }
    return Knex(configs.database)
})

/**
 * Parameter && Property Decorator
 * Request
 */
export type Request = Core.Request
export const Request = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string, configs) => {
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
export const Response = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string, configs) => {
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
 * Request
 */
export interface Params {
    [key: string]: any;
}
export const Params = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string, configs) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = (ctx.params as any)[k]
        })
        return data
    }
    return ctx.params
})

/**
 * Parameter && Property Decorator
 * Files
 */
export interface Files {
    [key: string]: any;
}
export const Files = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string[]) => {
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
export const Type = createMethodDecorator((ctx: Core.Context, options: any, configs?: Core.Configs) => {
    ctx.type = options.arg
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