/**
 * @class CreateRequest
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 1:19
 */
/// <reference types="node" />
import TkServer from '..';
import * as net from 'net';
import { Core } from '..';
import { Accepts } from 'accepts';
import { URL } from 'url';
import { IncomingMessage, ServerResponse, IncomingHttpHeaders } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
export declare class CreateRequest implements Core.Request {
    req: IncomingMessage | Http2ServerRequest;
    res: ServerResponse | Http2ServerResponse;
    app: TkServer;
    originalUrl: string;
    private _accept;
    private _querycache;
    private _URLcache;
    private _ip;
    files: any;
    body: any;
    params: any;
    ctx: Core.Context;
    response: Core.Response;
    constructor(req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse, app: TkServer);
    /**
     * @property subdomains
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
    readonly subdomains: string[];
    /**
     * @property charset
     * Get the charset when present or undefined.
     */
    readonly charset: string;
    /**
     * @property type
     * Get the type when present or undefined.
     */
    readonly type: string;
    /**
     * @property URL
     * Get WHATWG parsed URL.
     */
    readonly URL: URL;
    /**
     * @property query
     * Get parsed query-string.
     */
    /**
    * @property query
    * Set query-string as an object.
    */
    query: object;
    /**
     * @property querystring
     * Get querystring.
     */
    /**
    * @property querystring
    * Set querystring.
    */
    querystring: string;
    /**
     * @property search
     * Get the search string. Same as the querystring
     * except it includes the leading ?.
     */
    /**
    * @property search
    * Set the search string. Same as
    * request.querystring= but included for ubiquity.
    */
    search: string;
    /**
     * @property path
     * Get request pathname.
     */
    /**
    * @property path
    * Set pathname, retaining the query-string when present.
    */
    path: string;
    /**
     * @property header
     * Get request headers
     */
    /**
    * @property header
    * Set request headers
    */
    header: IncomingHttpHeaders;
    /**
     * @property header
     * Get request headers
     */
    /**
    * @property header
    * Set request headers
    */
    headers: IncomingHttpHeaders;
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
     * @property origin
     * Set request origin
     */
    readonly origin: string;
    /**
     * @property href
     * Get full request URL.
     */
    readonly href: string;
    /**
     * @property host
     * Parse the "Host" header field host
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
    readonly host: string;
    /**
     * @property hostname
     * Parse the "Host" header field hostname
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
    readonly hostname: string;
    /**
     * @property socket
     * Get request socket
     */
    readonly socket: net.Socket | import("tls").TLSSocket;
    /**
     * @property protocol
     * Get protocol
     */
    readonly protocol: string;
    /**
     * @property secure
     * Get secure
     */
    readonly secure: boolean;
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
     * @property ips
     * Get request ips
     */
    readonly ips: string[];
    /**
     * @property ip
     * Get request ip
     */
    /**
    * @property ip
    * Set request ip
    */
    ip: string;
    /**
     * @property accept
     * Get accept object.
     */
    /**
    * @property accept
    * Set accept object.
    */
    accept: Accepts;
    /**
     * Check if the request is fresh, aka
     * Last-Modified and/or the ETag
     * still match.
     *
     * @access public
     */
    readonly fresh: boolean;
    /**
     * @property idempotent
     * Check if the request is idempotent.
     */
    readonly idempotent: boolean;
    /**
     * @property length
     * get request Content-Length
     */
    readonly length: number;
    /**
     * Check if the request is stale, aka
     * "Last-Modified" and / or the "ETag" for the
     * resource has changed.
     *
     * @access public
     */
    readonly stale: boolean;
    /**
     * Check if the incoming request contains the "Content-Type"
     * header field, and it contains any of the give mime `type`s.
     * If there is no request body, `null` is returned.
     * If there is no content type, `false` is returned.
     * Otherwise, it returns the first `type` that matches.
     *
     * Examples:
     *
     *     // With Content-Type: text/html; charset=utf-8
     *     this.is('html'); // => 'html'
     *     this.is('text/html'); // => 'text/html'
     *     this.is('text/*', 'application/json'); // => 'text/html'
     *
     *     // When Content-Type is application/json
     *     this.is('json', 'urlencoded'); // => 'json'
     *     this.is('application/json'); // => 'application/json'
     *     this.is('html', 'application/*'); // => 'application/json'
     *
     *     this.is('html'); // => false
     *
     * @access public
     */
    is(...types: string[]): string | false;
    /**
     * @method get
     * Get Request header for field
     */
    get(field: string): string | string[];
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
