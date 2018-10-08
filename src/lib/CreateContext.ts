/**
 * @class CreateContext
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 0:17
 */

// dependencies
import { Core as Server } from '../interface'
import * as httpAssert from 'http-assert'
import * as Cookies from 'cookies'
import * as httpErrors from 'http-errors';
import { IncomingMessage, ServerResponse } from 'http'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'

export class CreateContext implements Server.Context {

    /**
     * constructor
     * @param req IncomingMessage
     * @param res ServerResponse
     * @param request Request
     * @param response Response
     */
    constructor(
        public req: IncomingMessage | Http2ServerRequest,
        public res: ServerResponse | Http2ServerResponse,
        public request: Server.Request,
        public response: Server.Response
    ) {}

    // respond state
    public respond: boolean = true

    /**
     * @property writable
     * Get response writable
     */
    public get writable() {
        return this.response.writable
    }

    /**
     * @property params
     * Get request params
     */
    public get params() {
        return this.request.params
    }

    /**
     * @property URL
     * Get request URL
     */
    public get URL() {
        return this.request.URL
    }

    /**
     * @property finished
     * Get response state
     */
    public get finished() {
        return this.response.finished
    }

    /**
     * @property accept
     * Get request accept
     */
    public get accept() {
        return this.request.accept
    }

    /**
     * @method append
     * append response headers
     */
    public append(field: string, val: string | string[]): void {
        return this.response.append(field, val)
    }

    /**
     * @method assert
     * Http assert
     */
    public assert = httpAssert;

    /**
     * @method attachment
     * @param filename string
     * File reponse
     */
    public attachment(filename: string): void {
        return this.response.attachment(filename)
    }

    /**
     * @property body
     * Get request body
     */
    public get body() {
        return this.request.body
    }

    /**
     * @property body
     * Set response body
     */
    public set body(val: any) {
        this.response.body = val
    }

    /**
     * @property files
     * Get request files
     */
    public get files() {
        return this.request.files
    }

    /**
     * @property files
     * Set request files
     */
    public set files(val: any) {
        this.request.files = val
    }

    /**
     * @property cookies
     * Get request cookies
     */
    public cookies = Cookies(this.req as IncomingMessage, this.res as ServerResponse);

    /**
     * @property etag
     * Get response etag
     */
    public get etag() {
        return this.response.etag
    }

    /**
     * @property etag
     * Set response etag
     */
    public set etag(val: string) {
        this.response.etag = val
    }

    /**
     * Indicates whether the request is “fresh.” It is the opposite of req.stale.
     *  - It is true if the cache-control request header doesn’t have a no-cache directive and any of the following are true:
     *  - The if-modified-since request header is specified and last-modified request header is equal to or earlier than the modified response header.
     *  - The if-none-match request header is *.
     *  - The if-none-match request header, after being parsed into its directives, does not match the etag response header.
     */
    public get fresh() {
        return this.request.fresh
    }

    /**
     * @property header
     * Get request header
     */
    public get header() {
        return this.request.header
    }

    /**
     * @property headers
     * Get request headers
     */
    public get headers() {
        return this.request.headers
    }

    /**
     * @property headers
     * Set request headers
     */
    public set headers(val: any) {
        this.request.headers = val
    }

    /**
     * @property headerSent
     * Get request headerSent
     */
    public get headerSent() {
        return this.response.headerSent
    }

    /**
     * @property host
     * Get request host
     */
    public get host() {
        return this.request.host
    }

    /**
     * @property hostname
     * Get request hostname
     */
    public get hostname() {
        return this.request.hostname
    }

    /**
     * @property href
     * Get request href
     */
    public get href() {
        return this.request.href
    }

    /**
     * @property idempotent
     * Get request idempotent
     */
    public get idempotent() {
        return this.request.idempotent
    }

    /**
     * @property ip
     * Get request ip
     */
    public get ip() {
        return this.request.ip
    }

    /**
     * @property ips
     * Get request ips
     */
    public get ips() {
        return this.request.ips
    }

    /**
     * @property lastModified
     * Get response lastModified
     */
    public get lastModified() {
        return this.response.lastModified
    }

    /**
     * @property lastModified
     * Set response lastModified
     */
    public set lastModified(date: Date) {
        this.response.lastModified = date
    }

    /**
     * @property length
     * Get response length
     */
    public get length() {
        return this.response.length
    }

    /**
     * @property length
     * Set response length
     */
    public set length(val: number) {
        this.response.length = val
    }

    /**
     * @property message
     * Get response message
     */
    public get message() {
        return this.response.message
    }

