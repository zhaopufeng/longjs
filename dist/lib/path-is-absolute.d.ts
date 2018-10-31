/**
 * util path-is-absolute
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
export declare function posix(path: string): boolean;
export declare function win32(path: string): boolean;
declare const _default: typeof win32;
export default _default;
