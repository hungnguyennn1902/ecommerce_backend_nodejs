const { inventory } = require("../inventory.model")

const insertInventory = async ({
    productId, location, stock, shopId
}) => {
    return await inventory.create({
        iven_productId: productId,
        inven_location: location,
        inven_stock: stock,
        inven_shopId: shopId
    });
}

const reservationInventory = async ({productId, quantity, cartId}) => {
    const query = {
        inven_productId: productId,
        inven_stock: {$gte: quantity}
    },
    updateSet = {
        $inc: {inven_stock: -quantity},
        $push: {inven_reservation: {cartId, quantity, createdOn: new Date()}}
    }
    , options = {upsert: true};
    return await inventory.updateOne(query, updateSet, options);
}

module.exports = {
    insertInventory,
    reservationInventory
};
