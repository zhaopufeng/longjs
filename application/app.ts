import { Server } from '@longjs/server'
import { IndexController } from './controllers/IndexController';
import { configs } from './configs'

new Server({
    port: 3000,
    controllers: [
        IndexController
    ],
    configs
})