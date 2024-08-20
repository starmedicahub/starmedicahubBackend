const express = require("express");
const router = express.Router();
const jwtHelper = require("../utils/jwt");
const doctorCategoryController = require("../controller/doctorCategoryController");
const { upload } = require("../config/multer");

router.get(
  "/",
  jwtHelper.verifyJwtToken,
  doctorCategoryController.getDoctorCategoryById
);
router.post(
  "/",
  upload.single("image"),
  jwtHelper.verifyJwtToken,
  doctorCategoryController.createDoctorCategory
);
router.put(
  "/:id",
  upload.single("image"),
  jwtHelper.verifyJwtToken,
  doctorCategoryController.updateDoctorCategory
);
router.delete(
  "/:id",
  jwtHelper.verifyJwtToken,
  doctorCategoryController.deleteDoctorCategory
);

module.exports = router;
