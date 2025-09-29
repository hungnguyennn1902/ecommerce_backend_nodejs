'use strict'
const { UnauthorizedError, NotFoundError } = require('../core/error.response');
const asyncHandler = require('../helpers/asyncHandler');
const keyTokenModel = require('../models/keytoken.model');
const JWT = require('jsonwebtoken');
const { findByUserId } = require('../services/keyToken.service');
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-refresh-token',
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {

        //accessToken 
        const accessToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days',
        });

        //refreshToken
        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days',
        });

        // JWT.verify(accessToken, publicKey, (err, decoded) => {
        //     if (err) {
        //         console.log('Access Token is invalid:', err.message);
        //     } else {
        //         console.log('Access Token is valid:', decoded);
        //     }
        // })
        return { accessToken, refreshToken };

    } catch (error) {
        return {
            code: 'xxxxx',
            message: error.message || 'An error occurred while creating token pair',
        };
    }
}
const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
        throw new UnauthorizedError('Invalid request');
    }
    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError('Not found keyStore');
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new UnauthorizedError('Invalid request');
    }

    try {
        const decoded = await verifyJWT(accessToken, keyStore.publicKey);
        if (userId !== decoded.userId) {
            throw new UnauthorizedError('Invalid user');
        }
        req.user = decoded;
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new UnauthorizedError('Access token expired');
        }
        throw new UnauthorizedError('Invalid access token');
    }

})
const verifyJWT = async (token, publicKey) => {
    return await JWT.verify(token, publicKey, { algorithms: ['RS256'] });
}
module.exports = { createTokenPair, authentication, verifyJWT }