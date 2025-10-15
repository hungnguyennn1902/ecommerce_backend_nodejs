const redisPubsubService = require('../services/redisPubsub.service');

class InventoryServiceTest {
    async listenToPurchaseEvent() {
        await redisPubsubService.subscribe('purchase_event', (channel, message) => {
            const order = JSON.parse(message);
            console.log(`📦 Nhận sự kiện ${channel}:`, order);
        });
    }
}

module.exports = new InventoryServiceTest();
