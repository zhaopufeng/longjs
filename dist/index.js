"use strict";
/**
 * Controller Plugin
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const Router_1 = require("./lib/Router");
class ControllerPlugin {
    constructor(options) {
        const { strict, controllers } = options;
        this.strict = strict;
        this.router = new Router_1.Router({
            strict: true,
            controllers
        });
    }
    init(options) {
        options.configs.routerConfig = options;
    }
    async handlerRequest(ctx, configs, data) {
        const routes = data.routes = this.router.match(ctx);
    }
    async handlerResponse(ctx, config, data) {
        const { routes } = data;
        for (let route of routes) {
            const { layer, matches } = route;
            const { target, metadatas } = layer;
            const controller = new target(...metadatas.map((K) => new K(ctx)));
            for (let matche of matches) {
                const { propertyKey, statusCode, responseType, statusMessage, headers = {}, parameters = {}, exceptioncapture = {} } = matche;
                try {
                    const injectParameters = [];
                    Object.keys(parameters).forEach((k) => {
                        injectParameters[parameters[k].index] = parameters[k].callback(ctx, parameters[k].values);
                    });
                    let data = await controller[propertyKey](...injectParameters);
                    if (data) {
                        if (statusCode)
                            ctx.status = statusCode;
                        if (responseType)
                            ctx.type = responseType;
                        if (statusMessage)
                            ctx.response.message = statusMessage;
                        ctx.body = data;
                    }
                    if (headers) {
                        Object.keys(headers).forEach((key) => {
                            ctx.response.set(key, headers[key]);
                        });
                    }
                }
                catch (error) {
                    const catchs = exceptioncapture['Catch'];
                    const exception = exceptioncapture['Exception'];
                    if (catchs) {
                        catchs(error);
                    }
                    else if (exception) {
                        exception(error);
                    }
                    else {
                        throw error;
                    }
                }
            }
        }
    }
}
exports.default = ControllerPlugin;
__export(require("./lib"));
