/**
 * @class BodyParser
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 19:07
 */
import { Core } from '@longjs/core';
import { Plugin } from '@longjs/core';
export default class BodyParser implements Plugin {
    opts: BodyParser.Options;
    readonly jsonLimit: string;
    readonly formLimit: string;
    readonly textLimit: number;
    readonly encoding: BodyParser.Encoding;
    readonly multipart: boolean;
    readonly urlencoded: boolean;
    readonly text: boolean;
    readonly json: boolean;
    readonly jsonStrict: boolean;
    readonly formidable: BodyParser.FormidableOptions;
    readonly strict: boolean;
    readonly uploadDir: string;
    /**
     * constructor
     * @param ctx Context
     * @param opts Options
     */
    constructor(opts?: BodyParser.Options);
    init(options: Core.Options): void;
    /**
     * parse
     * Parser body request and file request
     *
     * Not allow GET DELETE HEAD COPY PURGE UNLOCK request
     */
    handlerRequest(ctx: Core.Context): Promise<void>;
    /**
     * parseBody
     * Parser body request data
     */
    private parseBody;
    /**
     * parseBody
     * Parser file request data
     */
    private parseFile;
}
/**
 * @namespace BodyParse
 * @interface BodyParse
 * @export { BodyParse }
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 22:49
 */
export declare namespace BodyParser {
    interface RequestFile {
        fields: any;
        files: any;
    }
    interface Options {
        uploadDir?: string;
        jsonLimit?: number;
        formLimit?: number;
        textLimit?: number;
        encoding?: Encoding;
        multipart?: boolean;
        urlencoded?: boolean;
        text?: boolean;
        json?: boolean;
        jsonStrict?: boolean;
        formidable?: FormidableOptions;
        strict?: boolean;
    }
    interface FormidableOptions {
        maxFields?: number;
        maxFieldsSize?: number;
        uploadDir?: string;
        keepExtensions?: boolean;
        hash?: string | boolean;
        multiples?: boolean;
    }
    type Encoding = 'utf-8' | string;
}
