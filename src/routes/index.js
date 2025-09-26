'use strict'

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth.js');
const router = express.Router();
//check Apikey
router.use(apiKey)
//check permission
router.use(permission('0000'))
router.use('/v1/api', require('./access.js/index.js'));

module.exports = router


