'use strict'

const JWT = require('jsonwebtoken');
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

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                log('Access Token is invalid:', err.message);
            } else {
                console.log('Access Token is valid:', decoded);
            }
        })
        return { refreshToken, accessToken };

    } catch (error) {
        return {
            code: 'xxxxx',
            message: error.message || 'An error occurred while creating token pair',
        };
    }
}
module.exports = createTokenPair