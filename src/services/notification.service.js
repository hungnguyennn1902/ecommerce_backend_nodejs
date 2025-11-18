'use strict'
const { model } = require('mongoose');
const NotiModel = require('../models/notification.model');
class NotificationService {
    static async pushNotiToSystem({
        type='SHOP-001',
        senderId = 1,
        receiverId = 2,
        options = {},
    }){
        let noti_content
        if(type === 'SHOP-001'){
            noti_content = 'Shop vừa mới thêm một sản phẩm: @@@'
        }else if(type === 'PROMOTION-001'){
            noti_content = 'Chương trình khuyến mãi mới: @@@'
        }
        const newNoti = await NotiModel.create({
            noti_type: type,
            noti_senderId: senderId,
            noti_receiverId: receiverId,
            noti_content: noti_content,
            noti_options: options,
        })
        return newNoti
    }
    static async listNotiByUser({
        userId = 1,
        type = 'ALL',
        isRead = 0,
    }){
        const match = {
            noti_receiverId: userId,
        }
        if(type !== 'ALL'){
            match.noti_type = type
        }
        return await NotiModel.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receiverId: 1,
                    noti_content: 1,
                    noti_options: 1,
                    createdAt: 1,
                }
            }
        ])
    }
}
module.exports = NotificationService;
