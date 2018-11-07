/**
 * Controller
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong
 */
/// <reference types="node" />
import { Core } from '@longjs/core';
import { IncomingHttpHeaders } from 'http';
import 'reflect-metadata';
interface IClassDecoratorCallback {
    (options: Options): void;
}
/**
 * @method createClassDecorator
 */
export declare function createClassDecorator(callback: IClassDecoratorCallback): ClassDecorator;
export declare function Controller(path: string): ClassDecorator;
export interface IRequestDecorator<T> {
    (route: string): MethodDecorator;
    <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
}
export declare function createRequestDecorator<T, Decorator = IRequestDecorator<any>>(type: RequestMethodType): Decorator;
export declare const All: IRequestDecorator<any>;
export declare const Copy: IRequestDecorator<any>;
export declare const Delete: IRequestDecorator<any>;
export declare const Get: IRequestDecorator<any>;
export declare const Head: IRequestDecorator<any>;
export declare const Link: IRequestDecorator<any>;
export declare const Lock: IRequestDecorator<any>;
export declare const Options: IRequestDecorator<any>;
export declare const Patch: IRequestDecorator<any>;
export declare const Propfind: IRequestDecorator<any>;
export declare const Post: IRequestDecorator<any>;
export declare const Purge: IRequestDecorator<any>;
export declare const Put: IRequestDecorator<any>;
export declare const Unlink: IRequestDecorator<any>;
export declare const Unlock: IRequestDecorator<any>;
export declare const View: IRequestDecorator<any>;
export interface IMethodDecorator<V, T = any> {
    (arg: V): MethodDecorator;
}
export interface IMethodDecoratorCallback {
    (options: {
        statusCode?: number;
        headers?: IncomingHttpHeaders;
        responseType?: string;
        statusMessage?: string;
        callback?: DecoratorCallback;
        exceptioncapture?: ExceptionCaptureCallback;
    }, values?: any): void;
}
export interface IMethodDecoratorCallbackOptions {
    statusCode?: number;
    headers?: IncomingHttpHeaders;
    responseType?: string;
    statusMessage?: string;
    callback?: DecoratorCallback;
    exceptioncapture?: ExceptionCaptureCallback;
}
export declare function createMehodDecorator<V, Decorator = IMethodDecorator<V>, T = any>(id: string, callback: IMethodDecoratorCallback): Decorator;
export declare const Type: IMethodDecorator<string, any>;
export declare const Status: IMethodDecorator<number, any>;
export declare const Message: IMethodDecorator<string, any>;
export declare const Catch: IMethodDecorator<Core.HttpExceptionConstructor, any>;
export declare const Exception: IMethodDecorator<Core.HttpException, any>;
export interface IParameterDecorator<K, V> {
    (key: K, value: V): ParameterDecorator;
}
export interface IParameterDecoratorCallback {
    (ctx: Core.Context, values?: any): any | Core.HttpException;
}
export declare function createParameterDecorator<K = any, V = any, Decorator = IParameterDecorator<K, V>>(id: string, callback: IParameterDecoratorCallback, ...values: any[]): Decorator;
export interface IPropertyDecorator<K> {
    (key: K): PropertyDecorator;
    (target: any, propertyKey: string): void;
}
export interface IPropertyDecoratorCallback {
    (ctx: Core.Context, values?: any): any | Core.HttpException;
}
export declare function createPropertyDecorator<K, Decorator = IPropertyDecorator<K>>(id: string, callback: IPropertyDecoratorCallback, ...values: any[]): Decorator;
export interface CombinedDecorator {
    (target: any, propertyKey: string, parametersIndex: number): void;
    (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void;
}
export interface CombinedDecoratorCallback {
    (ctx: Core.Context | IMethodDecoratorCallbackOptions, values?: any): any | Core.HttpException;
}
export declare function createCombinedDecorator<Decorator = CombinedDecorator>(id: string, callback: CombinedDecoratorCallback, more?: boolean): Decorator;
export interface NoParamsDecorator {
    (target: Object, propertyKey: string): void;
    (target: Object, propertyKey: string, parameterIndex: number): void;
}
export declare const Request: NoParamsDecorator;
export declare const Response: NoParamsDecorator;
export declare const Session: NoParamsDecorator;
/**
 * interface
 */
export interface IParameter {
    callback?: DecoratorCallback;
    index?: number;
    values?: any;
}
export interface IParameters {
    [id: string]: IParameter;
}
export interface IMethod {
    callback?: DecoratorCallback;
    values?: any;
}
export interface IMethods {
    [id: string]: IMethod;
}
export interface IHandler {
    routePath?: string[];
    methodTypes?: RequestMethodType[];
    parameters?: IParameters;
    methods?: IMethods;
    statusCode?: number;
    headers?: IncomingHttpHeaders;
    responseType?: string;
    statusMessage?: string;
    exceptioncapture?: {
        [id: string]: ExceptionCaptureCallback;
    };
}
export interface IHandlers {
    [key: string]: IHandler;
}
export interface IProperty {
    [id: string]: {
        callback?: DecoratorCallback;
        values?: any;
    };
}
export interface IPropertys {
    [key: string]: IProperty;
}
export interface Options {
    target?: IControllerConstructor;
    propertys?: IPropertys;
    metadatas?: Array<{
        new (...args: any[]): any;
    }>;
    handlers?: IHandlers;
    path?: string;
}
export interface IController {
    prototype?: {
        ____$options?: Options;
    };
}
export interface IControllerConstructor {
    new (...args: any[]): any;
    prototype?: {
        ____$options?: Options;
    };
}
export interface DecoratorCallback {
    (ctx: Core.Context, values?: any): void;
}
export interface ExceptionCaptureCallback {
    (error: Core.HttpException, decoratorValue?: Core.HttpException | Core.HttpExceptionConstructor): void;
}
export declare type RequestMethodType = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT' | 'COPY' | 'LINK' | 'UNLINK' | 'PURGE' | 'LOCK' | 'UNLOCK' | 'PORPFIND' | 'VIEW';
export {};
