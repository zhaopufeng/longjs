"use strict";
/**
 * Controller
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mimeTypes = require("mime-types");
const statuses = require("statuses");
require("reflect-metadata");
/**
 * @method createClassDecorator
 */
function createClassDecorator(callback) {
    return (target) => {
        const options = target.prototype.____$options || {};
        // Set options.target
        if (!options.target)
            options.target = target;
        callback(options);
        if (!options.target)
            options.target = target;
        target.prototype.____$options = options;
    };
}
exports.createClassDecorator = createClassDecorator;
function Controller(path) {
    return createClassDecorator((options) => {
        const { target } = options;
        // Set options metadata
        options.metadatas = Reflect.getMetadata('design:paramtypes', target) || [];
        // Set options route root path
        options.path = path;
    });
}
exports.Controller = Controller;
function createRequestDecorator(type) {
    function decorator(...args) {
        if (args.length === 1) {
            return (target, propertyKey, descriptor) => {
                return handler([target, propertyKey, descriptor], args[0]);
            };
        }
        const [target, propertyKey, descriptor] = args;
        return handler([target, propertyKey, descriptor]);
    }
    function handler(decorators, value) {
        if (value) {
            assert(typeof value === 'string', `The '@${type}(~)' decorator path Invalid: path is not string.`);
        }
        const [target, propertyKey, descriptor] = decorators;
        const options = target.____$options || {};
        options.handlers = options.handlers || {};
        const iHandler = options.handlers[propertyKey] = options.handlers[propertyKey] || {};
        const methodTypes = iHandler.methodTypes = iHandler.methodTypes || [];
        if (!~methodTypes.indexOf('ALL')) {
            methodTypes.push(type);
        }
        iHandler.routePath = iHandler.routePath = [];
        iHandler.routePath.push(value);
        target.____$options = options;
    }
    return decorator;
}
exports.createRequestDecorator = createRequestDecorator;
exports.All = createRequestDecorator('ALL');
exports.Copy = createRequestDecorator('COPY');
exports.Delete = createRequestDecorator('DELETE');
exports.Get = createRequestDecorator('GET');
exports.Head = createRequestDecorator('HEAD');
exports.Link = createRequestDecorator('LINK');
exports.Lock = createRequestDecorator('LOCK');
exports.Options = createRequestDecorator('OPTIONS');
exports.Patch = createRequestDecorator('PATCH');
exports.Propfind = createRequestDecorator('PORPFIND');
exports.Post = createRequestDecorator('POST');
exports.Purge = createRequestDecorator('PURGE');
exports.Put = createRequestDecorator('PUT');
exports.Unlink = createRequestDecorator('UNLINK');
exports.Unlock = createRequestDecorator('UNLOCK');
exports.View = createRequestDecorator('VIEW');
function createMehodDecorator(id, callback) {
    function decorator(...args) {
        if (args.length === 1) {
            const value = args[0];
            return (target, propertyKey, descriptor) => {
                return handler([target, propertyKey, descriptor], value);
            };
        }
        const [target, propertyKey, descriptor] = args;
        return handler([target, propertyKey, descriptor]);
        function handler(decorators, values) {
            const [target, propertyKey, descriptor] = decorators;
            const options = target.____$options || {};
            options.handlers = options.handlers || {};
            const handlers = options.handlers[propertyKey] = options.handlers[propertyKey] || {};
            const { headers, statusCode, responseType, statusMessage, methods = {}, exceptioncapture = {} } = handlers;
            const callbackOps = {};
            callback(callbackOps, values);
            // Checking statusCode
            if (statusCode) {
                assert(!callbackOps.statusCode, `@${id}('${values}') Invalid: statusCode had already been set.`);
            }
            // Set statusCode
            if (callbackOps.statusCode) {
                assert(statuses[values], `@${id}('${values}') Invalid: ${values} is not http statusCode.`);
                handlers.statusCode = callbackOps.statusCode;
            }
            // Checing headers
            if (headers) {
                assert(!callbackOps.headers, `@${id}(${JSON.stringify(values)}) Invalid: headers had already been set.`);
            }
            // Set headers
            if (callbackOps.headers) {
                handlers.headers = callbackOps.headers;
            }
            // Checking responseType
            if (responseType) {
                assert(!callbackOps.responseType, `@${id}('${values}') Invalid: content-type had already been set.`);
            }
            // Set responseType
            if (callbackOps.responseType) {
                assert(mimeTypes.contentType(values), `@${id}('${values}') Invalid: ${values} is not mime-type.`);
                handlers.responseType = callbackOps.responseType;
            }
            // Checing message
            if (statusMessage) {
                assert(!callbackOps.statusMessage, `@${id}('${values}') Invalid: message had already been set.`);
            }
            // Set statusMessage
            if (callbackOps.statusMessage) {
                handlers.statusMessage = callbackOps.statusMessage;
            }
            if (callbackOps.callback) {
                assert(!methods[id], `@${id}() decorator Invalid: decorator should not be used repeatedly.`);
                methods[id] = {
                    values,
                    callback: callbackOps.callback
                };
                handlers.methods = methods;
            }
            if (callbackOps.exceptioncapture) {
                assert(!exceptioncapture[id], `@${id}() decorator Invalid: decorator should not be used repeatedly.`);
                exceptioncapture[id] = callbackOps.exceptioncapture;
                handlers.exceptioncapture = exceptioncapture;
            }
            target.____$options = options;
        }
    }
    return decorator;
}
exports.createMehodDecorator = createMehodDecorator;
exports.Type = createMehodDecorator('Type', (options, values) => {
    options.responseType = values;
});
exports.Status = createMehodDecorator('Status', (options, values) => {
    options.statusCode = values;
});
exports.Message = createMehodDecorator('Message', (options, values) => {
    options.statusMessage = values;
});
exports.Catch = createMehodDecorator('Catch', (options, values) => {
    options.exceptioncapture = function (err) {
        const { message, data, statusCode } = err;
        throw new values({
            message,
            data,
            statusCode
        });
    };
});
exports.Exception = createMehodDecorator('Exception', (options, values) => {
    options.exceptioncapture = function (err) {
        const { message, data, statusCode } = err;
        throw values;
    };
});
function createParameterDecorator(id, callback, ...values) {
    function decorator(...args) {
        if (args.length < 3) {
            return (target, propertyKey, parametersIndex) => {
                return handler([target, propertyKey, parametersIndex], ...args);
            };
        }
        const [target, propertyKey, parametersIndex] = args;
        if (values) {
            return handler([target, propertyKey, parametersIndex], values);
        }
    }
    function handler(decorators, values) {
        const [target, propertyKey, parametersIndex] = decorators;
        const options = target.____$options || {};
        const handlers = options.handlers[propertyKey] = options.handlers[propertyKey] || {};
        const { parameters = {} } = handlers;
        // const parameter = parameters[id] = parameters[id] || {}
        assert(!parameters[id], `@${id}() Invalid: decorator should not be used repeatedly.`);
        parameters[id] = {
            values,
            index: parametersIndex,
            callback
        };
        handlers.parameters = parameters;
        target.____$options = options;
    }
    return decorator;
}
exports.createParameterDecorator = createParameterDecorator;
function createPropertyDecorator(id, callback, ...values) {
    function decorator(...args) {
        if (args.length === 1) {
            return (target, propertyKey) => {
                return handler([target, propertyKey], args[0]);
            };
        }
        const [target, propertyKey] = args;
        if (values) {
            return handler([target, propertyKey], values);
        }
        else {
            return handler([target, propertyKey]);
        }
    }
    function handler(decorators, values) {
        const [target, propertyKey] = decorators;
        const options = target.____$options || {};
        const { propertys = {} } = options;
        const property = propertys[propertyKey] = propertys[propertyKey] || {};
        assert(!property[id], `@${id}() Invalid: decorator should not be used repeatedly.`);
        property[id] = {
            callback,
            values
        };
        options.propertys = propertys;
        target.____$options = options;
    }
    return decorator;
}
exports.createPropertyDecorator = createPropertyDecorator;
function createCombinedDecorator(id, callback, more) {
    function decorators(...args) {
        if (!more) {
            if (args.length === 2) {
                const [target, propertyKey] = args;
                return createPropertyDecorator(id, (ctx, values) => {
                    return callback(ctx, values);
                })(target, propertyKey);
            }
            else if (args.length === 3) {
                const [target, propertyKey, parametersIndex] = args;
                if (typeof parametersIndex === 'number') {
                    return createParameterDecorator(id, (ctx, values) => {
                        return callback(ctx, values);
                    })(target, propertyKey, parametersIndex);
                }
                return createMehodDecorator(id, (options) => {
                    return;
                });
            }
        }
    }
    return decorators;
}
exports.createCombinedDecorator = createCombinedDecorator;
exports.Request = createCombinedDecorator('Request', (ctx) => {
    return ctx.request;
});
exports.Response = createCombinedDecorator('Response', (ctx) => {
    return ctx.response;
});
exports.Session = createCombinedDecorator('Session', (ctx) => {
    return ctx.session;
});
