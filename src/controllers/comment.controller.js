'use strict'
const CommentService = require('../services/comment.service')
const { SuccessResponse, Created } = require('../core/success.response')
class DiscountController {
    static async createComment(req, res, next) {
        new Created({
            message: 'Create comment successfully',
            data: await CommentService.createComment(req.body)
        }).send(res);
    }
    static async getCommentsByParentId(req, res, next) {
        new SuccessResponse({
            message: 'Get comments successfully',
            data: await CommentService.getCommentsByParentId(req.query)
        }).send(res);
    }
    static async deleteComment(req, res, next) {
        new SuccessResponse({
            message: 'Delete comment successfully',
            data: await CommentService.deleteComment(req.body)
        }).send(res);
    }
}
module.exports = DiscountController;