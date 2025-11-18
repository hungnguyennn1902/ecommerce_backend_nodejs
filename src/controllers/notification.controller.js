'use strict'
const NotiService = require('../services/notification.service')
const { SuccessResponse, Created } = require('../core/success.response')
class NotificationController {
    static async getNotiByUser(req, res, next) {
        new SuccessResponse({
            message: 'Get notifications successfully',
            data: await NotiService.listNotiByUser(req.query)
        }).send(res);
    }
}
module.exports = NotificationController;