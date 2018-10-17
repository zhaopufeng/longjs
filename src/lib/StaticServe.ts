/**
 * @class StaticServer
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 */

/**
 * Module dependencies.
 */

import send from '../utils/send'
import * as assert from 'assert'
import { resolve } from 'path'
import { Options } from '../utils/send'
import { Server } from './Server';

export class StaticServe {
    constructor(public opts: StaticServe.Opts) {
        const { root } = opts
        opts = Object.assign({}, opts)
        assert(root, 'root directory is required to serve files')
        opts.root = resolve(root)
        if (opts.index !== false) this.opts.index = opts.index || 'index.html'
    }
    public async handler(ctx: Server.Context) {
        if (this.opts.defer) return;
        if (ctx.method === 'HEAD' || ctx.method === 'GET') {
            try {
                await send(ctx, ctx.path, this.opts)
            } catch (err) {
                if (err.status !== 404) {
                    throw err
                }
            }
        }
    }

    public async deferHandler(ctx: Server.Context) {
        if (!this.opts.defer) return;
        if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return
        // response is already handled
        if (ctx.response.body != null || ctx.status !== 404) return // eslint-disable-line
        try {
            await send(ctx, ctx.path, this.opts)
        } catch (err) {
            if (err.status !== 404) {
              throw err
            }
        }
    }
}

export namespace StaticServe {
    export interface Opts extends Options {
        defer?: boolean; // If true, Run after the controller is running.
    }
}