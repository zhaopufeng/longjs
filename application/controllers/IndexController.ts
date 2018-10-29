import { Controller, Get, Session, Database, Post, Body, Query } from '@longjs/decorators'
import { CaptchaService } from '../services/CaptchaService';

@Controller('/')
export class IndexController {
    @Session public session: Session;
    constructor(public captchaService: CaptchaService) {}

    @Get('/')
    public async index() {
        return this.session.captcha
    }

    @Get
    public async captcha() {
        return this.captchaService.create().data
    }

    @Post
    public async register(@Body body: Body, @Query query: Query) {
        console.log(body, query)
        return 'xx'
    }
}