"use strict";
/**
 * @class BodyParser
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 19:07
 */
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const parse = require("co-body");
const typeIs = require("type-is");
const formidable = require("formidable");
class CreateBody {
    /**
     * constructor
     * @param ctx Context
     * @param opts Options
     */
    constructor(ctx, opts = {}) {
        this.ctx = ctx;
        this.encoding = opts.encoding || 'utf-8';
        this.formLimit = (opts.formLimit || 56) + 'kb';
        this.json = opts.json || true;
        this.jsonLimit = (opts.jsonLimit || 1) + 'mb';
        this.jsonStrict = opts.jsonStrict || true;
        this.multipart = opts.multipart || true;
        this.urlencoded = opts.urlencoded || true;
        this.strict = opts.strict || true;
    }
    /**
     * parse
     * Parser body request and file request
     *
     * Not allow GET DELETE HEAD COPY PURGE UNLOCK request
     */
    async create() {
        if (!/(GET|DELETE|HEAD|COPY|PURGE|UNLOCK)/.test(this.ctx.method)) {
            await this.parseBody();
            await this.parseFile();
        }
    }
    /**
     * parseBody
     * Parser body request data
     */
    async parseBody() {
        const request = this.ctx.req;
        if (typeIs(request, 'json') === 'json') {
            this.ctx.request.body = await parse.json(request, { limit: this.jsonLimit, strict: this.strict });
        }
        if (typeIs(request, 'urlencoded') === 'urlencoded') {
            this.ctx.request.body = await parse.form(request, { limit: this.formLimit, strict: this.strict });
        }
        if (typeIs(request, 'text') === 'text') {
            this.ctx.request.body = await parse.text(request, { limit: this.textLimit, strict: this.strict });
        }
    }
    /**
     * parseBody
     * Parser file request data
     */
    async parseFile() {
        return new Promise((resolve, reject) => {
            const request = this.ctx.req;
            if (typeIs(request, 'multipart')) {
                const form = new formidable.IncomingForm();
                if (this.formidable) {
                    const { uploadDir, keepExtensions, maxFieldsSize, maxFields, hash, multiples } = this.formidable;
                    if (uploadDir)
                        form.uploadDir = uploadDir;
                    if (keepExtensions)
                        form.keepExtensions = keepExtensions;
                    if (maxFieldsSize) {
                        form.maxFieldsSize = maxFieldsSize;
                        form.maxFileSize = maxFieldsSize;
                    }
                    if (maxFields)
                        form.maxFields = maxFields;
                    if (hash)
                        form.hash = hash;
                    if (multiples)
                        form.multiples = multiples;
                }
                else {
                    form.uploadDir = os.tmpdir();
                    form.multiples = true;
                }
                form.encoding = this.encoding;
                form.parse(request, (err, fields, files) => {
                    if (err)
                        reject(err);
                    this.ctx.request.body = fields || {};
                    this.ctx.request.files = files || {};
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
}
exports.CreateBody = CreateBody;
