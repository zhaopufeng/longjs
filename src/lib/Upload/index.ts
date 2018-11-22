import * as fs from 'fs'
import { IncomingForm } from 'formidable'
import * as typeIs from 'type-is'
import { IncomingMessage, ServerResponse } from 'http';
import { Core } from 'src';
import { HttpException } from '../HttpException';
import { join } from 'path';
export class Upload {
    constructor(public options: FileUploadOpts = {}) {}
    public async parseRequest(ctx: Core.Context): Promise<any> {
        if (ctx.finished || ctx.headerSent || !ctx.writable) return;
        if (!/(GET|DELETE|HEAD|COPY|PURGE|UNLOCK)/.test(ctx.req.method)) {
            const req = ctx.req as IncomingMessage
            const res = ctx.res as ServerResponse
            return new Promise((resolve, reject) => {
                if (typeIs(req as IncomingMessage, 'multipart')) {
                    const form = new IncomingForm()
                    const {
                        maxFields,
                        maxFieldsSize,
                        maxFileSize,
                        encoding,
                        hash,
                        uploadDir,
                        multiples,
                        type,
                        bytesReceived,
                        bytesExpected
                    } = this.options
                    if (maxFields) form.maxFields = maxFields
                    if (maxFieldsSize) form.maxFieldsSize = maxFieldsSize
                    if (maxFileSize) form.maxFileSize = maxFileSize
                    if (encoding) form.encoding = encoding
                    if (hash) form.hash = hash
                    if (uploadDir) form.uploadDir = uploadDir
                    if (multiples) form.multiples = multiples
                    if (type) form.type = type
                    if (bytesExpected) form.bytesExpected = bytesExpected
                    if (bytesReceived) form.bytesReceived = bytesReceived
                    form.parse(req as IncomingMessage, (err, fields, files) => {
                        if (err) {
                            const { message } = err
                            if (/^(maxFileSize| maxFieldsSize)/.test(message)) {
                                reject(new HttpException({statusCode: 413}))
                            } else if (/^bad content-type header/.test(message)) {
                                reject(new HttpException({statusCode: 406}))
                            } else  {
                                reject(new HttpException({statusCode: 400}))
                            }
                        }
                        ctx.request.body = fields || {}
                        ctx.request.files = files || {}
                        resolve()
                    })

                    form.on('file', (name, file) => {
                        let needsave = false
                        file.save = function(path: string, name?: string) {
                            needsave = true
                            const rd = fs.createReadStream(file.path)
                            const wt = fs.createWriteStream(join(path, name || file.name))
                            rd.pipe(wt)
                            wt.on('close', function() {
                                fs.unlink(file.path, (err) => {
                                    if (err) throw err;
                                })
                            })
                        }
                        if (fs.existsSync(file.path)) {
                            res.on('finish', function() {
                                if (!needsave) {
                                    fs.unlink(file.path, (err) => {
                                        if (err) throw err;
                                    })
                                    return;
                                }
                            })
                        }
                    })
                }
            })
        }
    }
}

export interface FileUploadOpts {
    encoding?: string;
    uploadDir?: string;
    keepExtensions?: boolean;
    maxFileSize?: number;
    maxFieldsSize?: number;
    maxFields?: number;
    hash?: string | boolean;
    multiples?: boolean;
    type?: string;
    bytesReceived?: number;
    bytesExpected?: number;
}