/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */
import * as Knex from 'knex';
/**
 * Controller Decorator
 * @param path
 */
export declare function Controller(path: string): ClassDecorator;
export interface Header {
    [key: string]: any;
}
/**
 * Parameter && Property Decorator
 * Header
 */
export declare const Header: {
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
export interface Session {
    [key: string]: any;
}
export declare const Session: {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: string[]): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
};
export declare type Database = Knex.QueryInterface | Knex;
export declare const Database: {
    (target: any, propertyKey: string, parameterIndex: number): void;
    (target: any, propertyKey: string | symbol): void;
    (arg: string): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
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
