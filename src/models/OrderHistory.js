const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrderHistory', orderHistorySchema);
