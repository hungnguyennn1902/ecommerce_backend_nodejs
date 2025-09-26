'use strict'
const statusCode = {
    FORBIDDEN: 403,
    CONFLICT : 409,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
}
const reasonStatusCode = {
    FORBIDDEN: 'Forbidden error',
    CONFLICT : 'Conflict error',
    UNAUTHORIZED: 'Unauthorized error',
    NOT_FOUND: 'Not found error',
    BAD_REQUEST: 'Bad request error',
}
class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}
class ConflictRequestError extends ErrorResponse {
    constructor(message = reasonStatusCode.CONFLICT, status = statusCode.CONFLICT){
        super(message, status)
    }
}
class BadRequestError extends ErrorResponse { 
    constructor(message = reasonStatusCode.BAD_REQUEST, status = statusCode.BAD_REQUEST){
        super(message, status)
    }
}
class UnauthorizedError extends ErrorResponse {
    constructor(message = reasonStatusCode.UNAUTHORIZED, status = statusCode.UNAUTHORIZED){
        super(message, status)
    }
}
class NotFoundError extends ErrorResponse {
    constructor(message = reasonStatusCode.NOT_FOUND, status = statusCode.NOT_FOUND){
        super(message, status)
    }
}
class ForbiddenError extends ErrorResponse {
    constructor(message = reasonStatusCode.FORBIDDEN, status = statusCode.FORBIDDEN){
        super(message, status)
    }
}
module.exports = {
    BadRequestError,
    ConflictRequestError,
    UnauthorizedError,
    NotFoundError,
    ForbiddenError
}