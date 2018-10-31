"use strict";
/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("@longjs/Core");
require("reflect-metadata");
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
/**
 * Parameter && Property Decorator
 * Header
 */
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
exports.Body = Core_1.createPropertyAndParameterDecorator((ctx, args) => {
    if (Array.isArray(ctx.body))
        return ctx.body;
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.body[k];
        });
        return data;
    }
    return ctx.body;
});
exports.Query = Core_1.createPropertyAndParameterDecorator((ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.query[k];
        });
        return data;
    }
    return ctx.query;
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
exports.Params = Core_1.createPropertyAndParameterDecorator((ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.params[k];
        });
        return data;
    }
    return ctx.params;
});
exports.Files = Core_1.createPropertyAndParameterDecorator((ctx, args) => {
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
exports.Type = Core_1.createMethodDecorator((ctx, options, configs) => {
    ctx.type = options.arg;
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
