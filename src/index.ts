/**
 * @class @longjs/database
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */

import { Core, Plugin, createPropertyAndParameterDecorator } from '@longjs/core'
import { Config, QueryInterface } from 'knex'
import * as knex from 'knex'
import * as assert from 'assert'

export default class Databases implements Plugin {
    constructor(public options: Config) {}
    public init(options: Core.Options, pluginConfigs: any) {
        pluginConfigs.configs = this.options
    }
}

export type Database = knex & QueryInterface
interface DatabseInterface {
    (table: string): DatabseInterface;
    (target: Object, propertyKey: string): void;
    (target: Object, propertyKey: string, parameterIndex: number): void;
}
export const Database = createPropertyAndParameterDecorator<string, DatabseInterface>('Database', (ctx: Core.Context, data: any) => {
    const uid = ctx.app.getPluginID(Databases)
    const configs = ctx.app.options.pluginConfigs[uid].configs
    assert(configs, 'Your must be used @longjs/database module plugin `Databases`.')
    if (data) return knex(configs)(data)
    return knex(configs)
})