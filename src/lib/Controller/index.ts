import 'reflect-metadata'
import { IncomingHttpHeaders } from 'http'
import { Parameter } from '../Router/Stack'
import { createClassDecorator, createDecorator, IMethodDecoratorCallbackOptions, createRequestDecorator, StatusCode } from './decoraotors';
import * as assert from 'assert'
import { Core } from 'src';

export function Controller(path: string) {
    return createClassDecorator((options) => {
        const { target } = options
        // Set options metadata
        options.metadatas = Reflect.getMetadata('design:paramtypes', target) || []
        // Set options route root path
        options.path = path
    })
}

export function ContentType(type: string) {
    return createDecorator<MethodDecorator>('Type', (options: IMethodDecoratorCallbackOptions) => {
        options.contentType = type
    }, type)
}

export function StatusCode(statusCode: StatusCode) {
    return createDecorator<MethodDecorator>('Status', (options: IMethodDecoratorCallbackOptions) => {
        options.statusCode = statusCode
    }, statusCode)
}

export function StatusMessage(statusMessage: string) {
    return createDecorator<MethodDecorator>('Message', (options: IMethodDecoratorCallbackOptions) => {
        options.statusMessage = statusMessage
    })
}

export function Catch(ExceptionConstructor: Core.HttpExceptionConstructor) {
    return createDecorator<MethodDecorator>('Catch', (options: IMethodDecoratorCallbackOptions) => {
        options.exceptioncapture = ExceptionConstructor
    })
}

export function Exception(Exception: Core.HttpException) {
    return createDecorator<MethodDecorator>('Exception', (options: IMethodDecoratorCallbackOptions) => {
        options.exceptioncapture = Exception
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

export interface RequestResponseSessionDecorator {
    (target: Object, propertyKey: string): void;
    (target: Object, propertyKey: string, parameterIndex: number): void;
}