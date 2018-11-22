/**
 * util path-is-absolute
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */

export function posix(path: string): boolean {
    return path.charAt(0) === '/';
}

export function win32(path: string) {
    const splitDeviceRe = /^([a-zA-Z]:|[\\/]{2}[^\\/]+[\\/]+[^\\/]+)?([\\/])?([\s\S]*?)$/;
    const result = splitDeviceRe.exec(path);
    const device = result[1] || '';
    const isUnc = Boolean(device && device.charAt(1) !== ':');

    return Boolean(result[2] || isUnc);
}

export default process.platform === 'win32' ? win32 : posix