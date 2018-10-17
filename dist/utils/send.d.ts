/**
 * util send
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
/// <reference types="node" />
import { fs } from 'mz';
import { Server } from '../lib/Server';
import { ServerResponse } from 'http';
export default function (ctx: Server.Context, path: string, opts?: Options): Promise<string>;
/**
 * File type.
 */
export declare function type(file: string, ext: string): string;
/**
 * Decode `path`.
 */
export declare function decode(path: string): string | -1;
/**
 *  Check if it's hidden.
 */
export declare function isHidden(root: string, path: string | string[]): boolean;
export interface Options {
    root?: string;
    index?: string | boolean;
    maxage?: number;
    maxAge?: number;
    immutable?: boolean;
    hidden?: boolean;
    format?: boolean;
    extensions?: any | any[];
    brotli?: boolean;
    gzip?: boolean;
    setHeaders?: (res: ServerResponse, path: string, stats: fs.Stats) => void;
}
