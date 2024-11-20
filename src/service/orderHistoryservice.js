const OrderHistory = require('../models/orderHistory');

const createOrderHistory = async (userId, cartIds) => {
  try {
    const orderHistory = new OrderHistory({
      user: userId,
      order: cartIds,
      createdAt: new Date(),
    });
    await orderHistory.save();
    return orderHistory;
  } catch (error) {
    throw new Error('Error saving order history: ' + error.message);
  }
};
const getOrderHistoryByUserId = async (userId) => {
  try {
    const orderHistory = await OrderHistory.findOne({ user: userId }).populate({
      path: 'order',
      populate: {
        path: 'items.product_id',
      },
    });

    return orderHistory;
  } catch (error) {
    throw new Error('Error fetching order history: ' + error.message);
  }
};

module.exports = {
  createOrderHistory,
  getOrderHistoryByUserId
};
