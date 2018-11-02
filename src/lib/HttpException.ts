import { Core } from '..';

export class HttpException extends Error implements Core.HttpException {
    public errors: { [key: string]: Core.Messages};
    public statusCode: number;
    public type: 'json' | 'html';
}