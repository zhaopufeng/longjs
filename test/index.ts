import { Server } from '../src'
import { IndexController } from './controllers/IndexController';
import { UsersController } from './controllers/UsersController';

import { resolve } from 'path';

new Server({
    port: 3000,
    controllers: [
        IndexController,
        UsersController
    ],
    configs: {
        staticServeOpts: {
            root: resolve('public')
        }
    }
})