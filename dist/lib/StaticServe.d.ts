/**
 * @class StaticServer
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 */
import { Options } from '../utils/send';
import { Server } from './Server';
export declare class StaticServe {
    opts: StaticServe.Opts;
    constructor(opts: StaticServe.Opts);
    handler(ctx: Server.Context): Promise<void>;
    deferHandler(ctx: Server.Context): Promise<void>;
}
export declare namespace StaticServe {
    interface Opts extends Options {
        defer?: boolean;
    }
}
