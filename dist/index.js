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
    init(options, pluginConfigs) {
        pluginConfigs.configs = this.options;
    }
}
exports.default = Databases;
exports.Database = core_1.createPropertyAndParameterDecorator('Database', (ctx, data) => {
    const uid = ctx.app.getPluginID(Databases);
    const configs = ctx.app.options.pluginConfigs[uid].configs;
    assert(configs, 'Your must be used @longjs/database module plugin `Databases`.');
    if (data)
        return knex(configs)(data);
    return knex(configs);
});