    /**
     * @property message
     * Set response message
     */
    public set message(val: string) {
        this.response.message = val
    }

    /**
     * @property method
     * Get request method
     */
    public get method() {
        return this.request.method
    }

    /**
     * @property method
     * Set request method
     */
    public set method(val: string) {
        this.request.method = val
    }

    /**
     * @property origin
     * Get request origin
     */
    public get origin() {
        return this.request.origin
    }

    /**
     * @property originalUrl
     * Get request originalUrl
     */
    public get originalUrl() {
        return this.request.originalUrl
    }

    /**
     * @property path
     * Get request path
     */
    public get path() {
        return this.request.path
    }

    /**
     * @property path
     * Set request path
     */
    public set path(val: string) {
        this.request.path = val
    }

    /**
     * @property protocol
     * Get request protocol
     */
    public get protocol() {
        return this.request.protocol
    }

    /**
     * @property query
     * Get request query
     */
    public get query() {
        return this.request.query
    }

    /**
     * @property query
     * Set request query
     */
    public set query(val: any) {
        this.request.query = val
    }

    /**
     * @property querystring
     * Get request querystring
     */
    public get querystring() {
        return this.request.querystring
    }

    /**
     * @property querystring
     * Set request querystring
     */
    public set querystring(val: string) {
        this.request.querystring = val
    }

    /**
     * @method redirect
     * Response redirect method
     */
    public redirect(url: string, alt?: string): void {
        return this.response.redirect(url, alt)
    }

    /**
     * @property search
     * Get request search
     */
    public get search() {
        return this.request.search
    }

    /**
     * @property search
     * Set request search
     */
    public set search(val: string) {
        this.request.search = val
    }

    /**
     * @property secure
     * Set request secure
     */
    public get secure() {
        return this.request.secure
    }

    /**
     * @property url
     * Get request url
     */
    public get url() {
        return this.request.url
    }

    /**
     * @property url
     * Set request url
     */
    public set url(val: string) {
        this.request.url = val
    }

    /**
     * @property stale
     * Get request stale
     */
    public get stale() {
        return this.request.stale
    }

    /**
     * @property socket
     * Get request socket
     */
    public get socket() {
        return this.request.socket
    }

    /**
     * @property subdomains
     * Get request subdomains
     */
    public get subdomains() {
        return this.request.subdomains
    }

    /**
     * @property status
     * Get response status
     */
    public get status() {
        return this.response.status
    }

    /**
     * @property status
     * Set response status
     */
    public set status(val: number) {
        this.response.status = val
    }

    /**
     * @property type
     * Get response type
     */
    public get type() {
        return this.response.type
    }

    /**
     * @property type
     * Set response type
     */
    public set type(type: ServerResponseFileTypes | string) {
        this.response.type = type
    }

    /**
     * @method remove
     * Response remove header field
     */
    public remove(field: string): void {
       return this.response.remove(field)
    }

    /**
     * @method throw
     * Throw http exception
     */
    public throw(message: string, code?: number, properties?: {}): never;
    public throw(status: number): never;
    public throw(...properties: Array<number | string | {}>): never;
    public throw(...args: any[]) {
        throw httpErrors(...args)
    }

    /**
     * @method set
     * Set response headers
     */
    public set(field: { [key: string]: string }): void;
    public set(field: string, val: string | string[]): void;
    public set(...args: any[]): void {
        return this.response.set(args[0], args[1])
    }

    /**
     * @method get
     * Get request headers
     */
    public get(field: string): string | number | string[] {
        return this.request.get(field)
    }

    /**
     * @method vary
     * Response vary handler
     */
    public vary(field: string) {
        return this.response.vary(field)
    }

    /**
     * @method flushHeaders
     * Response flush headers
     */
    public flushHeaders() {
        this.response.flushHeaders()
    }

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
    public accepts(args: string | string[]): string[] | string | false;
    public accepts(...args: string[]): string[] | string | false {
        return this.request.accepts(...args)
    }

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
    public acceptsLanguages(args: string | string[]): string | false;
    public acceptsLanguages(...args: string[]): string | false {
        return this.request.acceptsLanguages(...args)
    }

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
    public acceptsCharsets(args: string | string[]): string | false;
    public acceptsCharsets(...args: string[]): string | false {
        return this.request.acceptsCharsets(...args)
    }

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
    public acceptsEncodings(args: string | string[]): string | false;
    public acceptsEncodings(...args: string[]): string | false {
        return this.request.acceptsEncodings(...args)
    }

}

type ServerResponseFileTypes = 'html' | 'text/html' | 'json' | 'application/json' | 'png' | 'image/png' | 'jpg' | 'image/jpg'