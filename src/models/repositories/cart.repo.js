'use strict'
const Cart = require('../cart.model')
const createUserCart = async ({userId, product}) =>{
    const userCart = await Cart.create({
        cartUserId: userId,
        cartProducts: [product],
    });
    return userCart;
}
const findCartById = async (cartId) =>{
    return await Cart.findOne({_id: cartId, cartState: 'active'}).lean()
}
module.exports = {
    createUserCart,
    findCartById
}