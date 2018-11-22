import { Controller, Get, Response, Request, ContentType, Catch, HttpException, Exception, StatusCode, StatusMessage } from '../../src';

@Controller('/')
export class IndexController {
    @Response response: any;
    @Request request: any;
    @Get
    @Get('xxx')
    public async index() {
        console.log(1)
    }

    @Get('/test')
    @ContentType('html')
    @Catch(HttpException)
    @StatusCode('201')
    @StatusMessage('xxx')
    @Exception(new HttpException({
        message: 'xx'
    }))
    public async test() {
        console.log(1)
    }
}