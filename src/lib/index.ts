/**
 * validator
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export validator
 */

import {
    isAlpha, isAlphanumeric, isAscii, isBase64, isBoolean,
    isByteLength, isCreditCard, isDataURI, isDecimal, isMACAddress,
    isMD5, isMimeType, isMobilePhone, isMultibyte, isEmail, isEmpty,
    isFloat, isFQDN, isHash, isHexadecimal, isHexColor, isIn, isInt, isIP,
    isISBN, isISIN, isISO31661Alpha2, isISO8601, isISRC, isISSN, isJSON,
    isLatLong, isLength, isLowercase, isNumeric, isPort, isPostalCode,
    isUppercase, isURL, isUUID
} from 'validator'
import * as validatorJS from 'validator';
import * as assert from 'assert'

const messages: Messages = {
    alpha: `The parameter is not a date that's after the specified.`,
    alphanumeric: 'The parameter is not contains only letters (a-zA-Z).',
    ascii: 'The parameter is not contains ASCII chars only.',
    base64: 'The parameter is not base64 encoded.',
    boolean: 'The parameter is not a boolean.',
    byteLength: `The parameter's length (in UTF-8 bytes) falls not in a range.`,
    creditCard: `The parameter is not a credit card.`,
    dataURI: `The parameter is not a data uri format.`,
    magnetURI: `The parameter is not a magnet uri format.`,
    decimal: `The parameter represents not a decimal number.`,
    email: `The parameter is not an email.`,
    float: `The parameter is not a float.`,
    hash: `The parameter is not a hash of type algorithm.`,
    hexColor: `The parameter is not a hexadecimal color.`,
    hexadecimal: `The parameter is not a hexadecimal number.`,
    identityCard: `The parameter is not a valid identity card code.`,
    ip: `The parameter is not an IP (version 4 or 6).`,
    ipRange: `The parameter is not an IP Range(version 4 only).`,
    ISBN: `The parameter is not an ISBN (version 10 or 13).`,
    ISSN: `The parameter is not an ISSN.`,
    ISIN: `The parameter is not an ISIN (stock/security identifier).`,
    ISO8601: `The parameter is not a valid ISO 8601 date.`,
    RFC3339: `The parameter is not a valid RFC 3339 date.`,
    ISO31661Alpha: `The parameter is not a valid ISO 3166-1 alpha-2/alpha-3 officially assigned country code.`,
    ISRC: `The parameter is not a ISRC.`,
    in: `The parameter is not in a array of allowed values.`,
    int: `The parameter is not an integer.`,
    json: `The parameter is not valid JSON (note: uses JSON.parse).`,
    jwt: `The parameter is not valid JWT token.`,
    latLong: `The parameter is not a valid latitude-longitude coordinate in the format lat,long or lat, long.`,
    length: `The parameter's length falls not in a range.`,
    lowercase: `The parameter is not lowercase.`,
    macAddress: `The parameter is not a MAC address.`,
    md5: `The parameter is not a MD5 hash.`,
    mimeType: `The parameter not a valid MIME type format.`,
    mobilePhone: `The parameter is not a mobile phone number.`,
    multibyte: `The parameter not contains one or more multibyte chars.`,
    numeric: `The parameter not contains only numbers.`,
    port: `The parameter is not a valid port number.`,
    postalCode: `The parameter is not a postal code.`,
    url: `The parameter is not an URL.`,
    uuid: `The parameter is not a UUID (version 3, 4 or 5).`,
    uppercase: `The parameter is uppercase.`,
    required: `The parameter is required.`,
    validator: `The parameter custom validate fail`,
}

