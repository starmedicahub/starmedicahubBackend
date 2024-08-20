const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  image: { type: String, required: true },
  itemName: { type: String, required: true },
  about: { type: String, required: true },
  mrp: { type: Number, required: true },
  ptr: { type: String, required: true },
  doctorCategory: {
    type: String,
    required: true,
  },
  companyName: { type: String, required: true },
  sellerName: { type: String, required: true },
  productCategory: {
    type: String,
    required: true,
  },
  stock: { type: Number, required: true },
  dis: { type: String, required: true },
  code: { type: Number, required: true },
  gst: { type: Number, required: true },
  hns: { type: String, required: true },
  inv: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
