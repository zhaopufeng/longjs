import { MimeDbTypes } from '.';
export interface Files {
    [key: string]: BaseFile[];
}
export interface File {
    [key: string]: BaseFile;
}
export interface BaseFile {
    size: number;
    path: string;
    name: string;
    type: string;
    lastModifiedDate?: Date;
    hash?: string;
    toJSON(): Object;
}
export interface FileRule {
    type?: MimeDbTypes;
    extname?: string;
    size?: {
        max?: number;
        min?: number;
    } | number;
}
export interface FilesFieldRules {
    [key: string]: FileRule[] | FileRule;
}
export interface FileFieldRules {
    [key: string]: FileRule;
}
export declare function filesFieldRulesValidate(data: Files, filesFieldRules: FilesFieldRules): {
    datas: Files;
    errors: any;
};
export declare function fileFieldRulesValidate(data: File, fileFieldRules: FileFieldRules): {
    datas: File;
    errors: any;
};
