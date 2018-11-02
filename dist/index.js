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
exports.Headers = Core_1.createPropertyAndParameterDecorator((ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.headers[k];
        });
        return data;
    }
    return ctx.headers;
});
exports.Body = Core_1.createPropertyAndParameterDecorator('Body', (ctx, validateKeys) => {
    const data = {
        data: {},
        getError() {
            return false;
        }
    };
    if (!Array.isArray(validateKeys) && typeof validateKeys === 'object') {
        Object.keys(validateKeys).forEach((k) => {
            data.data[k] = ctx.body[k] || validateKeys[k].defalut;
        });
        const errors = lib_1.default(data, validateKeys);
        if (Object.keys(errors).length > 0) {
            data.getError = function () {
                return errors;
            };
        }
        return data;
    }
    data.data = ctx.body;
    return data;
});
exports.Query = Core_1.createPropertyAndParameterDecorator('Query', (ctx, validateKeys) => {
    const data = {
        data: {},
        getError() {
            return false;
        }
    };
    if (!Array.isArray(validateKeys) && typeof validateKeys === 'object') {
        Object.keys(validateKeys).forEach((k) => {
            data.data[k] = ctx.query[k] || validateKeys[k].defalut;
        });
        const errors = lib_1.default(data, validateKeys);
        if (Object.keys(errors).length > 0) {
            data.getError = function () {
                return errors;
            };
        }
        return data;
    }
    data.data = ctx.query;
    return data;
});
exports.Params = Core_1.createPropertyAndParameterDecorator('Params', (ctx, validateKeys) => {
    const data = {
        data: {},
        getError() {
            return false;
        }
    };
    if (!Array.isArray(validateKeys) && typeof validateKeys === 'object') {
        Object.keys(validateKeys).forEach((k) => {
            data.data[k] = ctx.params[k] || validateKeys[k].defalut;
        });
        const errors = lib_1.default(data, validateKeys);
        if (Object.keys(errors).length > 0) {
            data.getError = function () {
                return errors;
            };
        }
        return data;
    }
    data.data = ctx.params;
    return data;
});
exports.Session = Core_1.createPropertyAndParameterDecorator((ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.session[k];
        });
        return data;
    }
    return ctx.session;
});
exports.Request = Core_1.createPropertyAndParameterDecorator((ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.request[k];
        });
        return data;
    }
    return ctx.request;
});
exports.Response = Core_1.createPropertyAndParameterDecorator((ctx, args) => {
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
 * Type
 */
exports.Type = Core_1.createMethodDecorator((ctx, options) => {
    const { value } = options.descriptor;
    options.descriptor.value = async function (...args) {
        let data = await value.call(this, ...args);
        if (data) {
            ctx.type = options.arg;
        }
        return data;
    };
});
/**
 * MethodDecorators
 * Status
 */
exports.Status = Core_1.createMethodDecorator((ctx, options) => {
    const { value } = options.descriptor;
    options.descriptor.value = async function (...args) {
        let data = await value.call(this, ...args);
        if (data) {
            ctx.status = options.arg;
        }
        return data;
    };
});
/**
 * RequestMethodDecorators
 * Get
 */
exports.Get = Core_1.createRequestDecorator('GET');
/**
 * RequestMethodDecorators
 * All
 */
exports.All = Core_1.createRequestDecorator('ALL');
/**
 * RequestMethodDecorators
 * Delete
 */
exports.Delete = Core_1.createRequestDecorator('DELETE');
/**
 * RequestMethodDecorators
 * Head
 */
exports.Head = Core_1.createRequestDecorator('HEAD');
/**
 * RequestMethodDecorators
 * Options
 */
exports.Options = Core_1.createRequestDecorator('OPTIONS');
/**
 * RequestMethodDecorators
 * Patch
 */
exports.Patch = Core_1.createRequestDecorator('PATCH');
/**
 * RequestMethodDecorators
 * Post
 */
exports.Post = Core_1.createRequestDecorator('POST');
/**
 * RequestMethodDecorators
 * Put
 */
exports.Put = Core_1.createRequestDecorator('PUT');
__export(require("./lib"));
