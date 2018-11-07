import { IControllerConstructor, IPropertys, IHandlers } from '../Controller';
import { Stack } from './Stack';
import { Core } from '@longjs/core';
export declare class Layer {
    readonly regexp: RegExp;
    readonly path: string;
    readonly target: IControllerConstructor;
    readonly stacks: Stack[];
    readonly metadatas: Array<{
        new (...args: any[]): any;
    }>;
    readonly propertys: IPropertys;
    private strict;
    constructor(options: ILayer);
    matchRouter(ctx: Core.Context): Stack[];
}
export interface ILayer {
    path: string;
    target: IControllerConstructor;
    strict: boolean;
    metadatas: Array<{
        new (...args: any[]): any;
    }>;
    propertys: IPropertys;
    handlers: IHandlers;
}
