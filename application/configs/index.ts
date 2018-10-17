import { Server } from '@longjs/server';
import { RedisStorage } from '@longjs/redis-storage'
import { resolve } from 'path'

export const configs: Server.Configs = {
    session: {
        store: new RedisStorage(),
        signed: true
    },
    staticServeOpts: {
        root: resolve('public')
    }
}