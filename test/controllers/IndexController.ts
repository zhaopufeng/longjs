import { Controller, Get, Session, Post, Body } from '@longjs/decorators'
import { TestService } from '../services/TestService';
import { Database } from '@longjs/database';

@Controller('/')
export class IndexController {
    @Session public session: Session;
    @Database public database: Database;

    constructor(public testService: TestService) {
        // console.log(testService.test())
        // console.log(this.database)
    }

    @Get('/')
    public async index() {
        if (!this.session.user) {
            this.session.user = 'zhangsan'
        }
        return 'xx'
    }

    @Get('/user')
    public async user() {
        if (this.session.user) {
            return this.session.user
        }
        return 'xx'
    }

    @Post
    public async test(@Body body: Body) {
        console.log(body)
        return 'test'
    }
}
