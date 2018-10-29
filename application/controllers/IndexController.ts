import { Controller, Get } from '@longjs/decorators'

@Controller('/')
export class IndexController {

    @Get('/')
    async index() {
        return 'xx'
    }
}