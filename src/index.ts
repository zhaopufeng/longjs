/**
 * @class CreateSession
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-14 10:04
 */

import { SessionStorage } from './lib/SessionStorage'
import { SetOption, GetOption } from 'cookies'
import { Core, Plugin } from '@longjs/core'

export class Session implements Plugin {
    public sessions: any = {}
    constructor(public opts: SessionOpts = {}) {
        opts.signed = true
        opts.key = opts.key || 'ssid'
        opts.store = opts.store || new SessionStorage()
    }
    public async handlerRequest(ctx: Core.Context) {
        const {  opts } = this;
        const { key, store } = opts
        // Get Sid from cookies
        let sid = ctx.cookies.get(key, opts as GetOption);
        // Check sid
        if (!sid) {
            // Not sid
            ctx.session = {sid};
        } else {
            // Get Sid from store
            ctx.session = await store.get(sid);
        }

        // Check session state
        if (typeof ctx.session !== 'object' || ctx.session === null) {
            ctx.session = {sid};
        }
        ctx._session = JSON.stringify(ctx.session)
    }

    public async handlerResponse(ctx: Core.Context) {
        const { opts } = this;
        const {  key, store } = opts
        // Get Sid from cookies
        const sid = ctx.session.sid

        // Get old session
        const old = ctx._session

        // Add refresh function
        let need_refresh = false
        ctx.session.refresh = () => {need_refresh = true}

        // Remove refresh function
        if (ctx.session && 'refresh' in ctx.session) {
            delete ctx.session.refresh
        }

        // Get session from context
        const sess = JSON.stringify(ctx.session);

        // If not changed
        if (!need_refresh && old === sess) return;

        // If is an empty object
        if (sess === '{}') {
            ctx.session = null;
        }

        // Need clear old session
        if (sid && !ctx.session) {
            await store.destroy(sid);
            ctx.cookies.set(key, null);
            return;
        }

        // set/update session
        const ssid = await store.set(ctx.session, {
            ...opts,
            sid
        });
        ctx.cookies.set(key, ssid, opts);
    }
}

export interface SessionOpts extends SetOption {
    key?: string;
    store?: SessionStorage;
    signed?: boolean;
}

export * from './lib/SessionStorage'
export * from './lib/SessionRedisStorage'