import Server from '@longjs/core'
import StaticServer from '@longjs/static'
import Proxy from '@longjs/proxy'
import { Session, SessionRedisStorage } from '@longjs/session'
import { resolve } from 'path'
import { IndexController } from './controllers/IndexController'

new Server({
    port: 3000,
    controllers: [
        IndexController
    ],
    plugins: [
        new Proxy({
            '^/api': {
                target: 'https://www.qq.com/',
                changeOrigin: true,
                pathRewrite: {
                    '/api': '/'
                }
            },
            '^/baidu': {
                target: 'https://www.baidu.com/',
                changeOrigin: true,
                pathRewrite: {
                    '/baidu': '/'
                }
            }
        }),
        new Session({
            store: new SessionRedisStorage(),
            key: 'sess:id',
            maxAge: 86400000,
            overwrite: true,
            httpOnly: true,
            signed: true
        }),
        new StaticServer({
            root: resolve('public'),
            maxage: 60000,
            defer: true
        }),
    ]
})