'use strict'

const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/upload.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config');

// router.use(authentication);
router.post('/product', asyncHandler(uploadController.uploadImageFromUrl));
router.post('/product/thumbnail', uploadDisk.single('file'), asyncHandler(uploadController.uploadImageFromLocal));
router.post('/product/images', uploadDisk.array('files', 10), asyncHandler(uploadController.uploadImageFromLocal));
router.post('/s3/image', uploadMemory.single('file'), asyncHandler(uploadController.uploadImageToS3));


module.exports = router;
