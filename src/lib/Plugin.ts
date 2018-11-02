import { Core } from '..';
import { IncomingMessage, ServerResponse } from 'http';

export interface Plugin {
    readonly uid?: string;
    init?(options: Core.Options): void;
    handlerRequest?(ctx: Core.Context, configs?: Core.Configs): Promise<any>;
    handlerRequested?(ctx: Core.Context, configs?: Core.Configs): Promise<any>
    handlerResponse?(ctx: Core.Context, configs?: Core.Configs): Promise<any>;
    handlerResponseAfter?(ctx: Core.Context, configs?: Core.Configs): Promise<any>;
    handlerResponded?(ctx: Core.Context, configs?: Core.Configs): Promise<any>;
    handlerException?(err: Error, request?: IncomingMessage, response?: ServerResponse, configs?: Core.Configs): Promise<any>;
}

export type Plugins = Plugin[];