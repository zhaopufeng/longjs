import { HttpException, Core } from '@longjs/core'

export class CustomHttpException extends HttpException {
    public message: string;
    constructor(error: HttpException, context: any) {
        super(error.message)
        this.message = error.message
        this.errors = error as any
        this.type = 'json'
        this.statusCode = 404
    }
}