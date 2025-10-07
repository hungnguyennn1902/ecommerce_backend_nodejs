'use strict'

const express = require('express');
const router = express.Router();
const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

//authentication
router.use(authentication);

//get all product with discount code
router.get('/list-product', asyncHandler(discountController.getAllProductWithDiscount));

//create discount code
router.post('/create', asyncHandler(discountController.createDiscountCode));

//get all discount by shop
router.get('/shop', asyncHandler(discountController.getAllDiscountByShop));


module.exports = router;
