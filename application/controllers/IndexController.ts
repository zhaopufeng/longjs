import { Controller, Get, Session } from '@longjs/decorators'

@Controller('/')
export class IndexController {
    @Session public session: Session;
    @Get('/')
    async index() {
        if (this.session.user) {
            return this.session.user
        }
        return 'xx'
    }

    @Get('/set/:name')
    async set() {
        this.session.user = 'zhangsan'
        return this.session
    }
}