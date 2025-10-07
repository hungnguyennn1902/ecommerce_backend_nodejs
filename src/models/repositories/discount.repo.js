const { getUnSelectData } = require("../../utils");
const { discount } = require("../discount.model");

const findAllDiscount = async ({ limit = 50, sort = 'ctime', page = 1, filter, unselect }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const discounts = await discount.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unselect))
        .lean();
    return discounts
}
const checkDiscountExist = async (filter) =>{
    return await discount.findOne(filter).lean()
}
module.exports = {
    findAllDiscount,
    checkDiscountExist
}