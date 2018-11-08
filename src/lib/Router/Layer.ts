/**
 * @class Layer
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */
import * as assert from 'assert'
import { IControllerConstructor, IPropertys, IHandler } from '../decoraotors'
import { Stack } from './Stack'
import { Core } from '@longjs/core';
import { MatchLayer } from './MatchLayer';
import { MatchStack } from './MatchStack';

export class Layer {
    public readonly regexp: RegExp;
    public readonly path: string;
    public readonly target: IControllerConstructor;
    public readonly stacks: Stack[] = []
    public readonly metadatas: Array<{ new(...args: any[]): any }>;
    public readonly propertys: Map<string, IPropertys>;
    private strict: boolean;
    constructor(options: ILayer) {
        const { path = '', target, strict = false, metadatas = [], propertys = new Map<string, IPropertys>(), handlers = new Map<string, IHandler>() } = options
        assert(path, 'Controller path Invalid: path is not defined.')
        assert(typeof path === 'string', 'Controller path Invalid: path is not string.')
        assert(path !== '', 'Controller path Invalid: path Cannot be empty.')
        this.path = path
        this.strict = strict
        this.regexp = RegExp(`^${path}`)
        this.target = target
        this.metadatas = metadatas
        this.propertys = propertys
        handlers.forEach((handler, propertyKey) => {
            const { routePath, parameters, methods, headers, statusCode, statusMessage, responseType, exceptioncapture } = handler
            this.stacks.push(new Stack({
                propertyKey,
                routePath,
                strict,
                methods,
                parameters,
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
        const matches: MatchStack[] = []
        const { path, strict, metadatas, propertys, target } = this
        this.stacks.forEach((k) => {
            const stack = k.matchRoutePath(ctx)
            if (stack.length > 0) {
                matches.push(...stack)
            }
            return;
        })
        if (matches.length > 0) {
            return new MatchLayer({
                stacks: matches,
                path,
                strict,
                metadatas,
                propertys,
                target
            })
        } else {
            return;
        }
    }
}

export interface ILayer {
    path: string;
    target: IControllerConstructor;
    strict: boolean;
    metadatas: Array<{ new(...args: any[]): any }>;
    propertys: Map<string, IPropertys>;
    handlers: Map<string, IHandler>;
}