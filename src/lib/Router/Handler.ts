import { Stack, RequestMethodType } from './Stack'
import { Core } from 'src';
import { IncomingHttpHeaders } from 'http';
import { HttpException } from '../HttpException';
import { Key } from 'path-to-regexp'
export class Handler {
    public files: { [key: string]: Core.File | Core.File[] }
    public params: { [key: string]: any };
    public path: string;
    public regexp: RegExp;
    public keys: Key[]
    public statusCode: number;
    public parameters: any;
    public contentType: string;
    public headers: IncomingHttpHeaders;
    public method: RequestMethodType;
    public error: HttpException;
    public statusMessage: string;
    constructor(handlerOpts: Stack, context: Core.Context) {
        const { path, regexp, keys, statusCode, parameters, contentType, headers, method, error, statusMessage } = handlerOpts
        this.path = path
        this.regexp = regexp
        this.keys = keys
        this.statusCode = statusCode
        this.parameters = parameters
        this.contentType = contentType
        this.headers = headers
        this.method = method
        this.error = error
        this.statusMessage = statusMessage
        this.parseParams(context).parseFile(context)
    }
    private parseFile(context: Core.Context) {
        this.files = context.files
        return this;
    }
    private parseParams(context: Core.Context) {
        this.params = {}
        const origin = this.regexp.exec(context.path)
        this.keys.forEach((key, index) => {
            this.params[key.name] = origin[index + 1]
        })
        return this;
    }
}