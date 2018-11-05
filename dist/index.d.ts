/**
 * @class StaticServer
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 */
/**
 * Module dependencies.
 */
import { Options } from './lib/send';
import { Core, Plugin } from '@longjs/core';
export default class StaticServer implements Plugin {
    opts: StaticServe.Opts;
    constructor(opts: StaticServe.Opts);
    init(options: Core.Options): void;
    handlerRequest(ctx: Core.Context): Promise<void>;
    handlerResponseAfter(ctx: Core.Context): Promise<void>;
}
export declare namespace StaticServe {
    interface Opts extends Options {
        defer?: boolean;
    }
}
