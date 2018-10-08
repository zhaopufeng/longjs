"use strict";
/**
 * @class CreateResponse
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 1:18
 */
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const path = require("path");
const mime = require("mime-types");
const vary = require("vary");
const typeIs = require("type-is");
const disposition = require("content-disposition");
const statuses = require("statuses");
class CreateResponse {
    constructor(req, res, app) {
        this.req = req;
        this.res = res;
        this.app = app;
        this.set('Server', 'tkrjs/' + require('../../package.json').version);
        this.set('Expires', new Date().toUTCString());
        this.set('Cache-Control', 'max-age=60');
        this.vary('Accept-Encoding');
        this.lastModified = new Date();
    }
    /**
     * @property socket
     * Return the request socket.
     */
    get socket() {
        return this.res.socket;
    }
    /**
     * @property header
     * Return response header, alias as response.header
     */
    get header() {
        return this.res.getHeaders();
    }
    /**
     * @property headers
     * Return response header, alias as response.header
     */
    get headers() {
        return this.res.getHeaders();
    }
    /**
     * @property lastModified
     * Get the Last-Modified date in Date form, if it exists.
     */
    get lastModified() {
        const s = this.get('Last-Modified');
        return new Date(s);
    }
    /**
     * @property lastModified
     * Set the Last-Modified date using a string or a Date.
     */
    set lastModified(val) {
        this.set('Last-Modified', val.toUTCString());
    }
    /**
     * @property length
     * Return parsed response Content-Length when present.
     */
    get length() {
        let length = this.get('Content-Length');
        if (!length) {
            if (!this.body)
                return null;
            if (typeof this.body === 'string') {
                return Buffer.byteLength(this.body);
            }
            if (Buffer.isBuffer(this.body)) {
                return this.body.byteLength;
            }
            if (this.body instanceof Object) {
                return Buffer.byteLength(JSON.stringify(this.body));
            }
        }
        // ~~ format length to number
        return ~~length;
    }
    /**
     * @property length
     * Set Content-Length field to `val`
     */
    set length(val) {
        this.set('Content-Length', val.toString());
    }
    /**
     * @property writable
     * Checks if the request is writable.
     * Tests for the existence of the socket
     * as node sometimes does not set it.
     */
    get writable() {
        if (this.finished)
            return false;
        const socket = this.socket;
        if (!socket)
            return true;
        const res = this.res;
        return res.writable;
    }
    /**
     * @property headerSent
     * Check if a header has been written to the socket.
     */
    get headerSent() {
        return this.res.headersSent;
    }
    /**
     * @property finished
     * Return response finished
     */
    get finished() {
        return this.res.finished;
    }
    /**
     * @property status
     * Get response status code.
     */
    get status() {
        return this.res.statusCode;
    }
    /**
     * @property status
     * Set response status code.
     */
    set status(val) {
        this.res.statusCode = val;
    }
    /**
     * @
     * Set Content-Type response header with `type` through `mime.contentType()`
     */
    set type(val) {
        this.set('Content-Type', mime.contentType(val));
    }
    /**
     * @property message
     * Get response status message
     */
    get message() {
        return this.res.statusMessage;
    }
    /**
     * @property message
     * Set response status message
     */
    set message(val) {
        this.res.statusMessage = val;
    }
    /**
     * @property body
     * Get response body.
     */
    get body() {
        return this._body;
    }
    /**
     * @property body
     * Set response body.
     */
    set body(val) {
        if (this.finished)
            return;
        this._body = val;
        if (!this.status)
            this.status = 200;
        const response = this.res;
        if (typeof val === 'string') {
            this.type = 'html';
            this.length = val.length;
            response.write(val);
            response.end();
        }
        else if (Buffer.isBuffer(val)) {
            this.type = 'application/octet-stream';
            this.length = val.byteLength;
            response.write(val);
            response.end();
        }
        else if (val instanceof stream_1.Stream) {
            this.type = 'application/octet-stream';
            response.on('error', this.onError);
        }
        else if (Array.isArray(Array)) {
            this.type = 'json';
            const data = JSON.stringify(val);
            this.length = this.length = Buffer.byteLength(data);
            response.write(data);
            response.end();
        }
        else if (val instanceof Object) {
            this.type = 'json';
            const data = JSON.stringify(val);
            this.length = Buffer.byteLength(data);
            response.write(data);
            response.end();
        }
        else if (val === null) {
            response.end();
        }
        else {
            response.end();
        }
    }
    /**
     * Get the ETag of a response.
     */
    get etag() {
        return this.get('ETag');
    }
    /**
     * @property etag
     * Set the ETag of a response.
     * This will normalize the quotes if necessary.
     *
     *     this.response.etag = 'md5hashsum';
     *     this.response.etag = '"md5hashsum"';
     *     this.response.etag = 'W/"123456789"';
     */
    set etag(val) {
        if (!/^(W\/)?"/.test(val))
            val = `"${val}"`;
        this.set('ETag', val);
    }
    /**
     * @method
     */
    onError(err) {
        console.log(err);
    }
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
    get(field) {
        return this.res.getHeader(field);
    }
    /**
     * @method attachment
     * Set Content-Disposition header to "attachment" with optional `filename`.
     */
    attachment(filename) {
        this.set('Content-Disposition', disposition(filename));
        const mimeType = mime.contentType(path.extname(filename));
        if (mimeType) {
            this.set('Content-Type', mimeType);
        }
    }
    set(...args) {
        const [field, val] = args;
        if (field instanceof Object) {
            Object.keys(field).forEach((k) => {
                this.res.setHeader(k, field[k]);
            });
        }
        else {
            this.res.setHeader(field, val);
        }
    }
    /**
     * @method append
     * Append additional header `field` with value `val`.
     */
    append(field, val) {
        if (!this.res.hasHeader(field)) {
            this.set(field, val);
        }
    }
    /**
     * @method remove
     * Remove header `field`.
     */
    remove(field) {
        if (this.headerSent)
            return;
        this.res.removeHeader(field);
    }
    /**
     * @method vary
     * Vary on `field`.
     */
    vary(field) {
        if (this.headerSent)
            return;
        return vary(this.res, field);
    }
    is(...types) {
        return typeIs.is(this.type, types);
    }
    /**
     * @method flushHeaders
     * Flush any set headers, and begin the body
     */
    flushHeaders() {
        const res = this.res;
        res.flushHeaders();
    }
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
    redirect(url, alt) {
        // location
        if ('back' === url)
            url = this.ctx.get('Referrer') || alt || '/';
        this.set('Location', url);
        // status
        if (!statuses.redirect[this.status])
            this.status = 302;
        // html
        if (this.ctx.accepts('html')) {
            url = escape(url);
            this.type = mime.contentType('html');
            this.body = `Redirecting to <a href="${url}">${url}</a>.`;
            return;
        }
        // text
        this.type = 'text/plain; charset=utf-8';
        this.body = `Redirecting to ${url}.`;
    }
}
exports.CreateResponse = CreateResponse;
