/**
 * @class LRU
 */
export declare class LRU {
    size: number;
    cache: Map<any, any>;
    _cache: Map<any, any>;
    max: number;
    constructor(max: any);
    get(key: string, options?: any): string | false;
    set(key: string, value: any, options?: any): void;
    keys(): any[];
    _update(key: any, item: any): void;
}
