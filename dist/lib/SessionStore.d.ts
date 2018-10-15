/**
 * @class SessionStorage
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-13 11:15
 */
import { Core } from '..';
export declare class SessionStorage {
    sessions: Map<any, any>;
    __timer: Map<any, any>;
    constructor();
    getID(length: number): string;
    get(sid: string): Core.Session;
    set(session: any, { sid, maxAge }?: any): any;
    destroy(sid: any): void;
}
