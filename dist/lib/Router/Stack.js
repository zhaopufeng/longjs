"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Layer
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */
const pathToRegExp = require("path-to-regexp");
class Stack {
    constructor(options) {
        this.paths = [];
        const { propertyKey, routePath, strict, parameters, headers = {}, methodTypes, methods, statusCode, statusMessage, responseType, exceptioncapture } = options;
        this.propertyKey = options.propertyKey;
        this.root = options.root;
        this.methods = methods;
        this.statusMessage = statusMessage;
        this.statusCode = statusCode;
        this.responseType = responseType;
        this.exceptioncapture = exceptioncapture;
        this.parameters = parameters;
        this.headers = headers;
        if (routePath.length === 0)
            options.routePath = [`/${propertyKey}`];
        options.routePath.forEach((k) => {
            if (!k || k === '')
                k = `/${propertyKey}`;
            let keys = [];
            let routePath = (this.root + k).replace(/[\/]{2,}/g, '/');
            let regexp = pathToRegExp(routePath, [], { strict });
            this.paths.push({
                keys,
                routePath,
                regexp
            });
        });
        this.strict = strict;
        this.methodTypes = methodTypes;
    }
    matchRoutePath(ctx) {
        const { method, path } = ctx;
        const regexpFilters = this.paths.filter((k) => k.regexp.test(path));
        return Boolean(regexpFilters.length) && this.matchRouteMethodType(method);
    }
    matchRouteMethodType(method) {
        return !!~this.methodTypes.indexOf(method) || !!~this.methodTypes.indexOf('ALL');
    }
}
exports.Stack = Stack;
