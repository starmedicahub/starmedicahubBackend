const mongoose = require('mongoose');

const doctorCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  about: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DoctorCategory', doctorCategorySchema);
