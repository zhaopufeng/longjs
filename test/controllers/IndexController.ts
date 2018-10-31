import { Controller, Get, Session } from '@longjs/decorators'

@Controller('/')
export class IndexController {
    @Session public session: Session;
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
}
