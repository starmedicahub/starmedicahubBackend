const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const jwtHelper = require("../utils/jwt");
const { upload } = require("../config/multer");

router.get("/", jwtHelper.verifyJwtToken, productController.getProductById);
router.post(
  "/data",
  upload.single("image"),
  // jwtHelper.verifyJwtToken,
  productController.createProduct
);
router.put(
  "/:id",
  upload.single("image"),
  jwtHelper.verifyJwtToken,
  productController.updateProduct
);
router.delete(
  "/:id",
  jwtHelper.verifyJwtToken,
  productController.deleteProduct
);

module.exports = router;
