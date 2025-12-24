'use strict'
const { SuccessResponse, Created } = require('../core/success.response')
const rbac = require('../services/rbac.service')
class RbacController {
    static async createResource(req, res, next) {
        new Created({
            message: 'Create resource successfully',
            data: await rbac.createResource(req.body)
        }).send(res)
    }
    static async resourceList(req, res, next) {
        new SuccessResponse({
            message: 'Get resource list successfully',
            data: await rbac.resourceList(req.query)
        }).send(res)
    }
    static async createRole(req, res, next) {
        new Created({
            message: 'Create role successfully',
            data: await rbac.createRole(req.body)
        }).send(res)
    }
    static async roleList(req, res, next) {
        new SuccessResponse({
            message: 'Get role list successfully',
            data: await rbac.roleList(req.query)
        }).send(res)
    }
}
module.exports = RbacController;