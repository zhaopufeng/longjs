import send, { Options } from './send'
import * as assert from 'assert'
import { Core } from '../../';

export default class Static {
    constructor(public options: StaticOpts) {
        const { root } = options
        assert(root, 'root directory is required to serve files')
        if (options.index !== false) this.options.index = options.index || 'index.html'
    }
    public async handlerRequest(ctx: Core.Context) {
        if (this.options.defer) return;
        if (ctx.finished || ctx.headerSent || !ctx.writable) return;
        if (ctx.method === 'HEAD' || ctx.method === 'GET') {
            try {
                await send(ctx, ctx.path, this.options)
            } catch (err) {
                if (err.status !== 404) {
                    throw err
                }
            }
        }
    }
    public async handlerRequestDefer(ctx: Core.Context) {
        if (!this.options.defer) return;
        if (ctx.finished || ctx.headerSent || !ctx.writable) return;
        if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return
        // response is already handled
        if (ctx.response.body != null || ctx.status === 404) return // eslint-disable-line
        try {
            await send(ctx, ctx.path, this.options)
        } catch (err) {
            if (err.status !== 404) {
              throw err
            }
        }
    }
}

export interface StaticOpts extends Options {
    root: string;
    defer?: boolean;
}