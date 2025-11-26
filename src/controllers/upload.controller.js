'use strict'
const UploadService = require('../services/upload.service')
const { SuccessResponse } = require('../core/success.response')
const { BadRequestError, NotFoundError } = require('../core/error.response')
class UploadController {
    static async uploadImageFromUrl(req, res, next) {
        await UploadService.uploadImageFromUrl()
        new SuccessResponse({
            message: 'Upload image from URL successfully'
        }).send(res)
    }
    static async uploadImageFromLocal(req, res, next) {
        const file = req.file
        if (!file) {
            throw new NotFoundError('File not found').send(res)
        }
        new SuccessResponse({
            message: 'Upload image from local successfully',
            data: await UploadService.uploadImageFromLocal({ path: file.path })
        }).send(res)

    }
}
module.exports = UploadController;