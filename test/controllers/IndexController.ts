import { Controller, Get, Session, Post, Body, Query } from '@longjs/decorators'
import { TestService } from '../services/TestService';
import { Database } from '@longjs/database';

@Controller('/')
export class IndexController {
    @Session public session: Session;
    @Database('users') public users: Database;
    @Database public db: Database;

    constructor(public testService: TestService) {}

    @Get('/')
    public async index() {
        if (!this.session.users) {
            this.session.users = await this.db('users').select()
        }
        return 'xx'
    }

    @Get('/user')
    public async user() {
        // if (this.session.user) {
        //     return this.session.user
        // }
        return await this.users.select()
    }

    @Query({
        username: {
            rules: 'required',
            message: {
                required: '老子错误了'
            }
        }
    }) query: Query

    @Get
    public async test() {
       return this.query.getError()
    }
}
