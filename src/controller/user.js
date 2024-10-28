const userService = require("../service/user");

/**
 * Post user info
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const postUser = async (req, res, next) => {
  const bodyObj = req.body;
  const empId = res.locals.userId;
  if (req.files) {
    bodyObj.documents = {
      photo: req.files["photo"] ? req.files["photo"][0].filename : "",
      license: req.files["license"] ? req.files["license"][0].filename : "",
      visitingCard: req.files["visitingCard"]
        ? req.files["visitingCard"][0].filename
        : "",
    };
  }

  try {
    const message = await userService.postUser(bodyObj, empId);
    res.status(201).send({ message });
  } catch (err) {
    console.error("Failed to create user:", err);
    res.status(500).send({ error: "Failed to create user" });
  }
};

/**
 * Get user info
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getUser = async (req, res) => {
  const userId = req.query.userId;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const search = req.query.search || "";

  try {
    const users = await userService.getUser(userId, fromDate, toDate, search);
    res.status(200).send(users);
  } catch (err) {
    console.error("Failed to retrieve users:", err);
    res.status(500).send({ error: "Failed to retrieve users" });
  }
};

/**
 * Update user info
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const putUser = async (req, res, next) => {
  const bodyObj = req.body;
  const adminId = res.locals.userId;
  const userId = req.params.userId;

  if (req.file) {
    bodyObj.photo = req.file.filename;
    bodyObj.license = req.file.filename;
    bodyObj.visitingCard = req.file.filename;
  }

  try {
    await userService.putUser(bodyObj, adminId, userId);
    res.status(200).send({ message: "User details updated successfully" });
  } catch (err) {
    console.error("Failed to update user:", err);
    res.status(500).send({ error: "Failed to update user" });
  }
};

/**
 * Delete user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const deleteUser = async (req, res, next) => {
  const adminId = res.locals.userId;
  const userId = req.params.userId;

  try {
    await userService.DeleteUser(userId, adminId);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.status(500).send({ error: "Failed to delete user" });
  }
};

module.exports = {
  postUser,
  getUser,
  putUser,
  deleteUser,
};
