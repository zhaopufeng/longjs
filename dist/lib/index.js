"use strict";
/**
 * validator
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export validator
 */
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("validator");
const validatorJS = require("validator");
const assert = require("assert");
const messages = {
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
};
function valid(data, k, value) {
    switch (k) {
        case 'alpha':
            if (typeof value === 'string') {
                return validator_1.isAlpha(data, value);
            }
            return validator_1.isAlpha(data);
        case 'alphanumeric':
            if (typeof value === 'string') {
                return validator_1.isAlphanumeric(data, value);
            }
            return validator_1.isAlphanumeric(data);
        case 'ascii':
            return validator_1.isAscii(data);
        case 'base64':
            return validator_1.isBase64(data);
        case 'boolean':
            return validator_1.isBoolean(data);
        case 'byteLength':
            return validator_1.isByteLength(data, value);
        case 'creditCard':
            return validator_1.isCreditCard(data);
        case 'dataURI':
            return validator_1.isDataURI(data);
        case 'magnetURI':
            return validatorJS.isMagnetURI(data);
        case 'decimal':
            if (typeof value === 'object') {
                return validator_1.isDecimal(data, value);
            }
            return validator_1.isDecimal(data);
        case 'email':
            if (typeof value === 'object') {
                return validator_1.isEmail(data, value);
            }
            return validator_1.isEmail(data);
        case 'float':
            if (typeof value === 'object') {
                return validator_1.isFloat(data, value);
            }
            return validator_1.isFloat(data);
        case 'hash':
            return validator_1.isHash(data, value);
        case 'hexColor':
            return validator_1.isHexColor(data);
        case 'hexadecimal':
            return validator_1.isHexadecimal(data);
        case 'identityCard':
            if (typeof value === 'string') {
                return validatorJS.isIdentityCard(data, value);
            }
            return validatorJS.isIdentityCard(data);
        case 'ip':
            if (value === '4' || value === '6' || value === 4 || value === 6) {
                return validator_1.isIP(data, value);
            }
            return validator_1.isIP(data);
        case 'ipRange':
            return validatorJS.isIPRange(data);
        case 'ISBN':
            if (typeof value === 'string') {
                return validator_1.isISBN(data, value);
            }
            return validator_1.isISBN(data);
        case 'ISSN':
            if (typeof value === 'string') {
                return validator_1.isISSN(data, value);
            }
            return validator_1.isISSN(data);
        case 'ISIN':
            return validator_1.isISIN(data);
        case 'ISO8601':
            return validator_1.isISO8601(data);
        case 'RFC3339':
            return validatorJS.isRFC3339(data);
        case 'ISO31661Alpha':
            if (value === '2' || value === 2) {
                return validator_1.isISO31661Alpha2(data);
            }
            else if (value === '3' || value === 3) {
                return validatorJS.isISO31661Alpha3(data);
            }
        case 'ISRC':
            return validator_1.isISRC(data);
        case 'in':
            return validator_1.isIn(data, value);
        case 'int':
            if (typeof value === 'object') {
                return validator_1.isInt(data, value);
            }
            return validator_1.isInt(data);
        case 'json':
            return validator_1.isJSON(data);
        case 'jwt':
            return validatorJS.isJWT(data);
        case 'latLong':
            return validator_1.isLatLong(data);
        case 'length':
            return validator_1.isLength(data, value);
        case 'lowercase':
            return validator_1.isLowercase(data);
        case 'macAddress':
            return validator_1.isMACAddress(data);
        case 'md5':
            return validator_1.isMD5(data);
        case 'mimeType':
            return validator_1.isMimeType(data);
        case 'mobilePhone':
            return validator_1.isMobilePhone(data, value);
        case 'multibyte':
            return validator_1.isMultibyte(data);
        case 'numeric':
            if (typeof value === 'object') {
                return validator_1.isNumeric(data, value);
            }
            return validator_1.isNumeric(data);
        case 'port':
            return validator_1.isPort(data);
        case 'postalCode':
            return validator_1.isPostalCode(data, value);
        case 'url':
            return validator_1.isURL(data);
        case 'uuid':
            if (typeof data === 'string') {
                return validator_1.isUUID(data, value);
            }
            return validator_1.isUUID(data);
        case 'uppercase':
            return validator_1.isUppercase(data);
        case 'required':
            return !validator_1.isEmpty(data);
        case 'validator':
            assert(typeof value === 'function', 'Option validator is not a function');
            return value(data);
    }
}
function validator(data = '', rules, message) {
    const errors = {};
    if (rules) {
        const type = typeof rules;
        if (Array.isArray(rules)) {
            rules.forEach((k) => {
                if (!valid(data, k)) {
                    errors[k] = message[k];
                }
            });
        }
        else if (type === 'object') {
            Object.keys(rules).forEach((k) => {
                const ruleValue = rules[k];
                if (ruleValue) {
                    if (!valid(data, k, ruleValue)) {
                        errors[k] = message[k];
                    }
                }
            });
        }
        else if (type === 'string') {
            if (!valid(data, rules)) {
                errors[rules] = message[rules];
            }
        }
    }
    return errors;
}
function validateParams(data, validateKeys) {
    const errors = {};
    Object.keys(validateKeys).forEach((key) => {
        const { rules, message } = validateKeys[key];
        const result = validator(data[key], rules, message || messages);
        if (Object.keys(result).length > 0) {
            errors[key] = result;
        }
    });
    return errors;
}
exports.default = validateParams;
