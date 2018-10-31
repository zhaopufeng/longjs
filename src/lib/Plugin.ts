import { Core } from '..';
import { IncomingMessage, ServerResponse } from 'http';

export interface Plugin {
    handlerRequest?(ctx: Core.Context): Promise<any>;
    handlerRequested?(ctx: Core.Context): Promise<any>
    handlerResponse?(ctx: Core.Context): Promise<any>;
    handlerResponded?(ctx: Core.Context): Promise<any>;
    handlerException?(err: Error, request?: IncomingMessage, response?: ServerResponse): Promise<any>;
}

export type Plugins = Plugin[];