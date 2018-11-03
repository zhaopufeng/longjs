import { HttpException, Core } from '@longjs/core'

export class CustomHttpException extends HttpException {
    public message: string;
    constructor(error: HttpException) {
        console.log(error)
        super(error.message)
        this.errors = error.errors
        this.type = 'json'
        this.statusCode = 200
    }
}