import { Controller, Get } from '@longjs/decorators'

@Controller('/')
export class IndexController {
    @Get
    public async index() {
        return 'xx'
    }
}
