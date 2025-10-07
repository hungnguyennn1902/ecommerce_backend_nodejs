'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const { findAllDiscount, checkDiscountExist } = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");

/**
 * @description Service for managing discounts
 */
class DiscountService {
    static async createDiscountCode(payload) {
        const { name, description, type, value, code, startDate, endDate, maxUsage, maxUsagePerUser, minOrderValue, shopId, isActive, applyTo, productIds } = payload;

        if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
            throw new BadRequestError('Invalid discount date range');
        }

        if (new Date(startDate) >= new Date(endDate)) {
            throw new BadRequestError('Start date must be before end date');
        }

        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: shopId
        }).lean()

        if (foundDiscount && foundDiscount.isActive === true) {
            throw new BadRequestError('Discount code already exists');
        }

        return await discount.create({
            discountName: name,
            discountDescription: description,
            discountType: type,
            discountValue: value,
            discountCode: code,
            discountStartDate: startDate,
            discountEndDate: endDate,
            discountMaxUsage: maxUsage,
            discountMaxUsagePerUser: maxUsagePerUser,
            discountMinOrderValue: minOrderValue,
            discountShopId: shopId,
            discountIsActive: isActive,
            discountApplyTo: applyTo,
            discountProductIds: applyTo === 'all' ? [] : productIds
        })



    }

    /**
     * @description Get all product with discount code
     */
    static async getAllProductWithDiscount({ code, shopId, limit, page }) {
        const foundDiscount = await discount.findOne({
            discountCode: code,
            discountShopId: shopId,
        }).lean()

        if (!foundDiscount || foundDiscount.discountIsActive === false) {
            throw new NotFoundError('Discount code not found');
        }

        const { discountApplyTo, discountProductIds } = foundDiscount
        let product

        if (discountApplyTo === 'all') {
            product = await findAllProducts({
                filter: { product_shop: shopId, isPublished: true },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discountApplyTo === 'specific') {
            product = await findAllProducts({
                filter: { _id: { $in: discountProductIds }, isPublished: true },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return product
    }

    static async getAllDiscountByShop({ shopId, limit, page }) {
        return await findAllDiscount({
            filter: { discountShopId: shopId, discountIsActive: true },
            limit: +limit,
            page: +page,
            sort: 'ctime',
            unselect: ['__v', 'discountShopId']
        })
    }

    /**
     * @description Apply discount code
     */

    static async getDiscountAmount({ code, shopId, userId, products }) {
        const foundDiscount = await checkDiscountExist({
            discountCode: code,
            discountShopId: shopId,
        })
        const { discountIsActive, discountMaxUsage, discountUsedCount, discountStartDate, discountEndDate, discountMinOrderValue, discountMaxUsagePerUser, discountUserUsed, discountValue, discountType } = foundDiscount
        if (!foundDiscount) throw new NotFoundError('Discount code not found')
        if (discountIsActive === false) throw new BadRequestError('Discount has expired')
        if (discountMaxUsage === discountUsedCount) throw new BadRequestError('Discount usage limit reached')
        if (new Date() < new Date(discountStartDate)) throw new BadRequestError('Discount is not yet valid')
        if (new Date() > new Date(discountEndDate)) throw new BadRequestError('Discount has expired')

        // Check minimum order value
        let totalOrder
        if (discountMinOrderValue > 0) {
            totalOrder = products.reduce((total, item) => total + item.price * item.quantity, 0)
            if (totalOrder < discountMinOrderValue) throw new BadRequestError(`Minimum order value is ${discountMinOrderValue}`)
        }
        // Check user usage limit
        if (discountMaxUsagePerUser > 0) {
            const userUsageCount = discountUserUsed.filter(id => id.toString() === userId).length
            if (userUsageCount >= discountMaxUsagePerUser) throw new BadRequestError('You have reached the maximum usage limit for this discount')
        }

        const discountAmount = discountType === 'fixed_amount' ? discountValue : (totalOrder * discountValue) / 100

        return {
            totalOrder,
            discount: discountAmount,
            totalPrice: totalOrder - discountAmount
        }

    }

    static async deleteDiscountCode({ code, shopId }) {
        const deleted = await discount.findOneAndDelete({
            discountCode: code,
            discountShopId: shopId,
        })
        return deleted
    }

    /**
     * @description Cancel discount code (for order cancellation)
     */

    static async cancelDiscountCode({ code, shopId, userId }) {
        const foundDiscount = await checkDiscountExist({
            discountCode: code,
            discountShopId: shopId,
        })
        if (!foundDiscount) throw new NotFoundError('Discount code not found')
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: { discountUserUsed: userId },
            $inc: { discountUsedCount: -1 }
        })
        return result;
    }

}
module.exports = DiscountService;