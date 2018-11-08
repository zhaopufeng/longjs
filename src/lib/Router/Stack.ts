/**
 * @class Stack
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */
import * as pathToRegExp from 'path-to-regexp'
import { Core } from '@longjs/core';
import { RequestMethodType, IMethod, IParameter, ExceptionCaptureCallback } from '../decoraotors';
import { IncomingHttpHeaders } from 'http';
import { MatchStack } from './MatchStack';

export interface IStack {
    propertyKey: string;
    routePath?: Map<string, Set<RequestMethodType>>;
    strict: boolean;
    methods: Map<string, IMethod>;
    parameters: Map<string, IParameter>;
    root: string;
    statusCode: number;
    statusMessage: string;
    responseType: string;
    headers: IncomingHttpHeaders;
    exceptioncapture: Map<string, ExceptionCaptureCallback>
}

export interface IStackPath {
    routePath?: string;
    keys?: pathToRegExp.Key[];
    methodTypes?: Set<RequestMethodType>;
}

export class Stack {
    public readonly propertyKey: string;
    public readonly root: string;
    public readonly paths: Map<RegExp, IStackPath> = new Map()
    public readonly methods: Map<string, IMethod>;
    public readonly statusCode: number;
    public readonly statusMessage: string;
    public readonly responseType: string;
    public readonly exceptioncapture: Map<string, ExceptionCaptureCallback>
    public readonly parameters: Map<string, IParameter>;
    public readonly headers: IncomingHttpHeaders;
    private strict: boolean;
    constructor(options: IStack) {
        const {
            propertyKey,
            routePath = new Map<string, Set<RequestMethodType>>(),
            strict,
            parameters = new Map<string, IParameter>(),
            headers = {},
            methods = new Map<string, IMethod>(),
            statusCode,
            statusMessage,
            responseType,
            exceptioncapture = new Map(),
            root
        } = options
        this.propertyKey = propertyKey;
        this.root = root;
        this.methods = methods
        this.statusMessage = statusMessage
        this.statusCode = statusCode
        this.responseType = responseType
        this.exceptioncapture = exceptioncapture
        this.parameters = parameters
        this.headers = headers
        this.strict = strict
        routePath.forEach((k, key) => {
            if (!key || key === '') key = `/${propertyKey}`
            key = (root + key).replace(/[\/]{2,}/g, '/')
            const keys: pathToRegExp.Key[] = []
            const regexp = pathToRegExp(key, keys, { strict })
            this.paths.set(regexp, {
                keys,
                routePath: key,
                methodTypes: k
            })
        })
    }

    public matchRoutePath(ctx: Core.Context): MatchStack[] {
        const { method, path } = ctx
        const matches: MatchStack[] = []
        const { methods, statusCode, responseType, exceptioncapture, parameters, headers, strict, propertyKey, statusMessage } = this
        this.paths.forEach((k, regexp) => {
            if (regexp.test(path)  && (k.methodTypes.has('ALL') || k.methodTypes.has(method as RequestMethodType))) {
                const { keys, routePath } = k
                const params: { [key: string]: any} = {}
                const data = regexp.exec(path)
                keys.forEach((k, i) => {
                    params[k.name] = data[i]
                })
                matches.push(new MatchStack({
                    params,
                    regexp,
                    path: routePath,
                    keys: keys,
                    methods,
                    statusCode,
                    responseType,
                    exceptioncapture,
                    parameters,
                    statusMessage,
                    propertyKey,
                    headers,
                    strict
                }))
            }
        })
        return matches
    }
}