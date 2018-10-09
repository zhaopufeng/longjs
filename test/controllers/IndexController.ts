import { Server, Controller, Get, Post, Query } from '../../src';
import { TestService } from '../services/TestService';

@Controller('/')
export class IndexController implements Server.Controller {
    constructor(public test: TestService) {}

    @Query public q: any;
    @Get
    public async index() {
        return 'index';
    }

    @Get
    public async users() {
        console.log(this.q)
        return 'index/users'
    }
}