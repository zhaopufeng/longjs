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
    init(options: Core.Options, pluginConfigs: any): void;
}
export declare type Database = knex & QueryInterface;
interface DatabseInterface {
    (table: string): DatabseInterface;
    (target: Object, propertyKey: string): void;
    (target: Object, propertyKey: string, parameterIndex: number): void;
}
export declare const Database: DatabseInterface;
export {};
