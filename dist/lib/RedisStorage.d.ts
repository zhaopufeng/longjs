/**
 * @class RedisStorage
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
import * as Redis from 'ioredis';
import { Core, SessionStorage } from '@longjs/core';
import { SessionOpts as Opts } from '@longjs/core/dist/lib/CreateSession';
export declare class RedisStorage extends SessionStorage {
    redis: Redis.Redis;
    constructor(options?: Redis.RedisOptions);
    get(sid: string): Promise<Core.Session>;
    set(session: Core.Session, { sid, maxAge }: SessionOpts): Promise<string>;
    destroy(sid: string): Promise<void>;
}
export interface SessionOpts extends Opts {
    sid?: string;
}
