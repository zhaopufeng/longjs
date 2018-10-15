/**
 * @class CreateResponse
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 1:18
 */
/// <reference path="../../node_modules/@types/node/index.d.ts" />
/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import { Core } from '..';
import { Socket } from 'net';
import { Stream } from 'stream';
import TkServer from '..';
export declare class CreateResponse implements Core.Response {
    req: IncomingMessage | Http2ServerRequest;
    res: ServerResponse | Http2ServerResponse;
    app: TkServer;
    private _body;
    ctx: Core.Context;
    request: Core.Request;
    constructor(req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse, app: TkServer);
    /**
     * @property socket
     * Return the request socket.
     */
    readonly socket: Socket;
    /**
     * @property header
     * Return response header, alias as response.header
     */
    readonly header: import("http").OutgoingHttpHeaders;
    /**
     * @property headers
     * Return response header, alias as response.header
     */
    readonly headers: import("http").OutgoingHttpHeaders;
    /**
     * @property lastModified
     * Get the Last-Modified date in Date form, if it exists.
     */
    /**
    * @property lastModified
    * Set the Last-Modified date using a string or a Date.
    */
    lastModified: Date;
    /**
     * @property length
     * Return parsed response Content-Length when present.
     */
    /**
    * @property length
    * Set Content-Length field to `val`
    */
    length: number;
    /**
     * @property writable
     * Checks if the request is writable.
     * Tests for the existence of the socket
     * as node sometimes does not set it.
     */
    readonly writable: boolean;
    /**
     * @property headerSent
     * Check if a header has been written to the socket.
     */
    readonly headerSent: boolean;
    /**
     * @property finished
     * Return response finished
     */
    readonly finished: boolean;
    /**
     * @property status
     * Get response status code.
     */
    /**
    * @property status
    * Set response status code.
    */
    status: number;
    /**
     * @
     * Set Content-Type response header with `type` through `mime.contentType()`
     */
    type: string;
    /**
     * @property message
     * Get response status message
     */
    /**
    * @property message
    * Set response status message
    */
    message: any;
    /**
     * @property body
     * Get response body.
     */
    /**
    * @property body
    * Set response body.
    */
    body: String | Buffer | Object | Stream;
    /**
     * Get the ETag of a response.
     */
    /**
    * @property etag
    * Set the ETag of a response.
    * This will normalize the quotes if necessary.
    *
    *     this.response.etag = 'md5hashsum';
    *     this.response.etag = '"md5hashsum"';
    *     this.response.etag = 'W/"123456789"';
    */
    etag: string;
    /**
     * @method
     */
    onError(err: Error): void;
    /**
     * @method get
     * Return response header.
     *
     * Examples:
     *
     *     this.get('Content-Type');
     *     // => "text/plain"
     *
     *     this.get('content-type');
     *     // => "text/plain"
     */
    get(field: string): string | number | string[];
    /**
     * @method attachment
     * Set Content-Disposition header to "attachment" with optional `filename`.
     */
    attachment(filename: string): void;
    /**
     * @method set
     * Set header `field` to `val`, or pass
     * an object of header fields.
     *
     * Examples:
     *
     *    this.set('Foo', ['bar', 'baz']);
     *    this.set('Accept', 'application/json');
     *    this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
     */
    set(field: {
        [key: string]: string;
    }): void;
    set(field: string, val: string | string[]): void;
    /**
     * @method append
     * Append additional header `field` with value `val`.
     */
    append(field: string, val: string | string[]): void;
    /**
     * @method remove
     * Remove header `field`.
     */
    remove(field: string): void;
    /**
     * @method vary
     * Vary on `field`.
     */
    vary(field: string): void;
    /**
     * @method is
     * Check whether the response is one of the listed types.
     * Pretty much the same as `this.request.is()`.
     */
    is(type: string): string | false;
    /**
     * @method flushHeaders
     * Flush any set headers, and begin the body
     */
    flushHeaders(): void;
    /**
     * @method redirect
     * Perform a 302 redirect to `url`.
     *
     * The string "back" is special-cased
     * to provide Referrer support, when Referrer
     * is not present `alt` or "/" is used.
     *
     * Examples:
     *
     *    this.redirect('back');
     *    this.redirect('back', '/index.html');
     *    this.redirect('/login');
     *    this.redirect('http://google.com');
     */
    redirect(url: string, alt?: string): void;
}
