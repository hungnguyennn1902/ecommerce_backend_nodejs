'use strict'
const express = require('express');
const router = express.Router();
const rbacController = require('../../controllers/rbac.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// router.use(authentication);

// Resource routes
router.post('/resource', asyncHandler(rbacController.createResource));
router.get('/resources', asyncHandler(rbacController.resourceList));

// Role routes
router.post('/role', asyncHandler(rbacController.createRole));
router.get('/roles', asyncHandler(rbacController.roleList));

module.exports = router;
