import { Controller, Get, Session, Post, Body, Query, Catch, Exception, Headers, ValidatorKeys, Status, Type, Header, Params } from '@longjs/decorators'
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
    public async test(
        @Query(testRule) query: Query<Test>,
        @Headers({
            'content-type': 'application/x-www-form-urlencoded'
        }) headers: Headers,
        @Params({
            id: {
                rules: {
                    required: true,
                    string: true
                }
            }
        }) params: Params
    ) {
       return headers
    }
}

interface Test {
    username: string;
}