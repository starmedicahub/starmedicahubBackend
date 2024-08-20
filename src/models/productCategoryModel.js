const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  about: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProductCategory', productCategorySchema);
