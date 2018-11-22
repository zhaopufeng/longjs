import Server from '../src';
import { IndexController } from './controllers/Index';

const app = new Server({
    port: 3000,
    controllers: [
        IndexController
    ],
    configs: {
        serveProxyTable: {
            '^/api': {
                target: 'https://www.baidu.com',
                pathRewrite: {
                    '^/api': '/'
                }
            }
        },
        serveSession: {
            redis: {}
        }
    }
})

app.on('err', function() {
    console.log(1)
})