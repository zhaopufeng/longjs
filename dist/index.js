"use strict";
/**
 * @class @longjs/database
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@longjs/core");
const knex = require("knex");
const assert = require("assert");
class Databases {
    constructor(options) {
        this.options = options;
    }
    async handlerRequest(ctx, configs) {
        if (!configs.options)
            configs.options = this.options;
    }
}
exports.default = Databases;
exports.Database = core_1.createPropertyAndParameterDecorator((ctx, args) => {
    const uid = ctx.app.getPluginID(Databases);
    let configs;
    assert(uid, 'Your must be used @longjs/database plugin');
    assert(ctx.app.options, 'Server options is not define');
    assert(ctx.app.options.pluginConfigs, 'Your must be used @longjs/database plugin');
    assert(ctx.app.options.pluginConfigs[uid], 'Your must be used @longjs/database plugin');
    assert(ctx.app.options.pluginConfigs[uid].options, 'Your must be used @longjs/database plugin');
    if (args)
        return knex(ctx.app.options.pluginConfigs[uid].options)(args);
    return knex(ctx.app.options.pluginConfigs[uid].options);
});
