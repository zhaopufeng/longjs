/**
 * @class SessionStorage
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-13 11:15
 */

import { randomBytes } from 'crypto'
import { Core } from '..';

export class SessionStorage {
    public sessions: Map<any, any>;
    public __timer: Map<any, any>;
    constructor() {
        this.sessions = new Map();
        this.__timer = new Map();
    }

    public getID(length: number): string {
        return randomBytes(length).toString('hex');
    }

    public async get(sid: string): Promise<Core.Session> {
        if (!this.sessions.has(sid)) return undefined;
        // We are decoding data coming from our Store, so, we assume it was sanitized before storing
        return {
            sid,
            ...JSON.parse(this.sessions.get(sid))
        };
    }

    public async set(session: any, { sid =  this.getID(24), maxAge }: any = {}): Promise<string> {
        // Just a demo how to use maxAge and some cleanup
        if (this.sessions.has(sid) && this.__timer.has(sid)) {
            const __timeout = this.__timer.get(sid);
            if (__timeout) clearTimeout(__timeout);
        }

        if (maxAge) {
            this.__timer.set(sid, setTimeout(() => this.destroy(sid), maxAge));
        }
        try {
            this.sessions.set(sid, JSON.stringify(session));
        } catch (err) {
            console.log('Set session error:', err);
        }

        return sid;
    }

    public async destroy(sid: any) {
        this.sessions.delete(sid);
        this.__timer.delete(sid);
    }
}