/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */
import { Core } from '@longjs/Core';
import 'validator';
import 'reflect-metadata';
import { ValidatorKeys } from './lib';
/**
 * Controller Decorator
 * @param path
 */
export declare function Controller(path: string): ClassDecorator;
/**
 * Parameter && Property Decorator
 * Header
 */
export interface Headers {
    [key: string]: any;
}
export declare const Headers: ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator & ((arg: string[]) => ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator);
/**
 * Parameter && Property Decorator
 * Body
 */
export interface Body {
    [key: string]: any;
}
export declare const Body: ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator & ((arg: ValidatorKeys) => ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator);
/**
 * Parameter && Property Decorator
 * Query
 */
export interface Query {
    [key: string]: any;
}
export declare const Query: ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator & ((arg: ValidatorKeys) => ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator);
/**
 * Parameter && Property Decorator
 * Request
 */
export interface Params {
    [key: string]: any;
}
export declare const Params: ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator & ((arg: ValidatorKeys) => ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator);
/**
 * Parameter && Property Decorator
 * Session
 */
export interface Session {
    [key: string]: any;
}
export declare const Session: ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator & ((arg: string[]) => ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator);
/**
 * Parameter && Property Decorator
 * Request
 */
export declare type Request = Core.Request;
export declare const Request: ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator & ((arg: string[]) => ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator);
/**
 * Parameter && Property Decorator
 * Request
 */
export declare type Response = Core.Response;
export declare const Response: ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator & ((arg: string[]) => ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator);
/**
 * Parameter && Property Decorator
 * Files
 */
export interface Files {
    [key: string]: any;
}
export declare const Files: ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator & ((arg: string[]) => ((target: Object, propertyKey: string | symbol, parameterIndex?: number) => void) & PropertyDecorator);
/**
 * MethodDecorators
 * Type
 */
export declare const Type: {
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
    (key: string, value: any): MethodDecorator;
};
/**
 * MethodDecorators
 * Status
 */
export declare const Status: {
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
    (key: string, value: any): MethodDecorator;
};
/**
 * RequestMethodDecorators
 * Get
 */
export declare const Get: {
    (route: string): MethodDecorator;
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
};
/**
 * RequestMethodDecorators
 * All
 */
export declare const All: {
    (route: string): MethodDecorator;
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
};
/**
 * RequestMethodDecorators
 * Delete
 */
export declare const Delete: {
    (route: string): MethodDecorator;
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
};
/**
 * RequestMethodDecorators
 * Head
 */
export declare const Head: {
    (route: string): MethodDecorator;
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
};
/**
 * RequestMethodDecorators
 * Options
 */
export declare const Options: {
    (route: string): MethodDecorator;
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
};
/**
 * RequestMethodDecorators
 * Patch
 */
export declare const Patch: {
    (route: string): MethodDecorator;
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
};
/**
 * RequestMethodDecorators
 * Post
 */
export declare const Post: {
    (route: string): MethodDecorator;
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
};
/**
 * RequestMethodDecorators
 * Put
 */
export declare const Put: {
    (route: string): MethodDecorator;
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
};
export * from './lib';
