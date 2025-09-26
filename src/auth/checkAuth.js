'use strict'
const apikeyModel = require("../models/apikey.model");
const { findById } = require("../services/apiKey.service");
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION : 'authorization'
}
const apiKey = async (req, res, next) => {
    try {
        
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'Forbidden'
            })
        }
        const objKey  = await findById(key)
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden'
            })
        }
        req.objKey = objKey
        return next()
    } catch (error) {
        
    }
}
const permission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey || !req.objKey.permissions.includes(permission)){
            return res.status(403).json({
                message: 'Permission denied'
            })
        }
        return next()
    }
}

module.exports = { apiKey, permission }