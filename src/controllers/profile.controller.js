'use strict'
const profiles = [
    {
        usr_id: 1,
        usr_name: 'John Doe',
        usr_avatar: 'https://example.com/avatars/johndoe.jpg',
    },
    {
        usr_id: 2,
        usr_name: 'Jane Smith',
        usr_avatar: 'https://example.com/avatars/janesmith.jpg',
    },
    {
        usr_id: 3,
        usr_name: 'Alice Johnson',
        usr_avatar: 'https://example.com/avatars/alicejohnson.jpg',
    }
]
const profile = {
    usr_id: 1,
    usr_name: 'John Doe',
    usr_avatar: 'https://example.com/avatars/johndoe.jpg',
}
const { SuccessResponse, Created } = require('../core/success.response')
class ProfileController {
    static async profiles(req, res, next) {
        new SuccessResponse({
            message: 'Get profiles successfully',
            data: profiles
        }).send(res)
    }
    static async profile(req, res, next) {
        new SuccessResponse({
            message: 'Get profile successfully',
            data: profile   
        }).send(res)
    }
}
module.exports = ProfileController;