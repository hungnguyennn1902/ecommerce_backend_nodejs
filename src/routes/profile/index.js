'use strict'
const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profile.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const { grantAccess } = require('../../middlewares/rbac.middleware');

// router.use(authentication);
router.get('/viewAny', grantAccess('readAny', 'profile'), asyncHandler(profileController.profiles));
router.get('/viewOwn', grantAccess('readOwn', 'profile'), asyncHandler(profileController.profile));
module.exports = router;
