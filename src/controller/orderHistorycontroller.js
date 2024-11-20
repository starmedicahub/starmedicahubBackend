const orderHistoryService = require('../service/orderHistoryservice');

const createOrderHistory = async (req, res) => {
  try {
    const { cartIds } = req.body;
    const userId = res.locals.userId;  

    if (!cartIds || !cartIds.length) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    // Check if order history exists for the user
    let orderHistory = await orderHistoryService.getOrderHistoryByUserId(userId);
    if (orderHistory) {
      // If order history exists, push the new cart IDs to the existing order
      orderHistory.cartIds.push(...cartIds);
      await orderHistory.save();
    } else {
      // If no order history exists for the user, create a new one
      orderHistory = await orderHistoryService.createOrderHistory(userId, cartIds);
    }

    res.status(201).json({
      message: 'Order history created or updated successfully',
      orderHistory,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating or updating order history',
      error: error.message,
    });
  }
};

const getOrderHistoryByUserId = async (req, res) => {
  try {
    const userId = res.locals.userId; 
    const orderHistory = await orderHistoryService.getOrderHistoryByUserId(userId);

    if (!orderHistory) {
      return res.status(404).json({ message: 'No order history found for this user' });
    }

    res.status(200).json({
      message: 'Order history fetched successfully',
      data: orderHistory,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching order history',
      error: error.message,
    });
  }
};

module.exports = {
  createOrderHistory,
  getOrderHistoryByUserId
};
