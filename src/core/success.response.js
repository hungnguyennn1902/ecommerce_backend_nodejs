'use strict'
const StatusCode = {
    OK: 200,
    CREATED: 201,
}
const ReasonStatusCode = {
    OK: 'OK',
    CREATED: 'Created!'
}
class SuccessResponse {
    constructor({message, status=StatusCode.OK, reasonStatusCode=ReasonStatusCode.OK, data = {}}) {
        this.message = message || reasonStatusCode
        this.status = status
        this.data = data
    }
    send(res) {
        return res.status(this.status).json(this)
    }
}
class OK extends SuccessResponse {
    constructor({message, data, options={}}) {
        super({message, data})
        this.options = options
    }
}
class Created extends SuccessResponse {
    constructor({message, data}) {
        super({message, status: StatusCode.CREATED, reasonStatusCode: ReasonStatusCode.CREATED, data})
    }
}
module.exports = {
    OK,
    Created, 
    SuccessResponse
}