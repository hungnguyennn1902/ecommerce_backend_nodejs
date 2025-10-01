'use strict'

const shopModel = require("../models/shop.model")
const keyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const {getInfoData} = require("../utils")
const { BadRequestError, ConflictRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response")
const { findbyEmail } = require("./shop.service")
const KeyTokenService = require("./keyToken.service")
const { verifyJWT } = require("../auth/authUtils")
const roleShop = {
    SHOP: 'SHOP',
    ADMIN: 'ADMIN',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
}

class AccessService {
    /*
        check this token used?
    */
    static handleRefreshToken = async (refreshToken) => {
        console.log('refreshToken from client:', refreshToken);
        const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            const { userId, email } = await verifyJWT(refreshToken, foundToken.publicKey)
            console.log(userId, email)
            await keyTokenService.removeKeyById(userId)
            throw new ForbiddenError('Refresh token has been used. Please re-login!')
        }
        const holderToken = await keyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) {
            throw new UnauthorizedError('Invalid refresh token1')
        }
        let decoded;
        try {
            decoded = await verifyJWT(refreshToken, holderToken.publicKey);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedError('Refresh token expired. Please re-login!');
            }
            throw new UnauthorizedError('Invalid refresh token2');
        }
        const { userId, email } = decoded

        const foundShop = await findbyEmail({ email })
        if (!foundShop) {
            throw new UnauthorizedError('Shop not registered!')
        }
        const tokens = await createTokenPair(
            { userId, email },
            holderToken.publicKey,
            holderToken.privateKey
        )
        await holderToken.updateOne({
            $set: { refreshToken: tokens.refreshToken },
            $addToSet: { refreshTokensUsed: refreshToken }
        })
        return {
            user: { userId, email },
            tokens
        }
    }
    static logout = async (keyStore) => {
        return await KeyTokenService.removeKeyById(keyStore.user)
    }
    /*
        1. check email in dbs
        2. match password
        3. create publicKey, privateKey
        4. create token pair
        5. get info data return client
        
    */
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findbyEmail({ email })
        if (!foundShop) {
            throw new BadRequestError('Shop not registered!')
        }
        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new UnauthorizedError('Authentication failed!')
        }
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        })

        const { _id: userId } = foundShop
        const tokens = await createTokenPair(
            { userId, email: foundShop.email },
            publicKey,
            privateKey
        )
        await keyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId: userId
        })


        return {
            shop: getInfoData({
                object: foundShop,
                fields: ['_id', 'name', 'email']
            }),
            tokens
        }

    }
    static signUp = async ({ name, email, password }) => {

        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Shop already registered!')
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [roleShop.SHOP]
        })
        if (newShop) {
            //created privateKey, publicKey
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                }
            })



            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                throw new ConflictRequestError('Failed to create public key Store')
            }


            // create token pair
            const tokens = await createTokenPair(
                { userId: newShop._id, email: newShop.email },
                publicKey,
                privateKey
            )

            console.log('Tokens created successfully')

            return {
                shop: getInfoData({
                    object: newShop,
                    fields: ['_id', 'name', 'email']
                }),
                tokens
            }
        }
        return {
            code: '200',
            metadata: null,
        }

    }
}
module.exports = AccessService
