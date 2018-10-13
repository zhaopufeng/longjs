/**
 * @class CreateContext
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 0:17
 */
/// <reference path="../../node_modules/@types/node/index.d.ts" />
/// <reference types="node" />
import { Core } from '../interface';
import * as httpAssert from 'http-assert';
import * as Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import Server from '..';
declare const COOKIES: unique symbol;
export declare class CreateContext implements Core.Context {
    req: IncomingMessage | Http2ServerRequest;
    res: ServerResponse | Http2ServerResponse;
    request: Core.Request;
    response: Core.Response;
    app: Server;
    /**
     * constructor
     * @param req IncomingMessage
     * @param res ServerResponse
     * @param request Request
     * @param response Response
     */
    constructor(req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse, request: Core.Request, response: Core.Response, app: Server);
    [COOKIES]: Cookies;
    session: any;
    respond: boolean;
    /**
     * @property writable
     * Get response writable
     */
    readonly writable: boolean;
    /**
     * @property params
     * Get request params
     */
    readonly params: any;
    /**
     * @property URL
     * Get request URL
     */
    readonly URL: URL;
    /**
     * @property finished
     * Get response state
     */
    readonly finished: boolean;
    /**
     * @property accept
     * Get request accept
     */
    readonly accept: any;
    /**
     * @method append
     * append response headers
     */
    append(field: string, val: string | string[]): void;
    /**
     * @method assert
     * Http assert
     */
    assert: typeof httpAssert;
    /**
     * @method attachment
     * @param filename string
     * File reponse
     */
    attachment(filename: string): void;
    /**
     * @property body
     * Get request body
     */
    /**
    * @property body
    * Set response body
    */
    body: any;
    /**
     * @property files
     * Get request files
     */
    /**
    * @property files
    * Set request files
    */
    files: any;
    /**
     * @property cookies
     * Get request cookies
     */
    /**
    * @property cookies
    * Set request cookies
    */
    cookies: Cookies;
    /**
     * @property etag
     * Get response etag
     */
    /**
    * @property etag
    * Set response etag
    */
    etag: string;
    /**
     * Indicates whether the request is “fresh.” It is the opposite of req.stale.
     *  - It is true if the cache-control request header doesn’t have a no-cache directive and any of the following are true:
     *  - The if-modified-since request header is specified and last-modified request header is equal to or earlier than the modified response header.
     *  - The if-none-match request header is *.
     *  - The if-none-match request header, after being parsed into its directives, does not match the etag response header.
     */
    readonly fresh: boolean;
    /**
     * @property header
     * Get request header
     */
    readonly header: import("http2").IncomingHttpHeaders;
    /**
     * @property headers
     * Get request headers
     */
    /**
    * @property headers
    * Set request headers
    */
    headers: any;
    /**
     * @property headerSent
     * Get request headerSent
     */
    readonly headerSent: boolean;
    /**
     * @property host
     * Get request host
     */
    readonly host: string;
    /**
     * @property hostname
     * Get request hostname
     */
    readonly hostname: string;
    /**
     * @property href
     * Get request href
     */
    readonly href: string;
    /**
     * @property idempotent
     * Get request idempotent
     */
    readonly idempotent: boolean;
    /**
     * @property ip
     * Get request ip
     */
    readonly ip: string;
    /**
     * @property ips
     * Get request ips
     */
    readonly ips: string[];
    /**
     * @property lastModified
     * Get response lastModified
     */
    /**
    * @property lastModified
    * Set response lastModified
    */
    lastModified: Date;
    /**
     * @property length
     * Get response length
     */
    /**
    * @property length
    * Set response length
    */
    length: number;
    /**
     * @property message
     * Get response message
     */
    /**
    * @property message
    * Set response message
    */
    message: string;
    /**
     * @property method
     * Get request method
     */
    /**
    * @property method
    * Set request method
    */
    method: string;
    /**
     * @property origin
     * Get request origin
     */
    readonly origin: string;
    /**
     * @property originalUrl
     * Get request originalUrl
     */
    readonly originalUrl: string;
    /**
     * @property path
     * Get request path
     */
    /**
    * @property path
    * Set request path
    */
    path: string;
    /**
     * @property protocol
     * Get request protocol
     */
    readonly protocol: string;
    /**
     * @property query
     * Get request query
     */
    /**
    * @property query
    * Set request query
    */
    query: any;
    /**
     * @property querystring
     * Get request querystring
     */
    /**
    * @property querystring
    * Set request querystring
    */
    querystring: string;
    /**
     * @method redirect
     * Response redirect method
     */
    redirect(url: string, alt?: string): void;
    /**
     * @property search
     * Get request search
     */
    /**
    * @property search
    * Set request search
    */
    search: string;
    /**
     * @property secure
     * Set request secure
     */
    readonly secure: boolean;
    /**
     * @property url
     * Get request url
     */
    /**
    * @property url
    * Set request url
    */
    url: string;
    /**
     * @property stale
     * Get request stale
     */
    readonly stale: boolean;
    /**
     * @property socket
     * Get request socket
     */
    readonly socket: import("net").Socket;
    /**
     * @property subdomains
     * Get request subdomains
     */
    readonly subdomains: string[];
    /**
     * @property status
     * Get response status
     */
    /**
    * @property status
    * Set response status
    */
    status: number;
    /**
     * @property type
     * Get response type
     */
    /**
    * @property type
    * Set response type
    */
    type: ServerResponseFileTypes | string;
    /**
     * @method remove
     * Response remove header field
     */
    remove(field: string): void;
    /**
     * @method throw
     * Throw http exception
     */
    throw(message: string, code?: number, properties?: {}): never;
    throw(status: number): never;
    throw(...properties: Array<number | string | {}>): never;
    /**
     * @method set
     * Set response headers
     */
    set(field: {
        [key: string]: string;
    }): void;
    set(field: string, val: string | string[]): void;
    /**
     * @method get
     * Get request headers
     */
    get(field: string): string | number | string[];
    /**
     * @method vary
     * Response vary handler
     */
    vary(field: string): void;
    /**
     * @method flushHeaders
     * Response flush headers
     */
    flushHeaders(): void;
    /**
     * Check if the given `type(s)` is acceptable, returning
     * the best match when true, otherwise `false`, in which
     * case you should respond with 406 "Not Acceptable".
     *
     * The `type` value may be a single mime type string
     * such as "application/json", the extension name
     * such as "json" or an array `["json", "html", "text/plain"]`. When a list
     * or array is given the _best_ match, if any is returned.
     *
     * Examples:
     *
     *     // Accept: text/html
     *     this.accepts('html');
     *     // => "html"
     *
     *     // Accept: text/*, application/json
     *     this.accepts('html');
     *     // => "html"
     *     this.accepts('text/html');
     *     // => "text/html"
     *     this.accepts('json', 'text');
     *     // => "json"
     *     this.accepts('application/json');
     *     // => "application/json"
     *
     *     // Accept: text/*, application/json
     *     this.accepts('image/png');
     *     this.accepts('png');
     *     // => false
     *
     *     // Accept: text/*;q=.5, application/json
     *     this.accepts(['html', 'json']);
     *     this.accepts('html', 'json');
     *     // => "json"
     *
     * @access public
     */
    accepts(args: string | string[]): string[] | string | false;
    /**
     * Return accepted languages or best fit based on `langs`.
     *
     * Given `Accept-Language: en;q=0.8, es, pt`
     * an array sorted by quality is returned:
     *
     *     ['es', 'pt', 'en']
     *
     * @access public
     */
    acceptsLanguages(args: string | string[]): string | false;
    /**
     * Return accepted charsets or best fit based on `charsets`.
     *
     * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
     * an array sorted by quality is returned:
     *
     *     ['utf-8', 'utf-7', 'iso-8859-1']
     *
     * @access public
     */
    acceptsCharsets(args: string | string[]): string | false;
    /**
     * Return accepted encodings or best fit based on `encodings`.
     *
     * Given `Accept-Encoding: gzip, deflate`
     * an array sorted by quality is returned:
     *
     *     ['gzip', 'deflate']
     *
     * @access public
     */
    acceptsEncodings(args: string | string[]): string | false;
}
declare type ServerResponseFileTypes = 'html' | 'text/html' | 'json' | 'application/json' | 'png' | 'image/png' | 'jpg' | 'image/jpg';
export {};
