'use strict'

const { Created } = require('../core/success.response');
const ProductService = require('../services/product.service')
class AccessController {

    
    createProduct = async (req, res, next) => {

        new Created({
            message: 'Product created successfully',
            data: await ProductService.createProduct(req.body.product_type, {
                ...req.body, 
                product_shop: req.user.userId
            }),
        }).send(res)
    }
}

module.exports = new AccessController();
