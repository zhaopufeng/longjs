/**
 * @class CreateSession
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-14 10:04
 */
import { SessionStorage } from './lib/SessionStorage';
import { SetOption } from 'cookies';
import { Core, Plugin } from '@longjs/core';
export default class Session implements Plugin {
    opts: SessionOpts;
    sessions: any;
    constructor(opts?: SessionOpts);
    handlerRequest(ctx: Core.Context, configs: any): Promise<void>;
    handlerResponseAfter(ctx: Core.Context): Promise<void>;
}
export interface SessionOpts extends SetOption {
    key?: string;
    store?: SessionStorage;
    signed?: boolean;
}
export * from './lib/SessionStorage';
export * from './lib/SessionRedisStorage';
