/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Decorators
 */
import Server, { Core } from '..';
import * as pathToRegExp from 'path-to-regexp';
declare type ClassDecoratorCallback = (options: ControllerOptions) => void;
declare type RequestMethodType = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT' | 'COPY' | 'LINK' | 'UNLINK' | 'PURGE' | 'LOCK' | 'UNLOCK' | 'PORPFIND' | 'VIEW';
declare type ParameterDecoratorHttpCallback = (ctx: Core.Context, data?: any) => void;
declare type PropertyDecoratorHttpCallback = (ctx: Core.Context, data?: any) => void;
declare type MethodDecoratorHttpCallback = (ctx: Core.Context, data?: any) => void;
interface Parameter {
    callback?: ParameterDecoratorHttpCallback;
    id?: string;
    value?: any;
}
interface Parameters {
    [key: string]: Parameter[];
}
interface Propertys {
    [key: string]: {
        callback?: PropertyDecoratorHttpCallback;
        value?: any;
    };
}
interface Methods {
    [key: string]: {
        callback?: MethodDecoratorHttpCallback;
        value?: any;
    };
}
interface Router {
    routePath?: string;
    propertyKey?: string;
    keys?: pathToRegExp.Key[];
    RegExp?: RegExp;
}
export interface ControllerOptions {
    route?: string;
    metadatas?: Array<{
        new (...args: any[]): any;
    }>;
    parameters?: Parameters;
    propertys?: Propertys;
    methods?: Methods;
    target?: Controller;
    routes?: {
        [key: string]: Router[];
    };
}
export interface Controller {
    readonly prototype: {
        $app: Server;
        ____$options: ControllerOptions;
    };
    [key: string]: any;
}
export interface ControllerConstructor {
    new (...args: any[]): Controller;
    readonly prototype: {
        ____$options: ControllerOptions;
    };
}
/**
 * createClassDecorator
 * 创建类装饰器方法
 */
export declare function createClassDecorator(callback: ClassDecoratorCallback): ClassDecorator;
/**
 * createMethodDecorator
 * 创建方法装饰器
 * @param callback
 */
export declare type MethodDecoratorInterface<K, V> = MethodDecorator & {
    (key: K, value?: V): MethodDecorator;
};
export interface MethodDecoratorCallback<K, V> {
    (options: ControllerOptions, decorator: [Object, string, TypedPropertyDescriptor<any>], key?: K, value?: V, ...args: any[]): ControllerOptions;
}
export declare function createMethodDecorator<K, V = any, D = MethodDecoratorInterface<K, V>>(callback: MethodDecoratorCallback<K, V>): D;
/**
 * createPropertyDecorator
 * 创建属性装饰器方法
 * @param callback
 */
export declare type PropertyDecoratorInterface<K> = PropertyDecorator & {
    (arg: K): PropertyDecorator;
};
export interface PropertyDecoratorCallback<K> {
    (options: ControllerOptions, decorator: [Object, string], key?: K, ...args: any[]): ControllerOptions;
}
export declare function createPropertyDecorator<K, D = PropertyDecoratorInterface<K>>(callback: PropertyDecoratorCallback<K>): D;
/**
 * createPropertyDecorator
 * 创建属性装饰器方法
 * @param callback
 */
export declare type ParameterDecoratorInterface<K, V> = ParameterDecorator & {
    (key: K, value?: V): ParameterDecorator;
};
export interface ParameterDecoratorCallback<K, V> {
    (options: ControllerOptions, decorator: [Object, string, number], key?: K, value?: V, ...args: any[]): ControllerOptions;
}
export declare function createParameterDecorator<K, V = any, D = ParameterDecoratorInterface<K, V>>(callback: ParameterDecoratorCallback<K, V>): D;
/**
 * createPropertyAndParameterDecorator
 * 创建同时能兼容参数装饰器和属性装饰器方法
 */
export declare type PropertyAndParameterDecorator = ParameterDecorator & PropertyDecorator;
export declare type FnPropertyAndParameterDecorator<V> = (arg: V) => PropertyAndParameterDecorator;
export declare function createPropertyAndParameterDecorator<V, D = PropertyAndParameterDecorator & FnPropertyAndParameterDecorator<V>>(id: string, callback: MethodDecoratorHttpCallback): D;
/**
 * RequestMethodDecorator
 * 创建http请求方式装饰器
 */
export declare type RequestMethodDecorator = MethodDecorator & {
    (route: string): MethodDecorator;
};
export declare function createRequestMethodDecorator(type: RequestMethodType): RequestMethodDecorator;
/**
 * createHttpExceptionDecorator
 * 创建http异常捕获装饰器
 */
export declare type HttpExceptionCaptureDecorator = MethodDecorator & {
    (HttpExceptionCaptureConstructor: Core.HttpExceptionCaptureConstructor): MethodDecorator;
};
export declare function createHttpExceptionCaptureDecorator<T>(): HttpExceptionCaptureDecorator;
export {};
