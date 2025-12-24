'use strict'
const RESOURCE = require('../models/resource.model');
const ROLE = require('../models/role.model');
class RbacService {
    /**
     * new resource
     * @param {string} name
     * @param {string} slug
     * @param {string} description
     */
    static async createResource({ name = 'profile', slug = 'p00001', description = '' }) {
        try {
            const existingResource = await RESOURCE.findOne({ src_slug: slug });
            if (existingResource) {
                return existingResource;
            }
            const newResource = await RESOURCE.create({ src_name: name, src_slug: slug, src_description: description });
            return newResource;
        } catch (error) {
            return error
        }
    }

    static async resourceList(
        {
            userId = 0, //admin
            limit = 30,
            offset = 0,
            search = ''
        }
    ) {
        try {
            const resources = await RESOURCE.aggregate([{
                $project: {
                    _id: 0,
                    resourceId: '$_id',
                    src_name: 1,
                    src_slug: 1,
                    src_description: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }]).skip(offset).limit(limit);
            return resources;
        } catch (error) {
            return error
        }
    }

    static async createRole({
        name = 'shop',
        slug = 's00001',
        description = '',
        grants = []
    }) {
        try {
            const existingRole = await ROLE.findOne({ role_slug: slug });
            if (existingRole) {
                return existingRole;
            }
            const newRole = await ROLE.create({ role_name: name, role_slug: slug, role_description: description, role_grants: grants });
            return newRole;
        } catch (error) {
            return error
        }
    }
    static async roleList({
        userId = 0,
        limit = 30,
        offset = 0,
        search = ''
    }) {
        try{
            const roles = await ROLE.aggregate([{
                $unwind: '$role_grants'
            },{
                $lookup: {
                    from: 'Resources',
                    localField: 'role_grants.resource',
                    foreignField: '_id',
                    as: 'resource_info'
                }
            }
            ,{
                $unwind: '$resource_info'
            }
            ,{
                $project: {
                    _id: 0,
                    role: '$role_name',
                    resource: '$resource_info.src_name',
                    action: '$role_grants.actions',
                    attribute: '$role_grants.attributes'
                    // actions: '$role_grants.actions',
                    // attributes: '$role_grants.attributes'
                }
            
            },{
                $unwind: '$action'
            }
        ]).skip(offset).limit(limit);    
            return roles;
        }catch(error){
            return error
        }
    }

}
module.exports = RbacService;

