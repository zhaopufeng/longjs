import { Server } from '../src'
import { resolve } from 'path'
import { IndexController } from './controllers/IndexController'

new Server({
    port: 3000,
    controllers: [
        IndexController
    ],
    configs: {
        staticServeOpts: {
            root: resolve('public'),
            maxage: 60000,
            defer: true
        },
        proxyTable: {
            '^/api': {
                target: 'https://www.baidu.com',
                changeOrigin: true
            }
        }
    }
})