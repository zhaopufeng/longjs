import { MatchStack } from './MatchStack';
import { IControllerConstructor, IPropertys } from '../decoraotors';

/**
 * @class MatchStack
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */

export class MatchLayer {
    public readonly stacks: MatchStack[];
    public readonly path: string;
    public readonly target: IControllerConstructor;
    public readonly metadatas: Array<{ new(...args: any[]): any }>;
    public readonly propertys: Map<string, IPropertys>;
    public readonly strict: boolean;
    constructor(options: MatchLayerOptions) {
        this.stacks = options.stacks
        this.path = options.path
        this.target = options.target
        this.metadatas = options.metadatas
        this.propertys = options.propertys
        this.strict = options.strict
    }
}

export interface MatchLayerOptions {
    stacks: MatchStack[]
    path: string;
    target: IControllerConstructor;
    metadatas: Array<{ new(...args: any[]): any }>;
    propertys: Map<string, IPropertys>;
    strict: boolean;
}