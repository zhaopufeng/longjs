import { Server } from '@longjs/server';

export class UserService {
    constructor(public ctx: Server.Context, public configs: Server.Configs) {}
}