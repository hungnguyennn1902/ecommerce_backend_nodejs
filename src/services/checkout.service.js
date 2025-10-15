'use strict'

const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { acquireLock, releaseLock } = require("./redis.service");
const order = require("../models/order.model");
const DiscountService = require("./discount.service");


class CheckoutService {


    /**
    
        payload = {
        cartId,
        userId,
        shopOrderIds : [
            {        
                shopId,
                shopDiscounts:[
                    {
                        discountId,
                        codeId,
                        shopId
                    }
                
                
                ],
                itemProducts:[
                {
                        price,
                        quantity,
                        productId,
                    }
                ]
        
        ]
     }
     */
    static async checkoutReview({
        cartId, userId, shopOrderIds = []
    }) {
        //check cartId valid
        const foundCart = findCartById(cartId);
        if (!foundCart) throw new NotFoundError('Cart not found')
        const checkoutOrder = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }, shopOrderIdsNew = []

        // calculate total price
        for (const shopOrder of shopOrderIds) {
            const { shopId, shopDiscounts = [], itemProducts = [] } = shopOrder
            //check product available
            const productChecked = await checkProductByServer(itemProducts)
            if (productChecked.length !== itemProducts.length) throw new BadRequestError('Some products are not available')

            const checkoutPrice = productChecked.reduce((acc, item) => acc + (item.price * item.quantity), 0)

            checkoutOrder.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shopDiscounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                itemProducts: productChecked
            }
            //check discount apply for shop

            if (shopDiscounts.length > 0) {
                const { discount = 0 } = await DiscountService.getDiscountAmount({
                    code: shopDiscounts[0]?.codeId,
                    shopId,
                    userId,
                    products: productChecked
                })
                checkoutOrder.totalDiscount += discount
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount
            shopOrderIdsNew.push(itemCheckout)




        }
        return {
            shopOrderIds,
            shopOrderIdsNew,
            checkoutOrder
        }

    }
    static async orderByUser({
        shopOrderIds,
        userId,
        cartId,
        userAddress,
        userPaymentMethod
    }) {
        // check if product over inventory
        const { checkoutOrder, shopOrderIdsNew } = await CheckoutService.checkoutReview({
            cartId, userId, shopOrderIds
        })
        const acquireProduct = []
        const products = shopOrderIdsNew.flatMap(i => i.itemProducts)
        for (const product of products) {
            const { quantity, productId } = product
            const keyLock = await acquireLock({ productId, quantity, cartId })
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock);
            }
        }
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Product out of stock')
        }
        const newOrder = await order.create({
            orderUserId: userId,
            orderCheckout: checkoutOrder,
            orderShippingAddress: userAddress,
            orderPaymentMethod: userPaymentMethod,
            orderProducts: shopOrderIdsNew
        })
        return newOrder;




    }
}
module.exports = CheckoutService