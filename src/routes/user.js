const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const validateUser = require("../validation/user");
const jwtHelper = require("../utils/jwt");
const { upload } = require("../config/multer"); // import multer configuration

const uploadDocuments = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "license", maxCount: 1 },
  { name: "visitingCard", maxCount: 1 },
]);

router.post("/", uploadDocuments, userController.postUser);

router.get(
  "/",
  jwtHelper.verifyJwtToken,
  validateUser.validateGetUser,
  userController.getUser
);

router.delete(
  "/:id",
  jwtHelper.verifyJwtToken,
  validateUser.validateDeleteUser,
  userController.deleteUser
);

router.put(
  "/:id",
  uploadDocuments,
  jwtHelper.verifyJwtToken,
  validateUser.validatePutUserInfo,
  userController.putUser
);

module.exports = router;
