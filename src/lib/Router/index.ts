import { RegExpOptions } from 'path-to-regexp'
import { Layer, LayerOpts } from './Layer'
import { Core } from 'src';
export class Router {
    public layers = new Map<string, Layer>()
    public config: RegExpOptions = {
        strict: true
    }
    constructor(options: RouterOptions = {}) {
        const { layers = [], ...config } = options
        this.config = config
        this.add(...layers)
    }
    public async handlerResponse(context: Core.Context) {
        this.layers.forEach((layer) => {
            layer.match(context)
        })
    }
    public add(...layers: LayerOpts[]) {
        layers.forEach((layerOpts) => {
            const { path } = layerOpts
            // new Layer(layerOpts, this)
            this.layers.set(path, null)
        })
    }
    public remove(path: string) {
        if (this.layers.has(path)) {
            return this.layers.delete(path)
        }
    }
}

export interface RouterOptions extends RegExpOptions {
    layers?: LayerOpts[];
}