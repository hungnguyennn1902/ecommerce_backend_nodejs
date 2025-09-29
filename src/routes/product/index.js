'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

//authentication
router.use(authentication);

//logout
router.post('/create', asyncHandler(productController.createProduct));


module.exports = router;
