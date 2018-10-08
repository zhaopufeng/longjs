"use strict";
/**
 * @class CreateRequest
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 1:19
 */
Object.defineProperty(exports, "__esModule", { value: true });
const accepts = require("accepts");
const url_1 = require("url");
const qs = require("querystring");
const fresh = require("fresh");
const mime = require("mime-types");
const typeIs = require("type-is");
const parseUrl = require("parseurl");
const net = require("net");
class CreateRequest {
    constructor(req, res, app) {
        this.req = req;
        this.res = res;
        this.app = app;
        this.files = {};
        this.body = {};
        this.params = {};
        // originalUrl
        this.originalUrl = req.url || '';
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
    get subdomains() {
        const offset = this.app.subdomainOffset;
        const hostname = this.hostname;
        if (net.isIP(hostname))
            return [];
        return hostname
            .split('.')
            .reverse()
            .slice(offset);
    }
    /**
     * @property charset
     * Get the charset when present or undefined.
     */
    get charset() {
        const contentType = this.get('content-type');
        return mime.charset(contentType);
    }
    /**
     * @property type
     * Get the type when present or undefined.
     */
    get type() {
        const contentType = this.get('content-type');
        return mime.contentType(contentType);
    }
    /**
     * @property URL
     * Get WHATWG parsed URL.
     */
    get URL() {
        if (!this._URLcache) {
            this._URLcache = new url_1.URL(this.protocol + '://' + this.host + this.originalUrl);
        }
        return this._URLcache;
    }
    /**
     * @property query
     * Get parsed query-string.
     */
    get query() {
        if (!this._querycache)
            this._querycache = qs.parse(this.querystring) || {};
        return this._querycache;
    }
    /**
     * @property query
     * Set query-string as an object.
     */
    set query(obj) {
        this.querystring = qs.stringify(obj);
        this._querycache = qs.parse(this.querystring);
    }
    /**
     * @property querystring
     * Get querystring.
     */
    get querystring() {
        if (!this.req)
            return '';
        return parseUrl(this.req).query || '';
    }
    /**
     * @property querystring
     * Set querystring.
     */
    set querystring(val) {
        const url = parseUrl(this.req);
        if (url.search === `?${val}`)
            return;
        url.search = val;
        url.path = null;
        this.url = url_1.format(url);
    }
    /**
     * @property search
     * Get the search string. Same as the querystring
     * except it includes the leading ?.
     */
    get search() {
        if (!this.querystring)
            return '';
        return `?${this.querystring}`;
    }
    /**
     * @property search
     * Set the search string. Same as
     * request.querystring= but included for ubiquity.
     */
    set search(val) {
        this.querystring = val;
    }
    /**
     * @property path
     * Get request pathname.
     */
    get path() {
        return parseUrl(this.req).pathname;
    }
    /**
     * @property path
     * Set pathname, retaining the query-string when present.
     */
    set path(val) {
        const url = parseUrl(this.req);
        if (url.pathname === val)
            return;
        url.pathname = val;
        url.path = null;
        this.url = url_1.format(url);
    }
    /**
     * @property header
     * Get request headers
     */
    get header() {
        return this.req.headers;
    }
    /**
     * @property header
     * Set request headers
     */
    set header(val) {
        this.req.headers = val;
    }
    /**
     * @property header
     * Get request headers
     */
    get headers() {
        return this.req.headers;
    }
    /**
     * @property header
     * Set request headers
     */
    set headers(val) {
        this.req.headers = val;
    }
    /**
     * @property url
     * Get request url
     */
    get url() {
        return this.req.url;
    }
    /**
     * @property url
     * Set request url
     */
    set url(val) {
        this.req.url = val;
    }
    /**
     * @property origin
     * Set request origin
     */
    get origin() {
        return this.protocol + '://' + this.host;
    }
    /**
     * @property href
     * Get full request URL.
     */
    get href() {
        // support: `GET http://example.com/foo`
        if (/^https?:\/\//i.test(this.originalUrl))
            return this.originalUrl;
        return this.origin + this.originalUrl;
    }
    /**
     * @property host
     * Parse the "Host" header field host
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
    get host() {
        let host = this.app.proxy && this.get('X-Forwarded-Host');
        host = host || this.get('Host');
        if (!host)
            return '';
        return host.split(/\s*,\s*/)[0];
    }
    /**
     * @property hostname
     * Parse the "Host" header field hostname
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
    get hostname() {
        const host = this.host;
        if (!host)
            return '';
        if ('[' === host[0])
            return this.URL.hostname || ''; // IPv6
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
    get protocol() {
        if (this.socket.encrypted)
            return 'https';
        if (!this.app.proxy)
            return 'http';
        const proto = this.get('X-Forwarded-Proto');
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
    get method() {
        return this.req.method;
    }
    /**
     * @property method
     * Set request method
     */
    set method(val) {
        this.req.method = val;
    }
    /**
     * @property ips
     * Get request ips
     */
    get ips() {
        const proxy = this.app.proxy;
        const val = this.get('X-Forwarded-For');
        return proxy && val
            ? val.split(/\s*,\s*/)
            : [];
    }
    /**
     * @property ip
     * Get request ip
     */
    get ip() {
        if (!this._ip) {
            this._ip = this.ips[0] || this.socket.remoteAddress || '';
        }
        return this._ip;
    }
    /**
     * @property ip
     * Set request ip
     */
    set ip(ip) {
        this._ip = ip;
    }
    /**
     * @property accept
     * Get accept object.
     */
    get accept() {
        return this._accept || (this._accept = accepts(this.req));
    }
    /**
     * @property accept
     * Set accept object.
     */
    set accept(obj) {
        this._accept = obj;
    }
    /**
     * Check if the request is fresh, aka
     * Last-Modified and/or the ETag
     * still match.
     *
     * @access public
     */
    get fresh() {
        const method = this.method;
        const status = this.ctx.status;
        // GET or HEAD for weak freshness validation only
        if ('GET' !== method && 'HEAD' !== method)
            return false;
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
    get idempotent() {
        const methods = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'];
        // ~-1 = 0 , !~-1 = true , !!~ -1 = false
        return !!~methods.indexOf(this.method);
    }
    /**
     * @property length
     * get request Content-Length
     */
    get length() {
        const byteLength = this.get('Content-Length');
        if (byteLength === '')
            return 0;
        // ~~ string to number
        return ~~byteLength;
    }
    /**
     * Check if the request is stale, aka
     * "Last-Modified" and / or the "ETag" for the
     * resource has changed.
     *
     * @access public
     */
    get stale() {
        return !this.fresh;
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
    is(...types) {
        return typeIs(this.req, types);
    }
    /**
     * @method get
     * Get Request header for field
     */
    get(field) {
        return this.req.headers[field];
    }
    accepts(...args) {
        return this.accept.types(...args);
    }
    acceptsLanguages(...args) {
        return this.accept.languages(...args);
    }
    acceptsCharsets(...args) {
        return this.accept.charsets(...args);
    }
    acceptsEncodings(...args) {
        return this.accept.encodings(...args);
    }
}
exports.CreateRequest = CreateRequest;
