const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gst: { type: Number, required: true },
  total: { type: Number, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  name: { type: String, required: true }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
