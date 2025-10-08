'use strict'

const { createUserCart } = require("../models/repositories/cart.repo");
const Cart = require("../models/cart.model");
const { findProduct } = require("../models/repositories/product.repo");
const { NotFoundError } = require("../core/error.response");


/**
    * @description Key Features: Cart Service
    * Add product to cart [User]
    * Reduce product quantity in cart [User]
    * Increase product quantity in cart [User]
    * Remove product from cart [User]
    * Get cart details [User]
    * Delete cart [User]
    * Delete cart items [User]
 */
class CartService {


    // Update product quantity in cart

    static async updateCartItemQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
            cartUserId: userId,
            'cartProducts.productId': productId,
            cartState: 'active'
        },
            updateSet = {
                $inc: {
                    'cartProducts.$.quantity': quantity
                }
            },
            options = { upsert: true, new: true };
        return await Cart.findOneAndUpdate(query, updateSet, options);
    }
    // Add product to cart
    static async addToCart({ userId, product = {} }) {
        // Check if cart exists for the user
        const userCart = await Cart.findOne({ cartUserId: userId, cartState: 'active' });
        if (!userCart) {
            // If no cart exists, create a new cart for the user
            return await createUserCart({ userId, product });
        }
        // If cart exists but is empty, add the product
        if (!userCart.cartProducts.length) {
            userCart.cartProducts = [product]
            return await userCart.save()
        }
        // If cart exists and has products, update the quantity of the product
        return await CartService.updateCartItemQuantity({ userId, product });
    }

    // update item when user changes the quantity from cart page
    /**
     * 
     shopOrderIds = [
        {
            shopId,
            itemProducts:[
            {
                productId,
                quantity,
                oldQuantity,
                shopId,
                price
            }
            ]
     }


     ]
     */
    static async updateCartItem({ userId, shopOrderIds = [] }) {
        const { productId, quantity, oldQuantity } = shopOrderIds[0]?.itemProducts[0]
        const foundProduct = await findProduct({ product_id: productId })
        if (!foundProduct) throw new NotFoundError('Product not found')
        if (foundProduct.product_shop.toString() !== shopOrderIds[0]?.shopId) throw new NotFoundError('Product not found in this shop')
        return await CartService.updateCartItemQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - oldQuantity
            }
        })
    }

    static async deleteCartItem({ userId, productId }) {
        const query = {
            cartUserId: userId,
            cartState: 'active'
        },
            updateSet = {
                $pull: {
                    cartProducts: { productId }
                }
            }
        const deletedCart = await Cart.updateOne(query, updateSet);
        return deletedCart;
    }
    static async getUserCart({ userId }) {
        return await Cart.findOne({ cartUserId: userId, cartState: 'active' }).lean();
    }
}
module.exports = CartService;