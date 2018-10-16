"use strict";
/**
 * @class CreateContext
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 0:17
 */
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const Cookies = require("cookies");
const statuses = require("statuses");
const httpAssert = require("http-assert");
const httpErrors = require("http-errors");
const COOKIES = Symbol('context#cookies');
class CreateContext {
    /**
     * constructor
     * @param req IncomingMessage
     * @param res ServerResponse
     * @param request Request
     * @param response Response
     */
    constructor(req, res, request, response, app) {
        this.req = req;
        this.res = res;
        this.request = request;
        this.response = response;
        this.app = app;
        // respond state
        this.respond = true;
        /**
         * @method assert
         * Http assert
         */
        this.assert = httpAssert;
    }
    /**
     * @property writable
     * Get response writable
     */
    get writable() {
        return this.response.writable;
    }
    /**
     * @property params
     * Get request params
     */
    get params() {
        return this.request.params;
    }
    /**
     * @property URL
     * Get request URL
     */
    get URL() {
        return this.request.URL;
    }
    /**
     * @property finished
     * Get response state
     */
    get finished() {
        return this.response.finished;
    }
    /**
     * @property accept
     * Get request accept
     */
    get accept() {
        return this.request.accept;
    }
    /**
     * @method append
     * append response headers
     */
    append(field, val) {
        return this.response.append(field, val);
    }
    /**
     * @method attachment
     * @param filename string
     * File reponse
     */
    attachment(filename) {
        return this.response.attachment(filename);
    }
    /**
     * @property body
     * Get request body
     */
    get body() {
        return this.request.body;
    }
    /**
     * @property body
     * Set response body
     */
    set body(val) {
        this.response.body = val;
    }
    /**
     * @property files
     * Get request files
     */
    get files() {
        return this.request.files;
    }
    /**
     * @property files
     * Set request files
     */
    set files(val) {
        this.request.files = val;
    }
    /**
     * @property cookies
     * Get request cookies
     */
    get cookies() {
        if (!this[COOKIES]) {
            this[COOKIES] = new Cookies(this.req, this.res, {
                keys: this.app.keys,
                secure: this.request.secure
            });
        }
        return this[COOKIES];
    }
    /**
     * @property cookies
     * Set request cookies
     */
    set cookies(_cookies) {
        this[COOKIES] = _cookies;
    }
    /**
     * @property etag
     * Get response etag
     */
    get etag() {
        return this.response.etag;
    }
    /**
     * @property etag
     * Set response etag
     */
    set etag(val) {
        this.response.etag = val;
    }
    /**
     * Indicates whether the request is “fresh.” It is the opposite of req.stale.
     *  - It is true if the cache-control request header doesn’t have a no-cache directive and any of the following are true:
     *  - The if-modified-since request header is specified and last-modified request header is equal to or earlier than the modified response header.
     *  - The if-none-match request header is *.
     *  - The if-none-match request header, after being parsed into its directives, does not match the etag response header.
     */
    get fresh() {
        return this.request.fresh;
    }
    /**
     * @property header
     * Get request header
     */
    get header() {
        return this.request.header;
    }
    /**
     * @property headers
     * Get request headers
     */
    get headers() {
        return this.request.headers;
    }
    /**
     * @property headers
     * Set request headers
     */
    set headers(val) {
        this.request.headers = val;
    }
    /**
     * @property headerSent
     * Get request headerSent
     */
    get headerSent() {
        return this.response.headerSent;
    }
    /**
     * @property host
     * Get request host
     */
    get host() {
        return this.request.host;
    }
    /**
     * @property hostname
     * Get request hostname
     */
    get hostname() {
        return this.request.hostname;
    }
    /**
     * @property href
     * Get request href
     */
    get href() {
        return this.request.href;
    }
    /**
     * @property idempotent
     * Get request idempotent
     */
    get idempotent() {
        return this.request.idempotent;
    }
    /**
     * @property ip
     * Get request ip
     */
    get ip() {
        return this.request.ip;
    }
    /**
     * @property ips
     * Get request ips
     */
    get ips() {
        return this.request.ips;
    }
    /**
     * @property lastModified
     * Get response lastModified
     */
    get lastModified() {
        return this.response.lastModified;
    }
    /**
     * @property lastModified
     * Set response lastModified
     */
    set lastModified(date) {
        this.response.lastModified = date;
    }
    /**
     * @property length
     * Get response length
     */
    get length() {
        return this.response.length;
    }
    /**
     * @property length
     * Set response length
     */
    set length(val) {
        this.response.length = val;
    }
    /**
     * @property message
     * Get response message
     */
    get message() {
        return this.response.message;
    }
    /**
     * @property message
     * Set response message
     */
    set message(val) {
        this.response.message = val;
    }
    /**
     * @property method
     * Get request method
     */
    get method() {
        return this.request.method;
    }
    /**
     * @property method
     * Set request method
     */
    set method(val) {
        this.request.method = val;
    }
    /**
     * @property origin
     * Get request origin
     */
    get origin() {
        return this.request.origin;
    }
    /**
     * @property originalUrl
     * Get request originalUrl
     */
    get originalUrl() {
        return this.request.originalUrl;
    }
    /**
     * @property path
     * Get request path
     */
    get path() {
        return this.request.path;
    }
    /**
     * @property path
     * Set request path
     */
    set path(val) {
        this.request.path = val;
    }
    /**
     * @property protocol
     * Get request protocol
     */
    get protocol() {
        return this.request.protocol;
    }
    /**
     * @property query
     * Get request query
     */
    get query() {
        return this.request.query;
    }
    /**
     * @property query
     * Set request query
     */
    set query(val) {
        this.request.query = val;
    }
    /**
     * @property querystring
     * Get request querystring
     */
    get querystring() {
        return this.request.querystring;
    }
    /**
     * @property querystring
     * Set request querystring
     */
    set querystring(val) {
        this.request.querystring = val;
    }
    /**
     * @method redirect
     * Response redirect method
     */
    redirect(url, alt) {
        return this.response.redirect(url, alt);
    }
    /**
     * @property search
     * Get request search
     */
    get search() {
        return this.request.search;
    }
    /**
     * @property search
     * Set request search
     */
    set search(val) {
        this.request.search = val;
    }
    /**
     * @property secure
     * Set request secure
     */
    get secure() {
        return this.request.secure;
    }
    /**
     * @property url
     * Get request url
     */
    get url() {
        return this.request.url;
    }
    /**
     * @property url
     * Set request url
     */
    set url(val) {
        this.request.url = val;
    }
    /**
     * @property stale
     * Get request stale
     */
    get stale() {
        return this.request.stale;
    }
    /**
     * @property socket
     * Get request socket
     */
    get socket() {
        return this.request.socket;
    }
    /**
     * @property subdomains
     * Get request subdomains
     */
    get subdomains() {
        return this.request.subdomains;
    }
    /**
     * @property status
     * Get response status
     */
    get status() {
        return this.response.status;
    }
    /**
     * @property status
     * Set response status
     */
    set status(val) {
        this.response.status = val;
    }
    /**
     * @property type
     * Get response type
     */
    get type() {
        return this.response.type;
    }
    /**
     * @property type
     * Set response type
     */
    set type(type) {
        this.response.type = type;
    }
    /**
     * @method remove
     * Response remove header field
     */
    remove(field) {
        return this.response.remove(field);
    }
    onerror(err) {
        // don't do anything if there is no error.
        // this allows you to pass `this.onerror`
        // to node-style callbacks.
        if (null == err)
            return;
        if (!(err instanceof Error))
            err = new Error(util.format('non-error thrown: %j', err));
        let headerSent = false;
        if (this.headerSent || !this.writable) {
            headerSent = err.headerSent = true;
        }
        // delegate
        this.app.emit('error', err, this);
        // nothing we can do here other
        // than delegate to the app-level
        // handler and log.
        if (headerSent) {
            return;
        }
        const res = this.res;
        // first unset all headers
        /* istanbul ignore else */
        if (typeof res.getHeaderNames === 'function') {
            res.getHeaderNames().forEach((name) => res.removeHeader(name));
        }
        // then set those specified
        this.set(err.headers);
        // force text/plain
        this.type = 'text';
        // ENOENT support
        if ('ENOENT' === err.code)
            err.status = 404;
        // default to 500
        if ('number' !== typeof err.status || !statuses[err.status])
            err.status = 500;
        // respond
        const code = statuses[err.status];
        const msg = err.expose ? err.message : code;
        this.status = err.status;
        this.length = Buffer.byteLength(msg);
        this.res.end(msg);
    }
    throw(...args) {
        throw httpErrors(...args);
    }
    set(...args) {
        return this.response.set(args[0], args[1]);
    }
    /**
     * @method get
     * Get request headers
     */
    get(field) {
        return this.request.get(field);
    }
    /**
     * @method vary
     * Response vary handler
     */
    vary(field) {
        return this.response.vary(field);
    }
    /**
     * @method flushHeaders
     * Response flush headers
     */
    flushHeaders() {
        this.response.flushHeaders();
    }
    accepts(...args) {
        return this.request.accepts(...args);
    }
    acceptsLanguages(...args) {
        return this.request.acceptsLanguages(...args);
    }
    acceptsCharsets(...args) {
        return this.request.acceptsCharsets(...args);
    }
    acceptsEncodings(...args) {
        return this.request.acceptsEncodings(...args);
    }
}
exports.CreateContext = CreateContext;
