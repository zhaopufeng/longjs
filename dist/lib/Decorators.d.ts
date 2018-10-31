/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Decorators
 */
import 'reflect-metadata';
import Server, { Core } from '..';
import * as pathToRegExp from 'path-to-regexp';
interface Parameters {
    [key: string]: Array<{
        handler?: ParameterDecoratorCallback;
        arg?: any;
    }>;
}
interface Propertys {
    [key: string]: {
        handler?: PropertyDecoratorCallback;
        arg?: any;
    };
}
interface MethodsOptions {
    target?: any;
    propertyKey?: string | symbol;
    descriptor?: TypedPropertyDescriptor<any>;
    arg?: any;
    key?: string;
    value?: any;
}
interface Methods {
    [key: string]: {
        handler?: MethodDecoratorCallback;
        options?: MethodsOptions;
    };
}
interface ControllerOptions {
    route?: string;
    metadatas?: Array<{
        new (...args: any[]): any;
    }>;
    parameters?: Parameters;
    propertys?: Propertys;
    methods?: Methods;
    target?: Controller;
    routes?: {
        [key: string]: Array<{
            routePath?: string;
            propertyKey?: string;
            keys?: pathToRegExp.Key[];
            RegExp?: RegExp;
        }>;
    };
}
export interface Controller {
    readonly prototype: {
        $app: Server;
        $options: ControllerOptions;
    };
    [key: string]: any;
}
export interface ControllerConstructor {
    new (...args: any[]): Controller;
    readonly prototype: {
        $options: ControllerOptions;
    };
}
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
declare type ClassDecoratorCallback = (options: ControllerOptions) => void;
declare type RequestMethodType = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT';
declare type ParameterDecoratorCallback = (ctx: Core.Context, arg?: any) => any;
declare type PropertyDecoratorCallback = (ctx: Core.Context, arg?: any) => any;
declare type MethodDecoratorCallback = (ctx: Core.Context, options: MethodsOptions) => void;
/**
 * createClassDecorator
 * 创建类装饰器方法
 */
export declare function createClassDecorator(callback: ClassDecoratorCallback): ClassDecorator;
/**
 * 创建http请求装饰器方法
 * @param type
 */
export declare function createRequestDecorator<T = any>(type: RequestMethodType): {
    (route: T): MethodDecorator;
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
};
/**
 * createParameterDecorator
 * 创建参数装饰器方法
 * @param callback
 */
export declare function createParameterDecorator<T = any>(callback: ParameterDecoratorCallback): {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (arg: T): ParameterDecorator;
};
/**
 * createPropertyDecorator
 * 创建属性装饰器方法
 * @param callback
 */
export declare function createPropertyDecorator<T = any>(callback: PropertyDecoratorCallback): {
    (target: any, propertyKey: string | symbol): void;
    (arg: T): PropertyDecorator;
};
/**
 * createPropertyAndParameterDecorator
 * 创建同时能兼容参数装饰器和属性装饰器方法
 * @param callback
 */
export declare function createPropertyAndParameterDecorator<T = any>(callback: ParameterDecoratorCallback | PropertyDecoratorCallback): {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: T): ParameterDecorator;
};
/**
 * createMethodDecorator
 * 创建方法装饰器
 * @param callback
 */
export declare function createMethodDecorator<K = any, V = any>(callback: MethodDecoratorCallback): {
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
    (key: K, value: V): MethodDecorator;
};
export {};
