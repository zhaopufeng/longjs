"use strict";
/**
 * @class StaticServer
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
const send_1 = require("../utils/send");
const assert = require("assert");
const path_1 = require("path");
class StaticServe {
    constructor(opts) {
        this.opts = opts;
        const { root } = opts;
        opts = Object.assign({}, opts);
        assert(root, 'root directory is required to serve files');
        opts.root = path_1.resolve(root);
        if (opts.index !== false)
            opts.index = opts.index || 'index.html';
    }
    async handler(ctx) {
        if (this.opts.defer)
            return;
        if (ctx.method === 'HEAD' || ctx.method === 'GET') {
            try {
                await send_1.default(ctx, ctx.path, this.opts);
            }
            catch (err) {
                if (err.status !== 404) {
                    throw err;
                }
            }
        }
    }
    async deferHandler(ctx) {
        if (!this.opts.defer)
            return;
        if (ctx.method !== 'HEAD' && ctx.method !== 'GET')
            return;
        // response is already handled
        if (ctx.body != null || ctx.status !== 404)
            return; // eslint-disable-line
        try {
            await send_1.default(ctx, ctx.path, this.opts);
        }
        catch (err) {
            if (err.status !== 404) {
                throw err;
            }
        }
    }
}
exports.StaticServe = StaticServe;
