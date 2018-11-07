import { IController, Controller, Get, Status, Request, Type, Message, Exception, Catch, Headers, Response, Header } from '../../src';
import { HttpException } from '@longjs/core';

@Controller('/')
export class IndexController {
    @Get
    public async index() {
        throw new Error('你麻痹')
    }

    @Get
    public async test(@Header('connection', 'keep-alive') h: any) {
        console.log(h)
        return 'test'
    }
}