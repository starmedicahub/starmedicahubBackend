const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  about: { type: String, required: false },
  doctorId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProductCategory', productCategorySchema);
