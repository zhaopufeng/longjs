import { Controller, Get, Session, Post, Body, Query, Catch, Exception, Headers, ValidatorKeys, Status, Type, Header, Params, Files, File } from '@longjs/decorators'
import { HttpException } from '@longjs/core'
import { TestHttpException } from '../exception/TestException';
import { Database } from '@longjs/database';

const testRule: ValidatorKeys = {
    username: {
        rules: {
            required: true,
            length: {
                max: 5,
                min: 3
            }
        }
    }
}

@Controller('/')
export class IndexController {
    @Session public session: Session;

    @Get('/')
    public async index() {
        throw new Error('')
    }

    @Get
    @Type('text/html')
    @Status(400)
    public async getusers(@Database('users') users: Database) {
        return users.select()
    }

    @Get
    @Post
    @Catch(TestHttpException)
    @Status(200)
    @Header({
        'content-type': 'text/html'
    })
    public async test(@File({
        a: {
            // type: 'text/html',
            size: {
                min: 20,
                max: 50000
            },
            // extname: 'txt'
        }
    }) file: File) {
        console.log(file)
       return 'test'
    }
}

interface Test {
    username: string;
}