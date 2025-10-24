const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/comment.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// router.use(authentication);
router.post('/create', asyncHandler(commentController.createComment));
router.get('/by-parent', asyncHandler(commentController.getCommentsByParentId));
router.delete('/delete', asyncHandler(commentController.deleteComment));
module.exports = router;