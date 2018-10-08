/**
 * @class BodyParser
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 19:07
 */
import { Core as Server, BodyParse } from '../interface';
export declare class BodyParser {
    ctx: Server.Context;
    readonly jsonLimit: string;
    readonly formLimit: string;
    readonly textLimit: number;
    readonly encoding: BodyParse.Encoding;
    readonly multipart: boolean;
    readonly urlencoded: boolean;
    readonly text: boolean;
    readonly json: boolean;
    readonly jsonStrict: boolean;
    readonly formidable: BodyParse.FormidableOptions;
    readonly strict: boolean;
    /**
     * constructor
     * @param ctx Context
     * @param opts Options
     */
    constructor(ctx: Server.Context, opts?: BodyParse.Options);
    /**
     * parse
     * Parser body request and file request
     *
     * Not allow GET DELETE HEAD COPY PURGE UNLOCK request
     */
    parse(): Promise<void>;
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
