import { MimeDbTypes } from '.';
import * as assert from 'assert'
import { type } from 'os';
import { extname } from 'path';

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
    [key: string]: FileRule[] | FileRule
}

export interface FileFieldRules {
    [key: string]: FileRule
}

function validateFileType(ruleType: string, fileType: string) {
    return ruleType === fileType
}

function validateFileSize(ruleSize: { max?: number, min?: number } | number , fileSize: number) {
    if (typeof ruleSize === 'object') {
        return fileSize <= ruleSize.max && fileSize >= ruleSize.min
    }
}

function validateFileExtname(ruleExtname: string, filename: string) {
    const fileExtname = extname(filename)
    if (!/^\./.test(ruleExtname)) ruleExtname = `.${ruleExtname}`
    return fileExtname === ruleExtname
}

export function filesFieldRulesValidate(data: Files, filesFieldRules: FilesFieldRules) {
    const errors: any = {}
    const datas: Files = {}
    if (typeof filesFieldRules === 'object' && !Array.isArray(filesFieldRules)) {
        Object.keys(filesFieldRules).forEach((k) => {
            const rules = filesFieldRules[k]
            const _files = data[k] || []
            datas[k] = []
            assert(Array.isArray(_files), `The uploaded file Invalid, Uploading files must contain more than one file.`)
            if (Array.isArray(rules)) {
                rules.forEach((rule, index) => {
                    if (_files[index]) {
                        if (rule.type) {
                            if (!validateFileType(rule.type, _files[index].type)) {
                                errors[k] = errors[k] || []
                                const err = errors[k][index] = errors[k][index] || {}
                                err.type = `The uploaded file Invalid, expected ${rule.type}, got ${_files[index].type}.`
                            }
                        }
                        if (rule.size) {
                            if (!validateFileSize(rule.size, _files[index].size)) {
                                errors[k] = errors[k] || []
                                const err = errors[k][index] = errors[k][index] || {}
                                if (typeof rule.size === 'object') {
                                    err.size = `The uploaded file Invalid, expected ${rule.size.min}-${rule.size.max}, got ${_files[index].size}.`
                                } else {
                                    err.size =  `The uploaded file Invalid, expected maximum ${rule.size}, got ${_files[index].size}.`
                                }
                            }
                        }
                        if (rule.extname) {
                            if (!validateFileExtname(rule.extname, _files[index].name)) {
                                errors[k] = errors[k] || []
                                const err = errors[k][index] = errors[k][index] || {}
                                err.extname = `The uploaded file Invalid, expected ${rule.extname}, got ${extname(_files[index].name)}.`
                            }
                        }
                        if (!errors[k]) {
                            datas[k][index] = _files[index]
                        }
                    } else {
                        let str = `The uploaded file Invalid, expected file`
                        if (rule.type) {
                            str += `type ${rule.type},`
                        }
                        if (rule.size) {
                            if (typeof rule.size === 'object') {
                                str += `size ${rule.size.min}-${rule.size.max}, `
                            } else {
                                str += `maximum size ${rule.size}, `
                            }
                        }
                        if (rule.extname) {
                            str += `extname ${rule.extname}`
                        }
                        errors[k] = str
                    }
                })
            } else if (typeof rules === 'object') {
                _files.forEach((file, index) => {
                    if (rules.type) {
                        if (!validateFileType(rules.type, file.type)) {
                            errors[k] = errors[k] || []
                            const err = errors[k][index] = errors[k][index] || {}
                            err.type = `The uploaded file Invalid, expected ${rules.type}, got ${file.type}.`
                        }
                    }
                    if (rules.size) {
                        if (!validateFileSize(rules.size, file.size)) {
                            errors[k] = errors[k] || []
                            const err = errors[k][index] = errors[k][index] || {}
                            if (typeof rules.size === 'object') {
                                err.size = `The uploaded file Invalid, expected ${rules.size.min}-${rules.size.max}, got ${file.size}.`
                            } else {
                                err.size =  `The uploaded file Invalid, expected maximum ${rules.size}, got ${file.size}.`
                            }
                        }
                    }
                    if (rules.extname) {
                        if (!validateFileExtname(rules.extname, file.name)) {
                            errors[k] = errors[k] || []
                            const err = errors[k][index] = errors[k][index] || {}
                            err.extname = `The uploaded file Invalid, expected ${rules.extname}, got ${extname(file.name)}.`
                        }
                    }
                    if (!errors[k]) {
                        datas[k][index] = _files[index]
                    }
                })
            }
        })
    }
    return {
        datas,
        errors
    }
}

export function fileFieldRulesValidate(data: File, fileFieldRules: FileFieldRules) {
    const errors: any = {}
    const datas: File = {}
    if (typeof fileFieldRules === 'object' && !Array.isArray(fileFieldRules)) {
        Object.keys(fileFieldRules).forEach((key) => {
            const file = data[key]
            const rule = fileFieldRules[key]
            if (file) {
                assert(!Array.isArray(file), `The uploaded file Invalid, the uploaded file cannot contains multiple files, in field ${key}`)
                if (rule.type) {
                    if (validateFileType(rule.type, file.type)) {
                        const err = errors[key] = errors[key] || {}
                        err.type = `The uploaded file Invalid, expected ${rule.type}, got ${file.type}.`
                    }
                }

                if (rule.size) {
                    if (!validateFileSize(rule.size, file.size)) {
                        const err = errors[key] = errors[key] || {}
                        if (typeof rule.size === 'object') {
                            err.size = `The uploaded file Invalid, expected ${rule.size.min}-${rule.size.max}, got ${file.size}.`
                        } else {
                            err.size =  `The uploaded file Invalid, expected maximum ${rule.size}, got ${file.size}.`
                        }
                    }
                }

                if (rule.extname) {
                    if (!validateFileExtname(rule.extname, file.name)) {
                        const err = errors[key] = errors[key] || {}
                        err.extname = `The uploaded file Invalid, expected ${rule.extname}, got ${extname(file.name)}.`
                    }
                }
                if (!errors[key]) {
                    datas[key] = file
                }
            } else {
                let str = `The uploaded file Invalid, expected file`
                if (rule.type) {
                    str += `type ${rule.type},`
                }
                if (rule.size) {
                    if (typeof rule.size === 'object') {
                        str += `size ${rule.size.min}-${rule.size.max}, `
                    } else {
                        str += `maximum size ${rule.size}, `
                    }
                }
                if (rule.extname) {
                    str += `extname ${rule.extname}`
                }
                errors[key] = str
            }
        })
    }
    return {
        datas,
        errors
    }
}