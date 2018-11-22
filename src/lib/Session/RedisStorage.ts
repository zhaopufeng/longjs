/**
 * @class RedisStorage
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
import * as Redis from 'ioredis'
import { Core } from '../../'
import { Storage } from './Storage'
import { SessionOpts as Opts } from './'

export class RedisStorage extends Storage {
    public redis: Redis.Redis;
    constructor(options: Redis.RedisOptions = {}) {
        super()
        this.redis = new Redis(options)
    }

    public async get(sid: string): Promise<Core.Session> {
        let data = await this.redis.get(`SESSION:${sid}`);
        return JSON.parse(data)
    }

    public set(session: Core.Session, { sid =  this.getID(24), maxAge = 1000000}: SessionOpts): string {
        try {
            // Use redis set EX to automatically drop expired sessions
            this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000);
            return sid;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.log('Set session error:', e);
            }
        }
    }

    public async destroy(sid: string) {
        await this.redis.del(`SESSION:${sid}`);
    }
}

export interface SessionOpts extends Opts {
    sid?: string;
}