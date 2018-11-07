/**
 * Controller Plugin
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */
import { Core, Plugin } from '@longjs/core';
import { Router } from './lib/Router';
import { RegExpOptions } from 'path-to-regexp';
import { Stack } from './lib/Router/Stack';
import { Layer } from './lib/Router/Layer';
export default class ControllerPlugin implements Plugin {
    readonly strict: boolean;
    readonly router: Router;
    constructor(options: ControllerPluginOptions);
    init(options: Core.Options): void;
    handlerRequest(ctx: Core.Context, configs: any, data: IData): Promise<void>;
    handlerResponse(ctx: Core.Context, config: any, data: IData): Promise<void>;
}
export * from './lib';
export interface ControllerPluginOptions extends RegExpOptions {
    controllers: Array<{
        new (...args: any[]): any;
    }>;
}
interface IData {
    routes: Array<{
        layer: Layer;
        matches: Stack[];
    }>;
}
