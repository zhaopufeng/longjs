/**
 * util resolve-path
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */

/**
 * Module dependencies.
 */

import * as httpError from 'http-errors'
import absolute from './path-is-absolute'
import { join, normalize, resolve, sep } from 'path'

const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/

export default function(rootPath: string, relativePath?: string) {
    let path = relativePath
    let root = rootPath

    // root is optional, similar to root.resolve
    if (!relativePath) {
        path = rootPath
        root = process.cwd()
    }

    if (root == null) {
        throw new TypeError('argument rootPath is required')
    }

    if (typeof root !== 'string') {
        throw new TypeError('argument rootPath must be a string')
    }

    if (path == null) {
        throw new TypeError('argument relativePath is required')
    }

    if (typeof path !== 'string') {
        throw new TypeError('argument relativePath must be a string')
    }

    // containing NULL bytes is malicious
    if (!!~path.indexOf('\0')) {
        throw httpError(400, 'Malicious Path')
    }

    // path should never be absolute
    if (absolute(path)) {
        throw httpError(400, 'Malicious Path')
    }

    // path outside root
    if (UP_PATH_REGEXP.test(normalize('.' + sep + path))) {
        throw httpError(403)
    }

    // join the relative path
    return normalize(join(resolve(root), path))
}