function valid(data: any, k: string, value?: any) {
    switch (k) {
        case 'alpha':
            if (typeof value === 'string') {
                return isAlpha(data, value as any)
            }
            return isAlpha(data)
        case 'alphanumeric':
            if (typeof value === 'string') {
                return isAlphanumeric(data, value as any)
            }
            return isAlphanumeric(data)
        case 'ascii':
            return isAscii(data)
        case 'base64':
            return isBase64(data)
        case 'boolean':
            return isBoolean(data)
        case 'byteLength':
            return isByteLength(data, value)
        case 'creditCard':
            return isCreditCard(data)
        case 'dataURI':
            return isDataURI(data)
        case 'magnetURI':
            return (validatorJS as any).isMagnetURI(data)
        case 'decimal':
            if (typeof value === 'object') {
                return isDecimal(data, value as any)
            }
            return isDecimal(data)
        case 'email':
            if (typeof value === 'object') {
                return isEmail(data, value as any)
            }
            return isEmail(data)
        case 'float':
            if (typeof value === 'object') {
                return isFloat(data, value as any)
            }
            return isFloat(data)
        case 'hash':
            return isHash(data, value)
        case 'hexColor':
            return isHexColor(data)
        case 'hexadecimal':
            return isHexadecimal(data)
        case 'identityCard':
            if (typeof value === 'string') {
                return (validatorJS as any).isIdentityCard(data, value)
            }
            return (validatorJS as any).isIdentityCard(data)
        case 'ip':
            if (value === '4' || value === '6' || value === 4 || value === 6) {
                return isIP(data, value as any)
            }
            return isIP(data)
        case 'ipRange':
            return (validatorJS as any).isIPRange(data)
        case 'ISBN':
            if (typeof value === 'string') {
                return isISBN(data, value as any)
            }
            return isISBN(data)
        case 'ISSN':
            if (typeof value === 'string') {
                return isISSN(data, value as any)
            }
            return isISSN(data)
        case 'ISIN':
            return isISIN(data)
        case 'ISO8601':
            return isISO8601(data)
        case 'RFC3339':
            return (validatorJS as any).isRFC3339(data)
        case 'ISO31661Alpha':
            if (value === '2' || value === 2) {
                return isISO31661Alpha2(data)
            } else if (value === '3' || value === 3) {
                return (validatorJS as any).isISO31661Alpha3(data)
            }
        case 'ISRC':
            return isISRC(data)
        case 'in':
            return isIn(data, value)
        case 'int':
            if (typeof value === 'object') {
                return isInt(data, value)
            }
            return isInt(data)
        case 'json':
            return isJSON(data)
        case 'jwt':
            return (validatorJS as any).isJWT(data)
        case 'latLong':
            return isLatLong(data)
        case 'length':
            return isLength(data, value)
        case 'lowercase':
            return isLowercase(data)
        case 'macAddress':
            return isMACAddress(data)
        case 'md5':
            return isMD5(data)
        case 'mimeType':
            return isMimeType(data)
        case 'mobilePhone':
            return isMobilePhone(data, value)
        case 'multibyte':
            return isMultibyte(data)
        case 'numeric':
            if (typeof value === 'object') {
                return isNumeric(data, value as any)
            }
            return isNumeric(data)
        case 'port':
            return isPort(data)
        case 'postalCode':
            return isPostalCode(data, value)
        case 'url':
            return isURL(data)
        case 'uuid':
            if (typeof data === 'string') {
                return isUUID(data, value)
            }
            return isUUID(data)
        case 'uppercase':
            return isUppercase(data)
        case 'required':
            return !isEmpty(data)
        case 'validator':
        assert(typeof value === 'function', 'Option validator is not a function')
        return value(data)
    }
}

function validator(data: any = '', rules: ParamsRules | RuleType[] | RuleType, message: Messages): object {
    const errors: any = {}
    if (rules) {
        const type = typeof rules
        if (Array.isArray(rules)) {
            rules.forEach((k) => {
                if (!valid(data, k)) {
                    errors[k] = message[k]
                }
            })
        } else if (type === 'object') {
            Object.keys(rules).forEach((k: string) => {
                const ruleValue = (rules as ParamsRules)[k]
                if (ruleValue) {
                    if (!valid(data, k, ruleValue)) {
                        errors[k] = message[k]
                    }
                }
            })
        } else if (type === 'string') {
            if (!valid(data, rules as RuleType)) {
                errors[rules as RuleType] = message[rules as RuleType]
            }
        }
    }
    return errors
}

export default function validateParams(data: { [key: string]: any }, validateKeys: ValidatorKeys): { [key: string]: any } {
    const errors: { [key: string]: any } = {}
    Object.keys(validateKeys).forEach((key: string) => {
        const { rules, message } = validateKeys[key]
        const result = validator(data[key], rules, message || messages)
        if (Object.keys(result).length > 0) {
            errors[key] = result
        }
    })
    return errors
}

export interface ValidatorKeys {
    [key: string]: ParamsRuleOption | null;
}

