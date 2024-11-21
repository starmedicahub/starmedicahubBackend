const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  total: { type: Number, required: true },
  gst: { type: Number, required: true },
  status: { type: String, default: 'CONFIRMED' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
