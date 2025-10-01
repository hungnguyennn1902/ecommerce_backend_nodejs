'use strict'

const { Created, SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service')
class ProductController {

    static async createProduct(req, res, next) {

        new Created({
            message: 'Product created successfully',
            data: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            }),
        }).send(res)
    }

    static async findAllDraftsForShop(req, res, next) {
        new SuccessResponse({
            message: 'Get list drafts for shop successfully',
            data: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    static async findAllPublishedForShop(req, res, next) {
        new SuccessResponse({
            message: 'Get list published for shop successfully',
            data: await ProductService.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    static async publishProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'Publish product for shop successfully',
            data: await ProductService.pulishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res)
    }

    static async unPublishProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'Unpublish product for shop successfully',
            data: await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res)
    }

    static async getListSearchProducts(req, res, next) {
        new SuccessResponse({
            message: 'Search products successfully',
            data: await ProductService.searchProducts(req.params)
        }).send(res)
    }

    static async getAllProducts(req, res, next) {
        new SuccessResponse({
            message: 'Get all products successfully',
            data: await ProductService.findAllProducts(req.query)
        }).send(res)
    }

    static async getProductDetails(req, res, next) {
        new SuccessResponse({
            message: 'Get product details successfully',
            data: await ProductService.findProduct({
                product_id: req.params.productId
            })
        }).send(res)
    }

    static async updateProduct(req, res, next) {
        new SuccessResponse({
            message: 'Update product successfully',
            data: await ProductService.updateProduct(
                req.body.product_type,
                req.params.productId,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            )
        }).send(res)
    }

}

module.exports = ProductController;
