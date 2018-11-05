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
    ControllerOptions,
    HttpException
} from '@longjs/Core'
import 'validator'
import 'reflect-metadata'
import validateParams, { ValidatorKeys, MimeDbTypes } from './lib';
import { IncomingHttpHeaders } from 'http';
import * as assert from 'assert'
import { extname } from 'path';
import { FileRule, FilesFieldRules, FileFieldRules, fileFieldRulesValidate, filesFieldRulesValidate, BaseFile } from './lib/files';

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
type Headers = IncomingHttpHeaders;
type HeadersDecorator = PropertyDecorator & ParameterDecorator
interface HeadersFnDecorator {
    (key: IncomingHttpHeaders ): ParameterDecorator
}
export const Headers = createPropertyAndParameterDecorator<any, HeadersDecorator & HeadersFnDecorator>('Headers', (ctx: Core.Context, value: { [K in keyof IncomingHttpHeaders]: string }) => {
    if (typeof value === 'object') {
        assert(!Array.isArray(value), 'Headers decorator parameter is not a object.')
        const { headers } = ctx
        const data: IncomingHttpHeaders = {}
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
export const Body = createPropertyAndParameterDecorator<ValidatorKeys>('Body', (ctx: Core.Context, validateKeys: ValidatorKeys) => {
    const data: Body = {}
    if (!Array.isArray(validateKeys) && typeof validateKeys ===  'object') {
        Object.keys(validateKeys).forEach((k: string) => {
            data[k] = ctx.body[k] || validateKeys[k].defalut
        })
        const errors = validateParams(data, validateKeys)
        if (Object.keys(errors).length > 0) {
            throw new HttpException({
                data: errors,
                message: 'Request Body data is not valid.'
            })
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
            throw new HttpException({
                data: errors,
                message: 'Request query string data is not valid.'
            })
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
            throw new HttpException({
                data: errors,
                message: 'Request path parameter data is not valid.'
            })
        }
        return data
    }
    return ctx.params
})

/**
 * Parameter && Property Decorator
 * Session
 */
export type Session<T = any>  = T;
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

export interface Files {
    [key: string]: BaseFile[];
}
/**
 * Parameter && Property Decorator
 * Files
 */
export const Files = createPropertyAndParameterDecorator<FilesFieldRules>('Files', (ctx: Core.Context, fieldRules: FilesFieldRules) => {
    if (fieldRules) {
        const result = filesFieldRulesValidate(ctx.files || {}, fieldRules)
        if (Object.keys(result.errors).length > 0) {
            throw new HttpException({
                message: 'The uploaded file Invalid.',
                data: result.errors
            })
        } else {
            return result.datas
        }
    }
    return ctx.files
})

export interface File {
    [key: string]: BaseFile;
}
/**
 * Parameter && Property Decorator
 * Files
 */
export const File = createPropertyAndParameterDecorator<FileFieldRules>('Files', (ctx: Core.Context, fieldRules: FileFieldRules) => {
    if (fieldRules) {
        const result = fileFieldRulesValidate(ctx.files || {}, fieldRules)
        if (Object.keys(result.errors).length > 0) {
            throw new HttpException({
                message: 'The uploaded file Invalid.',
                data: result.errors
            })
        } else {
            return result.datas
        }
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

/**
 * MethodDecorators
 * Header
 */
interface StatusDecorator {
    (statusCode: number): MethodDecorator;
}
export const Status = createMethodDecorator<any, any, StatusDecorator>((options, decorator, status) => {
    assert(typeof status === 'number', 'StatusCode is not an number.')
    const [ target, PropertyKey ] = decorator
    options.methods = options.methods = {}
    options.methods[PropertyKey] = options.methods[PropertyKey] = []
    const optionStatus = options.status = options.status || {}
    if (!optionStatus[PropertyKey]) optionStatus[PropertyKey] = status
    options.methods[PropertyKey].push({
        callback(ctx) {
            ctx.status = status
        },
        value: status
    })
    return options
})

/**
 * MethodDecorators
 * Type
 */
interface TypeDecorator {
    (type: MimeDbTypes): any;
}
export const Type = createMethodDecorator<any, any, TypeDecorator>((options, decorator, type) => {
    assert(typeof type === 'string', 'Response type is not an string.')
    const [ target, PropertyKey ] = decorator
    options.methods = options.methods = {}
    options.methods[PropertyKey] = options.methods[PropertyKey] = []
    const responseTypes = options.responseTypes = options.responseTypes || {}
    if (!responseTypes[PropertyKey]) responseTypes[PropertyKey] = type
    options.methods[PropertyKey].push({
        callback(ctx) {
            ctx.type = type
        },
        value: type
    })
    return options
})

/**
 * MethodDecorators
 * Header
 */
type Header = IncomingHttpHeaders
interface HeaderDecorator {
    (header: Header): MethodDecorator;
}
export const Header = createMethodDecorator<any, any, HeaderDecorator>((options, decorator, headers) => {
    assert(!Array.isArray(headers), 'Header cannot be an array.')
    assert(typeof headers === 'object', 'Header is not an object.')
    const [ target, PropertyKey ] = decorator
    options.methods = options.methods = {}
    options.methods[PropertyKey] = options.methods[PropertyKey] = []
    const optionsHeaders = options.headers = options.headers || {}
    if (!optionsHeaders[PropertyKey]) optionsHeaders[PropertyKey] = headers
    options.methods[PropertyKey].push({
        callback(ctx) {
            Object.keys(headers).forEach((key) => {
                ctx.response.set(key, headers[key])
            })
        },
        value: headers
    })
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
export * from './lib/files'