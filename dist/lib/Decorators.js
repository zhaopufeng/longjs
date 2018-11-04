"use strict";
/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Decorators
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * createClassDecorator
 * 创建类装饰器方法
 */
function createClassDecorator(callback) {
    return (target) => {
        // Get options
        let options = target.prototype.____$options || {};
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
        target.prototype.____$options = options;
    };
}
exports.createClassDecorator = createClassDecorator;
function createMethodDecorator(callback) {
    function decorator(...args) {
        if (args.length < 3 && args.length > 0) {
            return (target, propertyKey, descriptor) => {
                const [key, value] = args;
                const options = target.____$options || {};
                target.____$options = callback(options, [target, propertyKey, descriptor], key, value);
            };
        }
        else {
            const [target, propertyKey, descriptor] = args;
            const options = target.____$options || {};
            target.____$options = callback(options, [target, propertyKey, descriptor]);
        }
    }
    return decorator;
}
exports.createMethodDecorator = createMethodDecorator;
function createPropertyDecorator(callback) {
    function decorator(...args) {
        if (args.length === 1) {
            return (target, propertyKey) => {
                const [arg] = args;
                const options = target.____$options || {};
                target.____$options = callback(options, [target, propertyKey], arg);
            };
        }
        else {
            const [target, propertyKey] = args;
            const options = target.____$options || {};
            target.____$options = callback(options, [target, propertyKey]);
        }
    }
    return decorator;
}
exports.createPropertyDecorator = createPropertyDecorator;
function createParameterDecorator(callback) {
    function decorator(...args) {
        if (args.length === 1) {
            return (target, propertyKey, parameterIndex) => {
                const [key, value] = args;
                const options = target.____$options || {};
                target.____$options = callback(options, [target, propertyKey, parameterIndex], key, value);
            };
        }
        else {
            const [target, propertyKey, parameterIndex] = args;
            const options = target.____$options || {};
            target.____$options = callback(options, [target, propertyKey, parameterIndex]);
        }
    }
    return decorator;
}
exports.createParameterDecorator = createParameterDecorator;
function createPropertyAndParameterDecorator(id, callback) {
    function decorator(...args) {
        if (args.length === 1) {
            const [arg] = args;
            return (...targs) => {
                handler(arg, ...targs);
            };
        }
        else {
            handler(null, ...args);
        }
        function handler(value, ...sagrs) {
            const [target, propertyKey, parameterIndex] = sagrs;
            if (typeof parameterIndex === 'number' && sagrs.length === 3) {
                const options = target.____$options || {};
                const parameters = options.parameters = options.parameters || {};
                const parameter = parameters[propertyKey] = parameters[propertyKey] || [];
                parameter[parameterIndex] = {
                    callback,
                    value,
                    id
                };
            }
            else {
                const options = target.____$options || {};
                const propertys = options.propertys = options.propertys || {};
                const property = propertys[propertyKey] = propertys[propertyKey] || {};
                property.callback = callback;
                property.value = value;
            }
        }
    }
    return decorator;
}
exports.createPropertyAndParameterDecorator = createPropertyAndParameterDecorator;
function createRequestMethodDecorator(type) {
    return createMethodDecorator((options, decorator, route) => {
        const [target, propertyKey] = decorator;
        const routes = options.routes = options.routes || {};
        if (!route)
            route = propertyKey;
        // If the path does not start with '/',insert '/' before route.
        if (!/^\//.test(route))
            route = `/${route}`;
        // If the path Contains double `//`, replace with '/'.
        route = route.replace(/[\/]{2,}/g, '/');
        // If request type `ALL` in routes return
        if (routes['ALL']) {
            if (routes['ALL'].length > 0)
                return options;
        }
        const router = routes[type] = routes[type] || [];
        // Check if the route is duplicated
        const filters = router.filter((k) => k.routePath === route);
        // If not is duplicated
        if (filters.length > 0)
            throw new Error(`In class ${target.constructor.name}, function ${propertyKey}(), route path '${route}' Repeat in request type '${type}'.`);
        // Append this router
        router.push({ routePath: route, propertyKey: propertyKey });
        return options;
    });
}
exports.createRequestMethodDecorator = createRequestMethodDecorator;
function createHttpExceptionCaptureDecorator() {
    return createMethodDecorator((options, decorator, HttpExceptionCapture) => {
        const [target, propertyKey, descriptor] = decorator;
        const { value } = descriptor;
        descriptor.value = function (...args) {
            try {
                args.forEach((k) => {
                    if (k instanceof Error) {
                        throw k;
                    }
                });
                value.call(this, ...args);
            }
            catch (error) {
                if (HttpExceptionCapture) {
                    throw HttpExceptionCapture(error);
                }
                else {
                    throw error;
                }
            }
        };
        return options;
    });
}
exports.createHttpExceptionCaptureDecorator = createHttpExceptionCaptureDecorator;
