/**
 * @class CreateRequest
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 1:19
 */

// dependencies
import { IncomingMessage, ServerResponse, IncomingHttpHeaders } from 'http'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import { Core as Server } from '../interface'
import * as accepts from 'accepts'
import { Accepts } from 'accepts'
import { URL, format } from 'url';
import * as qs from 'querystring'
import * as fresh from 'fresh'
import * as mime from 'mime-types'
import * as typeIs from 'type-is'
import TkServer from '..';
import * as parseUrl from 'parseurl'
import * as net from 'net'

export class CreateRequest implements Server.Request {
    public originalUrl: string;
    private _accept: Accepts;
    private _querycache: any;
    private _URLcache: URL;
    private _ip: string;
    public files: any = {};
    public body: any = {};
    public params: any = {}
    public ctx: Server.Context;
    public response: Server.Response;
    constructor(
        public req: IncomingMessage | Http2ServerRequest,
        public res: ServerResponse | Http2ServerResponse,
        public app: TkServer
    ) {
        // originalUrl
        this.originalUrl  = req.url || ''
    }

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
    public get subdomains() {
        const offset = this.app.subdomainOffset;
        const hostname = this.hostname;
        if (net.isIP(hostname)) return [];
        return hostname
          .split('.')
          .reverse()
          .slice(offset);
    }

    /**
     * @property charset
     * Get the charset when present or undefined.
     */
    public get charset() {
        const contentType = this.get('content-type') as string
        return mime.charset(contentType) as string
    }

    /**
     * @property type
     * Get the type when present or undefined.
     */
    public get type() {
        const contentType = this.get('content-type') as string
        return mime.contentType(contentType) as string
    }

    /**
     * @property URL
     * Get WHATWG parsed URL.
     */
    public get URL() {
        if (!this._URLcache) {
            this._URLcache = new URL(this.protocol + '://' + this.host + this.originalUrl)
        }
        return this._URLcache
    }

    /**
     * @property query
     * Get parsed query-string.
     */
    public get query(): object {
        if (!this._querycache) this._querycache = qs.parse(this.querystring) || {}
        return this._querycache
    }

    /**
     * @property query
     * Set query-string as an object.
     */
    public set query(obj: object) {
        this.querystring = qs.stringify(obj)
        this._querycache = qs.parse(this.querystring)
    }

    /**
     * @property querystring
     * Get querystring.
     */
    public get querystring(): string {
        if (!this.req) return '';
        return parseUrl(this.req as IncomingMessage).query as string || '';
    }

    /**
     * @property querystring
     * Set querystring.
     */
    public set querystring(val: string) {
        const url = parseUrl(this.req as IncomingMessage);
        if (url.search === `?${val}`) return;
        url.search = val;
        url.path = null;
        this.url = format(url);
    }

    /**
     * @property search
     * Get the search string. Same as the querystring
     * except it includes the leading ?.
     */
    public get search(): string {
        if (!this.querystring) return '';
        return `?${this.querystring}`;
    }

    /**
     * @property search
     * Set the search string. Same as
     * request.querystring= but included for ubiquity.
     */
    public set search(val: string) {
        this.querystring = val;
    }

    /**
     * @property path
     * Get request pathname.
     */
    public get path(): string {
        return parseUrl(this.req as IncomingMessage).pathname;
    }

    /**
     * @property path
     * Set pathname, retaining the query-string when present.
     */
    public set path(val: string) {
        const url = parseUrl(this.req as IncomingMessage);
        if (url.pathname === val) return;
        url.pathname = val;
        url.path = null;
        this.url = format(url)
    }

    /**
     * @property header
     * Get request headers
     */
    public get header() {
        return this.req.headers
    }

    /**
     * @property header
     * Set request headers
     */
    public set header(val: IncomingHttpHeaders) {
        this.req.headers = val
    }

    /**
     * @property header
     * Get request headers
     */
    public get headers() {
        return this.req.headers
    }

    /**
     * @property header
     * Set request headers
     */
    public set headers(val: IncomingHttpHeaders) {
        this.req.headers = val
    }

    /**
     * @property url
     * Get request url
     */
    public get url() {
        return this.req.url
    }

    /**
     * @property url
     * Set request url
     */
    public set url(val: string) {
        this.req.url = val;
    }

