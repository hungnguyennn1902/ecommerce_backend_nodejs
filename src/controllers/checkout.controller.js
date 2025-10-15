'use strict'
const CheckoutService = require('../services/checkout.service')
const { SuccessResponse, Created } = require('../core/success.response')
class CheckoutController {

    static async checkoutReview(req, res, next) {
        new SuccessResponse({
            message: 'Checkout review successfully',
            data: await CheckoutService.checkoutReview(req.body)
        }).send(res);
    }

}

module.exports = CheckoutController;
