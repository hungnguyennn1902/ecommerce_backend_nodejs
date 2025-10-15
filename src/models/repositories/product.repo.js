'use strict'
const { getSelectData, getUnSelectData } = require('../../utils');
const { product, clothing, electronic } = require('../product.model');

const searchProducts = async ({ keySearch }) => {
    const result = await product.find({
        $text: { $search: keySearch },
        isPublished: true
    }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .lean()
    return result;
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}
const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
    return products;
}

const findProduct = async ({ product_id, unselect = [] }) => {
    return await product.findById(product_id)
        .select(getUnSelectData(unselect))
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop,
        _id: product_id
    })
    if (!foundProduct) return null;
    foundProduct.isDraft = false;
    foundProduct.isPublished = true;
    await foundProduct.save();
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop,
        _id: product_id
    })
    if (!foundProduct) return null;
    foundProduct.isDraft = true;
    foundProduct.isPublished = false;
    await foundProduct.save();
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query).
        populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
    return await model.findByIdAndUpdate(
        productId,
        bodyUpdate,
        { new: isNew }
    )
}


const getProductById = async (productId) => {
    return await product.findById(productId).lean();
}
const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async (product) => {
        const foundProduct = await getProductById(product.productId)
        if(foundProduct) {
            return{
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId
            }
        }
        return null;
    }))
}
module.exports = {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProduct, 
    updateProductById,
    checkProductByServer
};
