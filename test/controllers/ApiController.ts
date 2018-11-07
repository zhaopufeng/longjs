import { IController, Controller, Get } from '../../src';

@Controller('/api')
export class ApiController {
    @Get('/')
    public async index() {
        return 'xx'
    }
}