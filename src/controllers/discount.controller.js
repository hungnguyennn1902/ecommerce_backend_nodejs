'use strict'
const DiscountService = require('../services/discount.service')
const { SuccessResponse, Created } = require('../core/success.response')
class DiscountController {
    static async createDiscountCode(req, res, next) {
        new Created({
            message: 'Create discount code successfully',
            data: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res);
    }

    static async getAllProductWithDiscount(req, res, next) {
        new SuccessResponse({
            message: 'Get all product with discount code successfully',
            data: await DiscountService.getAllProductWithDiscount({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res);
    }

    static async getAllDiscountByShop(req, res, next) {
        new SuccessResponse({
            message: 'Get all discount for shop successfully',
            data: await DiscountService.getAllDiscountByShop({
                ...req.query,
                shopId: req.user.userId,
            })
        }).send(res);
    }

    static async getDiscountAmount(req, res, next) {
        new SuccessResponse({
            message: 'Get discount amount successfully',
            data: await DiscountService.getDiscountAmount({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res);
    }

    static async deleteDiscountCode(req, res, next) {
        new SuccessResponse({
            message: 'Delete discount code successfully',
            data: await DiscountService.deleteDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res);
    }

    static async cancelDiscountCode(req, res, next) {
        new SuccessResponse({
            message: 'Cancel discount code successfully',
            data: await DiscountService.cancelDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res);

}
}

module.exports = DiscountController;
