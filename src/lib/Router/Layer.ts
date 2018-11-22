import { StackOpts, Stack } from './Stack';
import { Core } from 'src';
import { Router } from '.';
import { Handler } from './Handler';
import { Controller } from './Controller';

export class Layer {
    public path: string;
    public Controller: { new (...args: any[]): any };
    public propertys: Map<string, Property>;
    public services: Array<{ new (...args: any[]): any }> = []
    public stacks: Stack[];
    constructor(options: LayerOpts, public router: Router) {
        const { Controller, propertys, services, handlers } = options
        this.Controller = Controller
        this.propertys = propertys
        this.services = services
        this.addHandler(...handlers)
    }
    public addHandler(...handlers: StackOpts[]) {
        handlers.forEach((handlerOpts) => {
            this.stacks.push(new Stack(handlerOpts, this))
        })
    }
    public match(context: Core.Context) {
        const handlers: Handler[] = []
        this.stacks.forEach((k) => {
            const handler = k.match(context)
            if (handler) {
                handlers.push(handler)
            }
        })
        if (handlers.length > 0) {
            const { path, Controller, propertys, services } = this
            return new Controller({
                path,
                Controller,
                propertys,
                services,
                handlers
            }, context)
        }
    }
}

export interface LayerOpts {
    path?: string;
    Controller?: { new (...args: any[]): any };
    propertys?: Map<string, Property>;
    services?: Array<{ new (...args: any[]): any }>;
    handlers?: StackOpts[];
}

export interface Property {
    callback?(ctx: Core.Context): void;
    values?: any;
}