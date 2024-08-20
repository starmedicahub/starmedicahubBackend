const express = require("express");
const router = express.Router();
const jwtHelper = require("../utils/jwt");
const productCategoryController = require("../controller/productCategoryController");
const { upload } = require("../config/multer");

router.get(
  "/",
  jwtHelper.verifyJwtToken,
  productCategoryController.getProductCategoryById
);
router.post(
  "/",
  upload.single("image"),
  jwtHelper.verifyJwtToken,
  productCategoryController.createProductCategory
);
router.put(
  "/:id",
  upload.single("image"),
  jwtHelper.verifyJwtToken,
  productCategoryController.updateProductCategory
);
router.delete(
  "/:id",
  jwtHelper.verifyJwtToken,
  productCategoryController.deleteProductCategory
);

module.exports = router;
