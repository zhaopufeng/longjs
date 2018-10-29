"use strict";
/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@longjs/server");
const Knex = require("knex");
/**
 * Controller Decorator
 * @param path
 */
function Controller(path) {
    return server_1.createClassDecorator((options) => {
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
exports.Header = server_1.createPropertyAndParameterDecorator((ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.headers[k];
        });
        return data;
    }
    return ctx.headers;
});
exports.Body = server_1.createPropertyAndParameterDecorator((ctx, args) => {
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
exports.Query = server_1.createPropertyAndParameterDecorator((ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.query[k];
        });
        return data;
    }
    return ctx.query;
});
exports.Session = server_1.createPropertyAndParameterDecorator((ctx, args) => {
    if (Array.isArray(args)) {
        const data = {};
        args.forEach((k) => {
            data[k] = ctx.session[k];
        });
        return data;
    }
    return ctx.session;
});
exports.Database = server_1.createPropertyAndParameterDecorator((ctx, args, configs) => {
    if (args && configs.database) {
        return Knex(configs.database)(args);
    }
    return Knex(configs.database);
});
exports.Files = server_1.createPropertyAndParameterDecorator((ctx, args) => {
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
 * RequestMethodDecorators
 * Get
 */
exports.Get = server_1.createRequestDecorator('GET');
/**
 * RequestMethodDecorators
 * All
 */
exports.All = server_1.createRequestDecorator('ALL');
/**
 * RequestMethodDecorators
 * Delete
 */
exports.Delete = server_1.createRequestDecorator('DELETE');
/**
 * RequestMethodDecorators
 * Head
 */
exports.Head = server_1.createRequestDecorator('HEAD');
/**
 * RequestMethodDecorators
 * Options
 */
exports.Options = server_1.createRequestDecorator('OPTIONS');
/**
 * RequestMethodDecorators
 * Patch
 */
exports.Patch = server_1.createRequestDecorator('PATCH');
/**
 * RequestMethodDecorators
 * Post
 */
exports.Post = server_1.createRequestDecorator('POST');
/**
 * RequestMethodDecorators
 * Put
 */
exports.Put = server_1.createRequestDecorator('PUT');
