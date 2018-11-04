/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */
/// <reference types="node" />
import { Core } from '@longjs/Core';
import 'validator';
import 'reflect-metadata';
import { ValidatorKeys } from './lib';
import { IncomingHttpHeaders } from 'http';
/**
 * Controller Decorator
 * @param path
 */
export declare function Controller(path: string): ClassDecorator;
/**
 * HeadersDecorator
 */
export interface Headers {
    [key: string]: any;
}
interface HeadersFnDecorator {
    (key: {
        [K in keyof IncomingHttpHeaders]: string;
    }): ParameterDecorator;
}
export declare const Headers: PropertyDecorator & ParameterDecorator & HeadersFnDecorator;
/**
 * Parameter && Property Decorator
 * Body
 */
export declare type Body<T = any> = T;
export declare const Body: ParameterDecorator & PropertyDecorator & import("@longjs/Core/dist/lib/Decorators").FnPropertyAndParameterDecorator<number>;
/**
 * Parameter && Property Decorator
 * Query
 */
export declare type Query<T = any> = T;
export declare const Query: ParameterDecorator & PropertyDecorator & import("@longjs/Core/dist/lib/Decorators").FnPropertyAndParameterDecorator<ValidatorKeys>;
/**
 * Parameter && Property Decorator
 * Request
 */
export declare type Params<T = any> = T;
export declare const Params: ParameterDecorator & PropertyDecorator & import("@longjs/Core/dist/lib/Decorators").FnPropertyAndParameterDecorator<ValidatorKeys>;
/**
 * Parameter && Property Decorator
 * Session
 */
export interface Session {
    [key: string]: any;
}
export declare const Session: ParameterDecorator & PropertyDecorator & import("@longjs/Core/dist/lib/Decorators").FnPropertyAndParameterDecorator<string[]>;
/**
 * Parameter && Property Decorator
 * Request
 */
export declare type Request = Core.Request;
export declare const Request: ParameterDecorator & PropertyDecorator & import("@longjs/Core/dist/lib/Decorators").FnPropertyAndParameterDecorator<string[]>;
/**
 * Parameter && Property Decorator
 * Request
 */
export declare type Response = Core.Response;
export declare const Response: ParameterDecorator & PropertyDecorator & import("@longjs/Core/dist/lib/Decorators").FnPropertyAndParameterDecorator<string[]>;
/**
 * Parameter && Property Decorator
 * Files
 */
export interface Files {
    [key: string]: any;
}
export declare const Files: ParameterDecorator & PropertyDecorator & import("@longjs/Core/dist/lib/Decorators").FnPropertyAndParameterDecorator<string[]>;
/**
 * MethodDecorators
 * Catch
 */
export declare const Catch: import("@longjs/Core/dist/lib/Decorators").HttpExceptionCaptureDecorator;
/**
 * MethodDecorators
 * HttpException
 */
export declare const Exception: import("@longjs/Core/dist/lib/Decorators").HttpExceptionCaptureDecorator;
/**
 * MethodDecorators
 * Header
 */
interface StatusDecorator {
    (statusCode: number): any;
}
export declare const Status: StatusDecorator;
/**
 * MethodDecorators
 * Header
 */
declare type Header = {
    [K in keyof IncomingHttpHeaders]: string;
};
interface HeaderDecorator {
    (header: Header): any;
}
export declare const Header: HeaderDecorator;
/**
 * RequestMethodDecorators
 * Get
 */
export declare const Get: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * All
 */
export declare const All: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Delete
 */
export declare const Delete: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Head
 */
export declare const Head: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Options
 */
export declare const Options: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Patch
 */
export declare const Patch: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Post
 */
export declare const Post: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Put
 */
export declare const Put: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Copy
 */
export declare const Copy: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Link
 */
export declare const Link: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Unlink
 */
export declare const Unlink: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Purge
 */
export declare const Purge: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Lock
 */
export declare const Lock: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Unlock
 */
export declare const Unlock: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * Porpfind
 */
export declare const Porpfind: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
/**
 * RequestMethodDecorators
 * View
 */
export declare const View: import("@longjs/Core/dist/lib/Decorators").RequestMethodDecorator;
export * from './lib';
