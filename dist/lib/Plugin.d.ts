import { Core } from '..';
export interface Plugin {
    readonly uid?: string;
    init?(options: Core.Options): void;
    request?: PluginCallback;
    response?: PluginCallback;
    responded?: PluginCallback;
    close?: PluginCallback;
    exception?(err: Error, ctx: Core.Context, pluginConfig: PluginConfigs, data?: {
        [key: string]: any;
    }): Promise<any>;
}
interface PluginCallback {
    (ctx: Core.Context, pluginConfig: PluginConfigs, data?: {
        [key: string]: any;
    }): Promise<any>;
}
declare type PluginConfigs<T = {
    [key: string]: any;
}> = T;
export declare type Plugins = Plugin[];
export {};
