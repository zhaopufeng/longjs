/**
 * @class MatchStack
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */

import * as pathToRegExp from 'path-to-regexp'
import { IMethod, ExceptionCaptureCallback, IParameter } from '../decoraotors';
import { IncomingHttpHeaders } from 'http';

export class MatchStack {
    public readonly regexp: RegExp;
    public readonly path: string;
    public readonly keys: pathToRegExp.Key[];
    public readonly methods: Map<string, IMethod>;
    public readonly statusCode: number;
    public readonly responseType: string;
    public readonly exceptioncapture: Map<string, ExceptionCaptureCallback>
    public readonly parameters: Map<string, IParameter>;
    public readonly headers: IncomingHttpHeaders;
    public readonly strict: boolean;
    public readonly propertyKey: string;
    public readonly statusMessage: string;
    public params: { [key: string]: any };
    constructor(options: IMatchStackOptions) {
        console.log(options.params)
        this.regexp = options.regexp
        this.path = options.path
        this.keys = options.keys
        this.methods = options.methods
        this.statusCode = options.statusCode
        this.propertyKey = options.propertyKey
        this.statusMessage = options.statusMessage
        this.parameters = options.parameters
        this.responseType = options.responseType
        this.exceptioncapture = options.exceptioncapture
        this.headers = options.headers
        this.strict = options.strict
        this.params = options.params
    }
}

export interface IMatchStackOptions {
    regexp: RegExp;
    path: string;
    keys: pathToRegExp.Key[];
    methods: Map<string, IMethod>;
    statusCode: number;
    responseType: string;
    exceptioncapture: Map<string, ExceptionCaptureCallback>
    parameters: Map<string, IParameter>;
    headers: IncomingHttpHeaders;
    strict: boolean;
    propertyKey: string;
    params: { [key: string]: any };
    statusMessage: string;
}