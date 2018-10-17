"use strict";
/**
 * util resolve-path
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
const httpError = require("http-errors");
const path_is_absolute_1 = require("./path-is-absolute");
const path_1 = require("path");
const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
function default_1(rootPath, relativePath) {
    let path = relativePath;
    let root = rootPath;
    // root is optional, similar to root.resolve
    if (!relativePath) {
        path = rootPath;
        root = process.cwd();
    }
    if (root == null) {
        throw new TypeError('argument rootPath is required');
    }
    if (typeof root !== 'string') {
        throw new TypeError('argument rootPath must be a string');
    }
    if (path == null) {
        throw new TypeError('argument relativePath is required');
    }
    if (typeof path !== 'string') {
        throw new TypeError('argument relativePath must be a string');
    }
    // containing NULL bytes is malicious
    if (!!~path.indexOf('\0')) {
        throw httpError(400, 'Malicious Path');
    }
    // path should never be absolute
    if (path_is_absolute_1.default(path)) {
        throw httpError(400, 'Malicious Path');
    }
    // path outside root
    if (UP_PATH_REGEXP.test(path_1.normalize('.' + path_1.sep + path))) {
        throw httpError(403);
    }
    // join the relative path
    return path_1.normalize(path_1.join(path_1.resolve(root), path));
}
exports.default = default_1;
