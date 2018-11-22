/**
 * @class CreateSession
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-14 10:04
 */

import { Storage } from './Storage'
import { SetOption, GetOption } from 'cookies'
import { Core } from '../../'
import { RedisOptions } from 'ioredis';
import { RedisStorage } from './RedisStorage';
import { HttpException } from '../HttpException';

export default class Session {
    public storage: Storage;
    constructor(public opts: SessionOpts = {}) {
        opts.signed = true
        opts.key = opts.key || 'ssid'
        const { redis } = opts
        if (redis) {
            const storage = new RedisStorage(redis)
            this.storage = storage
            storage.redis.on('error', (e) => {
                storage.redis.disconnect()
                throw new HttpException({
                    message: 'Error: Connect redis fail!',
                    statusCode: 500
                })
            })
        } else {
            this.storage = new Storage()
        }
    }

    public async handlerRequest(ctx: Core.Context) {
        const {  opts, storage } = this;
        const { key, maxAge } = opts
        let session: any = {}
        // Get Sid from cookies
        const sid = ctx.cookies.get(key, opts as GetOption);
        if (sid) {
            session = await storage.get(sid) || {}
        }

        // Proxy session
        ctx.session = new Proxy(session, {
            get(target, key) {
                return target[key]
            },
            set(target, propertykey, value) {
                target[propertykey] = value
                const ssid = storage.set(target, {sid, maxAge})
                if (ssid && !Object.keys(session).length) {
                    storage.destroy(ssid)
                    return;
                }
                return Boolean(ctx.cookies.set(key, ssid, opts))
            }
        })
    }
}

export interface SessionOpts extends SetOption {
    key?: string;
    redis?: RedisOptions;
    signed?: boolean;
}