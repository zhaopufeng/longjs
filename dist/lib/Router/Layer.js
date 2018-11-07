"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Layer
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */
const assert = require("assert");
const Stack_1 = require("./Stack");
class Layer {
    constructor(options) {
        this.stacks = [];
        const { path = '', target, strict = false, metadatas = [], propertys = {}, handlers = {} } = options;
        assert(path, 'Controller path Invalid: path is not defined.');
        assert(typeof path === 'string', 'Controller path Invalid: path is not string.');
        assert(path !== '', 'Controller path Invalid: path Cannot be empty.');
        this.path = path;
        this.strict = strict;
        this.regexp = RegExp(`^${path}`);
        this.target = target;
        this.metadatas = metadatas;
        this.propertys = propertys;
        Object.keys(handlers).forEach((k) => {
            const { routePath = [], methodTypes = [], parameters = {}, methods = {}, headers = {}, statusCode, statusMessage, responseType, exceptioncapture = {} } = handlers[k];
            this.stacks.push(new Stack_1.Stack({
                propertyKey: k,
                routePath,
                strict,
                methods,
                parameters,
                methodTypes,
                root: path,
                statusCode,
                statusMessage,
                responseType,
                exceptioncapture,
                headers
            }));
        });
    }
    matchRouter(ctx) {
        return this.stacks.filter((k) => k.matchRoutePath(ctx));
    }
}
exports.Layer = Layer;
