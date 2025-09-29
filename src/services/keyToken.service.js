'use strict'

const mongoose = require('mongoose');
const keyTokenModel = require('../models/keytoken.model');

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null;
            const filter = { user: userId };
            const update = {
                $set: { publicKey, privateKey, refreshToken },       // cập nhật token mới
                $setOnInsert: { refreshTokensUsed: [] }              // nếu document mới, tạo mảng rỗng
            };
            const options = { upsert: true, new: true };
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error.message
        }
    }
    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: userId }).lean();
    }
    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ user: id });
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    }

}

module.exports = KeyTokenService;