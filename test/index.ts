import { Server } from '../src'
import { resolve } from 'path'
import { IndexController } from './controllers/IndexController'
import { UsersController } from './controllers/UsersController'

new Server({
    port: 3000,
    controllers: [
        IndexController,
        UsersController
    ],
    configs: {
        staticServeOpts: {
            root: resolve('public'),
            maxage: 60000,
            defer: true
        }
    }
})