'use strict'

const shopModel = require("../models/shop.model")
const keyTokenService = require("./keyToken.service")
const createTokenPair = require("../auth/authUtils")
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const roleShop = {
    SHOP: 'SHOP',
    ADMIN: 'ADMIN',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                return {
                    code: 'xxxxx',
                    message: 'Shop already exists',
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [roleShop.SHOP]
            })
            if (newShop) {
                // created privateKey, publicKey
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                })
                console.log({ privateKey, publicKey }) //save collection KeyStore

                const publicKeyString = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey
                })

                if (!publicKeyString) {
                    return {
                        code: 'xxxxx',
                        message: 'Failed to create public key token',
                    }
                }

                // create token pair
                const tokens = await createTokenPair(
                    { userId: newShop._id, email: newShop.email },
                    publicKey,
                    privateKey
                )
                return {
                    code: '201',
                    message: 'Shop created successfully',
                    data: {
                        shop: newShop,
                        tokens
                    }
                }
            }
            return {
                code: '200',
                metadata: null,
            }
        } catch (error) {
            return {
                code: 'xxxxx',
                message: error.message || 'An error occurred',
                status: error
            }
        }
    }
}
module.exports = AccessService
