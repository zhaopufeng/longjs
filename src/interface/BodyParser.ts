/**
 * @namespace BodyParse
 * @interface BodyParse
 * @export { BodyParse }
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 22:49
 */
export namespace BodyParse {
    export interface RequestFile {
        fields: any;
        files: any;
    }

    export interface Options {
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