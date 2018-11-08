/**
 * @class BodyParser
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 19:07
 */

import * as os from 'os'
import * as parse from 'co-body'
import * as typeIs from 'type-is'
import * as formidable from 'formidable'
import { Core } from '@longjs/core'
import { IncomingMessage } from 'http'
import { Plugin } from '@longjs/core'

export default class BodyParser implements Plugin {
    // JSON正文的字节限制 默认值1mb
    public readonly jsonLimit: string

    // 表单主体数据的限制 默认值56kb
    public readonly formLimit: string;

    // 文本正文的字节限制 默认值56kb
    public readonly textLimit: number;

    // 编码格式 默认 utf-8
    public readonly encoding: BodyParser.Encoding;

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
    public readonly formidable: BodyParser.FormidableOptions;
    // 开启严格模式 不解析GET HEAD DELETE请求 默认true
    public readonly strict: boolean;

    public readonly uploadDir: string;

    /**
     * constructor
     * @param ctx Context
     * @param opts Options
     */
    constructor(
       public opts: BodyParser.Options = {}
    ) {
        this.encoding = opts.encoding || 'utf-8';
        this.formLimit = (opts.formLimit || 56) + 'kb'
        this.json = opts.json || true
        this.jsonLimit = (opts.jsonLimit || 1) + 'mb'
        this.jsonStrict = opts.jsonStrict || true
        this.multipart = opts.multipart || true
        this.urlencoded = opts.urlencoded ||  true
        this.strict = opts.strict || true
        this.uploadDir = opts.uploadDir || os.tmpdir()
    }
    public init(options: Core.Options) {
        options.configs = options.configs || {}
        options.configs.body = this.opts
    }

    /**
     * parse
     * Parser body request and file request
     *
     * Not allow GET DELETE HEAD COPY PURGE UNLOCK request
     */
    public async handlerRequest(ctx: Core.Context) {
        if (!/(GET|DELETE|HEAD|COPY|PURGE|UNLOCK)/.test(ctx.method)) {
            await this.parseBody(ctx)
            await this.parseFile(ctx)
        }
    }

    /**
     * parseBody
     * Parser body request data
     */
    private async parseBody(ctx: Core.Context) {
        const request = ctx.req as IncomingMessage
        if (typeIs(request, 'json') === 'json') {
            ctx.request.body = await parse.json(request, { limit: this.jsonLimit, strict: this.strict })
        }

        if (typeIs(request, 'urlencoded') === 'urlencoded') {
            ctx.request.body = await parse.form(request, { limit: this.formLimit, strict: this.strict })
        }

        if (typeIs(request, 'text') === 'text') {
            ctx.request.body = await parse.text(request, { limit: this.textLimit, strict: this.strict })
        }
    }

    /**
     * parseBody
     * Parser file request data
     */
    private async parseFile(ctx: Core.Context): Promise<any> {
        return new Promise((resolve, reject) => {
            const request = ctx.req as IncomingMessage
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
                    form.uploadDir = this.uploadDir
                    form.multiples = true
                }

                form.encoding = this.encoding

                form.parse(request, (err, fields, files) => {
                    if (err) reject(err)
                    ctx.request.body = fields || {}
                    ctx.request.files = files || {}
                    resolve()
                })
            } else {
                resolve()
            }
        })
    }
}

/**
 * @namespace BodyParse
 * @interface BodyParse
 * @export { BodyParse }
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 22:49
 */
export namespace BodyParser {
    export interface RequestFile {
        fields: any;
        files: any;
    }

    export interface Options {
        uploadDir?: string;
        jsonLimit?: number;              // JSON正文的字节限制 默认值1mb
        formLimit?: number;              // 表单主体数据的限制 默认值56kb
        textLimit?: number;              // 文本正文的字节限制 默认值56kb
        encoding?: Encoding;             // 编码格式 默认 utf-8
        multipart?: boolean;             // 开启 multipart 默认true
        urlencoded?: boolean;            // 解析 urlencoded  默认true
        text?: boolean;                  // 解析text 默认true
        json?: boolean;                  // 解析json 默认true
        jsonStrict?: boolean;            // json只解析数组和对象 默认true
        formidable?: FormidableOptions;  // formidable 选项
        strict?: boolean;                // 开启严格模式 不解析GET HEAD DELETE请求 默认true
    }

    export interface FormidableOptions {
        maxFields?: number;              // 限制查询字符串解析器将解码的字段数，默认值1000
        maxFieldsSize?: number;          // 默认情况2mb (2 * 1024 * 1024)
        uploadDir?: string;              // 设置用于放置文件上载的目录，默认值os.tmpDir()
        keepExtensions?: boolean;        // 写入的文件uploadDir将包含原始文件的扩展名，默认值false
        hash?: string | boolean;         // 如果你想要进入的文件计算校验和，此设置为'sha1'或'md5'默认false
        multiples?: boolean;             // 多个文件上传或否，默认true
    }

    export type Encoding = 'utf-8' | string;
}