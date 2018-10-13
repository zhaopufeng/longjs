import { SessionStore } from './SessionStore';
import { Core } from '../interface/Core'
import { SetOption, GetOption } from 'cookies'

export class Session {
    public old: string;
    public sid: string;
    public key: string;
    public store: SessionStore;
    constructor(public opts: SessionOpts = {}) {
        this.key = opts.key = opts.key || 'long:sess'
        this.store = opts.store = opts.store || new SessionStore()
        opts.signed = false
    }

    public async run(ctx: Core.Context) {
        const { key, store, sid } = this;
        if (!sid) {
            this.sid = ctx.cookies.get(key, this.opts as GetOption);
            ctx.session = {};
        } else {
            const _sid = ctx.cookies.get(key, this.opts as GetOption);
            if (_sid === sid) {
                ctx.session = await store.get(sid);
            } else {
                this.sid = _sid
                ctx.session = await store.get(_sid);
            }

            if (typeof ctx.session !== 'object' || ctx.session == null) {
                ctx.session = {};
            }
        }
        this.old = JSON.stringify(ctx.session);
    }

    public async refresh(ctx: Core.Context) {
        const { key, store, opts, old} = this;
        let sid =  ctx.cookies.get(key, opts as GetOption);

        // add refresh function
        let need_refresh = false
        ctx.session.refresh = () => {need_refresh = true}

        // remove refresh function
        if (ctx.session && 'refresh' in ctx.session) {
            delete ctx.session.refresh
        }

        const sess = JSON.stringify(ctx.session);

        // if not changed
        if (!need_refresh && old === sess) return;

        // if is an empty object
        if (sess === '{}') {
            ctx.session = null;
        }

        // need clear old session
        if (sid && !ctx.session) {
            await store.destroy(sid);
            ctx.cookies.set(key, null);
            return;
        }

        // set/update session
        const ssid = await store.set(ctx.session, Object.assign({}, opts, {sid}));
        ctx.cookies.set(key, ssid, opts);
    }
}

export interface SessionOpts extends SetOption {
    key?: string;
    store?: SessionStore;
    signed?: boolean;
}