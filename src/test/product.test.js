const redisPubsubService = require('../services/redisPubsub.service');
class ProductServiceTest {
    async purcharseProduct( productId, quantity ) {
        const order = {
            productId,
            quantity
        }
        await redisPubsubService.publish('purchase_event', JSON.stringify(order));
    }
}
module.exports = new ProductServiceTest();