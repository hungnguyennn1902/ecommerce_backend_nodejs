'use strict'

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth.js');
const router = express.Router();
const logDiscordMiddleware = require('../middlewares/log.discord.js');

// Log all requests to Discord
// router.use(logDiscordMiddleware);
//check Apikey
router.use(apiKey)
//check permission
router.use(permission('0000'))
router.use('/v1/api/notification', require('./notification/index.js'));
router.use('/v1/api/comment', require('./comment/index.js'));
router.use('/v1/api/checkout', require('./checkout/index.js'));
router.use('/v1/api/cart', require('./cart/index.js'));
router.use('/v1/api/discount', require('./discount/index.js'));
router.use('/v1/api/product', require('./product/index.js'));
router.use('/v1/api', require('./access/index.js'));

module.exports = router


