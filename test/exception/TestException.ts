import { HttpException, Core } from '@longjs/core';

export class TestHttpException extends HttpException {
    constructor(options: Core.HttpException) {
        super(options)
        console.log(options)
    }
}