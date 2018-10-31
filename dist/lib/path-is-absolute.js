"use strict";
/**
 * util path-is-absolute
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
function posix(path) {
    return path.charAt(0) === '/';
}
exports.posix = posix;
function win32(path) {
    const splitDeviceRe = /^([a-zA-Z]:|[\\/]{2}[^\\/]+[\\/]+[^\\/]+)?([\\/])?([\s\S]*?)$/;
    const result = splitDeviceRe.exec(path);
    const device = result[1] || '';
    const isUnc = Boolean(device && device.charAt(1) !== ':');
    return Boolean(result[2] || isUnc);
}
exports.win32 = win32;
exports.default = process.platform === 'win32' ? win32 : posix;
