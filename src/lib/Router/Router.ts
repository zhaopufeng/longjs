/**
 * @class Router
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */

import { IController, IControllerConstructor } from '../Decoraotors'
import { Core } from '@longjs/core'
import { Layer } from './Layer';
import { RegExpOptions } from 'path-to-regexp';
import { Stack } from './Stack';

export class Router {
    public layers: Layer[] = []
    constructor(public options: RouterOptions) {
        const { controllers = [] } = options
        controllers.forEach((Controller) => {
            this.registerController(Controller)
        })
    }
    public registerController(controller: IControllerConstructor) {
        const options = controller.prototype.____$options
        if (!options) return;
        const { target, path, handlers, metadatas, propertys } = options
        const { strict } = this.options
        this.layers.push(new Layer({
            strict,
            target,
            path,
            handlers,
            metadatas,
            propertys
        }))
    }
    public match(ctx: Core.Context) {
        const routes: Array<{
            layer: Layer,
            matches: Stack[]
        }> = []
        this.layers.filter((layer) => {
            const matches = layer.matchRouter(ctx)
            if (matches.length > 0) {
                routes.push({
                    layer,
                    matches
                })
            }
        })
        return routes
    }
 }

 interface RouterOptions extends RegExpOptions {
    strict?: boolean;
    controllers?: IControllerConstructor[];
 }