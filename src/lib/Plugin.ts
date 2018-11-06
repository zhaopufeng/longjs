import { Core } from '..';

export interface Plugin {
    readonly uid?: string;
    init?(options: Core.Options): void;
    handlerRequest?(ctx: Core.Context, pluginConfig: PluginConfigs, globalConfigs?: Core.Configs): Promise<any>;
    handlerRequested?(ctx: Core.Context, pluginConfig: {[key: string]: any }, globalConfigs?: Core.Configs): Promise<any>
    handlerResponse?(ctx: Core.Context, pluginConfig: {[key: string]: any }, globalConfigs?: Core.Configs): Promise<any>;
    handlerbeforeClose?(ctx: Core.Context, pluginConfig: {[key: string]: any }, globalConfigs?: Core.Configs): Promise<any>;
    handlerResponded?(ctx: Core.Context, pluginConfig: {[key: string]: any }, globalConfigs?: Core.Configs): Promise<any>;
    handlerException?(err: Error, ctx: Core.Context, pluginConfig: {[key: string]: any }, globalConfigs?: Core.Configs): Promise<any>;
}

type PluginConfigs<T = {
    [key: string]: any
}> = T

export type Plugins = Plugin[];