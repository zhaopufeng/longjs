/**
 * @class Router
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */
import { IControllerConstructor } from '../Controller';
import { Core } from '@longjs/core';
import { Layer } from './Layer';
import { RegExpOptions } from 'path-to-regexp';
import { Stack } from './Stack';
export declare class Router {
    options: RouterOptions;
    layers: Layer[];
    constructor(options: RouterOptions);
    registerController(controller: IControllerConstructor): void;
    match(ctx: Core.Context): {
        layer: Layer;
        matches: Stack[];
    }[];
}
interface RouterOptions extends RegExpOptions {
    strict?: boolean;
    controllers?: IControllerConstructor[];
}
export {};
