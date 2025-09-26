'use strict'

const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp));

//login
router.post('/shop/login', asyncHandler(accessController.login));

//handle refresh token
router.post('/shop/handle-refresh-token', asyncHandler(accessController.handleRefreshToken));


//authentication
router.use(authentication);

//logout
router.post('/shop/logout', asyncHandler(accessController.logout));


module.exports = router;
