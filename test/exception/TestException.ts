import { HttpException, Core } from '@longjs/core';

export class TestHttpException extends HttpException {
    constructor(options: Core.HttpException) {
        super(options)
        this.data = {
            code: 0,
            errMsg: options.message,
            errData: options.data
        }
        this.statusCode = 404
    }
}