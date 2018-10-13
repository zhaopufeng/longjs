import { Server, Controller, Get, Post, Query, Param, Session } from '../../src';
import { TestService } from '../services/TestService';

@Controller('/')
export class IndexController implements Server.Controller {
    constructor(public test: TestService) {}

    @Query public q: any;
    @Get
    public async index() {
        return this.q;
    }

    @Get
    public async users() {
        console.log(this.q)
        return 'index/users'
    }

    @Session public ss: any;

    @Get('/admin/:id/:name')
    public async admin(@Param(['id', 'name']) pm: any) {
        console.log(this.ss)
        return pm
    }
}