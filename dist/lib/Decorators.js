"use strict";
/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Decorators
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
/**
 * createClassDecorator
 * 创建类装饰器方法
 */
function createClassDecorator(callback) {
    return (target) => {
        // Get options
        let options = target.prototype.$options || {};
        // Check options target is defined
        if (!options.target)
            options.target = target;
        // Run callback
        callback(options);
        // Set controller route
        const { route, metadatas } = options;
        if (route)
            options.route = route;
        // Set metadata
        if (metadatas)
            options.metadatas = metadatas;
        // Set options
        target.prototype.$options = options;
    };
}
exports.createClassDecorator = createClassDecorator;
/**
 * 创建http请求装饰器方法
 * @param type
 */
function createRequestDecorator(type) {
    function decorator(...args) {
        if (args.length === 1) {
            const [route] = args;
            return handler(route);
        }
        else {
            return handler(null, ...args);
        }
    }
    function handler(route, ...args) {
        if (route) {
            return (target, propertyKey, descriptor) => {
                appendRoute(route, target, propertyKey, descriptor);
            };
        }
        else {
            appendRoute(route, ...args);
        }
        function appendRoute(route, ...args) {
            const [target, propertyKey, descriptor] = args;
            if (!route)
                route = propertyKey;
            // If the path does not start with '/',insert '/' before route.
            if (!/^\//.test(route)) {
                route = `/${route}`;
            }
            // If the path Contains double `//`, replace with '/'.
            route = route.replace(/[\/]{2,}/g, '/');
            const options = target.$options || {};
            const { routes } = options;
            options.routes = routes || {};
            // Check if the route is duplicated
            const theTypeRoutes = options.routes[type];
            if (Array.isArray(theTypeRoutes)) {
                const filters = theTypeRoutes.filter((k) => {
                    return k.routePath === route;
                });
                // If not is duplicated
                if (!filters.length) {
                    theTypeRoutes.push({
                        routePath: route,
                        propertyKey: propertyKey
                    });
                    return;
                }
                throw new Error(`In class ${target.constructor.name}, function ${propertyKey}(), route path '${route}' Repeat in request type '${type}'.`);
            }
            else {
                options.routes[type] = [{
                        routePath: route,
                        propertyKey: propertyKey
                    }];
            }
            target.$options = options;
        }
    }
    return decorator;
}
exports.createRequestDecorator = createRequestDecorator;
/**
 * createParameterDecorator
 * 创建参数装饰器方法
 * @param callback
 */
function createParameterDecorator(callback) {
    function decorator(...args) {
        if (args.length === 1) {
            return (target, propertyKey, parameterIndex) => {
                const options = target.$options || {};
                const parameters = options.parameters = options.parameters || {};
                if (!Array.isArray(parameters[propertyKey])) {
                    parameters[propertyKey] = [];
                }
                parameters[propertyKey][parameterIndex] = {
                    handler: callback,
                    arg: args[0]
                };
                target.$options = options;
            };
        }
        else {
            const [target, propertyKey, parameterIndex] = args;
            const options = target.$options || {};
            const parameters = options.parameters = options.parameters || {};
            if (!Array.isArray(parameters[propertyKey])) {
                parameters[propertyKey] = [];
            }
            parameters[propertyKey][parameterIndex] = {
                handler: callback
            };
            target.$options = options;
        }
    }
    return decorator;
}
exports.createParameterDecorator = createParameterDecorator;
/**
 * createPropertyDecorator
 * 创建属性装饰器方法
 * @param callback
 */
function createPropertyDecorator(callback) {
    function decorator(...args) {
        if (args.length === 1) {
            return (target, propertyKey) => {
                const options = target.$options || {};
                if (!options.propertys)
                    options.propertys = {};
                const { propertys } = options;
                propertys[propertyKey] = {
                    handler: callback,
                    arg: args[0]
                };
                target.$options = options;
            };
        }
        else {
            const [target, propertyKey] = args;
            const options = target.$options || {};
            if (!options.propertys)
                options.propertys = {};
            const { propertys } = options;
            propertys[propertyKey] = {
                handler: callback
            };
            target.$options = options;
        }
    }
    return decorator;
}
exports.createPropertyDecorator = createPropertyDecorator;
/**
 * createPropertyAndParameterDecorator
 * 创建同时能兼容参数装饰器和属性装饰器方法
 * @param callback
 */
function createPropertyAndParameterDecorator(callback) {
    function decorator(...args) {
        if (args.length === 1) {
            function fn(...ags) {
                const [target, propertyKey, parameterIndex] = ags;
                handler({
                    target,
                    propertyKey,
                    parameterIndex,
                    args: args[0]
                });
            }
            return fn;
        }
        else {
            const [target, propertyKey, parameterIndex] = args;
            handler({
                target,
                propertyKey,
                parameterIndex
            });
        }
        function handler(options) {
            const { target, propertyKey, parameterIndex, args } = options;
            // If the parameterIndex is an number, it is a parameter decorator, otherwise it is an property decorator.
            const opts = target.$options || {};
            if (typeof parameterIndex !== 'number') {
                if (!opts.propertys) {
                    opts.propertys = {};
                    opts.propertys[propertyKey] = {
                        arg: args,
                        handler: callback
                    };
                }
                else {
                    opts.propertys[propertyKey] = {
                        arg: args,
                        handler: callback
                    };
                }
            }
            else {
                if (!opts.parameters) {
                    opts.parameters = {};
                    opts.parameters[propertyKey] = [];
                    opts.parameters[propertyKey][parameterIndex] = {
                        arg: args,
                        handler: callback
                    };
                }
                else {
                    if (Array.isArray(opts.parameters[propertyKey])) {
                        opts.parameters[propertyKey][parameterIndex] = {
                            arg: args,
                            handler: callback
                        };
                    }
                    else {
                        opts.parameters[propertyKey] = [];
                        opts.parameters[propertyKey][parameterIndex] = {
                            arg: args,
                            handler: callback
                        };
                    }
                }
            }
            target.$options = opts;
        }
    }
    return decorator;
}
exports.createPropertyAndParameterDecorator = createPropertyAndParameterDecorator;
/**
 * createMethodDecorator
 * 创建方法装饰器
 * @param callback
 */
function createMethodDecorator(callback) {
    function decorator(...args) {
        if (args.length < 3) {
            return (target, propertyKey, descriptor) => {
                const options = target.$options || {};
                if (!options.methods)
                    options.methods = {};
                options.methods[propertyKey] = {
                    handler: callback,
                    options: {
                        target,
                        propertyKey,
                        descriptor,
                        arg: args[0],
                        key: args[0],
                        value: args[1]
                    }
                };
                target.$options = options;
            };
        }
        else {
            const [target, propertyKey, descriptor] = args;
            const options = target.$options || {};
            if (!options.methods)
                options.methods = {};
            options.methods[propertyKey] = {
                handler: callback,
                options: {
                    target,
                    propertyKey,
                    descriptor
                }
            };
            target.$options = options;
        }
    }
    return decorator;
}
exports.createMethodDecorator = createMethodDecorator;
