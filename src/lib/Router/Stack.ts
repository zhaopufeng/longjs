/**
 * @class Layer
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */
import * as pathToRegExp from 'path-to-regexp'
import { Core } from '@longjs/core';
import { RequestMethodType, IMethods, IParameters, ExceptionCaptureCallback } from '../Decoraotors';
import { IncomingHttpHeaders } from 'http';

export interface IStack {
    propertyKey: string;
    routePath?: string[];
    strict: boolean;
    methodTypes: RequestMethodType[];
    methods: IMethods;
    parameters: IParameters;
    root: string;
    statusCode: number;
    statusMessage: string;
    responseType: string;
    headers: IncomingHttpHeaders;
    exceptioncapture: {
        [id: string]: ExceptionCaptureCallback;
    };
}

export interface IStackPath {
    regexp?: RegExp;
    routePath?: string;
    keys?: pathToRegExp.Key[];
}

export class Stack {
    public readonly propertyKey: string;
    public readonly root: string;
    public readonly methodTypes: RequestMethodType[];
    public readonly paths: IStackPath[] = []
    public readonly methods: IMethods;
    public readonly statusCode: number;
    public readonly statusMessage: string;
    public readonly responseType: string;
    public readonly exceptioncapture: { [id: string]: ExceptionCaptureCallback }
    public readonly parameters: IParameters;
    public readonly headers: IncomingHttpHeaders;
    private strict: boolean;
    constructor(options: IStack) {
        const { propertyKey, routePath, strict, parameters, headers = {}, methodTypes, methods, statusCode, statusMessage, responseType, exceptioncapture } = options
        this.propertyKey = options.propertyKey;
        this.root = options.root;
        this.methods = methods
        this.statusMessage = statusMessage
        this.statusCode = statusCode
        this.responseType = responseType
        this.exceptioncapture = exceptioncapture
        this.parameters = parameters
        this.headers = headers
        if (routePath.length === 0) options.routePath = [`/${propertyKey}`]
        options.routePath.forEach((k) => {
            if (!k || k === '') k = `/${propertyKey}`
            let keys: any[] = []
            let routePath = (this.root + k).replace(/[\/]{2,}/g, '/')
            let regexp = pathToRegExp(routePath, [] , { strict } )
            this.paths.push({
                keys,
                routePath,
                regexp
            })
        })
        this.strict = strict
        this.methodTypes = methodTypes
    }

    public matchRoutePath(ctx: Core.Context): boolean {
        const { method, path } = ctx
        const regexpFilters = this.paths.filter((k) => k.regexp.test(path))
        return Boolean(regexpFilters.length) && this.matchRouteMethodType(method as RequestMethodType)
    }

    public matchRouteMethodType(method: RequestMethodType): boolean {
        return !!~this.methodTypes.indexOf(method as RequestMethodType) || !!~this.methodTypes.indexOf('ALL')
    }
}