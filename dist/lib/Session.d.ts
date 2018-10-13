import { SessionStore } from './SessionStore';
import { Core } from '../interface/Core';
import { SetOption } from 'cookies';
export declare class Session {
    opts: SessionOpts;
    old: string;
    sid: string;
    key: string;
    store: SessionStore;
    constructor(opts?: SessionOpts);
    run(ctx: Core.Context): Promise<void>;
    refresh(ctx: Core.Context): Promise<void>;
}
export interface SessionOpts extends SetOption {
    key?: string;
    store?: SessionStore;
    signed?: boolean;
}
