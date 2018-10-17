import { Server, Controller, Get, Post, Query, Param, Session, Database } from '../../src';
import { TestService } from '../services/TestService';

@Controller('/')
export class IndexController implements Server.Controller {
    constructor(public test: TestService) {}
    @Session public ss: any;
    @Query public q: any;
    // @Database public db: any;

    @Get
    public async index() {
        if (!this.ss.name) {
            this.ss.name = Math.random() * 100
        }
        return '100'
    }

    @Get
    public async users() {
        return this.ss.name
    }
}