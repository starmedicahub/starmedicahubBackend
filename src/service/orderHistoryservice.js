const OrderHistory = require('../models/orderHistory');

class OrderHistoryService {
    // Fetch all order histories
    async getAllOrderHistories() {
        return await OrderHistory.find().populate('user').populate('cart');
    }

    // Fetch a specific order history by order ID
    async getOrderHistoryById(orderId) {
        return await OrderHistory.findById(orderId).populate('user').populate('cart');
    }
}


module.exports = new OrderHistoryService();
