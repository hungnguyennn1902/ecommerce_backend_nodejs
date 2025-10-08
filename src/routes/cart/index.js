'use strict'

const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

router.get('', asyncHandler(cartController.getUserCart));
router.post('/add', asyncHandler(cartController.addToCart));
router.post('/update', asyncHandler(cartController.updateCartItem));
router.delete('/delete', asyncHandler(cartController.deleteCartItem));


module.exports = router;
