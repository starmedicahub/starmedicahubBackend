const OrderHistory = require('../models/orderHistory');

const createOrderHistory = async (userId, cartIds) => {
  try {
    const orderHistory = new OrderHistory({
      userId: userId,
      productDetails: cartIds,
      orderDate: new Date(),
      status: 'Pending'
    });
    await orderHistory.save();
    return orderHistory;
  } catch (error) {
    throw new Error('Error saving order history: ' + error.message);
  }
};

const getOrderHistoryByUserId = async (userId) => {
  try {
    const orderHistory = await OrderHistory.find({ userId: userId }).populate({
      path: 'productDetails.productId',
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