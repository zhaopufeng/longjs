/**
 * @class CreateSession
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-14 10:04
 */
import { SessionStorage } from './SessionStore';
import { SetOption } from 'cookies';
import { Core } from '..';
export declare class CreateSession {
    opts: SessionOpts;
    key: string;
    store: SessionStorage;
    sessions: any;
    constructor(opts?: SessionOpts);
    create(ctx: Core.Context): Promise<void>;
    reset(ctx: Core.Context): Promise<void>;
}
export interface SessionOpts extends SetOption {
    key?: string;
    store?: SessionStorage;
    signed?: boolean;
}
