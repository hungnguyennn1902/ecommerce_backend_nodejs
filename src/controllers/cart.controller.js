'use strict'
const CartService = require('../services/cart.service')
const { SuccessResponse, Created } = require('../core/success.response')
class CartController {

    static async addToCart(req, res, next) {
        new SuccessResponse({
            message: 'Add to cart successfully',
            data: await CartService.addToCart(req.body)
        }).send(res);
    }

    static async updateCartItem(req, res, next) {
        new SuccessResponse({
            message: 'Update cart item successfully',
            data: await CartService.updateCartItem(req.body)
        }).send(res);
    }

    static async deleteCartItem(req, res, next) {
        new SuccessResponse({
            message: 'Delete cart item successfully',
            data: await CartService.deleteCartItem(req.body)
        }).send(res);
    }

    static async getUserCart(req, res, next) {
        new SuccessResponse({
            message: 'Get user cart successfully',
            data: await CartService.getUserCart(req.query)
        }).send(res);
    }

}

module.exports = CartController;
