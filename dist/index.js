"use strict";
/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("@longjs/Core");
require("validator");
require("reflect-metadata");
const lib_1 = require("./lib");
const assert = require("assert");
/**
 * Controller Decorator
 * @param path
 */
function Controller(path) {
    return Core_1.createClassDecorator((options) => {
        const { target } = options;
        // Set options metadata
        options.metadatas = Reflect.getMetadata('design:paramtypes', target) || [];
        // Set options route root path
        options.route = (path + '/').replace(/[\/]{2,}/g, '/');
    });
}
exports.Controller = Controller;
exports.Headers = Core_1.createPropertyAndParameterDecorator('Headers', (ctx, value) => {
    if (typeof value === 'object') {
        assert(!Array.isArray(value), 'Headers decorator parameter is not a object.');
        const { headers } = ctx;
        const data = {};
        const errors = {};
        Object.keys(value).forEach((k) => {
            if (headers[k] !== value[k]) {
                errors[k] = value[k];
            }
            else {
                data[k] = value[k];
            }
        });
        if (Object.keys(errors).length > 0) {
            const error = new Error('Authentication Failed on http request headers.');
            error.errors = errors;
            throw error;
        }
        return data;
    }
    return ctx.headers;
});
exports.Body = Core_1.createPropertyAndParameterDecorator('Body', (ctx, validateKeys) => {
    const data = {};
    if (!Array.isArray(validateKeys) && typeof validateKeys === 'object') {
        Object.keys(validateKeys).forEach((k) => {
            data[k] = ctx.body[k] || validateKeys[k].defalut;
        });
        const errors = lib_1.default(data, validateKeys);
        if (Object.keys(errors).length > 0) {
            const error = new Error('Request Body data is not valid.');
            error.errors = errors;
            throw error;
        }
        return data;
    }
    return ctx.body;
});
exports.Query = Core_1.createPropertyAndParameterDecorator('Query', (ctx, validateKeys) => {
    const data = {};
    if (!Array.isArray(validateKeys) && typeof validateKeys === 'object') {
        Object.keys(validateKeys).forEach((k) => {
            data[k] = ctx.query[k] || validateKeys[k].defalut;
        });
        const errors = lib_1.default(data, validateKeys);
        if (Object.keys(errors).length > 0) {
            const error = new Error('Request query string data is not valid.');
            error.errors = errors;
            throw error;
        }
        return data;
    }
    return ctx.query;
});
exports.Params = Core_1.createPropertyAndParameterDecorator('Params', (ctx, validateKeys) => {
    const data = {};
    if (!Array.isArray(validateKeys) && typeof validateKeys === 'object') {
        Object.keys(validateKeys).forEach((k) => {
            data[k] = ctx.params[k] || validateKeys[k].defalut;
        });
        const errors = lib_1.default(data, validateKeys);
        if (Object.keys(errors).length > 0) {
            const error = new Error('Request path parameter data is not valid.');
            error.errors = errors;
            throw error;
        }
        return data;
    }
    return ctx.params;
});
exports.Session = Core_1.createPropertyAndParameterDecorator('Session', (ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.session[k];
        });
        return data;
    }
    return ctx.session;
});
exports.Request = Core_1.createPropertyAndParameterDecorator('Request', (ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.request[k];
        });
        return data;
    }
    return ctx.request;
});
exports.Response = Core_1.createPropertyAndParameterDecorator('Response', (ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.response[k];
        });
        return data;
    }
    return ctx.response;
});
exports.Files = Core_1.createPropertyAndParameterDecorator('Files', (ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.files[k];
        });
        return data;
    }
    return ctx.files;
});
/**
 * MethodDecorators
 * Catch
 */
exports.Catch = Core_1.createHttpExceptionCaptureDecorator();
/**
 * RequestMethodDecorators
 * Get
 */
exports.Get = Core_1.createRequestMethodDecorator('GET');
/**
 * RequestMethodDecorators
 * All
 */
exports.All = Core_1.createRequestMethodDecorator('ALL');
/**
 * RequestMethodDecorators
 * Delete
 */
exports.Delete = Core_1.createRequestMethodDecorator('DELETE');
/**
 * RequestMethodDecorators
 * Head
 */
exports.Head = Core_1.createRequestMethodDecorator('HEAD');
/**
 * RequestMethodDecorators
 * Options
 */
exports.Options = Core_1.createRequestMethodDecorator('OPTIONS');
/**
 * RequestMethodDecorators
 * Patch
 */
exports.Patch = Core_1.createRequestMethodDecorator('PATCH');
/**
 * RequestMethodDecorators
 * Post
 */
exports.Post = Core_1.createRequestMethodDecorator('POST');
/**
 * RequestMethodDecorators
 * Put
 */
exports.Put = Core_1.createRequestMethodDecorator('PUT');
/**
 * RequestMethodDecorators
 * Copy
 */
exports.Copy = Core_1.createRequestMethodDecorator('COPY');
/**
 * RequestMethodDecorators
 * Link
 */
exports.Link = Core_1.createRequestMethodDecorator('LINK');
/**
 * RequestMethodDecorators
 * Unlink
 */
exports.Unlink = Core_1.createRequestMethodDecorator('UNLINK');
/**
 * RequestMethodDecorators
 * Purge
 */
exports.Purge = Core_1.createRequestMethodDecorator('PURGE');
/**
 * RequestMethodDecorators
 * Lock
 */
exports.Lock = Core_1.createRequestMethodDecorator('LOCK');
/**
 * RequestMethodDecorators
 * Unlock
 */
exports.Unlock = Core_1.createRequestMethodDecorator('UNLOCK');
/**
 * RequestMethodDecorators
 * Porpfind
 */
exports.Porpfind = Core_1.createRequestMethodDecorator('PORPFIND');
/**
 * RequestMethodDecorators
 * View
 */
exports.View = Core_1.createRequestMethodDecorator('VIEW');
__export(require("./lib"));
