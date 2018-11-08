/**
 * Controller Plugin
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */

import { Core, Plugin, HttpException } from '@longjs/core';
import { Router } from './lib/Router'
import { RegExpOptions } from 'path-to-regexp';
import { Stack } from './lib/Router/Stack';
import { Layer } from './lib/Router/Layer';

export default class ControllerPlugin implements Plugin {
    public readonly strict: boolean;
    public readonly router: Router;
    public readonly fileParseOpts: FileParseOpts;
    constructor(options: ControllerPluginOptions) {
        const { strict, controllers = [], fileParseOpts = {} } = options;
        this.strict = strict
        this.fileParseOpts = fileParseOpts;
        this.router = new Router({
            strict: true,
            controllers
        })
    }
    public init(options: Core.Options) {
        options.configs.routerConfig = options
    }

    public async response(ctx: Core.Context, config: any, data: IData) {
        const routes = this.router.match(ctx)
        for (let route of routes) {
            const { stacks, target, metadatas, propertys } = route
            propertys.forEach((property, key) => {
                const origin = target.prototype as any
                property.forEach((item) => {
                    const { callback, values } = item
                    if (typeof callback === 'function') {
                        origin[key] = callback(ctx, values)
                    }
                })
            })
            const controller = new target(...metadatas.map((Service) => new Service(ctx)))
            for (let stack of stacks) {
                const { headers = {}, propertyKey, exceptioncapture, responseType, statusCode, statusMessage, params, parameters } = stack
                try {
                    ctx.request.params = params || {}
                    const injectParameters: any = []
                    parameters.forEach((parameter) => {
                        const { callback, index, values } = parameter
                        if (typeof callback === 'function') {
                            injectParameters[index] = callback(ctx, values)
                        }
                    })
                    const data = await controller[propertyKey](...injectParameters)
                    if (data) {
                        ctx.body = data
                    }

                    Object.keys(headers).forEach((key) => {
                        ctx.response.set(key, headers[key])
                    })

                    if (statusCode) ctx.status = statusCode
                    if (statusMessage) ctx.message = statusMessage
                    if (responseType) ctx.type = responseType
                } catch (error) {
                    if (exceptioncapture.has('Exception')) {
                        const callback = exceptioncapture.get('Exception')
                        callback(error)
                    } else if (exceptioncapture.has('Catch')) {
                        const callback = exceptioncapture.get('Catch')
                        callback(error)
                    } else {
                        throw error;
                    }
                }
            }
        }
    }
}

export * from './lib'

export interface FileParseOpts {
    highWaterMark?: number;
    fileHwm?: number;
    defCharset?: string;
    preservePath?: boolean;
    limits?: {
        fieldNameSize?: number;
        fieldSize?: number;
        fields?: number;
        fileSize?: number;
        files?: number;
        parts?: number;
        headerPairs?: number;
    };
}

export interface ControllerPluginOptions extends RegExpOptions {
    controllers?: Array<{ new(...args: any[]): any }>;
    fileParseOpts?: FileParseOpts
}

interface IData {
    routes: Array<{
        layer: Layer,
        matches: Stack[]
    }>;
}