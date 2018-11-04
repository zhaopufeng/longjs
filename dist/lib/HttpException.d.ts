import { Core } from '..';
export declare class HttpException extends Error implements Core.HttpException {
    options: Core.HttpException;
    statusCode: number;
    data: any;
    constructor(options: Core.HttpException);
}
