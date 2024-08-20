const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for user
const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    maxLength: 100,
    unique: true,
  },
  phoneNo: { 
    type: String, 
    required: true,
    unique: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  drsDegree: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  gender: { type: String, required: true },
  birthDate: { type: Date, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true },
  info: { type: String, required: true },
  role: { type: String, default: "USER" },
  photo: { type: String, required: true },
  license: { type: String, required: true },
  visitingCard: { type: String, required: true },
  status: { type: String, default: "ACTIVE" },
  hashPass: { type: String },
  saltPass: { type: String },
  createdId: { type: Date, default: Date.now },
  modifiedId: { type: String, default: "" },
});

const User = mongoose.model("User", userSchema);

const otpSchema = new Schema({
  mobileNo: {
    type: String,
    required: true,
  },
  secret: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = {
  User,
  OTP,
};
