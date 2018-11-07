/**
 * Controller Plugin
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */

import { Core, Plugin } from '@longjs/core';
import { createClassDecorator, Options, IControllerConstructor } from './lib';
import { Router } from './lib/Router'
import { RouterOptions } from 'express';
import { RegExpOptions } from 'path-to-regexp';
import { Stack } from './lib/Router/Stack';
import { Layer } from './lib/Router/Layer';

export default class ControllerPlugin implements Plugin {
    public readonly strict: boolean;
    public readonly router: Router;
    constructor(options: ControllerPluginOptions) {
        const { strict, controllers } = options;
        this.strict = strict
        this.router = new Router({
            strict: true,
            controllers
        })
    }
    public init(options: Core.Options) {
        options.configs.routerConfig = options
    }

    public async handlerRequest(ctx: Core.Context, configs: any, data: IData) {
        const routes =  data.routes = this.router.match(ctx)
    }

    public async handlerResponse(ctx: Core.Context, config: any, data: IData) {
        const { routes } = data

        for (let route of routes) {
            const { layer, matches } = route
            const { target, metadatas = [], propertys = {} } = layer
            Object.keys(propertys).forEach((k) => {
                if (propertys[k]) {
                    Object.keys(propertys[k]).forEach((key) => {
                        if (propertys[k][key]) {
                            const { callback, values } = propertys[k][key]
                            if (typeof callback === 'function') {
                                if (typeof (target as any).prototype[k] !== 'function' ) {
                                    (target as any).prototype[k] = callback(ctx, values)
                                }
                            }
                        }
                    })
                }
            })
            const controller = new target(...metadatas.map((K) => new K(ctx)))
            for (let matche of matches) {
                const { propertyKey, statusCode, responseType, statusMessage, headers = {}, parameters = {}, exceptioncapture = {} } = matche
                try {
                    const injectParameters: any = []
                    Object.keys(parameters).forEach((k) => {
                        injectParameters[parameters[k].index] = parameters[k].callback(ctx, parameters[k].values)
                    })
                    let data = await controller[propertyKey](...injectParameters)
                    if (data) {
                        if (statusCode) ctx.status = statusCode
                        if (responseType) ctx.type = responseType
                        if (statusMessage) ctx.response.message = statusMessage
                        ctx.body = data
                    }
                    if (headers) {
                        Object.keys(headers).forEach((key) => {
                            ctx.response.set(key, headers[key])
                        })
                    }
                } catch (error) {
                    const catchs = exceptioncapture['Catch']
                    const exception = exceptioncapture['Exception']
                    if (catchs) {
                        catchs(error)
                    } else if (exception) {
                        exception(error)
                    } else {
                        throw error
                    }
                }
            }
        }
    }
}

export * from './lib'

export interface ControllerPluginOptions extends RegExpOptions {
    controllers: Array<{ new(...args: any[]): any }>;
}

interface IData {
    routes: Array<{
        layer: Layer,
        matches: Stack[]
    }>;
}