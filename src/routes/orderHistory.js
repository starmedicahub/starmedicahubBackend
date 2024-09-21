const express = require('express');
const router = express.Router();
const orderHistoryController = require('../controller/orderHistorycontroller');

// Route to get all order histories
router.get('/order-history', orderHistoryController.getAllOrderHistories);

// Route to get a specific order history by order ID
router.get('/order-history/:orderId', orderHistoryController.getOrderHistoryById);

module.exports = router;
