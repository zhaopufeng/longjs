"use strict";
/**
 * @class CreateSession
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-14 10:04
 */
Object.defineProperty(exports, "__esModule", { value: true });
const SessionStore_1 = require("./SessionStore");
class CreateSession {
    constructor(opts = {}) {
        this.opts = opts;
        this.sessions = {};
        opts.signed = true;
        this.key = opts.key || 'ssid';
        this.store = opts.store || new SessionStore_1.SessionStorage();
    }
    async create(ctx) {
        const { key, store, opts } = this;
        // Get Sid from cookies
        let sid = ctx.cookies.get(key, opts);
        // Check sid
        if (!sid) {
            // Not sid
            ctx.session = { sid };
            // Create a new sid
            sid = await store.set(ctx.session, opts);
            ctx.session.sid = sid;
            // Set a new sid for cookie
            ctx.cookies.set(key, sid, opts);
        }
        else {
            // Get Sid from store
            ctx.session = await store.get(sid);
        }
        // Check session state
        if (typeof ctx.session !== 'object' || ctx.session === null) {
            ctx.session = { sid };
        }
        ctx._session = JSON.stringify(ctx.session);
    }
    async reset(ctx) {
        const { key, store, opts } = this;
        // Get Sid from cookies
        const sid = ctx.session.sid;
        // Get old session
        const old = ctx._session;
        // Add refresh function
        let need_refresh = false;
        ctx.session.refresh = () => { need_refresh = true; };
        // Remove refresh function
        if (ctx.session && 'refresh' in ctx.session) {
            delete ctx.session.refresh;
        }
        // Get session from context
        const sess = JSON.stringify(ctx.session);
        // If not changed
        if (!need_refresh && old === sess)
            return;
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
        await store.set(ctx.session, {
            ...opts,
            sid
        });
    }
}
exports.CreateSession = CreateSession;
