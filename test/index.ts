import Server from '@longjs/core'
import Controller from '../src'
import { resolve, join } from 'path';
import { IndexController } from './controllers/IndexController';
import { ApiController } from './controllers/ApiController';

const app = new Server({
    port: 3000
})

app.use(new Controller({
    controllers: [
        IndexController,
        ApiController
    ]
}))