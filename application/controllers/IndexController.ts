import { Controller, Get, Session, Param } from '@longjs/server'
import { Core } from '@longjs/core';

@Controller('/')
export class IndexController {
    @Session public sess: Core.Session

    @Get
    public async index() {
        return this.sess.user
    }

    @Get('/set/:name')
    public async set(@Param(['name']) pm: any) {
        this.sess.user = pm.name
    }
}