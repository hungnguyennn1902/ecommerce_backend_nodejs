'use strict'

const express = require('express');
const router = express.Router();
const notiController = require('../../controllers/notification.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

router.use(authentication);
// get list noti by user
router.get('/by-user', asyncHandler(notiController.getNotiByUser));
module.exports = router;
