"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(options) {
        super(options.message);
        this.options = options;
        this.statusCode = options.statusCode || 500;
        this.data = options.data;
    }
}
exports.HttpException = HttpException;
