/**
 * @class Router
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */

import { IControllerConstructor } from '../decoraotors'
import { Core } from '@longjs/core'
import { Layer } from './Layer';
import { RegExpOptions } from 'path-to-regexp';
import { Stack } from './Stack';
import { MatchLayer } from './MatchLayer';

export class Router {
    public layers: Map<string, Layer> = new Map()
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
        this.layers.set(path, new Layer({
            strict,
            target,
            path,
            handlers,
            metadatas,
            propertys
        }))
    }
    public match(ctx: Core.Context) {
        const layers: MatchLayer[] = []
        this.layers.forEach((Layer) => {
            const layer = Layer.matchRouter(ctx)
            if (layer) {
                layers.push(layer)
            }
        })

        return layers
    }
 }

 interface RouterOptions extends RegExpOptions {
    strict?: boolean;
    controllers?: IControllerConstructor[];
 }