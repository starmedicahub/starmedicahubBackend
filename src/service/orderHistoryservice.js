// const OrderHistory = require("../models/orderHistory");

class OrderHistoryService {
  // Fetch all order histories
  async getAllOrderHistories() {
    return await OrderHistory.find().populate("user").populate("cart");
  }

  // Fetch a specific order history by order ID
  async getOrderHistoryById(userId) {
    let orderHistory = await OrderHistory.findOne({ user: userId });
    console.log(userId)
    console.log(orderHistory)
    return await OrderHistory.findOne({ user : userId })
      .populate("user")
      .populate("cart");
  }
}

module.exports = new OrderHistoryService();
