import { Server, Controller, Get } from '../../src';
import { TestService } from '../services/TestService';

@Controller('/users')
export class UsersController implements Server.Controller {
    constructor(public test: TestService) {}
    @Get
    public async index() {
        return '/users/index';
    }
}