export type RuleType = 'alpha' | 'alphanumeric' | 'ascii' |
'base64' | 'boolean' | 'creditCard' | 'dataURI' | 'magnetURI' |
'decimal' | 'email' | 'float' | 'hash' | 'hexColor' | 'hexadecimal' |
'identityCard' | 'ip' | 'ipRange' | 'ISBN' | 'ISIN' | 'ISO8601' | 'RFC3339' |
'ISRC' | 'int' | 'json' | 'jwt' | 'latLong' | 'lowercase' | 'macAddress' |
'md5' | 'mimeType' | 'mobilePhone' | 'multibyte' | 'numeric' | 'port' | 'url' | 'uuid' |
'uppercase' | 'required'

export interface ParamsRuleOption {
    rules?: ParamsRules | RuleType[] | RuleType;
    message?: Messages;
    defalut?: any;
}

export interface Messages<S = string> {
    alpha?: S;
    alphanumeric?: S;
    ascii?: S;
    base64?: S;
    boolean?: S;
    byteLength?: S;
    creditCard?: S;
    dataURI?: S;
    magnetURI?: S;
    decimal?: S;
    email?: S;
    float?: S;
    hash?: S;
    hexColor?: S;
    hexadecimal?: S;
    identityCard?: S;
    ip?: S;
    ipRange?: S;
    ISBN?: S;
    ISSN?: S;
    ISIN?: S;
    ISO8601?: S;
    RFC3339?: S;
    ISO31661Alpha?: S;
    ISRC?: S;
    in?: S;
    int?: S;
    json?: S;
    jwt?: S;
    latLong?: S;
    length?: S;
    lowercase?: S;
    macAddress?: S;
    md5?: S;
    mimeType?: S;
    mobilePhone?: S;
    multibyte?: S;
    numeric?: S;
    port?: S;
    postalCode?: S;
    url?: S;
    uuid?: S;
    uppercase?: S;
    required?: S;
    validator?: S;
    [key: string]: S;
}

export interface ParamsRules<
    T = true,
    AlphaLocale = ValidatorJS.AlphaLocale,
    AlphanumericLocale = ValidatorJS.AlphanumericLocale,
    ByteLength = ValidatorJS.IsByteLengthOptions,
    Decimal = ValidatorJS.IsDecimalOptions,
    Email = ValidatorJS.IsEmailOptions,
    Float = ValidatorJS.IsFloatOptions,
    Hash = ValidatorJS.HashAlgorithm,
    IP = true | '4' | '6' | 4 | 6,
    ISBN = '10' | '13' | 10 | 13,
    ISSN = ValidatorJS.IsISSNOptions,
    ISO31661Alpha = '2' | '3' | 2 | 3,
    Length = ValidatorJS.IsLengthOptions,
    Numeric = ValidatorJS.IsNumericOptions,
    PostalCodeLocale = ValidatorJS.PostalCodeLocale,
    URL = ValidatorJS.IsURLOptions,
    MobilePhone =  ValidatorJS.MobilePhoneLocale,
    UUID = '3' | '4' | '5' | 3 | 4 | 5 | 'all'> {
    alpha?: T | AlphaLocale;
    alphanumeric?: T | AlphanumericLocale;
    ascii?: T;
    base64?: T;
    boolean?: T;
    byteLength?: ByteLength;
    creditCard?: T;
    dataURI?: T;
    magnetURI?: T;
    decimal?: T | Decimal;
    email?: T | Email;
    float?: T | Float;
    hash?: Hash;
    hexColor?: T;
    hexadecimal?: T;
    identityCard?: T;
    ip?: IP;
    ipRange?: T;
    ISBN?: ISBN;
    ISSN?: T | ISSN;
    ISIN?: T;
    ISO8601?: T;
    RFC3339?: T;
    ISO31661Alpha?: ISO31661Alpha;
    ISRC?: T;
    in?: T;
    int?: T;
    json?: T;
    jwt?: T;
    latLong?: T;
    length?: Length;
    lowercase?: T;
    macAddress?: T;
    md5?: T;
    mimeType?: T;
    mobilePhone?: T | MobilePhone;
    multibyte?: T;
    numeric?: T | Numeric;
    port?: T;
    postalCode?: PostalCodeLocale;
    url?: T | URL;
    uuid?: UUID;
    uppercase?: T;
    required?: T;
    validator?: (value: string) => boolean;
    [key: string]: T | MobilePhone | PostalCodeLocale | ISO31661Alpha | Length | ISSN | ISBN | UUID | URL | Numeric | Float | IP | Hash | Decimal | Email | ByteLength | AlphanumericLocale | AlphaLocale | { (value: string): boolean }
}