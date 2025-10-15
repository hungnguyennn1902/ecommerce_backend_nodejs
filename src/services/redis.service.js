'use strict';
const redis = require('redis');
const client = redis.createClient();

const { reservationInventory } = require("../models/repositories/inventory.repo.js");
const acquireLock = async ({ productId, quantity, cartId }) => {
    const key = `lock_v2025_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3 giây

    for (let i = 0; i < retryTimes; i++) {
        const result = await client.set(key, cartId, {
            NX: true,
            PX: expireTime
        });

        console.log(`result:::`, result);

        if (result === 'OK') {
            const isReservation = await reservationInventory({ productId, quantity, cartId });
            if (isReservation.modifiedCount > 0) {
                await client.pExpire(key, expireTime)
                return key
            }
            return null
        } else {
            // Nếu khóa đã tồn tại, đợi 50ms rồi thử lại
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    console.log('Cannot get acquire lock');
    return null;


};

const releaseLock = async (keyLock) => {
    // Xóa khóa
    return await client.del(keyLock);
};

module.exports = {
    acquireLock,
    releaseLock
};