    /**
     * @property origin
     * Set request origin
     */
    public get origin() {
        return this.protocol + '://' + this.host
    }

    /**
     * @property href
     * Get full request URL.
     */
    public get href() {
        // support: `GET http://example.com/foo`
        if (/^https?:\/\//i.test(this.originalUrl)) return this.originalUrl;
        return this.origin + this.originalUrl;
    }

    /**
     * @property host
     * Parse the "Host" header field host
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
    public get host() {
        let host = this.app.proxy && this.get('X-Forwarded-Host') as string;
        host = host || this.get('Host') as string;
        if (!host) return '';
        return host.split(/\s*,\s*/)[0];
    }

    /**
     * @property hostname
     * Parse the "Host" header field hostname
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
    public get hostname() {
        const host = this.host;
        if (!host) return '';
        if ('[' === host[0]) return this.URL.hostname || ''; // IPv6
        return host.split(':')[0];
    }

    /**
     * @property socket
     * Get request socket
     */
    get socket() {
        return this.req.socket;
    }

    /**
     * @property protocol
     * Get protocol
     */
    public get protocol() {
        if ((this.socket as any).encrypted) return 'https';
        if (!this.app.proxy) return 'http';
        const proto = this.get('X-Forwarded-Proto') as string;
        return proto ? proto.split(/\s*,\s*/)[0] : 'http';
    }

    /**
     * @property secure
     * Get secure
     */
    get secure() {
        return 'https' === this.protocol;
    }

    /**
     * @property method
     * Get request method
     */
    public get method() {
        return this.req.method
    }

    /**
     * @property method
     * Set request method
     */
    public set method(val: string) {
        this.req.method = val
    }

    /**
     * @property ips
     * Get request ips
     */
    public get ips() {
        const proxy = this.app.proxy;
        const val = this.get('X-Forwarded-For') as string;
        return proxy && val
          ? val.split(/\s*,\s*/)
          : [];
    }

    /**
     * @property ip
     * Get request ip
     */
    public get ip() {
        if (!this._ip) {
            this._ip = this.ips[0] || this.socket.remoteAddress || '';
        }
        return this._ip;
    }

    /**
     * @property ip
     * Set request ip
     */
    public set ip(ip: string) {
        this._ip = ip
    }

    /**
     * @property accept
     * Get accept object.
     */
    public get accept(): Accepts {
        return this._accept || (this._accept = accepts(this.req as IncomingMessage))
    }

    /**
     * @property accept
     * Set accept object.
     */
    public set accept(obj: Accepts) {
        this._accept = obj;
    }

    /**
     * Check if the request is fresh, aka
     * Last-Modified and/or the ETag
     * still match.
     *
     * @access public
     */
    public get fresh(): boolean {
        const method = this.method;
        const status = this.ctx.status;

        // GET or HEAD for weak freshness validation only
        if ('GET' !== method && 'HEAD' !== method) return false;

         // 2xx or 304 as per rfc2616 14.26
        if ((status >= 200 && status < 300) || 304 === status) {
            return fresh(this.header, this.response.header);
        }

        return false;
    }

    /**
     * @property idempotent
     * Check if the request is idempotent.
     */
    public get idempotent(): boolean {
        const methods = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'];
        // ~-1 = 0 , !~-1 = true , !!~ -1 = false
        return !!~methods.indexOf(this.method);
    }

    /**
     * @property length
     * get request Content-Length
     */
    public get length(): number {
        const byteLength = this.get('Content-Length');
        if (byteLength === '') return 0;
        // ~~ string to number
        return ~~byteLength
    }

    /**
     * Check if the request is stale, aka
     * "Last-Modified" and / or the "ETag" for the
     * resource has changed.
     *
     * @access public
     */
    public get stale() {
        return !this.fresh
    }

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
    public is(...types: string[]) {
       return typeIs(this.req as IncomingMessage, types)
    }

    /**
     * @method get
     * Get Request header for field
     */
    public get(field: string): string | string[] {
        return this.req.headers[field]
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
        return this.accept.types(...args)
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
        return this.accept.languages(...args)
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
        return this.accept.charsets(...args)
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
        return this.accept.encodings(...args)
    }

}