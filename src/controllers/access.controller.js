'use strict'

const { Created, OK, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service')

class AccessController {

    handleRefreshToken = async (req, res, next) => {  
        new SuccessResponse({
            message: 'Get new token successfully',
            data: await AccessService.handleRefreshToken(req.headers['x-refresh-token'])
        }).send(res)
    }

    logout = async (req, res, next) => {
        new OK({
            message: 'Logout successfully',
            data: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    
    login = async (req, res, next) => {
        new OK({
            message: 'Login successfully',
            data: await AccessService.login(req.body)
        }).send(res)
    }
    
    signUp = async (req, res, next) => {

        new Created({
            message: 'Shop created successfully',
            data: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            }
        }
        ).send(res)

    }
}

module.exports = new AccessController();
