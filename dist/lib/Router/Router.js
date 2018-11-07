"use strict";
/**
 * @class Router
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Layer_1 = require("./Layer");
class Router {
    constructor(options) {
        this.options = options;
        this.layers = [];
        const { controllers = [] } = options;
        controllers.forEach((Controller) => {
            this.registerController(Controller);
        });
    }
    registerController(controller) {
        const options = controller.prototype.____$options;
        if (!options)
            return;
        const { target, path, handlers, metadatas, propertys } = options;
        const { strict } = this.options;
        this.layers.push(new Layer_1.Layer({
            strict,
            target,
            path,
            handlers,
            metadatas,
            propertys
        }));
    }
    match(ctx) {
        const routes = [];
        this.layers.filter((layer) => {
            const matches = layer.matchRouter(ctx);
            if (matches.length > 0) {
                routes.push({
                    layer,
                    matches
                });
            }
        });
        return routes;
    }
}
exports.Router = Router;
