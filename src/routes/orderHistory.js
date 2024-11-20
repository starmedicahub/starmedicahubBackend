const express = require('express');
const orderHistoryController = require('../controller/orderHistorycontroller');
const router = express.Router();
const jwtHelper = require("../utils/jwt");

router.post('/createorderhistory', jwtHelper.verifyJwtToken, orderHistoryController.createOrderHistory);
router.get('/getOrderHistory', jwtHelper.verifyJwtToken, orderHistoryController.getOrderHistoryByUserId);

module.exports = router;
