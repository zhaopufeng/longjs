/**
 * @class RedisStorage
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
import * as Redis from 'ioredis'
import { Core } from '@longjs/core'
import { SessionStorage } from './SessionStorage'
import { SessionOpts as Opts } from '../'

export class SessionRedisStorage extends SessionStorage {
    public redis: Redis.Redis;
    constructor(options?: Redis.RedisOptions) {
        super()
        this.redis = options ? new Redis(options) : new Redis(options)
    }

    public async get(sid: string): Promise<Core.Session> {
        let data = await this.redis.get(`SESSION:${sid}`);
        return {
            ...JSON.parse(data),
            sid
        }
    }

    public async set(session: Core.Session, { sid =  this.getID(24), maxAge = 1000000}: SessionOpts): Promise<string> {
        try {
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.log('Set session error:', e);
            }
        }
        return sid;
    }

    public async destroy(sid: string) {
        await this.redis.del(`SESSION:${sid}`);
    }
}

export interface SessionOpts extends Opts {
    sid?: string;
}