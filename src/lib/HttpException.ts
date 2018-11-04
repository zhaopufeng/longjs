import { Core } from '..';

export class HttpException extends Error implements Core.HttpException {
    public statusCode: number;
    public data: any;
    constructor(public options: Core.HttpException) {
        super(options.message)
        this.statusCode = options.statusCode || 500
        this.data = options.data
    }
}