const express = require("express");
const router = express.Router();
const jwtHelper = require("../utils/jwt");
const cartController = require("../controller/cartController");


router.get("/", jwtHelper.verifyJwtToken, cartController.getCartById);
router.post("/", jwtHelper.verifyJwtToken, cartController.createCart);
router.put("/:id", jwtHelper.verifyJwtToken, cartController.updateCart);
router.delete("/:id", jwtHelper.verifyJwtToken, cartController.deleteCart);

module.exports = router;
