"use strict";
/**
 * @class Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Decorators
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const chalk_1 = require("chalk");
const Knex = require("knex");
const pathToRegExp = require("path-to-regexp");
/**
 * 自定义指令方法
 * @param callback 回调函数 返回核心的options选项
 * @param Controller 可选自定义装饰器获取到的 构造函数
 */
function createDecorator(callback, Controller) {
    function decorator(...args) {
        if (args.length === 1) { // 只有一个参数时是类装饰器 否则是其他类型装饰器
            const [target] = args;
            const meta = Reflect.getMetadata('design:paramtypes', target) || [];
            const options = target.prototype.$options = target.prototype.$options || {};
            if (options.services) {
                options.services = [...options.services, ...meta];
            }
            else {
                options.services = meta;
            }
            target.prototype.$options = {
                propertys: options.propertys || {},
                handlers: options.handlers || {},
                services: options.services,
                parameters: options.parameters || {},
                databases: options.databases || {},
                target: target
            };
            callback(target.prototype.$options);
        }
        else {
            const [target, propertyKey, descriptor] = args;
            const options = target.$options = target.$options || {};
            target.$options = {
                propertys: options.propertys || {},
                handlers: options.handlers || {},
                parameters: options.parameters || {},
                databases: options.databases || {}
            };
            callback(target.$options, propertyKey, descriptor);
        }
    }
    if (!Controller) {
        return decorator;
    }
    else {
        const meta = Reflect.getMetadata('design:paramtypes', Controller);
        if (Controller.prototype) {
            const options = Controller.prototype.$options;
            if (options.services) {
                options.services = [...options.services, ...meta];
            }
            else {
                options.services = meta;
            }
            Controller.prototype.$options = options || {};
            Controller.prototype.$options = {
                propertys: options.propertys || {},
                handlers: options.handlers || {},
                services: options.services,
                parameters: options.parameters || {},
                databases: options.databases || {}
            };
            callback(Controller.prototype.$options);
        }
        else {
            Controller.$options = Controller.$options || {};
            const options = Controller.$options;
            Controller.$options = {
                propertys: options.propertys || {},
                handlers: options.handlers || {},
                services: options.services || [],
                parameters: options.parameters || {},
                databases: options.databases || {}
            };
            callback(Controller.$options);
        }
    }
}
exports.createDecorator = createDecorator;
/**
 * PropertyDecorator
 * Files
 *
 * Examples
 * ```
 * ```
 */
function Controller(path) {
    return createDecorator((options) => {
        const baseRoute = options.baseRoute = (path + '/').replace(/[\/]{2,}/g, '/');
        options.target.$options = options;
        const handlers = options.handlers;
        if (handlers['/index']) {
            handlers[baseRoute] = JSON.parse(JSON.stringify(handlers['/index']));
        }
        Object.keys(handlers).forEach((key) => {
            if (!/\/$/.test(key)) {
                const path = (baseRoute + key).replace(/[\/]{2,}/g, '/');
                const keys = [];
                handlers[key].regexp = pathToRegExp(path, keys, {
                    strict: true
                });
                handlers[key].keys = keys;
            }
            else {
                const keys = [];
                handlers[key].regexp = pathToRegExp(baseRoute, keys, {
                    strict: true
                });
                handlers[key].keys = keys;
            }
        });
        options.match = (ctx) => {
            ctx.controllers = ctx.controllers || [];
            const matched = [];
            Object.keys(handlers).forEach((key) => {
                const handler = handlers[key];
                if (handler.regexp.test(ctx.path) && !~~handler.type.indexOf(ctx.method)) {
                    matched.push(handler);
                    const data = handler.regexp.exec(ctx.path);
                    handler.keys.forEach((key, index) => {
                        ctx.params[key.name] = data[index + 1];
                    });
                }
            });
            if (matched.length > 0) {
                ctx.controllers.push({
                    target: options.target,
                    handlers: matched
                });
            }
        };
        // Inject services
        options.injectServices = function (ctx) {
            return options.services.map((K) => {
                return new K(ctx);
            });
        };
        options.injectParameters = function (ctx, propertyKey) {
            // Get parameters decorators params.
            const parameters = options.parameters;
            // result.
            const params = [];
            // Check whether there are decorator data on the routing method.
            if (!Array.isArray(parameters[propertyKey]))
                return [];
            parameters[propertyKey].forEach((k) => {
                params[k.parameterIndex] = params[k.parameterIndex] || {};
                if (Array.isArray(k.args)) {
                    k.args.forEach((value) => {
                        const data = ctx[k.type] || ctx.request[k.type];
                        if (typeof data === 'object') {
                            params[k.parameterIndex][value] = data[value];
                        }
                    });
                }
                else if (typeof k.args === 'object') {
                    // mark
                    // const data: object | undefined = (ctx as any)[k.type] || (ctx.request as any)[k.type]
                    // const result: any = {}
                    // for (let key in k.args) {
                    //     if (!data) return;
                    //     const d = (data as any)[key]
                    //     if (!d) return;
                    //     if (d instanceof (k.args as any)[key]) {
                    //         result[key] = (data as any)[key]
                    //     }
                    // }
                    // params[k.parameterIndex] = result
                }
                else if (typeof k.args === 'string') {
                    params[k.parameterIndex] = ctx[k.type][k.args] || ctx.request[k.type][k.args];
                }
                else {
                    params[k.parameterIndex] = ctx[k.type] || ctx.request[k.type];
                }
            });
            return params;
        };
        // Inject databases
        options.injectDatabases = function (config) {
            const databases = options.databases;
            Object.keys(databases).forEach((key) => {
                if (typeof databases[key] === 'string') {
                    options.target.prototype[key] = Knex(config)(databases[key]);
                }
                else {
                    options.target.prototype[key] = Knex(config);
                }
            });
        };
        // Inject propertys
        options.injectPropertys = function (ctx) {
            const propertys = Object.keys(options.propertys);
            propertys.forEach((key) => {
                const type = options.propertys[key];
                if (type === 'session') {
                    options.target.prototype[key] = ctx['session'];
                }
                else {
                    options.target.prototype[key] = ctx.request[type];
                }
            });
        };
    });
}
exports.Controller = Controller;
/**
 * createPropertyDecorator
 * @param type
 */
