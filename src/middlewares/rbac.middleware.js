'use strict'

const { UnauthorizedError } = require("../core/error.response");
const rbacService = require("../services/rbac.service");
const rbac = require('./role.middleware')

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try{
            rbac.setGrants(await rbacService.roleList({ userId: '099999' }));
            // Lấy role từ user (thay vì query)
            const role_name = req.query.role || 'shop';
            
            // Kiểm tra quyền: can(role)[action](resource).granted
            const permission = rbac.can(role_name)[action](resource);
            
            if(!permission.granted){
                throw new UnauthorizedError("You don't have enough permission to perform this action");
            }
            

            next()
        }catch(error){
            next(error)
        }
    }
}

module.exports = {
    grantAccess
}
