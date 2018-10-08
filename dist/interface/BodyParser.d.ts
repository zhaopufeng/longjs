/**
 * @namespace BodyParse
 * @interface BodyParse
 * @export { BodyParse }
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 22:49
 */
export declare namespace BodyParse {
    interface RequestFile {
        fields: any;
        files: any;
    }
    interface Options {
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
