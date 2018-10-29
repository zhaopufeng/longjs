import {Controller } from '../../src';

@Controller('/')
export class IndexController {
    @Get('/users/:name')
    public async index() {
        return 'xx';
    }

    @Post
    public async test() {
        return;
    }
}