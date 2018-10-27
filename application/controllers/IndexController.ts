import { Controller, Get, Session, Param, Database, Server } from '@longjs/server'
import { Core } from '@longjs/core';

@Controller('/')
export class IndexController {
    @Session public sess: any
    @Database('users') public db: Server.Database

    @Get
    public async index() {
        console.log(this.sess)
        return this.sess.user
    }

    @Get('/set/:name')
    public async set(@Param(['name']) pm: any) {
        console.log(pm)
        this.sess.user = pm.name
    }
}