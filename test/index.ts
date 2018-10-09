import { Server } from '../src'
import { IndexController } from './controllers/IndexController';
import { UsersController } from './controllers/UsersController';

new Server({
    port: 3000,
    controllers: [
        IndexController,
        UsersController
    ]
})