/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */
import { Core } from '@longjs/Core';
import 'reflect-metadata';
/**
 * Controller Decorator
 * @param path
 */
export declare function Controller(path: string): ClassDecorator;
export interface Headers {
    [key: string]: any;
}
/**
 * Parameter && Property Decorator
 * Header
 */
export declare const Headers: {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: string[]): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
};
/**
 * Parameter && Property Decorator
 * Body
 */
export interface Body {
    [key: string]: any;
}
export declare const Body: {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: string[]): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
};
/**
 * Parameter && Property Decorator
 * Query
 */
export interface Query {
    [key: string]: any;
}
export declare const Query: {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: string[]): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
};
/**
 * Parameter && Property Decorator
 * Session
 */
export interface Session {
    [key: string]: any;
}
export declare const Session: {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: string[]): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
};
/**
 * Parameter && Property Decorator
 * Request
 */
export declare type Request = Core.Request;
export declare const Request: {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: string[]): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
};
/**
 * Parameter && Property Decorator
 * Request
 */
export declare type Response = Core.Response;
export declare const Response: {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: string[]): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
};
/**
 * Parameter && Property Decorator
 * Request
 */
export interface Params {
    [key: string]: any;
}
export declare const Params: {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: string[]): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
};
/**
 * Parameter && Property Decorator
 * Files
 */
export interface Files {
    [key: string]: any;
}
export declare const Files: {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: string[]): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
};
/**
 * MethodDecorators
 * Type
 */
export declare const Type: {
    (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void | TypedPropertyDescriptor<any>;
    (key: any, value: any): MethodDecorator;
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
