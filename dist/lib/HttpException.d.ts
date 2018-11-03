import { Core } from '..';
export declare class HttpException extends Error implements Core.HttpExceptionCapture {
    errors: {
        [key: string]: Core.Messages;
    };
    statusCode: number;
    type: 'json' | 'html';
}
