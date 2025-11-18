import type { Request, Response } from 'express';
import env from '../../env.ts'

export class APIError extends Error {
    status: number;
    name: string;
    message: string;
    constructor(status: number, message: string, name: string) {
        super(message);
        this.status = status;
        this.name = name;
    }
}

// middleware to log errors
export const errorHandler = (err: APIError, req: Request, res: Response, next: Function) => {
    console.error(err.stack);


    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';

    if (err.name === 'ValidationError') {
        status = 400;
        message = err.message;
    }

    if (err.name === 'UnauthorizedError') {
        status = 401;
        message = 'Unauthorized';
    }

    return res.status(status).json({
        error: message,
        ...(env.APP_STAGE === 'dev' && {
            stack: err.stack,
            details: err.message
        })
    });
}