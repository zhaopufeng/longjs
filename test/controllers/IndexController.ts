import { Controller, Get, Session, Post, Body, Query, Catch, Headers } from '@longjs/decorators'
import { TestService } from '../services/TestService'
import { Database } from '@longjs/database'
import { CustomHttpException } from '../HttpException/CustomHttpException';

@Controller('/')
export class IndexController {
    @Session public session: Session;
    @Database('users') public users: Database;
    @Database public db: Database;

    constructor(public testService: TestService) {}

    @Get('/')
    public async index() {
        console.log(this.session)
        // if (!this.session.users) {
        //     this.session.users = await this.db('users').select()
        // }
        // return 'xx'
    }

    @Get('/user')
    public async user() {
        // if (this.session.user) {
        //     return this.session.user
        // }
        return await this.users.select()
    }

    @Get
    @Catch(CustomHttpException)
    public async test(@Headers({
        'content-length': '100'
    }) h: Headers) {
       return h
    }
}
