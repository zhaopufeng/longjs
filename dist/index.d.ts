/**
 * @class @longjs/database
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
import { Core, Plugin } from '@longjs/core';
import { Config, QueryInterface } from 'knex';
import * as knex from 'knex';
export default class Databases implements Plugin {
    options: Config;
    constructor(options: Config);
    handlerRequest(ctx: Core.Context, configs: any): Promise<void>;
}
export declare type Database = knex & QueryInterface;
export declare const Database: {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: String): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
};
