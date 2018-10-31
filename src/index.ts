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
    public async handlerRequest(ctx: Core.Context, configs: any) {
        if (!configs) configs = this.options
    }
}

export type Database = knex & QueryInterface
export const Database = createPropertyAndParameterDecorator<String>((ctx, args) => {
    const uid = ctx.app.getPluginID(Databases)
    let configs: any;
    assert(uid, 'Your must be used @longjs/database plugin')
    assert(ctx.app.options, 'Server options is not define')
    assert(ctx.app.options.pluginConfigs, 'Your must be used @longjs/database plugin')
    assert(ctx.app.options.pluginConfigs[uid], 'Your must be used @longjs/database plugin')
    if (args) return knex(ctx.app.options.pluginConfigs[uid])
    return knex
})