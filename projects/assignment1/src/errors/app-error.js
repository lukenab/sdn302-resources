export class AppError extends Error{
    constructor(statusCode, message, code = "APPLICATION ERROR"){
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}