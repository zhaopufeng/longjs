import { Server } from '@longjs/server';
import { RedisStorage } from '@longjs/redis-storage'

export const configs: Server.Configs = {
    session: {
        store: new RedisStorage(),
        signed: true
    }
}