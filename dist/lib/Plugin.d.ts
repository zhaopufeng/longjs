import { Core } from '..';
export interface Plugin {
    readonly uid?: string;
    init?(options: Core.Options): void;
    handlerRequest?(ctx: Core.Context, configs?: Core.Configs): Promise<any>;
    handlerRequested?(ctx: Core.Context, configs?: Core.Configs): Promise<any>;
    handlerResponse?(ctx: Core.Context, configs?: Core.Configs): Promise<any>;
    handlerResponseAfter?(ctx: Core.Context, configs?: Core.Configs): Promise<any>;
    handlerResponded?(ctx: Core.Context, configs?: Core.Configs): Promise<any>;
    handlerException?(err: Error, ctx?: Core.Context): Promise<any>;
}
export declare type Plugins = Plugin[];
