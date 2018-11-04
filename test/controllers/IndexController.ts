import { Controller, Get, Session, Post, Body, Query, Catch, Exception, Headers } from '@longjs/decorators'
import { HttpException } from '@longjs/core'
import { TestHttpException } from '../exception/TestException';

@Controller('/')
export class IndexController {
    @Session public session: Session;

    @Get('/')
    public async index() {
        throw new Error('')
        return 'xx'
    }

    @Get
    @Catch(TestHttpException)
    public async test(@Headers({
        'content-length': '100'
    }) h: Headers) {
       return h
    }
}
