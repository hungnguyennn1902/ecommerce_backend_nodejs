'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// get list search products
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProducts));

// get all products
router.get('/all', asyncHandler(productController.getAllProducts));

// get product details
router.get('/:productId', asyncHandler(productController.getProductDetails));

//authentication
router.use(authentication);

//update product
router.patch('/:productId', asyncHandler(productController.updateProduct));

//create product
router.post('/create', asyncHandler(productController.createProduct));

//find all drafts for shop
router.get('/drafts/all', asyncHandler(productController.findAllDraftsForShop));

//find all published for shop
router.get('/published/all', asyncHandler(productController.findAllPublishedForShop));

//publish product
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));

//unpublish product
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));
module.exports = router;
