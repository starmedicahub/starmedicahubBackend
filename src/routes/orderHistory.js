const express = require('express');
const router = express.Router();
const orderHistoryController = require('../controller/orderHistorycontroller');
const jwtHelper = require("../utils/jwt");

// Route to get all order histories
router.get('/', jwtHelper.verifyJwtToken, orderHistoryController.getAllOrderHistories);

// Route to get a specific order history by order ID
router.get('/user', jwtHelper.verifyJwtToken ,orderHistoryController.getOrderHistoryById);

module.exports = router;
