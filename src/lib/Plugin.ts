import { Core } from '..';

export interface Plugin {
    readonly uid?: string;
    init?(options: Core.Options, pluginConfig: {[key: string]: any }, globalConfigs?: {[key: string]: any }): void;
    handlerRequest?(ctx: Core.Context, pluginConfig: {[key: string]: any }, globalConfigs?: {[key: string]: any }): Promise<any>;
    handlerRequested?(ctx: Core.Context, pluginConfig: {[key: string]: any }, globalConfigs?: {[key: string]: any }): Promise<any>
    handlerResponse?(ctx: Core.Context, pluginConfig: {[key: string]: any }, globalConfigs?: {[key: string]: any }): Promise<any>;
    handlerResponseAfter?(ctx: Core.Context, pluginConfig: {[key: string]: any }, globalConfigs?: {[key: string]: any }): Promise<any>;
    handlerResponded?(ctx: Core.Context, pluginConfig: {[key: string]: any }, globalConfigs?: {[key: string]: any }): Promise<any>;
    handlerException?(err: Error, ctx: Core.Context, pluginConfig: {[key: string]: any }, globalConfigs?: {[key: string]: any }): Promise<any>;
}

export type Plugins = Plugin[];