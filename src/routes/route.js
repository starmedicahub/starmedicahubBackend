const express = require("express");
const router = express.Router();
const userModule = require("./user");
const loginModule = require("./login");
const lookupModule = require("./lookup");
const productCategoryRoutes = require("./productCategoryRoutes");
const doctorCategoryRoutes = require("./doctorCategoryRoutes");
const productRoutes = require("./productRoutes");
const cart = require("./cartRoutes");
const orderHistory =require("./orderHistory")

//user
router.use("/user", userModule);

//login
router.use("/login", loginModule);

//lookup
router.use("/lookup", lookupModule);

// productCategoryRoutes
router.use("/product", productCategoryRoutes);

// doctorCategoryRoutes
router.use("/doctor", doctorCategoryRoutes);

// Product Routes
router.use("/product_filed", productRoutes);

//cart Routes
router.use("/cart", cart);

//orderHistory
router.use("/Oderhistory", orderHistory)

module.exports = router;
