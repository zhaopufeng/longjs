/**
 * @class BodyParser
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 19:07
 */

import { Core as Server, BodyParse } from '../interface'
import * as os from 'os'
import * as parse from 'co-body'
import { IncomingMessage } from 'http';
import * as typeIs from 'type-is';
import * as formidable from 'formidable'

export class BodyParser {
    // JSON正文的字节限制 默认值1mb
    public readonly jsonLimit: string

    // 表单主体数据的限制 默认值56kb
    public readonly formLimit: string;

    // 文本正文的字节限制 默认值56kb
    public readonly textLimit: number;

    // 编码格式 默认 utf-8
    public readonly encoding: BodyParse.Encoding;

    // 开启 multipart 默认true
    public readonly multipart: boolean;

    // 解析 urlencoded  默认true
    public readonly urlencoded: boolean;

    // 解析text 默认true
    public readonly text: boolean;

    // 解析json 默认true
    public readonly json: boolean;

    // json只解析数组和对象 默认true
    public readonly jsonStrict: boolean;

    // formidable 选项
    public readonly formidable: BodyParse.FormidableOptions;
    // 开启严格模式 不解析GET HEAD DELETE请求 默认true
    public readonly strict: boolean;

    /**
     * constructor
     * @param ctx Context
     * @param opts Options
     */
    constructor(
        public ctx: Server.Context,
        opts: BodyParse.Options = {}
    ) {
        this.encoding = opts.encoding || 'utf-8';
        this.formLimit = (opts.formLimit || 56) + 'kb'
        this.json = opts.json || true
        this.jsonLimit = (opts.jsonLimit || 1) + 'mb'
        this.jsonStrict = opts.jsonStrict || true
        this.multipart = opts.multipart || true
        this.urlencoded = opts.urlencoded ||  true
        this.strict = opts.strict || true
    }

    /**
     * parse
     * Parser body request and file request
     *
     * Not allow GET DELETE HEAD COPY PURGE UNLOCK request
     */
    public async parse() {
        if (!/(GET|DELETE|HEAD|COPY|PURGE|UNLOCK)/.test(this.ctx.method)) {
            await this.parseBody()
            await this.parseFile()
        }
    }

    /**
     * parseBody
     * Parser body request data
     */
    private async parseBody() {
        const request = this.ctx.req as IncomingMessage
        if (typeIs(request, 'json') === 'json') {
            this.ctx.request.body = await parse.json(request, { limit: this.jsonLimit, strict: this.strict })
        }

        if (typeIs(request, 'urlencoded') === 'urlencoded') {
            this.ctx.request.body = await parse.form(request, { limit: this.formLimit, strict: this.strict })
        }

        if (typeIs(request, 'text') === 'text') {
            this.ctx.request.body = await parse.text(request, { limit: this.textLimit, strict: this.strict })
        }
    }

    /**
     * parseBody
     * Parser file request data
     */
    private async parseFile(): Promise<any> {
        return new Promise((resolve, reject) => {
            const request = this.ctx.req as IncomingMessage
            if (typeIs(request, 'multipart')) {
                const form = new formidable.IncomingForm()
                if (this.formidable) {
                    const { uploadDir, keepExtensions, maxFieldsSize, maxFields, hash, multiples} = this.formidable
                    if (uploadDir) form.uploadDir = uploadDir
                    if (keepExtensions)  form.keepExtensions = keepExtensions
                    if (maxFieldsSize) {
                        form.maxFieldsSize = maxFieldsSize
                        form.maxFileSize = maxFieldsSize
                    }
                    if (maxFields) form.maxFields = maxFields
                    if (hash) form.hash = hash
                    if (multiples) form.multiples = multiples
                } else {
                    form.uploadDir = os.tmpdir()
                    form.multiples = true
                }

                form.encoding = this.encoding

                form.parse(request, (err, fields, files) => {
                    if (err) reject(err)
                    this.ctx.request.body = fields || {}
                    this.ctx.request.files = files || {}
                    resolve()
                })
            } else {
                resolve()
            }
        })
    }
}