export declare class SessionStore {
    sessions: Map<any, any>;
    __timer: Map<any, any>;
    constructor();
    getID(length: number): string;
    get(sid: string): undefined | object;
    set(session: any, { sid, maxAge }?: any): any;
    destroy(sid: any): void;
}
