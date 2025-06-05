'use strict'

const express = require('express');
const router = express.Router();

router.use('/v1/api', require('./access.js/index.js'));

module.exports = router


