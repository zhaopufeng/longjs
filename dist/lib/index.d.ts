/**
 * validator
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export validator
 */
/// <reference types="validator" />
export default function validateParams(data: {
    [key: string]: any;
}, validateKeys: ValidatorKeys): {
    [key: string]: any;
};
export interface ValidatorKeys {
    [key: string]: ParamsRuleOption | null;
}
export declare type RuleType = 'alpha' | 'alphanumeric' | 'ascii' | 'base64' | 'boolean' | 'creditCard' | 'dataURI' | 'magnetURI' | 'decimal' | 'email' | 'float' | 'hash' | 'hexColor' | 'hexadecimal' | 'identityCard' | 'ip' | 'ipRange' | 'ISBN' | 'ISIN' | 'ISO8601' | 'RFC3339' | 'ISRC' | 'int' | 'json' | 'jwt' | 'latLong' | 'lowercase' | 'macAddress' | 'md5' | 'mimeType' | 'mobilePhone' | 'multibyte' | 'numeric' | 'port' | 'url' | 'uuid' | 'uppercase' | 'required';
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
export interface ParamsRules<T = true, AlphaLocale = ValidatorJS.AlphaLocale, AlphanumericLocale = ValidatorJS.AlphanumericLocale, ByteLength = ValidatorJS.IsByteLengthOptions, Decimal = ValidatorJS.IsDecimalOptions, Email = ValidatorJS.IsEmailOptions, Float = ValidatorJS.IsFloatOptions, Hash = ValidatorJS.HashAlgorithm, IP = true | '4' | '6' | 4 | 6, ISBN = '10' | '13' | 10 | 13, ISSN = ValidatorJS.IsISSNOptions, ISO31661Alpha = '2' | '3' | 2 | 3, Length = ValidatorJS.IsLengthOptions, Numeric = ValidatorJS.IsNumericOptions, PostalCodeLocale = ValidatorJS.PostalCodeLocale, URL = ValidatorJS.IsURLOptions, MobilePhone = ValidatorJS.MobilePhoneLocale, UUID = '3' | '4' | '5' | 3 | 4 | 5 | 'all'> {
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
    [key: string]: T | MobilePhone | PostalCodeLocale | ISO31661Alpha | Length | ISSN | ISBN | UUID | URL | Numeric | Float | IP | Hash | Decimal | Email | ByteLength | AlphanumericLocale | AlphaLocale | {
        (value: string): boolean;
    };
}
