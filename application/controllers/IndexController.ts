import { Controller, Get, Session, Database, Server, Header } from '@longjs/server'

@Controller('/')
export class IndexController {
    @Session public session: any
    @Database('users') public db: Server.Database
    @Header public headers: any

    @Get
    async index() {
        if (this.session.user) {
            return this.session.user
        }
        return 'xx'
    }

    @Get
    async set() {
        this.session.user = 100
    }
}