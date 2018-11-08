import {
    Controller,
    Get,
    Post,
    All,
    Message,
    Type,
    Status,
    Exception,
    Body,
    Headers,
    Session
} from '../../src';
import { HttpException } from '@longjs/core';

@Controller('/')
export class IndexController {

    @Body public body: Body

    @Get('/')
    @Message('hello')
    @Type('application/json')
    @Status(200)
    @Exception(new HttpException({
        message: 'your are da sha bi'
    }))
    public index(@Body({ username: null}) body: Body) {
        return 'your are da sha bi';
    }
}