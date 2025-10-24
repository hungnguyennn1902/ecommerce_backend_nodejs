'use strict'
const Comment = require('../models/comment.model');
const { NotFoundError } = require('../core/error.response');
const { getProductById } = require('../models/repositories/product.repo');

/**
 * Key Features:
 * add comment [user, shop]
 * get a list of comments [user, shop]
 * delete comment [user, shop, admin]
 */
class CommentService {
    static async createComment({ productId, userId, content, parentCommentId = null }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        });
        let rightValue
        if (parentCommentId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                throw new NotFoundError('Parent comment not found');
            }
            rightValue = parentComment.comment_right
            //update many comment
            await Comment.updateMany({
                comment_productId: productId,
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })
            await Comment.updateMany({
                comment_productId: productId,
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })
        } else {
            const maxRightValue = await Comment.findOne({
                comment_productId: productId
            }, 'comment_right', { sort: { 'comment_right': -1 } })
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1
        return await comment.save();
    }

    static async getCommentsByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId);
            if (!parent) {
                throw new NotFoundError('Parent comment not found');
            }
            const comments = await Comment.find({
                comment_productId: productId,
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lt: parent.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1,
            }).limit(limit).skip(offset)
                .sort({
                    comment_left: 1
                })

            return comments;
        }
        const comments = await Comment.find({
            comment_productId: productId,
            comment_parentId: null
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1,
        }).limit(limit).skip(offset)
            .sort({
                comment_left: 1
            })
        return comments;
    }

    static async deleteComment({ commentId, productId }) {
        const foundProduct = await getProductById(productId)
        if (!foundProduct) {
            throw new NotFoundError('Product not found');
        }
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new NotFoundError('Comment not found');
        }
        const leftValue = comment.comment_left
        const rightValue = comment.comment_right
        const width = rightValue - leftValue + 1;
        // delete comment and its replies
        await Comment.deleteMany({
            comment_productId: productId,
            comment_left: { $gte: leftValue },
            comment_right: { $lte: rightValue }
        })
        // update left and right values of remaining comments
        await Comment.updateMany({
            comment_productId: productId,
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -width }
        })
        await Comment.updateMany({
            comment_productId: productId,
            comment_left: { $gt: rightValue }
        }, {
            $inc: { comment_left: -width }
        })
        return true
    }
}

module.exports = CommentService;