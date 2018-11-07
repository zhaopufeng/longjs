/**
 * @class Layer
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */
import * as assert from 'assert'
import { IControllerConstructor, IPropertys, IHandlers, RequestMethodType } from '../Decoraotors'
import { Stack } from './Stack'
import { Core } from '@longjs/core';

export class Layer {
    public readonly regexp: RegExp;
    public readonly path: string;
    public readonly target: IControllerConstructor;
    public readonly stacks: Stack[] = []
    public readonly metadatas: Array<{ new(...args: any[]): any }>;
    public readonly propertys: IPropertys;
    private strict: boolean;
    constructor(options: ILayer) {
        const { path = '', target, strict = false, metadatas = [], propertys = {}, handlers = {} } = options
        assert(path, 'Controller path Invalid: path is not defined.')
        assert(typeof path === 'string', 'Controller path Invalid: path is not string.')
        assert(path !== '', 'Controller path Invalid: path Cannot be empty.')
        this.path = path
        this.strict = strict
        this.regexp = RegExp(`^${path}`)
        this.target = target
        this.metadatas = metadatas
        this.propertys = propertys
        Object.keys(handlers).forEach((k) => {
            const { routePath = [], methodTypes = [], parameters = {}, methods = {}, headers = {}, statusCode, statusMessage, responseType, exceptioncapture = {} } = handlers[k]
            this.stacks.push(new Stack({
                propertyKey: k,
                routePath,
                strict,
                methods,
                parameters,
                methodTypes,
                root: path,
                statusCode,
                statusMessage,
                responseType,
                exceptioncapture,
                headers
            }))
        })
    }

    public matchRouter(ctx: Core.Context) {
        return this.stacks.filter((k) => k.matchRoutePath(ctx))
    }
}

export interface ILayer {
    path: string;
    target: IControllerConstructor;
    strict: boolean;
    metadatas: Array<{ new(...args: any[]): any }>;
    propertys: IPropertys;
    handlers: IHandlers;
}