function createPropertyOrParameterDecorator(type) {
    function decorator(...args) {
        function handler(options, propertyKey, parameterIndex) {
            if (typeof parameterIndex === 'number') { // 参数装饰器
                const key = propertyKey;
                options.parameters[key] = options.parameters[key] || [];
                options.parameters[key].push({
                    parameterIndex,
                    type,
                    args: args.length === 1 ? args[0] : undefined
                });
            }
            else { // 属性装饰器
                options.propertys[propertyKey] = type;
            }
        }
        if (args.length === 1) {
            return createDecorator((options, propertyKey, parameterIndex) => {
                handler(options, propertyKey, parameterIndex);
            });
        }
        else {
            const [target, propertyKey, parameterIndex] = args;
            createDecorator((options) => {
                handler(options, propertyKey, parameterIndex);
            }, target);
        }
    }
    return decorator;
}
/**
 * PropertyDecorator
 * Query
 *
 * Examples
 * ```
 * ```
 */
exports.Query = createPropertyOrParameterDecorator('query');
/**
 * PropertyDecorator
 * Param
 *
 * Examples
 * ```
 * ```
 */
exports.Param = createPropertyOrParameterDecorator('params');
/**
 * PropertyDecorator
 * Body
 *
 * Examples
 * ```
 * ```
 */
exports.Body = createPropertyOrParameterDecorator('body');
/**
 * PropertyDecorator
 * Body
 *
 * Examples
 * ```
 * ```
 */
exports.Session = createPropertyOrParameterDecorator('session');
/**
 * PropertyDecorator
 * Files
 *
 * Examples
 * ```
 * ```
 */
exports.Files = createPropertyOrParameterDecorator('files');
exports.Header = createPropertyOrParameterDecorator('header');
exports.Headers = createPropertyOrParameterDecorator('headers');
/**
 * createRequestMethodDecorator
 * @param type
 */
function createRequestMethodDecorator(type) {
    function decorator(...args) {
        function handler(options, propertyKey, descriptor, path) {
            // 如果路径不是以 '/' 开头 添加 '/'
            if (!/^\//.test(path)) {
                path = '/' + path;
            }
            // 检测路由集合中是否已包含该方法
            if (options.handlers[path]) {
                // 如果method 存在 说明该路由已包含一种请求方式
                if (options.handlers[path].type) {
                    // 如果为数组说明已经包含2个及以上的请求方式
                    if (Array.isArray(options.handlers[path].type)) {
                        const types = options.handlers[path].type;
                        if ((types.indexOf(type) !== -1)) {
                            throw new Error(chalk_1.default.redBright(`router path ${path} ${type} is repeat in method ${descriptor.value.name}`));
                        }
                        types.push(type);
                    }
                    else {
                        options.handlers[path].type = [...options.handlers[path].type, type];
                    }
                }
            }
            else {
                options.handlers[path] = {
                    propertyKey,
                    type: [type]
                };
            }
        }
        if (args.length === 1) {
            const [route] = args;
            return createDecorator((options, propertyKey, descriptor) => {
                handler(options, propertyKey, descriptor, route || propertyKey);
            });
        }
        else {
            const [target, propertyKey, descriptor] = args;
            createDecorator((options) => {
                handler(options, propertyKey, descriptor, propertyKey);
            }, target);
        }
    }
    return decorator;
}
/**
 * RequestMethodDecorators
 * Get
 *
 * Examples
 * ```
 * ```
 */
exports.Get = createRequestMethodDecorator('GET');
/**
 * RequestMethodDecorators
 * All
 *
 * Examples
 * ```
 * ```
 */
exports.All = createRequestMethodDecorator('ALL');
/**
 * RequestMethodDecorators
 * Delete
 *
 * Examples
 * ```
 * ```
 */
exports.Delete = createRequestMethodDecorator('DELETE');
/**
 * RequestMethodDecorators
 * Head
 *
 * Examples
 * ```
 * ```
 */
exports.Head = createRequestMethodDecorator('HEAD');
/**
 * RequestMethodDecorators
 * Options
 *
 * Examples
 * ```
 * ```
 */
exports.Options = createRequestMethodDecorator('OPTIONS');
/**
 * RequestMethodDecorators
 * Patch
 *
 * Examples
 * ```
 * ```
 */
exports.Patch = createRequestMethodDecorator('PATCH');
/**
 * RequestMethodDecorators
 * Post
 *
 * Examples
 * ```
 * ```
 */
exports.Post = createRequestMethodDecorator('POST');
/**
 * RequestMethodDecorators
 * Put
 *
 * Examples
 * ```
 * ```
 */
exports.Put = createRequestMethodDecorator('PUT');
exports.Request = createPropertyOrParameterDecorator('request');
exports.Response = createPropertyOrParameterDecorator('response');
function Database(...args) {
    if (args.length === 1) {
        const table = args[0];
        return createDecorator((options, propertyKey) => {
            options.databases[propertyKey] = table;
        });
    }
    else {
        const target = args[0];
        const propertyKey = args[1];
        createDecorator((options) => {
            options.databases[propertyKey] = null;
        }, target);
    }
}
exports.Database = Database;
