import { Layer, Property } from './Layer'
import { Handler } from './Handler';
import { Core } from 'src';

export class Controller {
    public path: string;
    public Controller: { new (...args: any[]): any };
    public propertys: Map<string, Property>;
    public services: object[];
    public handlers: Handler[];
    constructor(options: Layer, context: Core.Context) {
        const { services, propertys, Controller, path } = options
        this.path = path
        this.services = services.map((k) => {
            return new k(context)
        })
        this.propertys = propertys
        this.Controller = Controller
    }
}