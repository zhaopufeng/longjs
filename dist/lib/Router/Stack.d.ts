/// <reference types="node" />
/**
 * @class Layer
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */
import * as pathToRegExp from 'path-to-regexp';
import { Core } from '@longjs/core';
import { RequestMethodType, IMethods, IParameters, ExceptionCaptureCallback } from '../Controller';
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
export declare class Stack {
    readonly propertyKey: string;
    readonly root: string;
    readonly methodTypes: RequestMethodType[];
    readonly paths: IStackPath[];
    readonly methods: IMethods;
    readonly statusCode: number;
    readonly statusMessage: string;
    readonly responseType: string;
    readonly exceptioncapture: {
        [id: string]: ExceptionCaptureCallback;
    };
    readonly parameters: IParameters;
    readonly headers: IncomingHttpHeaders;
    private strict;
    constructor(options: IStack);
    matchRoutePath(ctx: Core.Context): boolean;
    matchRouteMethodType(method: RequestMethodType): boolean;
}
