import * as Redis from 'ioredis'
import { randomBytes } from 'crypto'
import { Core, SessionStorage } from '@longjs/core';

export class RedisStore implements SessionStorage {
    public redis: Redis.Redis;
    constructor() {
        this.redis = new Redis();
    }

    public getID(length: number): string {
        return randomBytes(length).toString('hex');
    }

    public async get(sid: string): Promise<Core.Session> {
        let data = await this.redis.get(`SESSION:${sid}`);
        return {
            ...JSON.parse(data),
            sid
        }
    }

    public async set(session: Core.Session, { sid =  this.getID(24), maxAge = 1000000}: any) {
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

    async destroy(sid: string) {
        return await this.redis.del(`SESSION:${sid}`);
    }
}