import { Server } from './Server';

export abstract class Plugin<Response = any, Request = any> {
    constructor(public options: Server.Options) {}
    abstract async handlerRequest(ctx: Server.Context): Promise<Request>;
    abstract async handlerResponse(ctx: Server.Context): Promise<Response>;
}