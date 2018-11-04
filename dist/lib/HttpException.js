"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(options) {
        super(options.message || `Internal server error`);
        this.options = options;
        this.statusCode = options.statusCode || 500;
        this.data = options.data || `Internal server error`;
    }
}
exports.HttpException = HttpException;
