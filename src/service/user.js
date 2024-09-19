const mongoose = require("mongoose");
const db = require("../models/collection");
const bcrypt = require("bcryptjs");
const User = db.User;
const OTP = db.OTP;



// Define the service functions
const postUser = async (bodyObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      await postUserDetails(bodyObj).then(async (res) => {
        const secretCode = Math.floor(100000 + Math.random() * 900000);
        console.log(secretCode);
        await createOtplogs(bodyObj.phoneNo, secretCode).catch((err) => {
          reject(err);
        });
        const message = `${secretCode} is your one-time password (OTP)`;
        resolve(message);
      });
    } catch (err) {
      console.log(err, "Failed to create user [postUser]");
      reject(err);
    }
  });
};

const postUserDetails = async (bodyObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("bodyObj.password", bodyObj.password);
      bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), async (error, salt) => {
        if (error) reject(error);
        bcrypt.hash(bodyObj.password, salt, async (error, hash) => {
          if (error) reject(error);
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: bodyObj.email,
            firstName: bodyObj.firstName,
            lastName: bodyObj.lastName,
            phoneNo: bodyObj.phoneNo,
            drsDegree:bodyObj.drsDegree,
            licenseNumber:bodyObj.licenseNumber,
            gender:bodyObj.gender,
            birthDate:bodyObj.birthDate,
            createdId: new Date(),
            saltPass: salt,
            hashPass: hash,
            role: bodyObj.role || "USER",
            address: bodyObj.address,
            category: bodyObj.category,
            info: bodyObj.info,
            photo: bodyObj.documents.photo,
            license: bodyObj.documents.license,
            visitingCard: bodyObj.documents.visitingCard,
            status: bodyObj.status || "ACTIVE",
          });
          user
            .save()
            .then(result => resolve(result))
            .catch(err => {
              console.log(err);
              reject(err);
            });
        });
      });
    } catch (err) {
      console.log(err, "Failed to create user [postUserDetails]");
      reject(err);
    }
  });
};

const createOtplogs = async (email, secret) => {
  return new Promise(async (resolve, reject) => {
    try {
      const otplogs = new OTP({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        secret: secret,
      });
      otplogs
        .save()
        .then(() => resolve(otplogs))
        .catch((error) => {
          console.log(error, "error");
          reject(error.message);
        });
    } catch (err) {
      console.log(err, "Failed to create OTP logs [createOtplogs]");
      reject(err);
    }
  });
};

const getUser = async (userId, fromDate, toDate, search) => {
  return new Promise(async (resolve, reject) => {
    try {
      const today = new Date();
      const formattedToday = today.toISOString().split("T")[0];
      const todayStart = new Date(formattedToday + "T00:00:00.000Z");
      const todayEnd = new Date(formattedToday + "T23:59:59.999Z");
      let formattedStartDate = fromDate ? new Date(`${fromDate}T00:00:00.000Z`) : null;
      let formattedEndDate = toDate ? new Date(`${toDate}T23:59:59.999Z`) : null;
      let clause = {};

      if (userId) {
        clause = { _id: userId };
      } else if (formattedStartDate && formattedEndDate) {
        clause = {
          createdId: { $gte: formattedStartDate, $lte: formattedEndDate },
          role: "USER",
        };
      } else {
        clause = { role: "USER" };
      }

      if (search) {
        clause["$or"] = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { info: { $regex: search, $options: "i" } },
          { phoneNo: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      const options = {
        select: "-hashPass -saltPass -__v",
      };

      const users = await User.find(clause, null, options);

      resolve(users);
    } catch (err) {
      console.log(err);
      reject("Failed to get user details");
    }
  });
};

const putUser = async (bodyObj, adminId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.updateOne(
        { _id: userId },
        {
          email: bodyObj.email,
          firstName: bodyObj.firstName,
          lastName: bodyObj.lastName,
          phoneNo: bodyObj.phoneNo,
          modifiedId: adminId,
          modified: new Date(),
          address: bodyObj.address,
          status: bodyObj.status,
          category: bodyObj.category,
          info: bodyObj.info,
          photo: bodyObj.photo,
          license: bodyObj.license,
          visitingCard: bodyObj.visitingCard,
        }
      )
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    } catch (err) {
      console.log(err, "Failed to update user [putUser]");
      reject(err);
    }
  });
};

const DeleteUser = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteOne({ _id: userId })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    } catch (err) {
      console.log(err, "Failed to delete user [DeleteUser]");
      reject(err);
    }
  });
};

module.exports = {
  postUser,
  getUser,
  putUser,
  DeleteUser,
};

