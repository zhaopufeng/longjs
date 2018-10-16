/**
 * @class utils
 * @license MIT
 */
/// <reference types="node" />
import * as Stream from 'stream';
export declare function isJSON(body: any): boolean;
export declare function ensureErrorHandler(stream: Stream, error: (...args: any[]) => void): Stream;
export declare function getType(type: string): string;
