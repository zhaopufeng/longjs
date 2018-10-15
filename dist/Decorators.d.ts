/**
 * @class Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Decorators
 */
import 'reflect-metadata';
import { Server } from '.';
declare type CreateDecoratorCallback = (options: Server.ControllerOptions, propertyKey?: string | symbol, descriptorOrIndex?: TypedPropertyDescriptor<any> | number) => void;
/**
 * 自定义指令方法
 * @param callback 回调函数 返回核心的options选项
 * @param Controller 可选自定义装饰器获取到的 构造函数
 */
export declare function createDecorator(callback: CreateDecoratorCallback, Controller?: Server.Controller): Server.Decorator;
/**
 * PropertyDecorator
 * Files
 *
 * Examples
 * ```
 * ```
 */
export declare function Controller(path: string): Server.ClassDecorator;
/**
 * PropertyDecorator
 * Query
 *
 * Examples
 * ```
 * ```
 */
export declare const Query: {
    (target: Object, propertyKey: string | symbol): void;
    (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
    (field: string | string[]): ParameterDecorator;
};
/**
 * PropertyDecorator
 * Param
 *
 * Examples
 * ```
 * ```
 */
export declare const Param: {
    (target: Object, propertyKey: string | symbol): void;
    (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
    (field: string | string[]): ParameterDecorator;
};
/**
 * PropertyDecorator
 * Body
 *
 * Examples
 * ```
 * ```
 */
export declare const Body: {
    (target: Object, propertyKey: string | symbol): void;
    (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
    (field: string | string[]): ParameterDecorator;
};
/**
 * PropertyDecorator
 * Body
 *
 * Examples
 * ```
 * ```
 */
export declare const Session: {
    (target: Object, propertyKey: string | symbol): void;
    (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
    (field: string | string[]): ParameterDecorator;
};
/**
 * PropertyDecorator
 * Files
 *
 * Examples
 * ```
 * ```
 */
export declare const Files: {
    (target: Object, propertyKey: string | symbol): void;
    (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
    (field: string | string[]): ParameterDecorator;
};
export declare const Header: {
    (target: Object, propertyKey: string | symbol): void;
    (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
    (field: string | string[]): ParameterDecorator;
};
export declare const Headers: {
    (target: Object, propertyKey: string | symbol): void;
    (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
    (field: string | string[]): ParameterDecorator;
};
/**
 * RequestMethodDecorators
 * Get
 *
 * Examples
 * ```
 * ```
 */
export declare const Get: {
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
    (route: string): MethodDecorator;
};
/**
 * RequestMethodDecorators
 * All
 *
 * Examples
 * ```
 * ```
 */
export declare const All: {
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
    (route: string): MethodDecorator;
};
/**
 * RequestMethodDecorators
 * Delete
 *
 * Examples
 * ```
 * ```
 */
export declare const Delete: {
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
    (route: string): MethodDecorator;
};
/**
 * RequestMethodDecorators
 * Head
 *
 * Examples
 * ```
 * ```
 */
export declare const Head: {
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
    (route: string): MethodDecorator;
};
/**
 * RequestMethodDecorators
 * Options
 *
 * Examples
 * ```
 * ```
 */
export declare const Options: {
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
    (route: string): MethodDecorator;
};
/**
 * RequestMethodDecorators
 * Patch
 *
 * Examples
 * ```
 * ```
 */
export declare const Patch: {
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
    (route: string): MethodDecorator;
};
/**
 * RequestMethodDecorators
 * Post
 *
 * Examples
 * ```
 * ```
 */
export declare const Post: {
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
    (route: string): MethodDecorator;
};
/**
 * RequestMethodDecorators
 * Put
 *
 * Examples
 * ```
 * ```
 */
export declare const Put: {
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
    (route: string): MethodDecorator;
};
export declare const Request: {
    (target: Object, propertyKey: string | symbol): void;
    (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
    (field: string | string[]): ParameterDecorator;
};
export declare const Response: {
    (target: Object, propertyKey: string | symbol): void;
    (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
    (field: string | string[]): ParameterDecorator;
};
/**
 * PropertyDecorator
 *
 * Examples
 * ```
 * ```
 */
export declare function Database(target: Object, propertyKey: string): void;
export declare function Database(table: string): PropertyDecorator;
export {};
