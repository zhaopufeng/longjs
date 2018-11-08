import {
    createDecorator,
    createClassDecorator,
    IMethodDecoratorCallbackOptions,
    createRequestDecorator,
    createCombinedDecorator
} from './decoraotors'
import { Core, HttpException } from '@longjs/core';
import * as assert from 'assert'
import { IncomingHttpHeaders } from 'http2';
import { ValidationRule } from '../validator';
import validateParams from '../validator/field';

export function Controller(path: string) {
    return createClassDecorator((options) => {
        const { target } = options
        // Set options metadata
        options.metadatas = Reflect.getMetadata('design:paramtypes', target) || []
        // Set options route root path
        options.path = path
    })
}

export function Type(type: string) {
    return createDecorator<MethodDecorator>('Type', (options: IMethodDecoratorCallbackOptions) => {
        options.callback = function() {
            return;
        }
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

export type Body<T = { [key: string]: any }> = T
export const Body = createCombinedDecorator<BodyQueryParamsDecorator>('Body', (ctx: Core.Context, validateKeys: any) => {
    // Not allow GET DELETE HEAD COPY PURGE UNLOCK request method
    if (!/(GET|DELETE|HEAD|COPY|PURGE|UNLOCK)/.test(ctx.method)) {
        if (validateKeys) {
            const data: Body = {}
            if (!Array.isArray(validateKeys) && typeof validateKeys ===  'object') {
                Object.keys(validateKeys).forEach((k: string) => {
                    data[k] = ctx.body[k] || validateKeys[k].defalut
                })
                const errors = validateParams(data, validateKeys)
                if (Object.keys(errors).length > 0) {
                    throw new HttpException({
                        data: errors,
                        message: 'Error Invalid: Request Body data.'
                    })
                }
                return data
            }
        }
    }
    if (!validateKeys) return ctx.body
})

export type Query<T = { [key: string]: any }> = T
export const Query = createCombinedDecorator<BodyQueryParamsDecorator>('Query', (ctx: Core.Context, validateKeys: any) => {
    if (validateKeys) {
        const data: Query = {}
        if (!Array.isArray(validateKeys) && typeof validateKeys ===  'object') {
            Object.keys(validateKeys).forEach((k: string) => {
                data[k] = ctx.query[k] || validateKeys[k].defalut
            })
            const errors = validateParams(data, validateKeys)
            if (Object.keys(errors).length > 0) {
                throw new HttpException({
                    data: errors,
                    message: 'Error Invalid: Request query string data.'
                })
            }
            return data
        }
    }
    return ctx.query
})

export type Params<T = { [key: string]: any }> = T
export const Params = createCombinedDecorator<BodyQueryParamsDecorator>('Params', (ctx: Core.Context, validateKeys: any) => {
    if (validateKeys) {
        if (Object.keys(ctx.params).length > 0) {
            const data: Query = {}
            if (!Array.isArray(validateKeys) && typeof validateKeys ===  'object') {
                Object.keys(validateKeys).forEach((k: string) => {
                    data[k] = ctx.params[k] || validateKeys[k].defalut
                })
                const errors = validateParams(data, validateKeys)
                if (Object.keys(errors).length > 0) {
                    throw new HttpException({
                        data: errors,
                        message: 'Params invalid: This router path params mismatch.'
                    })
                }
                return data
            }
        } else {
            throw new HttpException({
                message: 'Behavior invalid: This router path is not dynamic route matching.'
            })
        }
    }
    return ctx.params
})

// export interface FileDecorator {
//     (rules: ): ParameterDecorator;
//     (target: Object, propertyKey: string): void;
// }
// export type File<T = { [key: string]: any }> = T
// export const File = createCombinedDecorator<FileDecorator>('File', (ctx: Core.Context, values: any) => {
//     return;
// })

// export interface FilesDecorator {
//     (rules: FileRule): ParameterDecorator;
//     (target: Object, propertyKey: string): void;
// }
// export type Files<T = { [key: string]: any }> = T
// export const Files = createCombinedDecorator<FileDecorator>('Files', (ctx: Core.Context, values: any) => {
//     if (!/(GET|DELETE|HEAD|COPY|PURGE|UNLOCK)/.test(ctx.method)) {
//         // const bus = new Busboy({ headers: ctx.req.headers })
//         // bus.on('file', function(fieldname, file, filename, encoding, mimetype) {
//         //     console.log(fieldname)
//         // })

//         // ctx.req.pipe(bus)
//     }
//     return ctx.files
// })

/**
 * RequestDecorators
 */
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

export * from './decoraotors'

/**
 * Interfaces
 * DecoratorCallbacks
 */

export interface RequestResponseSessionDecorator {
    (target: Object, propertyKey: string): void;
    (target: Object, propertyKey: string, parameterIndex: number): void;
}

export interface BodyQueryParamsDecorator {
    (rules: ValidationRule): ParameterDecorator;
    (target: Object, propertyKey: string): void;
}

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