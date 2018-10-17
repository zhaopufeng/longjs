import { Controller, Get, Session, Param, Database, Server } from '@longjs/server'
import { Core } from '@longjs/core';

@Controller('/')
export class IndexController {
    @Session public sess: Core.Session
    @Database('users') public db: Server.Database

    @Get
    public async index() {
        this.sess.user = 'xx'
    }

    @Get('/set/:name')
    public async set(@Param(['name']) pm: any) {
        this.sess.user = pm.name
    }
}