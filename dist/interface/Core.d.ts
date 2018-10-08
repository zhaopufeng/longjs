/**
 * @namespace Application
 * @interface Application
 * @export { Application }
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 22:39
 */
/// <reference types="node" />
import * as httpAssert from 'http-assert';
import * as Cookies from 'cookies';
import { IncomingMessage, ServerResponse, OutgoingHttpHeaders } from 'http';
import { Http2ServerRequest, Http2ServerResponse, IncomingHttpHeaders } from 'http2';
import { BodyParse } from './BodyParser';
import { Socket } from 'net';
export declare namespace Core {
    interface Configs {
        bodyParser?: BodyParse.Options;
    }
    interface Options {
        configs?: Configs;
        controllers?: Array<{
            new (...args: any[]): any;
        }>;
        beforeRequest?: Hook;
        requested?: Hook;
        beforeResponse?: Hook;
        responsed?: Hook;
    }
    interface BaseContext extends ContextDelegatedRequest, ContextDelegatedResponse {
        /**
         * Similar to .throw(), adds assertion.
         *
         *    this.assert(this.user, 401, 'Please login!');
         *
         * See: https://github.com/jshttp/http-assert
         */
        assert: typeof httpAssert;
        /**
         * Throw an error with `msg` and optional `status`
         * defaulting to 500. Note that these are user-level
         * errors, and the message may be exposed to the client.
         *
         *    this.throw(403)
         *    this.throw('name required', 400)
         *    this.throw(400, 'name required')
         *    this.throw('something exploded')
         *    this.throw(new Error('invalid'), 400);
         *    this.throw(400, new Error('invalid'));
         *
         * See: https://github.com/jshttp/http-errors
         */
        throw(message: string, code?: number, properties?: {}): never;
        throw(status: number): never;
        throw(...properties: Array<number | string | {}>): never;
    }
    interface BaseRequest extends ContextDelegatedRequest {
        /**
         * Get the charset when present or undefined.
         */
        charset: string;
        /**
         * Return parsed Content-Length when present.
         */
        length: number;
        /**
         * Return the request mime type void of
         * parameters such as "charset".
         */
        type: string;
        /**
         * Is
         */
        is(...types: string[]): string | false;
    }
    interface BaseResponse extends ContextDelegatedResponse {
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        socket: Socket;
        /**
         * Return response header.
         */
        header: OutgoingHttpHeaders;
        /**
         * Return response header, alias as response.header
         */
        headers: OutgoingHttpHeaders;
        /**
         * Check whether the response is one of the listed types.
         * Pretty much the same as `this.request.is()`.
         *
         * @param {String|Array} types...
         * @return {String|false}
         * @api public
         */
        is(...types: string[]): string | false;
        is(type: string): string | false;
        /**
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
    }
    interface Request extends BaseRequest {
        req: IncomingMessage | Http2ServerRequest;
        res: ServerResponse | Http2ServerResponse;
        ctx: Context;
        body: any;
        files: any;
        response: Response;
        originalUrl: string;
        ip: string;
    }
    interface Response extends BaseResponse {
        req: IncomingMessage | Http2ServerRequest;
        res: ServerResponse | Http2ServerResponse;
        ctx: Context;
        request: Request;
    }
    interface Context extends BaseContext {
        request: Request;
        response: Response;
        req: IncomingMessage | Http2ServerRequest;
        res: ServerResponse | Http2ServerResponse;
        originalUrl: string;
        cookies: Cookies;
        files: any;
        /**
         * To bypass Koa's built-in response handling, you may explicitly set `ctx.respond = false;`
         */
        respond?: boolean;
        [key: string]: any;
    }
    interface ContextDelegatedRequest {
        /**
         * Return request header.
         */
        header: IncomingHttpHeaders;
        /**
         * Return request header, alias as request.header
         */
        headers: IncomingHttpHeaders;
        /**
         * Get/Set request URL.
         */
        url: string;
        /**
         * Get origin of URL.
         */
        origin: string;
        /**
         * Get full request URL.
         */
        href: string;
        /**
         * Get/Set request method.
         */
        method: string;
        /**
         * Get request pathname.
         * Set pathname, retaining the query-string when present.
         */
        path: string;
        /**
         * Get parsed query-string.
         * Set query-string as an object.
         */
        query: any;
        /**
         * Get/Set query string.
         */
        querystring: string;
        /**
         * Get the search string. Same as the querystring
         * except it includes the leading ?.
         *
         * Set the search string. Same as
         * response.querystring= but included for ubiquity.
         */
        search: string;
        /**
         * Parse the "Host" header field host
         * and support X-Forwarded-Host when a
         * proxy is enabled.
         */
        host: string;
        /**
         * Parse the "Host" header field hostname
         * and support X-Forwarded-Host when a
         * proxy is enabled.
         */
        hostname: string;
        /**
         * Get WHATWG parsed URL object.
         */
        URL?: URL;
        /**
         * Check if the request is fresh, aka
         * Last-Modified and/or the ETag
         * still match.
         */
        fresh: boolean;
        /**
         * Check if the request is stale, aka
         * "Last-Modified" and / or the "ETag" for the
         * resource has changed.
         */
        stale: boolean;
        /**
         * Check if the request is idempotent.
         */
        idempotent: boolean;
        /**
         * Return the request socket.
         */
        socket: Socket;
        /**
         * Return the protocol string "http" or "https"
         * when requested with TLS. When the proxy setting
         * is enabled the "X-Forwarded-Proto" header
         * field will be trusted. If you're running behind
         * a reverse proxy that supplies https for you this
         * may be enabled.
         */
        protocol: string;
        /**
         * Short-hand for:
         *
         *    this.protocol == 'https'
         */
        secure: boolean;
        /**
         * Request remote address. Supports X-Forwarded-For when app.proxy is true.
         */
        ip: string;
        /**
         * Request params
         */
        params: any;
        /**
         * When `app.proxy` is `true`, parse
         * the "X-Forwarded-For" ip address list.
         *
         * For example if the value were "client, proxy1, proxy2"
         * you would receive the array `["client", "proxy1", "proxy2"]`
         * where "proxy2" is the furthest down-stream.
         */
        ips: string[];
        /**
         * Return subdomains as an array.
         *
         * Subdomains are the dot-separated parts of the host before the main domain
         * of the app. By default, the domain of the app is assumed to be the last two
         * parts of the host. This can be changed by setting `app.subdomainOffset`.
         *
         * For example, if the domain is "tobi.ferrets.example.com":
         * If `app.subdomainOffset` is not set, this.subdomains is
         * `["ferrets", "tobi"]`.
         * If `app.subdomainOffset` is 3, this.subdomains is `["tobi"]`.
         */
        subdomains: string[];
        accept: any;
        /**
         * Get
         */
        get(field: string): string | number | string[];
        /**
         * accepts
         */
        accepts(args: string | string[]): string[] | string | false;
        accepts(...args: string[]): string[] | string | false;
        /**
         * acceptsLanguages
         */
        acceptsLanguages(args: string | string[]): string | false;
        acceptsLanguages(...args: string[]): string | false;
        /**
         * acceptsLanguages
         */
        acceptsCharsets(args: string | string[]): string | false;
        acceptsCharsets(...args: string[]): string | false;
        /**
         * acceptsLanguages
         */
        acceptsEncodings(args: string | string[]): string | false;
        acceptsEncodings(...args: string[]): string | false;
    }
    interface ContextDelegatedResponse {
        /**
         * Response finished
         */
        finished: boolean;
        /**
         * Get/Set response status code.
         */
        status: number;
        /**
         * Get response status message
         */
        message: string;
        /**
         * Get/Set response body.
         */
        body: any;
        /**
         * Return parsed response Content-Length when present.
         * Set Content-Length field to `n`.
         */
        length: number;
        /**
         * Check if a header has been written to the socket.
         */
        headerSent: boolean;
        /**
         * Vary on `field`.
         */
        vary(field: string): void;
        /**
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
        /**
         * Set Content-Disposition header to "attachment" with optional `filename`.
         */
        attachment(filename: string): void;
        /**
         * Return the response mime type void of
         * parameters such as "charset".
         *
         * Set Content-Type response header with `type` through `mime.lookup()`
         * when it does not contain a charset.
         *
         * Examples:
         *
         *     this.type = '.html';
         *     this.type = 'html';
         *     this.type = 'json';
         *     this.type = 'application/json';
         *     this.type = 'png';
         */
        type: string;
        /**
         * Get the Last-Modified date in Date form, if it exists.
         * Set the Last-Modified date using a string or a Date.
         *
         *     this.response.lastModified = new Date();
         *     this.response.lastModified = '2013-09-13';
         */
        lastModified: Date;
        /**
         * Get/Set the ETag of a response.
         * This will normalize the quotes if necessary.
         *
         *     this.response.etag = 'md5hashsum';
         *     this.response.etag = '"md5hashsum"';
         *     this.response.etag = 'W/"123456789"';
         *
         * @param {String} etag
         * @api public
         */
        etag: string;
        /**
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
         * Append additional header `field` with value `val`.
         *
         * Examples:
         *
         * ```
         * this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
         * this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
         * this.append('Warning', '199 Miscellaneous warning');
         * ```
         */
        append(field: string, val: string | string[]): void;
        /**
         * Remove header `field`.
         */
        remove(field: string): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         */
        writable: boolean;
        /**
         * Flush any set headers, and begin the body
         */
        flushHeaders(): void;
    }
    type Env = 'development' | 'production';
    interface Hook {
        (ctx?: Context): Promise<any>;
    }
}
