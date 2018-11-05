import { Controller, Get, Session, Post, Body, Query, Catch, Exception, Headers, ValidatorKeys, Status, Type, Header, Params, Files } from '@longjs/decorators'
import { HttpException } from '@longjs/core'
import { TestHttpException } from '../exception/TestException';

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
        return 'xx'
    }

    @Get
    @Post
    @Catch(TestHttpException)
    @Status(200)
    @Header({
        'content-type': 'text/html'
    })
    public async test(@Files files: any) {
        console.log(typeof files['a'][0])
       return 'test'
    }
}

interface Test {
    username: string;
}