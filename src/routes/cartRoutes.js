const express = require("express");
const router = express.Router();
const jwtHelper = require("../utils/jwt");
const cartController = require("../controller/cart");

// Route to get cart details by ID or user
router.get("/", jwtHelper.verifyJwtToken, cartController.getCartDetails);

// Route to add an item to the cart
router.post("/add", jwtHelper.verifyJwtToken, cartController.addItemToCart);

router.delete("/remove/:productId", jwtHelper.verifyJwtToken, cartController.removeItemFromCart);

// Route to clear the cart
router.delete("/clear", jwtHelper.verifyJwtToken, cartController.clearCart);

// Route for checkout
router.post("/checkout", jwtHelper.verifyJwtToken, cartController.checkout);

// Route to get all orders for a user
router.get("/orders", jwtHelper.verifyJwtToken, cartController.getUserOrders);

module.exports = router;
