"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class RedisStorage
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
const Redis = require("ioredis");
const SessionStorage_1 = require("./SessionStorage");
class SessionRedisStorage extends SessionStorage_1.SessionStorage {
    constructor(options) {
        super();
        this.redis = options ? new Redis(options) : new Redis(options);
    }
    async get(sid) {
        let data = await this.redis.get(`SESSION:${sid}`);
        return {
            ...JSON.parse(data),
            sid
        };
    }
    async set(session, { sid = this.getID(24), maxAge = 1000000 }) {
        try {
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000);
        }
        catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.log('Set session error:', e);
            }
        }
        return sid;
    }
    async destroy(sid) {
        await this.redis.del(`SESSION:${sid}`);
    }
}
exports.SessionRedisStorage = SessionRedisStorage;
