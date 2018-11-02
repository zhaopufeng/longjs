import { Core } from '..';
export declare class HttpException extends Error implements Core.HttpException {
    errors: {
        [key: string]: Core.Messages;
    };
    statusCode: number;
    type: 'json' | 'html';
}
