import { Server, Controller, Get, Post, Query, Param, Session } from '../../src';
import { TestService } from '../services/TestService';

@Controller('/')
export class IndexController implements Server.Controller {
    constructor(public test: TestService) {}
    @Session public ss: any;
    @Query public q: any;
    @Get
    public async index() {
        return {xx: 0}
    }

    @Get
    public async users() {
        // console.log(this.q)
        return 'index/users'
    }

    @Get('/admin/:name')
    public async admin(@Param(['name']) pm: any) {
        if (pm.name) {
            this.ss.name = pm.name
        }
        return pm
    }
}