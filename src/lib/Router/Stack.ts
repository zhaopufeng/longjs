import { IncomingHttpHeaders } from 'http';
import { Core } from 'src';
import * as pathToRegexp from 'path-to-regexp'
import { Layer } from './Layer';
import { HttpException } from '../HttpException';
import { Handler } from './Handler';

export class Stack {
    public path: string;
    public regexp: RegExp;
    public keys: pathToRegexp.Key[]
    public statusCode: number;
    public parameters: any;
    public contentType: string;
    public headers: IncomingHttpHeaders;
    public method: RequestMethodType;
    public error: HttpException;
    public statusMessage: string;
    constructor(options: StackOpts, public layer: Layer) {
        const { statusCode, parameters, headers, contentType, path, propertyKey, method, statusMessage} = options
        this.method = method
        this.statusCode = statusCode
        this.parameters = parameters
        this.headers = headers
        this.contentType = contentType
        this.statusMessage = statusMessage

        this.keys = []
        this.path = `/${layer.path}/${path !== '' && path ? path : propertyKey}`.replace(/[\/]{2,}/g, '')
        this.regexp = pathToRegexp(this.path, this.keys, layer.router.config)
    }
    public test(path: string, method: RequestMethodType) {
        return this.regexp.test(path) && (method === this.method || method === 'ALL')
    }
    public match(context: Core.Context) {
        if (this.test(context.path, context.method as RequestMethodType)) {
            return new Handler(this, context)
        }
    }
}

export interface StackOpts {
    path: string;
    propertyKey: string;
    method: RequestMethodType;
    statusCode?: number;
    parameters?: Map<string, Parameter>;
    headers?: IncomingHttpHeaders;
    contentType?: string;
    statusMessage?: string;
    error?: HttpException;
}

export interface Parameter {
    callback(ctx: Core.Context): void;
    values: any;
}

export type RequestMethodType = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT' | 'COPY' | 'LINK' | 'UNLINK' | 'PURGE' | 'LOCK' | 'UNLOCK' | 'PORPFIND' | 'VIEW'